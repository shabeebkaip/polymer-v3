import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Package, Weight, Clock, Shield, Thermometer, Truck } from "lucide-react";
import MultiSelect from "@/components/shared/MultiSelect";
import { PackagingType, PackageInformationProps } from "@/types/product";

const PackageInformation: React.FC<PackageInformationProps> = ({
  data,
  onFieldChange,
  packagingTypes = [],
}) => {
  return (
    <>
      {/* Packaging Details */}
      <div className="col-span-full">
        <Card className="border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-700" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Package & Storage Information</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Define packaging specifications and storage requirements</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">Optional</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-700">
                  Packaging Type
                </Label>
                <MultiSelect
                  label=""
                  placeholder="Select packaging types"
                  options={packagingTypes}
                  selected={data.packagingType || []}
                  onChange={(selected) => onFieldChange("packagingType", selected)}
                />
                <p className="text-xs text-gray-500">e.g., Bags, Drums, Bulk containers</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="packagingWeight" className="text-xs font-medium text-gray-700">
                  Package Weight
                </Label>
                <div className="relative">
                  <Input
                    id="packagingWeight"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 25"
                    value={data.packagingWeight || ""}
                    onChange={(e) => onFieldChange("packagingWeight", e.target.value)}
                    className="pr-12 h-9 text-sm"
                  />
                  <div className="absolute right-3 top-2 text-xs text-gray-500 pointer-events-none">kg</div>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => onFieldChange("packagingWeight", "25")}
                    className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-200"
                  >
                    25 kg
                  </button>
                  <button
                    type="button"
                    onClick={() => onFieldChange("packagingWeight", "50")}
                    className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-200"
                  >
                    50 kg
                  </button>
                  <button
                    type="button"
                    onClick={() => onFieldChange("packagingWeight", "200")}
                    className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-200"
                  >
                    200 kg
                  </button>
                  <button
                    type="button"
                    onClick={() => onFieldChange("packagingWeight", "1000")}
                    className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-200"
                  >
                    1000 kg
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="storageConditions" className="text-xs font-medium text-gray-700">
                  Storage Conditions
                </Label>
                <Input
                  id="storageConditions"
                  placeholder="e.g., Cool, dry place at 15-25°C"
                  value={data.storageConditions || ""}
                  onChange={(e) => onFieldChange("storageConditions", e.target.value)}
                  className="h-9 text-sm"
                />
                <p className="text-xs text-gray-500">Temperature, humidity requirements</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="shelfLife" className="text-xs font-medium text-gray-700">
                  Shelf Life
                </Label>
                <div className="relative">
                  <Input
                    id="shelfLife"
                    placeholder="e.g., 24 months"
                    value={data.shelfLife || ""}
                    onChange={(e) => onFieldChange("shelfLife", e.target.value)}
                    className="pr-16 h-9 text-sm"
                  />
                  <div className="absolute right-3 top-2 text-xs text-gray-500 pointer-events-none">months</div>
                </div>
                <p className="text-xs text-gray-500">Under recommended storage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PackageInformation;
