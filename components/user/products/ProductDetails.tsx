import React from "react";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { Card, CardContent } from "../../ui/card";
import { ProductFormData } from "@/types/product";
import MultiSelect from "@/components/shared/MultiSelect";

interface DropdownItem {
  _id: string;
  name: string;
}

interface ProductDetailsProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: string | string[]) => void;
  chemicalFamilies: DropdownItem[];
  polymersTypes: DropdownItem[];
  industry: DropdownItem[];
  physicalForms: DropdownItem[];
  productFamilies: DropdownItem[];
  onFieldError: (field: keyof ProductFormData) => void;
  error: Partial<Record<keyof ProductFormData, string>>;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  data,
  onFieldChange,
  chemicalFamilies,
  polymersTypes,
  industry,
  physicalForms,
  productFamilies,
  onFieldError,
  error,
}) => {
  return (
    <>
      <div className="col-span-full mb-4 sm:mb-6">
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-3 sm:p-4">
            <h4 className="text-base sm:text-lg font-semibold text-emerald-800 mb-2">Technical Specifications</h4>
            <p className="text-xs sm:text-sm text-emerald-600">Define the technical characteristics and categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label htmlFor="chemicalFamily" className="text-sm font-medium text-gray-700 flex items-center gap-1">
          Chemical Family
          <span className="text-red-500">*</span>
        </Label>
        <Select
          value={data.chemicalFamily || ""}
          onValueChange={(val) => {
            onFieldChange("chemicalFamily", val);
            onFieldError("chemicalFamily");
          }}
        >
          <SelectTrigger 
            className={`transition-all duration-200 ${
              error.chemicalFamily 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-200'
            }`}
          >
            <SelectValue placeholder="Select Chemical Family" />
          </SelectTrigger>
          <SelectContent>
            {chemicalFamilies.map((family: DropdownItem) => (
              <SelectItem key={family._id} value={family._id}>
                {family.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error.chemicalFamily && (
          <p className="text-xs text-red-600 mt-1">{error.chemicalFamily}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          Product Families
          <span className="text-red-500">*</span>
        </Label>
        <MultiSelect
          label=""
          placeholder="Select Product Families"
          options={productFamilies}
          selected={data.product_family || []}
          onChange={(selected) => {
            onFieldChange("product_family", selected);
            onFieldError("product_family");
          }}
        />
        {error.product_family && (
          <p className="text-xs text-red-600 mt-1">{error.product_family}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="polymerType" className="text-sm font-medium text-gray-700 flex items-center gap-1">
          Polymer Type
          <span className="text-red-500">*</span>
        </Label>
        <Select
          value={data.polymerType || ""}
          onValueChange={(val) => {
            onFieldChange("polymerType", val);
            onFieldError("polymerType");
          }}
        >
          <SelectTrigger 
            className={`transition-all duration-200 ${
              error.polymerType 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-200'
            }`}
          >
            <SelectValue placeholder="Select Polymer Type" />
          </SelectTrigger>
          <SelectContent>
            {polymersTypes.map((polymer: DropdownItem) => (
              <SelectItem key={polymer._id} value={polymer._id}>
                {polymer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error.polymerType && (
          <p className="text-xs text-red-600 mt-1">{error.polymerType}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          Industries
          <span className="text-red-500">*</span>
        </Label>
        <MultiSelect
          label=""
          placeholder="Select Industries"
          options={industry}
          selected={data.industry || []}
          onChange={(selected) => {
            onFieldChange("industry", selected);
            onFieldError("industry");
          }}
        />
        {error.industry && (
          <p className="text-xs text-red-600 mt-1">{error.industry}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="physicalForm" className="text-sm font-medium text-gray-700 flex items-center gap-1">
          Physical Form
          <span className="text-red-500">*</span>
        </Label>
        <Select
          value={data.physicalForm || ""}
          onValueChange={(val) => {
            onFieldChange("physicalForm", val);
            onFieldError("physicalForm");
          }}
        >
          <SelectTrigger 
            className={`transition-all duration-200 ${
              error.physicalForm 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-200'
            }`}
          >
            <SelectValue placeholder="Select Physical Form" />
          </SelectTrigger>
          <SelectContent>
            {physicalForms.map((form: DropdownItem) => (
              <SelectItem key={form._id} value={form._id}>
                {form.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error.physicalForm && (
          <p className="text-xs text-red-600 mt-1">{error.physicalForm}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="manufacturingMethod" className="text-sm font-medium text-gray-700">
          Manufacturing Method
          <span className="text-gray-400 text-xs ml-1">(Optional)</span>
        </Label>
        <Input
          id="manufacturingMethod"
          placeholder="Enter manufacturing method"
          value={data.manufacturingMethod || ""}
          onChange={(e) => onFieldChange("manufacturingMethod", e.target.value)}
          className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-200 transition-all duration-200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="countryOfOrigin" className="text-sm font-medium text-gray-700">
          Country of Origin
          <span className="text-gray-400 text-xs ml-1">(Optional)</span>
        </Label>
        <Input
          id="countryOfOrigin"
          placeholder="Enter country of origin"
          value={data.countryOfOrigin || ""}
          onChange={(e) => onFieldChange("countryOfOrigin", e.target.value)}
          className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-200 transition-all duration-200"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color" className="text-sm font-medium text-gray-700">
          Color
          <span className="text-gray-400 text-xs ml-1">(Optional)</span>
        </Label>
        <Input
          id="color"
          placeholder="Enter color"
          value={data.color || ""}
          onChange={(e) => onFieldChange("color", e.target.value)}
          className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-200 transition-all duration-200"
        />
      </div>
    </>
  );
};

export default ProductDetails;
