"use client";
import { useCmsStore } from "@/stores/cms";
import React, { useEffect } from "react";
import Benefits from "./Benefits";

const BenefitsWrapper = () => {
  const {
    buyersBenefits,
    suppliersBenefits,
    getBenefitsOfBuyers,
    getBenefitsOfSuppliers,
  } = useCmsStore();
  useEffect(() => {
    getBenefitsOfBuyers();
    getBenefitsOfSuppliers();
  }, [getBenefitsOfBuyers, getBenefitsOfSuppliers]);
  return (
    <Benefits
      buyersBenefits={buyersBenefits}
      suppliersBenefits={suppliersBenefits}
    />
  );
};

export default BenefitsWrapper;
