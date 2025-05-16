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

interface DropdownItem {
  _id: string;
  name: string;
}

interface ProductDetailsProps {
  data: {
    manufacturingMethod?: string;
    countryOfOrigin?: string;
    color?: string;
    chemicalFamily?: string;
    productFamily?: string;
    polymerType?: string;
    industry?: string;
    physicalForm?: string;
    [key: string]: any;
  };
  onFieldChange: (field: string, value: string) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  data,
  onFieldChange,
}) => {
  const {
    chemicalFamilies,
    polymersTypes,
    industry,
    physicalForms,
    productFamilies,
  } = useDropdowns();

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
          value={data?.chemicalFamily || ""}
          onValueChange={(val) => onFieldChange("chemicalFamily", val)}
        >
          <SelectTrigger className="px-4 w-full">
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
        <Label htmlFor="productFamily" className="block mb-1">
          Product Family
        </Label>
        <Select
          value={data?.productFamily || ""}
          onValueChange={(val) => onFieldChange("productFamily", val)}
        >
          <SelectTrigger className="px-4 w-full">
            <SelectValue placeholder="Select Product Family" />
          </SelectTrigger>
          <SelectContent>
            {productFamilies.map((family: DropdownItem) => (
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
        <Select
          value={data?.polymerType || ""}
          onValueChange={(val) => onFieldChange("polymerType", val)}
        >
          <SelectTrigger className="px-4 w-full">
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
        <Label htmlFor="industry" className="block mb-1">
          Industry
        </Label>
        <Select
          value={data?.industry || ""}
          onValueChange={(val) => onFieldChange("industry", val)}
        >
          <SelectTrigger className="px-4 w-full h-full">
            <SelectValue placeholder="Select Industry" />
          </SelectTrigger>
          <SelectContent>
            {industry.map((ind: DropdownItem) => (
              <SelectItem key={ind._id} value={ind._id}>
                {ind.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="manufacturingMethod" className="block mb-1">
          Manufacturing Method
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Manufacturing Method"
          value={data?.manufacturingMethod || ""}
          onChange={(e) => onFieldChange("manufacturingMethod", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="physicalForm" className="block mb-1">
          Physical Form
        </Label>
        <Select
          value={data?.physicalForm || ""}
          onValueChange={(val) => onFieldChange("physicalForm", val)}
        >
          <SelectTrigger className="px-4 w-full">
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
          value={data?.countryOfOrigin || ""}
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
          value={data?.color || ""}
          onChange={(e) => onFieldChange("color", e.target.value)}
        />
      </div>
    </>
  );
};

export default ProductDetails;
