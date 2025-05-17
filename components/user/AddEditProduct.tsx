"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useDropdowns } from "@/lib/useDropdowns";
import GeneralInformation from "./products/GeneralInformation";
import ProductDetails from "./products/ProductDetails";
import ProductImages from "./products/ProductImages";
import TechnicalProperties from "./products/TechnicalProperties";
import TradeInformation from "./products/TradeInformation";
import PackageInformation from "./products/PackageInformation";
import Environmental from "./products/Environmental";
import Certification from "./products/Certifications";
import Documents from "./products/Documents";
import { ProductFormData } from "@/types/product";

const AddEditProduct = () => {
  const { id } = useParams();
  const [data, setData] = useState<ProductFormData>({
    productName: "",
    chemicalName: "",
    description: "",
    additionalInfo: [{ title: "", description: "" }],
    tradeName: "",
    chemicalFamily: "",
    polymerType: "",
    industry: [],
    grade: [],
    manufacturingMethod: "",
    physicalForm: "",
    countryOfOrigin: "",
    color: "",
    productImages: [],
    density: "",
    mfi: null,
    tensileStrength: null,
    elongationAtBreak: null,
    shoreHardness: null,
    waterAbsorption: null,
    minimum_order_quantity: null,
    stock: null,
    uom: "",
    price: null,
    priceTerms: "fixed",
    incoterms: [],
    leadTime: "",
    paymentTerms: "",
    packagingType: [],
    packagingWeight: "",
    storageConditions: "",
    technical_data_sheet: {},
    certificate_of_analysis: {},
    safety_data_sheet: {},
    shelfLife: "",
    recyclable: false,
    bioDegradable: false,
    fdaApproved: false,
    medicalGrade: false,
    product_family: [],
    _id: String(id) || "",
  });
  const onFieldChange = (key: keyof ProductFormData, value: any) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  console.log("data", data);
  return (
    <div className="container mx-auto px-4 pb-6">
      <div className="grid grid-cols-3 gap-4">
        {/* General Information */}
        <GeneralInformation data={data} onFieldChange={onFieldChange} />
        {/* Product Details */}
        <ProductDetails data={data} onFieldChange={onFieldChange} />
        <ProductImages data={data} onFieldChange={onFieldChange} />
        <TechnicalProperties data={data} onFieldChange={onFieldChange} />
        <TradeInformation data={data} onFieldChange={onFieldChange} />
        <PackageInformation data={data} onFieldChange={onFieldChange} />
        <Environmental data={data} onFieldChange={onFieldChange} />
        <Certification data={data} onFieldChange={onFieldChange} />
        <Documents data={data} onFieldChange={onFieldChange} />

        {/* div end */}
      </div>
    </div>
  );
};

export default AddEditProduct;
