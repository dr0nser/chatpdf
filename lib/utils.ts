import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// removes any non ascii characters from string
export function convertStringToAscii(input: string) {
  const asciiString = input.replace(/[^\x00-\x7F]/g, "");
  return asciiString;
}
