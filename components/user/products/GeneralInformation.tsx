import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { ProductFormData } from "@/types/product";

interface GeneralInformationProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: any) => void;
  onFieldError: (field: keyof ProductFormData) => void;
  error: Partial<Record<keyof ProductFormData, string>>;
}

const GeneralInformation: React.FC<GeneralInformationProps> = ({
  data,
  onFieldChange,
  error,
  onFieldError,
}) => {
  return (
    <>
      <div className="col-span-3">
        <h4 className="text-xl">General Information</h4>
      </div>

      <div>
        <Label htmlFor="productName" className="block mb-1">
          Product Name
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Product Name"
          value={data.productName || ""}
          onChange={(e) => onFieldChange("productName", e.target.value)}
          error={error.productName ? true : false}
          helperText={error.productName}
          onFocus={() => onFieldError("productName")} // Clear error on focus

          // Clear error on focus
        />
      </div>

      <div>
        <Label htmlFor="chemicalName" className="block mb-1">
          Chemical Name
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Chemical Name"
          value={data.chemicalName || ""}
          onChange={(e) => onFieldChange("chemicalName", e.target.value)}
          error={error.chemicalName ? true : false}
          helperText={error.chemicalName}
          onFocus={() => onFieldError("chemicalName")} // Clear error on focus
        />
      </div>

      <div>
        <Label htmlFor="tradeName" className="block mb-1">
          Trade Name
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Trade Name"
          value={data.tradeName || ""}
          onChange={(e) => onFieldChange("tradeName", e.target.value)}
          error={error.tradeName ? true : false}
          helperText={error.tradeName}
          onFocus={() => onFieldError("tradeName")} // Clear error on focus
        />
      </div>

      <div className="col-span-3">
        <Label htmlFor="description" className="block mb-1">
          Description
        </Label>
        <Textarea
          className="text-lg px-4"
          placeholder="Description"
          value={data.description || ""}
          onChange={(e) => onFieldChange("description", e.target.value)}
        />
      </div>
    </>
  );
};

export default GeneralInformation;
