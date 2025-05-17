"use client";
import React, { useState } from "react";
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
import { createProduct, updateProduct } from "@/apiServices/products";
import { initialFormData } from "@/apiServices/constants/userProductCrud";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// 🛠️ Interface to type the error state
type ValidationErrors = Partial<Record<keyof ProductFormData, string>>;
interface RequiredField {
  field: keyof ProductFormData;
  label: string;
}
interface AddEditProductProps {
  product?: ProductFormData;
  id?: string;
}

const AddEditProduct = ({ product, id }: AddEditProductProps) => {
  const router = useRouter();
  const isEditMode = id ? true : false;

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

  const [data, setData] = useState<ProductFormData>(
    product ? product : initialFormData
  );
  const [error, setError] = useState<ValidationErrors>({});

  const onFieldChange = (key: keyof ProductFormData, value: any) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const onFieldError = (key: keyof ProductFormData) => {
    setError((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const handleSubmit = () => {
    const toastId = toast.loading(
      isEditMode ? "Updating Product" : "Creating product..."
    );
    const validationErrors: ValidationErrors = {};

    const requiredFields: RequiredField[] = [
      { field: "productName", label: "Product Name" },
      { field: "chemicalName", label: "Chemical Name" },
      { field: "tradeName", label: "Trade Name" },
      { field: "chemicalFamily", label: "Chemical Family" },
      { field: "product_family", label: "Product Family" },
      { field: "polymerType", label: "Polymer Type" },
      { field: "physicalForm", label: "Physical Form" },
      { field: "minimum_order_quantity", label: "Minimum Order Quantity" },
      { field: "stock", label: "Stock" },
      { field: "uom", label: "UOM" },
      { field: "price", label: "Price" },
    ];

    requiredFields.forEach(({ field, label }) => {
      const value = data[field];
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        validationErrors[field] = `${label} is required`;
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
      toast.error("Please fill in all required fields", {
        id: toastId,
      });

      setError(validationErrors);
      return;
    }
    const apiCall = () =>
      isEditMode ? updateProduct(id as string, data) : createProduct(data);

    apiCall()
      .then((res) => {
        if (res?.success) {
          toast.success("Product created successfully", {
            id: toastId,
          });
          setData(initialFormData);
          setTimeout(() => {
            router.push("/user/products");
          }, 1000);
        } else {
          toast.error("Error creating product", {
            id: toastId,
          });
        }
      })
      .catch((err) => {
        console.error("Error creating product", err);
        toast.error("Error creating product", {
          id: toastId,
        });
      });
  };

  console.log("Errors", error);
  return (
    <div className="container mx-auto px-4 pb-6">
      <div className="grid grid-cols-3 gap-4">
        <GeneralInformation
          data={data}
          onFieldChange={onFieldChange}
          error={error}
          onFieldError={onFieldError}
        />
        <ProductDetails
          data={data}
          onFieldChange={onFieldChange}
          chemicalFamilies={chemicalFamilies}
          polymersTypes={polymersTypes}
          industry={industry}
          physicalForms={physicalForms}
          productFamilies={productFamilies}
          error={error}
          onFieldError={onFieldError}
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
          error={error}
          onFieldError={onFieldError}
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
