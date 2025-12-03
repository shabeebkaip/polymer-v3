import React from 'react';
import { Settings } from 'lucide-react';

interface TechnicalPropertiesProps {
  product: {
    density: string;
    mfi: string;
    tensileStrength: string;
    elongationAtBreak: string;
    shoreHardness: string;
    waterAbsorption: string;
  };
}

export const TechnicalProperties: React.FC<TechnicalPropertiesProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-purple-100 p-2 rounded-lg">
          <Settings className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Technical Properties</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <p className="text-xs text-purple-600 mb-1">Density</p>
          <p className="text-sm font-medium text-purple-900">{product.density} g/cm³</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <p className="text-xs text-purple-600 mb-1">Melt Flow Index (MFI)</p>
          <p className="text-sm font-medium text-purple-900">{product.mfi} g/10min</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <p className="text-xs text-purple-600 mb-1">Tensile Strength</p>
          <p className="text-sm font-medium text-purple-900">{product.tensileStrength} MPa</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <p className="text-xs text-purple-600 mb-1">Elongation at Break</p>
          <p className="text-sm font-medium text-purple-900">{product.elongationAtBreak}%</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <p className="text-xs text-purple-600 mb-1">Shore Hardness</p>
          <p className="text-sm font-medium text-purple-900">{product.shoreHardness} Shore D</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <p className="text-xs text-purple-600 mb-1">Water Absorption</p>
          <p className="text-sm font-medium text-purple-900">{product.waterAbsorption}%</p>
        </div>
      </div>
    </div>
  );
};
