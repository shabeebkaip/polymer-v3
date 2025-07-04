import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Card, CardContent } from "../../ui/card";
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
      <div className="col-span-full mb-6">
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <h4 className="text-lg font-semibold text-green-800 mb-2">Basic Product Information</h4>
            <p className="text-sm text-green-600">Enter the core details that identify your product</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label htmlFor="productName" className="text-sm font-medium text-gray-700 flex items-center gap-1">
          Product Name
          <span className="text-red-500">*</span>
        </Label>
        <Input
          id="productName"
          placeholder="Enter product name"
          value={data.productName || ""}
          onChange={(e) => onFieldChange("productName", e.target.value)}
          error={error.productName ? true : false}
          helperText={error.productName}
          onFocus={() => onFieldError("productName")}
          className={`transition-all duration-200 ${
            error.productName 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
          }`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="chemicalName" className="text-sm font-medium text-gray-700 flex items-center gap-1">
          Chemical Name
          <span className="text-red-500">*</span>
        </Label>
        <Input
          id="chemicalName"
          placeholder="Enter chemical name"
          value={data.chemicalName || ""}
          onChange={(e) => onFieldChange("chemicalName", e.target.value)}
          error={error.chemicalName ? true : false}
          helperText={error.chemicalName}
          onFocus={() => onFieldError("chemicalName")}
          className={`transition-all duration-200 ${
            error.chemicalName 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
          }`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tradeName" className="text-sm font-medium text-gray-700 flex items-center gap-1">
          Trade Name
          <span className="text-red-500">*</span>
        </Label>
        <Input
          id="tradeName"
          placeholder="Enter trade name"
          value={data.tradeName || ""}
          onChange={(e) => onFieldChange("tradeName", e.target.value)}
          error={error.tradeName ? true : false}
          helperText={error.tradeName}
          onFocus={() => onFieldError("tradeName")}
          className={`transition-all duration-200 ${
            error.tradeName 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-green-500 focus:ring-green-200'
          }`}
        />
      </div>

      <div className="col-span-full space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
          <span className="text-gray-400 text-xs ml-1">(Optional)</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Provide a detailed description of your product..."
          value={data.description || ""}
          onChange={(e) => onFieldChange("description", e.target.value)}
          className="min-h-[100px] resize-y border-gray-300 focus:border-green-500 focus:ring-green-200 transition-all duration-200"
          rows={4}
        />
        <p className="text-xs text-gray-500">Help buyers understand your product better with a comprehensive description</p>
      </div>
    </>
  );
};

export default GeneralInformation;
