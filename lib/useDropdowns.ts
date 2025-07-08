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

interface DropdownItem {
  _id: string;
  name: string;
  [key: string]: unknown;
}

export function useDropdowns() {
  const [chemicalFamilies, setChemicalFamilies] = useState<DropdownItem[]>([]);
  const [productFamilies, setProductFamilies] = useState<DropdownItem[]>([]);
  const [polymersTypes, setPolymersTypes] = useState<DropdownItem[]>([]);
  const [industry, setIndustry] = useState<DropdownItem[]>([]);
  const [physicalForms, setPhysicalForms] = useState<DropdownItem[]>([]);
  const [grades, setGrades] = useState<DropdownItem[]>([]);
  const [incoterms, setIncoterms] = useState<DropdownItem[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<DropdownItem[]>([]);
  const [packagingTypes, setPackagingTypes] = useState<DropdownItem[]>([]);

  useEffect(() => {
    getChemicalFamilies().then((response) => {
      const chemicalFamilyData: DropdownItem[] = response.data;
      setChemicalFamilies(chemicalFamilyData);
    });
    getProductFamilies().then((response) => {
      const productFamilyData: DropdownItem[] = response.data;
      setProductFamilies(productFamilyData);
    });
    getPolymersType().then((response) => {
      const polymersTypeData: DropdownItem[] = response.data;
      setPolymersTypes(polymersTypeData);
    });
    getIndustryList().then((response) => {
      const industryData: DropdownItem[] = response.data;
      setIndustry(industryData);
    });
    getPhysicalForms().then((response) => {
      const physicalFormData: DropdownItem[] = response.data;
      setPhysicalForms(physicalFormData);
    });
    getGrades().then((response) => {
      const gradesData: DropdownItem[] = response.data;
      setGrades(gradesData);
    });
    getIncoterms().then((response) => {
      const incotermsData: DropdownItem[] = response.data;
      setIncoterms(incotermsData);
    });
    getPaymentTerms().then((response) => {
      const paymentTermsData: DropdownItem[] = response.data;
      setPaymentTerms(paymentTermsData);
    });
    getPackagingTypes().then((response) => {
      const packagingTypesData: DropdownItem[] = response.data;
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
