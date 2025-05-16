"use client";

import {
  getChemicalFamilies,
  getGrades,
  getIncoterms,
  getIndustryList,
  getPackagingTypes,
  getPaymentTerms,
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
  const [grades, setGrades] = useState<any[]>([]);
  const [incoterms, setIncoterms] = useState<any[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<any[]>([]);
  const [packagingTypes, setPackagingTypes] = useState<any[]>([]);

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
    getGrades().then((response) => {
      const gradesData: any[] = response.data;
      setGrades(gradesData);
    });
    getIncoterms().then((response) => {
      const incotermsData: any[] = response.data;
      setIncoterms(incotermsData);
    });
    getPaymentTerms().then((response) => {
      const paymentTermsData: any[] = response.data;
      setPaymentTerms(paymentTermsData);
    });
    getPackagingTypes().then((response) => {
      const packagingTypesData: any[] = response.data;
      setPackagingTypes(packagingTypesData);
    });
  }, []);

  return {
    chemicalFamilies,
    productFamilies,
    polymersTypes,
    industry,
    physicalForms,
    grades,
    incoterms,
    paymentTerms,
    packagingTypes,
  };
}

// Usage example
// const { user } = useUserInfo();
