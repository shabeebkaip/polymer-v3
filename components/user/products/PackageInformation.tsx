import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { useDropdowns } from "@/lib/useDropdowns";

interface PackagingType {
  _id: string;
  name: string;
}

interface PackageInformationProps {
  data: {
    packageType?: string;
    packageWeight?: string;
    storageConditions?: string;
    shelfLife?: string;
    [key: string]: any;
  };
  onFieldChange: (field: string, value: string) => void;
}

const PackageInformation: React.FC<PackageInformationProps> = ({
  data,
  onFieldChange,
}) => {
  const { packagingTypes } = useDropdowns();

  return (
    <>
      <div className="col-span-3">
        <h4 className="text-xl">Package Information</h4>
      </div>

      <div>
        <Label htmlFor="packageType" className="block mb-1">
          Package Type
        </Label>
        <Select
          value={data?.packageType || ""}
          onValueChange={(val) => onFieldChange("packageType", val)}
        >
          <SelectTrigger className="px-4 w-full">
            <SelectValue placeholder="Select Package Type" />
          </SelectTrigger>
          <SelectContent>
            {packagingTypes.map((type: PackagingType) => (
              <SelectItem key={type._id} value={type._id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="packageWeight" className="block mb-1">
          Package Weight
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Package Weight"
          value={data?.packageWeight || ""}
          onChange={(e) => onFieldChange("packageWeight", e.target.value)}
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
