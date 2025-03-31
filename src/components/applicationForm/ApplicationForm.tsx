import { formSchema, FormSchemaType } from "@/schema/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultValues } from "@/schema/schema";
import PersonalInfoForm from "./steps/PersonalInfoForm";
import AddressInfoForm from "./steps/AddressInfoForm";
import WorkExperienceForm from "./steps/WorkExperienceForm";
import SocialLinksForm from "./steps/SocialLinksForm";
import ResumeUploaderForm from "./steps/ResumeUploaderForm";
import { Form } from "../ui/form";
import FormControlProvider from "@/FormContextProvider";
import FormHeader from "./FormHeader";
import FormFooter from "./FormFooter";
import RenderComponent from "./RenderComponent";

export type Step = {
  id: string;
  title: string;
  description: string;
  component: () => React.JSX.Element;
  inputs: (keyof FormSchemaType)[];
};

const steps = [
  {
    id: "1",
    title: "Personal Information",
    description: "Tell us about yourself",
    component: PersonalInfoForm,
    inputs: ["firstName", "lastName", "email", "phone"],
  },
  {
    id: "2",
    title: "Address",
    description: "Enter your address information.",
    component: AddressInfoForm,
    inputs: ["country", "state", "city", "address", "zip", "timeZone"],
  },
  {
    id: "3",
    title: "Work Experience",
    description:
      "Enter your work experience. This information will be used to evaluate your application.",
    component: WorkExperienceForm,
    inputs: ["jobs"],
  },
  {
    id: "4",
    title: "Social Links",
    description:
      "Enter your social links. This information helps us to know more about you.",
    component: SocialLinksForm,
    inputs: ["github", "portfolio"],
  },
  {
    id: "5",
    title: "Resume",
    description:
      "Upload your resume. This information helps us to know more about you.",
    component: ResumeUploaderForm,
    inputs: ["resume"],
  },
] satisfies Step[];


const ApplicationForm = () => {
  const onSubmit = (data: FormSchemaType) => {
    console.log(data);
  };
  const form = useForm<FormSchemaType>({
    defaultValues,
    resolver: zodResolver(formSchema),
  });
  return (
    <FormControlProvider steps={steps}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 h-svh py-20 flex flex-col justify-between"
        >
          <FormHeader steps={steps}/>
            <RenderComponent steps={steps}/>
          <FormFooter steps={steps}/>
        </form>
      </Form>
    </FormControlProvider>
  );
};

export default ApplicationForm;
