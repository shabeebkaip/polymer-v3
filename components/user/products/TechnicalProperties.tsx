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

interface Grade {
  _id: string;
  name: string;
}

interface TechnicalPropertiesProps {
  data: {
    density?: string;
    mfi?: string;
    tensileStrength?: string;
    elongationAtBreak?: string;
    shoreHardness?: string;
    waterAbsorption?: string;
    grade?: string;
    [key: string]: any;
  };
  onFieldChange: (field: string, value: string) => void;
}

const TechnicalProperties: React.FC<TechnicalPropertiesProps> = ({
  data,
  onFieldChange,
}) => {
  const { grades } = useDropdowns();

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
          value={data?.mfi || ""}
          onChange={(e) => onFieldChange("mfi", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="tensileStrength" className="block mb-1">
          Tensile Strength
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Tensile Strength"
          value={data?.tensileStrength || ""}
          onChange={(e) => onFieldChange("tensileStrength", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="elongationAtBreak" className="block mb-1">
          Elongation at Break
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Elongation at Break"
          value={data?.elongationAtBreak || ""}
          onChange={(e) => onFieldChange("elongationAtBreak", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="shoreHardness" className="block mb-1">
          Shore Hardness
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Shore Hardness"
          value={data?.shoreHardness || ""}
          onChange={(e) => onFieldChange("shoreHardness", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="waterAbsorption" className="block mb-1">
          Water Absorption
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Water Absorption"
          value={data?.waterAbsorption || ""}
          onChange={(e) => onFieldChange("waterAbsorption", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="grade" className="block mb-1">
          Grade
        </Label>
        <Select
          value={data?.grade || ""}
          onValueChange={(val) => onFieldChange("grade", val)}
        >
          <SelectTrigger className="px-4 w-full">
            <SelectValue placeholder="Select Grade" />
          </SelectTrigger>
          <SelectContent>
            {grades?.map((grade: Grade) => (
              <SelectItem key={grade._id} value={grade._id}>
                {grade.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default TechnicalProperties;
