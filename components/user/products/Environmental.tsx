import React from "react";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Leaf, Recycle, TreePine, Earth, Award, CheckCircle2 } from "lucide-react";
import { ProductFormData } from "@/types/product";

interface EnvironmentalProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: boolean) => void;
}

// Environmental features configuration
const ENVIRONMENTAL_FEATURES = [
  {
    key: "recyclable" as keyof ProductFormData,
    title: "Recyclable",
    description: "Material can be recycled after use",
    icon: Recycle,
    color: "text-green-600",
    bgColor: "bg-green-50",
    benefits: "Reduces waste and supports circular economy"
  },
  {
    key: "bioDegradable" as keyof ProductFormData,
    title: "Bio-Degradable", 
    description: "Material naturally decomposes over time",
    icon: TreePine,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    benefits: "Minimizes environmental impact at end of life"
  }
];

const Environmental: React.FC<EnvironmentalProps> = ({
  data,
  onFieldChange,
}) => {
  const getSelectedCount = () => {
    return ENVIRONMENTAL_FEATURES.filter(feature => data[feature.key]).length;
  };

  return (
    <>
      <div className="col-span-full mb-6">
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-green-800 mb-2">Environmental Impact</h4>
                <p className="text-sm text-green-600">Highlight eco-friendly properties and sustainability features</p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  {getSelectedCount()} / {ENVIRONMENTAL_FEATURES.length} Selected
                </Badge>
                <p className="text-xs text-green-600 mt-1">Boost your product's appeal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Features */}
      <div className="col-span-full space-y-4">
        {ENVIRONMENTAL_FEATURES.map((feature) => {
          const Icon = feature.icon;
          const isSelected = data[feature.key];

          return (
            <Card 
              key={feature.key} 
              className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
                isSelected ? 'ring-2 ring-green-300 border-green-300' : 'border-gray-200'
              }`}
              onClick={() => onFieldChange(feature.key, !isSelected)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${feature.bgColor} ${isSelected ? 'ring-2 ring-green-300' : ''}`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Checkbox
                        id={String(feature.key)}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          onFieldChange(feature.key, Boolean(checked))
                        }
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      <Label 
                        htmlFor={String(feature.key)} 
                        className="text-base font-semibold text-gray-800 cursor-pointer flex items-center gap-2"
                      >
                        {feature.title}
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                      </Label>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Award className="w-3 h-3" />
                      <span>{feature.benefits}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Benefits Section */}
      <div className="col-span-full mt-6">
        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Earth className="w-5 h-5 text-emerald-600" />
              <h6 className="font-medium text-gray-800">Why Environmental Features Matter</h6>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Market Advantage</p>
                  <p className="text-xs">Eco-conscious buyers actively seek sustainable products</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Compliance Ready</p>
                  <p className="text-xs">Meet increasing environmental regulations and standards</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Premium Pricing</p>
                  <p className="text-xs">Sustainable products often command higher prices</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Environmental;
