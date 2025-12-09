import React from 'react';
import { Settings } from 'lucide-react';

interface TechnicalPropertiesProps {
  product: {
    density?: string;
    mfi?: string;
    tensileStrength?: string;
    elongationAtBreak?: string;
    shoreHardness?: string;
    waterAbsorption?: string;
  };
}

export const TechnicalProperties: React.FC<TechnicalPropertiesProps> = ({ product }) => {
  const properties = [
    { label: 'Density', value: product.density, unit: 'g/cm³' },
    { label: 'MFI', value: product.mfi, unit: 'g/10 min' },
    { label: 'Tensile Strength', value: product.tensileStrength, unit: 'MPa' },
    { label: 'Elongation at Break', value: product.elongationAtBreak, unit: '%' },
    { label: 'Shore Hardness', value: product.shoreHardness, unit: 'Shore D' },
    { label: 'Water Absorption', value: product.waterAbsorption, unit: '%' },
  ].filter(prop => prop.value);

  if (properties.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-green-600" />
        <h2 className="text-lg font-semibold text-gray-900">Technical Properties</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {properties.map((prop) => (
          <div key={prop.label} className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <p className="text-xs text-purple-600 mb-1">{prop.label}</p>
            <p className="font-medium text-purple-900">
              {prop.value} {prop.unit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
