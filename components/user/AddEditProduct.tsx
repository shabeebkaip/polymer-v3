"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useDropdowns } from "@/lib/useDropdowns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import ImageUpload from "../shared/ImageUpload";
import { uomDropdown } from "@/lib/utils";
import { format } from "date-fns";
import GeneralInformation from "./products/GeneralInformation";
import ProductDetails from "./products/ProductDetails";
import ProductImages from "./products/ProductImages";
import TechnicalProperties from "./products/TechnicalProperties";
import TradeInformation from "./products/TradeInformation";
import PackageInformation from "./products/PackageInformation";
import Environmental from "./products/Environmental";
import Certification from "./products/Certifications";

const AddEditProduct = () => {
  const { id } = useParams();
  const {
    chemicalFamilies,
    productFamilies,
    polymersTypes,
    industry,
    physicalForms,
    grades,
    incoterms,
    paymentTerms,
  } = useDropdowns();
  const [data, setData] = useState({
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
    _id: id,
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const onFieldChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  console.log("chemicalFamilies", chemicalFamilies);
  return (
    <div className="container mx-auto px-4 pb-6">
      <div className="grid grid-cols-3 gap-4">
        {/* General Information */}
        <GeneralInformation data={data} onFieldChange={onFieldChange} />
        {/* Product Details */}
        <ProductDetails data={data} onFieldChange={onFieldChange} />
        <ProductImages />
        <TechnicalProperties data={data} onFieldChange={onFieldChange} />
        <TradeInformation data={data} onFieldChange={onFieldChange} />
        <PackageInformation data={data} onFieldChange={onFieldChange} />
        <Environmental data={data} onFieldChange={onFieldChange} />
        <Certification data={data} onFieldChange={onFieldChange} />

        {/* div end */}
      </div>
    </div>
  );
};

export default AddEditProduct;
