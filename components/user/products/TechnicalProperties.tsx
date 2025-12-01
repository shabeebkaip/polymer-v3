import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Gauge, FileText } from "lucide-react";
import { ProductFormData, TechnicalPropertiesProps } from "@/types/product";
import MultiSelect from "@/components/shared/MultiSelect";

// Technical property categories based on backend schema
const PROPERTY_CATEGORIES = [
  {
    title: "Physical Properties",
    icon: Gauge,
    fields: [
      { key: "density", label: "Density", unit: "g/cm³", placeholder: "Enter density value" },
      { key: "mfi", label: "Melt Flow Index (MFI)", unit: "g/10 min", placeholder: "Enter MFI value" },
      { key: "tensileStrength", label: "Tensile Strength", unit: "MPa", placeholder: "Enter tensile strength" },
      { key: "elongationAtBreak", label: "Elongation at Break", unit: "%", placeholder: "Enter elongation at break" },
      { key: "flexuralModulus", label: "Flexural Modulus", unit: "%", placeholder: "Enter Flexural Modulus" },
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
      {/* Grades Selection */}
      <div className="col-span-full">
        <Card className="border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Product Grades</h4>
                <p className="text-xs text-gray-500 mt-0.5">Select all grades that apply to this product</p>
              </div>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">Optional</span>
            </div>
            <MultiSelect
              label=""
              placeholder="Select applicable grades"
              options={grades}
              selected={data.grade || []}
              onChange={(selected) => onFieldChange("grade", selected)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Technical Property Categories */}
      {PROPERTY_CATEGORIES.map((category) => {
        const Icon = category.icon;
        return (
          <div key={category.title} className="col-span-full">
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                  <Icon className="w-4 h-4 text-gray-700" />
                  <h5 className="text-sm font-semibold text-gray-900">{category.title}</h5>
                  <span className="ml-auto px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">Optional</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.fields.map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <Label htmlFor={field.key} className="text-xs font-medium text-gray-700">
                        {field.label}
                        <span className="text-gray-400 text-xs ml-1">({field.unit})</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id={field.key}
                          type="number"
                          step="0.01"
                          placeholder={field.placeholder}
                          value={(data as Record<string, unknown>)?.[field.key] as string || ""}
                          onChange={(e) => onFieldChange(field.key as keyof ProductFormData, e.target.value)}
                          className="pr-16 h-9 text-sm"
                        />
                        <div className="absolute right-3 top-2 text-xs text-gray-500 pointer-events-none">
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
    </>
  );
};

export default TechnicalProperties;
