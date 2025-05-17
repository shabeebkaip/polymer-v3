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
import { Button } from "../ui/button";
import { createProduct } from "@/apiServices/products";
import { initialFormData } from "@/apiServices/constants/userProductCrud";

// 🛠️ Interface to type the error state
type ValidationErrors = Partial<Record<keyof ProductFormData, string>>;

const AddEditProduct = () => {
  const { id } = useParams();
  const {
    chemicalFamilies,
    polymersTypes,
    industry,
    physicalForms,
    packagingTypes,
    grades,
    incoterms,
    paymentTerms,
    productFamilies,
  } = useDropdowns();

  const [data, setData] = useState<ProductFormData>(initialFormData);
  const [error, setError] = useState<ValidationErrors>({});

  const onFieldChange = (key: keyof ProductFormData, value: any) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    const validationErrors: ValidationErrors = {};

    const requiredFields: (keyof ProductFormData)[] = [
      "productName",
      "chemicalName",
      "chemicalFamily",
      "polymerType",
      "physicalForm",
      "minimum_order_quantity",
      "stock",
      "uom",
      "price",
      "createdBy",
    ];

    requiredFields.forEach((field) => {
      if (
        data[field] === undefined ||
        data[field] === null ||
        data[field] === "" ||
        (Array.isArray(data[field]) && data[field].length === 0)
      ) {
        validationErrors[field] = `${String(field).replace(
          /_/g,
          " "
        )} is required`;
      }
    });

    if (data.industry.length === 0) {
      validationErrors.industry = "At least one industry must be selected";
    }

    if (data.incoterms.length === 0) {
      validationErrors.incoterms = "At least one incoterm must be selected";
    }

    if (data.productImages.length === 0) {
      validationErrors.productImages = "At least one product image is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      console.warn("Validation errors:", validationErrors);
      setError(validationErrors);
      return;
    }

    createProduct(data)
      .then((res) => {
        console.log("Product created successfully", res);
      })
      .catch((err) => {
        console.error("Error creating product", err);
      });
  };
    console.log("Errors", error);
  return (
    <div className="container mx-auto px-4 pb-6">
      <div className="grid grid-cols-3 gap-4">
        <GeneralInformation data={data} onFieldChange={onFieldChange} />
        <ProductDetails
          data={data}
          onFieldChange={onFieldChange}
          chemicalFamilies={chemicalFamilies}
          polymersTypes={polymersTypes}
          industry={industry}
          physicalForms={physicalForms}
          productFamilies={productFamilies}
        />
        <ProductImages data={data} onFieldChange={onFieldChange} />
        <TechnicalProperties
          data={data}
          onFieldChange={onFieldChange}
          grades={grades}
        />
        <TradeInformation
          data={data}
          onFieldChange={onFieldChange}
          incoterms={incoterms}
          paymentTerms={paymentTerms}
        />
        <PackageInformation
          data={data}
          onFieldChange={onFieldChange}
          packagingTypes={packagingTypes}
        />
        <Environmental data={data} onFieldChange={onFieldChange} />
        <Certification data={data} onFieldChange={onFieldChange} />
        <Documents data={data} onFieldChange={onFieldChange} />
        <div className="col-span-3 flex gap-4">
          <Button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white rounded-lg hover:opacity-90 cursor-pointer"
          >
            {id ? "Update" : "Create"} Product
          </Button>
          <Button
            onClick={() => setData(initialFormData)}
            variant="outline"
            className="px-4 py-2 border border-[var(--green-main)] text-[var(--green-main)] rounded-lg hover:bg-green-50 transition cursor-pointer"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddEditProduct;
