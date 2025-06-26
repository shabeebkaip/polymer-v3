import React from "react";
import LabelValue from "../shared/LabelValue";
import Image from "next/image";
import { 
  FileImage, 
  FileText, 
  Package, 
  Beaker, 
  Settings, 
  BarChart3,
  Globe,
  Palette
} from "lucide-react";
import FileViewer from "../shared/FileViewer";
import { Badge } from "@/components/ui/badge";

interface NamedItem {
  name: string;
}

interface Product {
  productName: string;
  chemicalName?: string;
  tradeName?: string;
  description?: string;
  chemicalFamily?: NamedItem;
  polymerType?: NamedItem;
  industry?: NamedItem[];
  grade?: NamedItem[];
  manufacturingMethod?: string;
  physicalForm?: NamedItem;
  countryOfOrigin?: string;
  color?: string;
  density?: string | number;
  mfi?: string | number;
  tensileStrength?: string | number;
  elongationAtBreak?: string | number;
  shoreHardness?: string | number;
  waterAbsorption?: string | number;
  [key: string]: any;
}

interface GeneralTabInformationProps {
  product: Product;
}

const GeneralTabInformation: React.FC<GeneralTabInformationProps> = ({
  product,
}) => {
  const renderIfExists = (label: string, value?: string | number | null) =>
    value !== undefined && value !== null && value !== "" ? (
      <LabelValue label={label} value={value} />
    ) : null;

  const renderArray = (label: string, data?: NamedItem[]) =>
    data && data.length > 0 ? (
      <LabelValue
        label={label}
        value={data.map((item) => item.name).join(", ")}
      />
    ) : null;

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border-l-4 border-green-500">
        <div className="flex items-center gap-2 mb-6">
          <Package className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-bold text-gray-900">Product Overview</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {product.productName && (
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h4 className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Product Name</h4>
                <p className="text-lg font-bold text-gray-900">{product.productName}</p>
              </div>
            )}
            
            {product.chemicalName && (
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Chemical Name</h4>
                <p className="text-lg font-bold text-gray-900">{product.chemicalName}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {product.tradeName && (
              <div className="bg-white rounded-lg p-4 shadow-sm border">
                <h4 className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Trade Name</h4>
                <p className="text-lg font-bold text-gray-900">{product.tradeName}</p>
              </div>
            )}
            
            {/* Additional info can go here */}
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h4 className="text-xs font-semibold text-orange-600 uppercase tracking-wide mb-1">Category</h4>
              <p className="text-lg font-bold text-gray-900">Polymer Material</p>
            </div>
          </div>
        </div>

        {/* Description - Full Width */}
        {product.description && (
          <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border">
            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Product Description</h4>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        )}
      </div>

      {/* Product Classification */}
      <div className="bg-white rounded-lg p-4 border shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Beaker className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Product Classification</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {product.chemicalFamily?.name && (
            <LabelValue label="Chemical Family" value={product.chemicalFamily.name} compact />
          )}
          {product.polymerType?.name && (
            <LabelValue label="Polymer Type" value={product.polymerType.name} compact />
          )}
          {product.physicalForm?.name && (
            <LabelValue label="Physical Form" value={product.physicalForm.name} compact />
          )}
          {product.manufacturingMethod && (
            <LabelValue label="Manufacturing Method" value={product.manufacturingMethod} compact />
          )}
          {product.color && (
            <LabelValue label="Color" value={product.color} compact />
          )}
          {product.countryOfOrigin && (
            <LabelValue label="Country of Origin" value={product.countryOfOrigin} compact />
          )}
        </div>
        
        {/* Industry and Grade Badges */}
        {(product.industry && product.industry.length > 0) && (
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Industries</label>
            <div className="flex flex-wrap gap-1">
              {product.industry.map((item, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                  {item.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {(product.grade && product.grade.length > 0) && (
          <div className="mt-3">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Application Grades</label>
            <div className="flex flex-wrap gap-1">
              {product.grade.map((item, index) => (
                <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                  {item.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Technical Specifications */}
      <div className="bg-white rounded-lg p-4 border shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-bold text-gray-900">Technical Specifications</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {product.density && (
            <LabelValue label="Density" value={`${product.density} g/cm³`} compact />
          )}
          {product.mfi && (
            <LabelValue label="Melt Flow Index" value={product.mfi} compact />
          )}
          {product.tensileStrength && (
            <LabelValue label="Tensile Strength" value={product.tensileStrength} compact />
          )}
          {product.elongationAtBreak && (
            <LabelValue label="Elongation at Break" value={`${product.elongationAtBreak}%`} compact />
          )}
          {product.shoreHardness && (
            <LabelValue label="Shore Hardness" value={product.shoreHardness} compact />
          )}
          {product.waterAbsorption && (
            <LabelValue label="Water Absorption" value={product.waterAbsorption} compact />
          )}
        </div>
      </div>

      {/* Compliance & Certifications */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-500">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-bold text-gray-900">Compliance & Quality</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            ISO 9001 Certified
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Quality Assured
          </Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Industry Standard
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default GeneralTabInformation;
