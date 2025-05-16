"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useDropdowns } from "@/lib/useDropdowns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const AddEditProduct = () => {
  const { id } = useParams();
  const {
    chemicalFamilies,
    productFamilies,
    polymersTypes,
    industry,
    physicalForms,
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
    density: null,
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
  const onFieldChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  console.log("chemicalFamilies", chemicalFamilies);
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-3 gap-4">
        {/* General Information */}
        <div className="col-span-3 my-4 ">
          <h4 className="text-xl">General Indformation</h4>
        </div>
        <div>
          <Label htmlFor="productName" className="block mb-1">
            Product Name
          </Label>
          <Input
            className=" text-lg px-4"
            placeholder="Product Name"
            value={data?.productName}
            onChange={(e) => onFieldChange("productName", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="chemicalName" className="block mb-1">
            Chemical Name
          </Label>
          <Input
            className=" text-lg px-4"
            placeholder="Chemical Name"
            value={data?.chemicalName}
            onChange={(e) => onFieldChange("chemicalName", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="tradeName" className="block mb-1">
            Trade Name
          </Label>
          <Input
            className=" text-lg px-4"
            placeholder="Trade Name"
            value={data?.tradeName}
            onChange={(e) => onFieldChange("tradeName", e.target.value)}
          />
        </div>
        <div className="col-span-3">
          <Label htmlFor="description" className="block mb-1">
            Description
          </Label>
          <Textarea
            className=" text-lg px-4"
            placeholder="Description"
            value={data?.description}
            onChange={(e) => onFieldChange("description", e.target.value)}
          />
        </div>
        {/* Product Details */}
        <div className="col-span-3 my-4">
          <h4 className="text-xl">Product Details</h4>
        </div>
        <div>
          <Label htmlFor="chemicalFamily" className="block mb-1">
            Chemical Family
          </Label>
          <Select>
            <SelectTrigger className="  px-4 w-full">
              <SelectValue placeholder="Select Chemical Family" />
            </SelectTrigger>
            <SelectContent>
              {chemicalFamilies.map((family) => (
                <SelectItem key={family._id} value={family._id}>
                  {family.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="productFamily" className="block mb-1">
            Product Family
          </Label>
          <Select>
            <SelectTrigger className="  px-4 w-full">
              <SelectValue placeholder="Select Product Family" />
            </SelectTrigger>
            <SelectContent>
              {productFamilies.map((family) => (
                <SelectItem key={family._id} value={family._id}>
                  {family.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="polymerType" className="block mb-1">
            Polymer Type
          </Label>
          <Select>
            <SelectTrigger className="  px-4 w-full">
              <SelectValue placeholder="Select Polymer Type" />
            </SelectTrigger>
            <SelectContent>
              {polymersTypes.map((polymer) => (
                <SelectItem key={polymer._id} value={polymer._id}>
                  {polymer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="industry" className="block mb-1">
            Industry
          </Label>
          <Select>
            <SelectTrigger className="  px-4 w-full h-full">
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              {industry.map((ind) => (
                <SelectItem key={ind._id} value={ind._id}>
                  {ind.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="Manufacturing Method" className="block mb-1">
            Manufacturing Method
          </Label>
          <Input
            className=" text-lg px-4"
            placeholder="Manufacturing Method"
            value={data?.manufacturingMethod}
            onChange={(e) =>
              onFieldChange("manufacturingMethod", e.target.value)
            }
          />
        </div>
        <div>
          <Label htmlFor="physicalForm" className="block mb-1">
            Physical Form
          </Label>
          <Select>
            <SelectTrigger className="  px-4 w-full">
              <SelectValue placeholder="Select Physical Form" />
            </SelectTrigger>
            <SelectContent>
              {physicalForms.map((form) => (
                <SelectItem key={form._id} value={form._id}>
                  {form.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="countryOfOrigin" className="block mb-1">
            Country of Origin
          </Label>
          <Input
            className=" text-lg px-4"
            placeholder="Country of Origin"
            value={data?.countryOfOrigin}
            onChange={(e) => onFieldChange("countryOfOrigin", e.target.value)}
          />
        </div>
        {/* div end */}
      </div>
    </div>
  );
};

export default AddEditProduct;
