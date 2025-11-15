// lib/useCountries.ts
import { PhoneNumberUtil } from "google-libphonenumber";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { Country } from "@/types/shared";

countries.registerLocale(en);

export const getCountryList = (): Country[] => {
  const phoneUtil = PhoneNumberUtil.getInstance();
  const regions = phoneUtil.getSupportedRegions();

  return Array.from(regions)
    .map((region): Country | null => {
      try {
        const exampleNumber = phoneUtil.getExampleNumber(region);
        return {
          code: region,
          name: countries.getName(region, "en") || region,
          dialCode: `+${exampleNumber.getCountryCode()}`,
        };
      } catch {
        return null;
      }
    })
    .filter((item): item is Country => item !== null);
};
