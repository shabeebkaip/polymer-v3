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
import { useDropdowns } from "@/lib/useDropdowns";
import { ProductFormData } from "@/types/product";
import MultiSelect from "@/components/shared/MultiSelect";

interface DropdownItem {
  _id: string;
  name: string;
}

interface ProductDetailsProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: any) => void;
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
      <div className="col-span-3 my-4">
        <h4 className="text-xl">Product Details</h4>
      </div>

      <div>
        <Label htmlFor="chemicalFamily" className="block mb-1">
          Chemical Family
        </Label>
        <Select
          value={data.chemicalFamily || ""}
          onValueChange={(val) => onFieldChange("chemicalFamily", val)}
        >
          <SelectTrigger
            className="px-4 w-full"
            onFocus={() => onFieldError("chemicalFamily")} // Clear error on focus
            error={error.chemicalFamily ? true : false} // Show error state
            helperText={error.chemicalFamily} // Show error message
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
      </div>

      <div>
        <MultiSelect
          label="Product Families"
          placeholder="Select Product Family"
          options={productFamilies}
          selected={data.product_family || []}
          onChange={(selected) => onFieldChange("product_family", selected)}
        />
      </div>

      <div>
        <Label htmlFor="polymerType" className="block mb-1">
          Polymer Type
        </Label>
        <Select
          value={data.polymerType || ""}
          onValueChange={(val) => onFieldChange("polymerType", val)}
        >
          <SelectTrigger
            className="px-4 w-full"
            onFocus={() => onFieldError("polymerType")} // Clear error on focus
            error={error.polymerType ? true : false} // Show error state
            helperText={error.polymerType} // Show error message
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
      </div>

      <div>
        <MultiSelect
          label="Industries"
          placeholder="Select Industry"
          options={industry}
          selected={data.industry || []}
          onChange={(selected) => onFieldChange("industry", selected)}
          error={!!error.industry}
          helperText={error.industry}
          onFocus={() => onFieldError("industry")} // Clear error on focus
        />
      </div>

      <div>
        <Label htmlFor="manufacturingMethod" className="block mb-1">
          Manufacturing Method
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Manufacturing Method"
          value={data.manufacturingMethod || ""}
          onChange={(e) => onFieldChange("manufacturingMethod", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="physicalForm" className="block mb-1">
          Physical Form
        </Label>
        <Select
          value={data.physicalForm || ""}
          onValueChange={(val) => onFieldChange("physicalForm", val)}
        >
          <SelectTrigger
            className="px-4 w-full"
            onFocus={() => onFieldError("physicalForm")} // Clear error on focus
            error={error.physicalForm ? true : false} // Show error state
            helperText={error.physicalForm} // Show error message
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
      </div>

      <div>
        <Label htmlFor="countryOfOrigin" className="block mb-1">
          Country of Origin
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Country of Origin"
          value={data.countryOfOrigin || ""}
          onChange={(e) => onFieldChange("countryOfOrigin", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="color" className="block mb-1">
          Color
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Color"
          value={data.color || ""}
          onChange={(e) => onFieldChange("color", e.target.value)}
        />
      </div>
    </>
  );
};

export default ProductDetails;
