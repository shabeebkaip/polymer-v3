import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Card, CardContent } from "../../ui/card";
import { Gauge, Layers, Thermometer } from "lucide-react";
import { ProductFormData, TechnicalPropertiesProps } from "@/types/product";
import MultiSelect from "@/components/shared/MultiSelect";
import ConfidenceBadge from "@/components/ai-import/ConfidenceBadge";

type Props = TechnicalPropertiesProps & {
  aiFilledFields?: Record<string, { confidence: string }>;
  clearAiField?: (field: string) => void;
};

// Technical property categories based on backend schema
const PROPERTY_CATEGORIES = [
  {
    id: "physical",
    title: "Physical Properties",
    icon: Gauge,
    description: "Base material characteristics and flow behavior",
    fields: [
      { key: "density", label: "Density", unit: "g/cm³", placeholder: "Enter density value" },
      { key: "mfi", label: "Melt Flow Index (MFI)", unit: "g/10 min", placeholder: "Enter MFI value" },
      { key: "waterAbsorption", label: "Water Absorption", unit: "%", placeholder: "Enter water absorption" },
    ]
  },
  {
    id: "mechanical",
    title: "Mechanical Properties",
    icon: Layers,
    description: "Strength, stiffness, and deformation data",
    fields: [
      { key: "tensileStrength", label: "Tensile Strength", unit: "MPa", placeholder: "Enter tensile strength" },
      { key: "elongationAtBreak", label: "Elongation at Break", unit: "%", placeholder: "Enter elongation" },
      { key: "flexuralModulus", label: "Flexural Modulus", unit: "MPa", placeholder: "Enter flexural modulus" },
      { key: "shoreHardness", label: "Shore Hardness", unit: "Shore A/D", placeholder: "Enter shore hardness" },
    ]
  },
  {
    id: "thermal",
    title: "Thermal Properties",
    icon: Thermometer,
    description: "Temperature limits and thermal stability",
    fields: [
      { key: "meltingPoint", label: "Melting Point", unit: "°C", placeholder: "Enter melting point" },
      { key: "glassTransitionTemperature", label: "Glass Transition Temp.", unit: "°C", placeholder: "Enter Tg" },
      { key: "heatDeflectionTemperature", label: "Heat Deflection Temp.", unit: "°C", placeholder: "Enter HDT" },
    ]
  }
];

const TechnicalProperties: React.FC<Props> = ({
  data,
  onFieldChange,
  grades = [],
  aiFilledFields,
  clearAiField,
}) => {
  const aiCls = (field: string) => {
    const ai = aiFilledFields?.[field];
    if (!ai) return "";
    return ai.confidence === "low" ? " border-orange-300 bg-orange-50" : " border-teal-300 bg-teal-50";
  };

  const AiChip = ({ field }: { field: string }) => {
    const ai = aiFilledFields?.[field];
    if (!ai) return null;
    return ai.confidence === "low"
      ? <ConfidenceBadge level="low" />
      : <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">✦ AI</span>;
  };

  return (
    <>
      {/* Grades Selection */}
      <div className="col-span-full" id="grade-field" tabIndex={-1}>
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
              onChange={(selected) => { clearAiField?.("grade"); onFieldChange("grade", selected); }}
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
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100">
                    <Icon className="w-4 h-4 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-semibold text-gray-900">{category.title}</h5>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">Optional</span>
                    </div>
                    <p className="text-xs text-gray-500">{category.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.fields.map((field) => (
                    <div key={field.key} className="space-y-1.5">
                      <Label htmlFor={field.key} className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        {field.label}
                        <span className="text-gray-400 text-xs">({field.unit})</span>
                        <AiChip field={field.key} />
                      </Label>
                      <div className="relative">
                        <Input
                          id={field.key}
                          type="number"
                          step="0.01"
                          placeholder={field.placeholder}
                          value={(data as Record<string, unknown>)?.[field.key] as string || ""}
                          onChange={(e) => { clearAiField?.(field.key); onFieldChange(field.key as keyof ProductFormData, e.target.value); }}
                          className={`pr-16 h-9 text-sm${aiCls(field.key)}`}
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
