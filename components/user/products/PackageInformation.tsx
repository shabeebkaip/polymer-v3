import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Package, Weight, Clock, Shield, Thermometer, Truck } from "lucide-react";
import MultiSelect from "@/components/shared/MultiSelect";

interface PackagingType {
  _id: string;
  name: string;
}

interface PackageInformationProps {
  data: {
    packagingType?: string[];
    packagingWeight?: string;
    storageConditions?: string;
    shelfLife?: string;
    [key: string]: unknown;
  };
  onFieldChange: (field: string, value: string | string[]) => void;
  packagingTypes?: PackagingType[];
}

const PackageInformation: React.FC<PackageInformationProps> = ({
  data,
  onFieldChange,
  packagingTypes = [],
}) => {
  return (
    <>
      <div className="col-span-full mb-6">
        <Card className="border-primary-500/30 bg-primary-50/50">
          <CardContent className="p-4">
            <h4 className="text-lg font-semibold text-primary-500 mb-2">Package & Storage Information</h4>
            <p className="text-sm text-primary-500">Define packaging specifications and storage requirements</p>
            <Badge variant="secondary" className="mt-2 text-xs">Optional - Helps with logistics planning</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Packaging Details */}
      <div className="col-span-full mb-6">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-primary-50">
              <Package className="w-5 h-5 text-primary-500" />
              <h5 className="font-semibold text-gray-800">Packaging Details</h5>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Packaging Type
                  <span className="text-gray-400 text-xs">(Optional)</span>
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

              <div className="space-y-2">
                <Label htmlFor="packagingWeight" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Weight className="w-4 h-4" />
                  Package Weight
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="packagingWeight"
                    type="number"
                    step="0.1"
                    placeholder="Enter package weight"
                    value={data.packagingWeight || ""}
                    onChange={(e) => onFieldChange("packagingWeight", e.target.value)}
                    className="pr-12 border-gray-300 focus:border-primary-500 focus:ring-primary-500/30 transition-all duration-200"
                  />
                  <div className="absolute right-3 top-2.5 text-sm text-gray-500 pointer-events-none">kg</div>
                </div>
                <p className="text-xs text-gray-500">Standard package weight</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Storage & Handling */}
      <div className="col-span-full">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-blue-50">
              <Shield className="w-5 h-5 text-blue-600" />
              <h5 className="font-semibold text-gray-800">Storage & Handling</h5>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="storageConditions" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Thermometer className="w-4 h-4" />
                  Storage Conditions
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </Label>
                <Input
                  id="storageConditions"
                  placeholder="e.g., Store in cool, dry place at 15-25°C"
                  value={data.storageConditions || ""}
                  onChange={(e) => onFieldChange("storageConditions", e.target.value)}
                  className="border-gray-300 focus:border-primary-500 focus:ring-primary-500/30 transition-all duration-200"
                />
                <p className="text-xs text-gray-500">Temperature, humidity, and other storage requirements</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shelfLife" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Shelf Life
                  <span className="text-gray-400 text-xs">(Optional)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="shelfLife"
                    placeholder="Enter shelf life"
                    value={data.shelfLife || ""}
                    onChange={(e) => onFieldChange("shelfLife", e.target.value)}
                    className="pr-20 border-gray-300 focus:border-primary-500 focus:ring-primary-500/30 transition-all duration-200"
                  />
                  <div className="absolute right-3 top-2.5 text-sm text-gray-500 pointer-events-none">months</div>
                </div>
                <p className="text-xs text-gray-500">Product shelf life under recommended storage conditions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logistics Information */}
      <div className="col-span-full mt-6">
        <Card className="border-orange-200 bg-orange-50/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="w-5 h-5 text-orange-600" />
              <h6 className="font-medium text-gray-800">Logistics Benefits</h6>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Better Quotes</p>
                  <p className="text-xs">Accurate packaging info helps suppliers provide precise shipping costs</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Faster Delivery</p>
                  <p className="text-xs">Clear storage requirements prevent delays and handling issues</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Quality Assurance</p>
                  <p className="text-xs">Proper specifications ensure product integrity during transport</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PackageInformation;
