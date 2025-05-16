"use client";

import {
  getChemicalFamilies,
  getIndustryList,
  getPhysicalForms,
  getPolymersType,
  getProductFamilies,
} from "@/apiServices/shared";
import { useState, useEffect } from "react";

export function useDropdowns() {
  const [chemicalFamilies, setChemicalFamilies] = useState<any[]>([]);
  const [productFamilies, setProductFamilies] = useState<any[]>([]);
  const [polymersTypes, setPolymersTypes] = useState<any[]>([]);
  const [industry, setIndustry] = useState<any[]>([]);
  const [physicalForms, setPhysicalForms] = useState<any[]>([]);

  useEffect(() => {
    getChemicalFamilies().then((response) => {
      const chemicalFamilyData: any[] = response.data;
      setChemicalFamilies(chemicalFamilyData);
    });
    getProductFamilies().then((response) => {
      const productFamilyData: any[] = response.data;
      setProductFamilies(productFamilyData);
    });
    getPolymersType().then((response) => {
      const polymersTypeData: any[] = response.data;
      setPolymersTypes(polymersTypeData);
    });
    getIndustryList().then((response) => {
      const industryData: any[] = response.data;
      setIndustry(industryData);
    });
    getPhysicalForms().then((response) => {
      const physicalFormData: any[] = response.data;
      setPhysicalForms(physicalFormData);
    });
  }, []);

  return {
    chemicalFamilies,
    productFamilies,
    polymersTypes,
    industry,
    physicalForms,
  };
}

// Usage example
// const { user } = useUserInfo();
