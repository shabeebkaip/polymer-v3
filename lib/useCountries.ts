import countryCodesList from "country-codes-list";
import { useMemo } from "react";

export interface CountryOption {
    code: string;
    name: string;
}

export function useCountries(): CountryOption[] {
    return useMemo(() => {
        return Object.values(countryCodesList.customList('countryCode', '{countryNameEn}')).map((name, idx) => ({
            code: Object.keys(countryCodesList.customList('countryCode', '{countryNameEn}'))[idx],
            name,
        }));
    }, []);
}
