import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { load } from "cheerio";

/**
 * Utility function to merge Tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates if an email is disposable using Kickbox API.
 */
// export const isValidEmail = async (email: string) => {
//   try {
//     const isDisposableResponse = await fetch(
//       `https://open.kickbox.com/v1/disposable/${email}`
//     );
//     const isDisposable = await isDisposableResponse.json();
//     return !isDisposable?.disposable;
//   } catch {
//     return true;
//   }
// };
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function isSubdomainEmail(email: string): boolean {
  // const isValid = await isValidEmail(email); // Wait for validation result
  // if (!isValid) return false; // Ensure it's a valid email first.

  if (!email.includes("@")) return false; // Ensure email format is correct

  const domain = email.split("@")[1]; // Get domain part
  if (!domain) return false; // Handle invalid cases

  const parts = domain.split("."); // Split domain by dots

  // A normal email (e.g., "user@gmail.com") should return false.
  // A subdomain email (e.g., "user@sub.example.com") should return true.
  return parts.length > 2; 
}




/**
 * Fetches address details from OpenStreetMap based on latitude and longitude.
 */
export const fetchAddress = async (latitude: number, longitude: number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "YourAppName/1.0" }, // Provide a User-Agent
    });
    const data = await response.json();
    const address = data.address || {};

    return {
      city: address.city || "",
      state: address.state || "",
      country: address.country_code || "",
      zip: address.postcode || "",
    };
  } catch (error) {
    console.error("Error fetching address:", error);
    return {};
  }
};

export type GitHubProfile = {
  avatar_url: string;
  login: string;
  bio: string;
};

export type PageMetadata = {
  title: string;
  description: string;
  image: string;
};

/**
 * Fetches GitHub user profile details from a given profile URL.
 */
export async function fetchGitHubProfile(
  url: string
): Promise<GitHubProfile | null> {
  try {
    const username = url.split("/").pop();
    if (!username) return null;

    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) return null;

    const data = await response.json();
    return {
      avatar_url: data.avatar_url,
      login: data.login,
      bio: data.bio || "",
    };
  } catch (error) {
    console.error("Error fetching GitHub profile:", error);
    return null;
  }
}

/**
 * Fetches page metadata (title, description, image) from a given URL.
 */
export async function fetchPageMetadata(
  url: string
): Promise<PageMetadata | null> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);

    return {
      title:
        $("title").text() ||
        $('meta[property="og:title"]').attr("content") ||
        "",
      description:
        $('meta[name="description"]').attr("content") ||
        $('meta[property="og:description"]').attr("content") ||
        "",
      image: $('meta[property="og:image"]').attr("content") || "",
    };
  } catch (error) {
    console.error("Error fetching page metadata:", error);
    return null;
  }
}

/**
 * Debounce function to limit the rate at which a function is executed.
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
