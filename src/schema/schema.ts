import { z } from "zod";
import {  validateEmail, isSubdomainEmail } from "@/lib/utils";
import { isValidPhoneNumber } from "react-phone-number-input";
import {
  convertMetricsToBytes,
  FileExtension,
  getMimeTypes,
} from "@/lib/files";
import { MimeType } from "@/lib/files";
// const emailValidationSchema = z
//   .string()
//   .email("Invalid email format. Please enter a valid email address.")
//   .min(1, "Email is required")
//   // .refine(async (email) => {
//   //   return await isValidEmail(email);
//   // }, 
//   // {
//   //   message: "Email is not valid",
//   // })
//   .refine((email) => {
//     return !isSubdomainEmail(email);
//   }, {
//     message: "Subdomain emails are not allowed. Please use an email from a main domain",
//   })
//   .refine((email) => {
//     return validateEmail(email);
//   }, {
//     message: "Invalid email format. Please enter a valid email address.",
//   });
const emailValidationSchema = z
  .string()
  .email("Invalid email format. Please enter a valid email address.")
  .min(1, "Email is required")
  .refine((email) => validateEmail(email), {
    message: "Invalid email format. Please enter a valid email address.",
  })
  .refine((email) => !isSubdomainEmail(email), {
    message: "Subdomain emails are not allowed. Please use an email from a main domain.",
  });

const jobSchema = z
  .object({
    title: z
      .string()
      .min(2, { message: "Title must be at least 2 characters long." })
      .max(70, { message: "Title must be at most 70 characters long." }),
    company: z
      .string()
      .min(2, { message: "Company name must be at least 2 characters long." })
      .max(90, { message: "Company name must be at most 90 characters long." }),
    from: z.date({ message: "Invalid start date." }),
    to: z.date({ message: "Invalid end date." }).optional(),
    description: z
      .string()
      .min(2, { message: "Description must be at least 2 characters long." })
      .max(500, {
        message: "Description must be at most 500 characters long.",
      }),
  })
  .refine(
    (data) => {
      if (data.to && data.to < data.from) {
        return false;
      }
      return true;
    },
    {
      message: "End date must be after the start date.",
      path: ["to"], // Error is associated with the "to" field
    }
  );

export const MAX_RESUME_SIZE_IN_BYTES = convertMetricsToBytes(10, "MB");
export const VALID_RESUME_FILE_EXTENSIONS: FileExtension[] = [".pdf"];
export const MAX_FILES = 2;

const resumeValidationSchema = z.instanceof(File).superRefine((file, ctx) => {
  if (file.size <= 0) {
    ctx.addIssue({
      code: "custom",
      message: "The uploaded file is empty. Please select a valid file.",
      path: ["resume"],
    });
  }

  if (file.size > MAX_RESUME_SIZE_IN_BYTES) {
    ctx.addIssue({
      code: "custom",
      message: `File ${file.name} exceeds the 10MB limit.`,
      path: ["resume"],
    });
  }

  if (!getMimeTypes(VALID_RESUME_FILE_EXTENSIONS).includes(file.type as MimeType)) {
    ctx.addIssue({
      code: "custom",
      message: `Invalid file type: ${file.type}. Only ${VALID_RESUME_FILE_EXTENSIONS.join(", ")} files are allowed.`,
      path: ["resume"],
    });
  }
});


export const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "first name must be at least 2 characters long" })
    .max(70, { message: "first name must be at most 70 characters long" }),
  lastName: z
    .string()
    .min(2, { message: "first name must be at least 2 characters long" })
    .max(70, { message: "first name must be at most 70 characters long" }),
  email: emailValidationSchema,
  phone: z
    .string()
    .refine(isValidPhoneNumber, { message: "Invalid Phone Number" }),
  country: z
    .string()
    .min(2, { message: "Country name must be at least 2 characters long." })
    .max(70, { message: "Country name must be at most 70 characters long." }),

  state: z
    .string()
    .min(2, { message: "State name must be at least 2 characters long." })
    .max(70, { message: "State name must be at most 70 characters long." }),

  city: z
    .string()
    .min(2, { message: "City name must be at least 2 characters long." })
    .max(70, { message: "City name must be at most 70 characters long." }),

  address: z
    .string()
    .min(2, { message: "Address must be at least 2 characters long." })
    .max(70, { message: "Address must be at most 70 characters long." }),

  zip: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9\s\-]{0,10}[A-Za-z0-9]$/, {
    message: "Invalid ZIP code format.",
  }),
  timeZone: z.string().optional(),
  jobs: z.array(jobSchema).min(1, {
    message: "At least one job is required.",
  }),
  github: z
    .string()
    .url({ message: "invalid url format" })
    .refine((url) => url.includes("github"), {
      message: "url should be a github profile",
    }),
  resume: z.array(resumeValidationSchema),
  portfolio: z.string().url({ message: "Invalid URL format" }),
});

export const defaultValues =  {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  state: "",
  city: "",
  jobs: [],
  github: "",
  portfolio: "",
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
}


export type FormSchemaType = z.infer<typeof formSchema>;
