import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import MultiSelect from "@/components/shared/MultiSelect";

interface PackagingType {
  _id: string;
  name: string;
}

interface PackageInformationProps {
  data: {
    packagingType?: string[]; // ✅ this should match actual usage
    packagingWeight?: string;
    storageConditions?: string;
    shelfLife?: string;
    [key: string]: any;
  };
  onFieldChange: (field: string, value: any) => void;
  packagingTypes?: PackagingType[];
}

const PackageInformation: React.FC<PackageInformationProps> = ({
  data,
  onFieldChange,
  packagingTypes = [],
}) => {
  return (
    <>
      <div className="col-span-3">
        <h4 className="text-xl">Package Information</h4>
      </div>

      <div>
        <MultiSelect
          label="Packaging Type"
          placeholder="Select Packaging Type"
          options={packagingTypes}
          selected={data.packagingType || []}
          onChange={(selected) => onFieldChange("packagingType", selected)}
        />
      </div>

      <div>
        <Label htmlFor="packagingWeight" className="block mb-1">
          Package Weight
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Package Weight"
          value={data?.packagingWeight || ""}
          onChange={(e) => onFieldChange("packagingWeight", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="storageConditions" className="block mb-1">
          Storage Conditions
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Storage Conditions"
          value={data?.storageConditions || ""}
          onChange={(e) => onFieldChange("storageConditions", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="shelfLife" className="block mb-1">
          Shelf Life
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Shelf Life"
          value={data?.shelfLife || ""}
          onChange={(e) => onFieldChange("shelfLife", e.target.value)}
        />
      </div>
    </>
  );
};

export default PackageInformation;
