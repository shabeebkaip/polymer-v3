import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Card, CardContent } from "../../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Beaker, Thermometer, Zap, Gauge, FileText } from "lucide-react";
import { ProductFormData } from "@/types/product";
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

// Technical property categories based on backend schema
const PROPERTY_CATEGORIES = [
  {
    title: "Physical Properties",
    icon: Gauge,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    fields: [
      { key: "density", label: "Density", unit: "g/cm³", placeholder: "Enter density value" },
      { key: "mfi", label: "Melt Flow Index (MFI)", unit: "g/10min", placeholder: "Enter MFI value" },
      { key: "tensileStrength", label: "Tensile Strength", unit: "MPa", placeholder: "Enter tensile strength" },
      { key: "elongationAtBreak", label: "Elongation at Break", unit: "%", placeholder: "Enter elongation at break" },
      { key: "shoreHardness", label: "Shore Hardness", unit: "Shore A/D", placeholder: "Enter shore hardness" },
      { key: "waterAbsorption", label: "Water Absorption", unit: "%", placeholder: "Enter water absorption" },
    ]
  }
];

const TechnicalProperties: React.FC<TechnicalPropertiesProps> = ({
  data,
  onFieldChange,
  grades = [],
}) => {
  return (
    <>
      <div className="col-span-full mb-6">
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardContent className="p-4">
            <h4 className="text-lg font-semibold text-indigo-800 mb-2">Technical Properties</h4>
            <p className="text-sm text-indigo-600">Define material characteristics and performance data</p>
            <Badge variant="secondary" className="mt-2 text-xs">Optional - Enhance product credibility</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Grades Selection */}
      <div className="col-span-full mb-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Product Grades
            <span className="text-gray-400 text-xs">(Optional)</span>
          </Label>
          <MultiSelect
            label=""
            placeholder="Select applicable grades"
            options={grades}
            selected={data.grade || []}
            onChange={(selected) => onFieldChange("grade", selected)}
          />
          <p className="text-xs text-gray-500">Select all grades that apply to this product</p>
        </div>
      </div>

      {/* Technical Property Categories */}
      {PROPERTY_CATEGORIES.map((category) => {
        const Icon = category.icon;
        return (
          <div key={category.title} className="col-span-full mb-6">
            <Card className="border-gray-200 hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className={`flex items-center gap-2 mb-4 p-2 rounded-lg ${category.bgColor}`}>
                  <Icon className={`w-5 h-5 ${category.color}`} />
                  <h5 className="font-semibold text-gray-800">{category.title}</h5>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key} className="text-sm font-medium text-gray-700">
                        {field.label}
                        <span className="text-gray-400 text-xs ml-1">({field.unit})</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id={field.key}
                          type="number"
                          step="0.01"
                          placeholder={field.placeholder}
                          value={(data as any)?.[field.key] || ""}
                          onChange={(e) => onFieldChange(field.key as keyof ProductFormData, e.target.value)}
                          className="pr-16 border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 transition-all duration-200"
                        />
                        <div className="absolute right-3 top-2.5 text-sm text-gray-500 pointer-events-none">
                          {field.unit}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}

      {/* Additional Properties */}
      <div className="col-span-full">
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <h5 className="font-semibold text-gray-800 mb-4">Additional Properties</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="elongation_at_break" className="text-sm font-medium text-gray-700">
                  Elongation at Break
                  <span className="text-gray-400 text-xs ml-1">(%)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="elongation_at_break"
                    type="number"
                    step="0.1"
                    placeholder="Enter elongation at break"
                    value={data?.elongation_at_break || ""}
                    onChange={(e) => onFieldChange("elongation_at_break", e.target.value)}
                    className="pr-8 border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 transition-all duration-200"
                  />
                  <div className="absolute right-3 top-2.5 text-sm text-gray-500 pointer-events-none">%</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="flexural_modulus" className="text-sm font-medium text-gray-700">
                  Flexural Modulus
                  <span className="text-gray-400 text-xs ml-1">(MPa)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="flexural_modulus"
                    type="number"
                    step="0.1"
                    placeholder="Enter flexural modulus"
                    value={data?.flexural_modulus || ""}
                    onChange={(e) => onFieldChange("flexural_modulus", e.target.value)}
                    className="pr-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-200 transition-all duration-200"
                  />
                  <div className="absolute right-3 top-2.5 text-sm text-gray-500 pointer-events-none">MPa</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TechnicalProperties;
