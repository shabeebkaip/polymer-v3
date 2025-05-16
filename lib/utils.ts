import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const uomDropdown = [
  "Kilogram",
  "Gram",
  "Milligram",
  "Metric Ton",
  "Pound",
  "Ounce",
  "Liter",
  "Milliliter",
  "Cubic Meter",
  "Cubic Centimeter",
  "Gallon",
  "Quart",
  "Pint",
];
