import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { useDropdowns } from "@/lib/useDropdowns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { ProductFormData } from "@/types/product"; // adjust the path as needed
import MultiSelectTrigger from "@/components/shared/MultiSelect";
import MultiSelect from "@/components/shared/MultiSelect";

interface DropdownItem {
  _id: string;
  name: string;
}

interface TechnicalPropertiesProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: any) => void;
  grades?: DropdownItem[];
}

const TechnicalProperties: React.FC<TechnicalPropertiesProps> = ({
  data,
  onFieldChange,
  grades = [],
}) => {
  return (
    <>
      <div className="col-span-3 my-4">
        <h4 className="text-xl">Technical Properties</h4>
      </div>

      <div>
        <Label htmlFor="density" className="block mb-1">
          Density g/cm²
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Density"
          value={data?.density || ""}
          onChange={(e) => onFieldChange("density", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="mfi" className="block mb-1">
          Melt Flow Index
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="MFI"
          type="number"
          value={data?.mfi ?? ""}
          onChange={(e) => onFieldChange("mfi", parseFloat(e.target.value))}
        />
      </div>

      <div>
        <Label htmlFor="tensileStrength" className="block mb-1">
          Tensile Strength
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Tensile Strength"
          type="number"
          value={data?.tensileStrength ?? ""}
          onChange={(e) =>
            onFieldChange("tensileStrength", parseFloat(e.target.value))
          }
        />
      </div>

      <div>
        <Label htmlFor="elongationAtBreak" className="block mb-1">
          Elongation at Break
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Elongation at Break"
          type="number"
          value={data?.elongationAtBreak ?? ""}
          onChange={(e) =>
            onFieldChange("elongationAtBreak", parseFloat(e.target.value))
          }
        />
      </div>

      <div>
        <Label htmlFor="shoreHardness" className="block mb-1">
          Shore Hardness
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Shore Hardness"
          type="number"
          value={data?.shoreHardness ?? ""}
          onChange={(e) =>
            onFieldChange("shoreHardness", parseFloat(e.target.value))
          }
        />
      </div>

      <div>
        <Label htmlFor="waterAbsorption" className="block mb-1">
          Water Absorption
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Water Absorption"
          type="number"
          value={data?.waterAbsorption ?? ""}
          onChange={(e) =>
            onFieldChange("waterAbsorption", parseFloat(e.target.value))
          }
        />
      </div>

      <div>
        <MultiSelect
          label="Grades"
          placeholder="Select Grades"
          options={grades}
          selected={data.grades || []}
          onChange={(selected) => onFieldChange("grades", selected)}
        />
      </div>
    </>
  );
};

export default TechnicalProperties;
