import React from 'react';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { Card, CardContent } from '../../ui/card';
import { Recycle, TreePine } from 'lucide-react';
import { ProductFormData, EnvironmentalProps } from '@/types/product';

// Environmental features configuration
const ENVIRONMENTAL_FEATURES = [
  {
    key: 'recyclable' as keyof ProductFormData,
    title: 'Recyclable',
    description: 'Material can be recycled after use',
    icon: Recycle,
  },
  {
    key: 'bioDegradable' as keyof ProductFormData,
    title: 'Bio-Degradable',
    description: 'Material naturally decomposes over time',
    icon: TreePine,
  },
];

const Environmental: React.FC<EnvironmentalProps> = ({ data, onFieldChange }) => {
  return (
    <>
      <div className="col-span-full">
        <Card className="border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Environmental Impact</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Highlight eco-friendly properties and sustainability features
                </p>
              </div>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                Optional
              </span>
            </div>

            {/* Environmental Features */}
            <div className="space-y-3">
              {ENVIRONMENTAL_FEATURES.map((feature) => {
                const Icon = feature.icon;
                const isSelected = data[feature.key];

                return (
                  <div
                    key={feature.key}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected ? 'bg-gray-50 border-gray-300' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => onFieldChange(feature.key, !isSelected)}
                  >
                    <Checkbox
                      id={String(feature.key)}
                      checked={isSelected}
                      onCheckedChange={(checked) => onFieldChange(feature.key, Boolean(checked))}
                      className="w-4 h-4"
                    />
                    <Icon className="w-5 h-5 text-gray-700 flex-shrink-0" />
                    <div className="flex-1">
                      <Label
                        htmlFor={String(feature.key)}
                        className="text-sm font-medium text-gray-900 cursor-pointer"
                      >
                        {feature.title}
                      </Label>
                      <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Environmental;
