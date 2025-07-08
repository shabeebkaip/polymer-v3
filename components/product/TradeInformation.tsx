import React from "react";
import LabelValue from "../shared/LabelValue";
import { 
  FileText, 
  DollarSign, 
  Package, 
  Leaf, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Download
} from "lucide-react";
import FileViewer from "../shared/FileViewer";
import { Badge } from "@/components/ui/badge";

interface NamedItem {
  name: string;
}

interface Product {
  minimum_order_quantity?: number;
  uom?: string;
  stock?: number;
  price?: string | number;
  priceTerms?: string;
  incoterms?: NamedItem[];
  leadTime?: string | Date;
  packagingType?: NamedItem[];
  packagingWeight?: string;
  storageConditions?: string;
  shelfLife?: string;
  recyclable?: boolean;
  bioDegradable?: boolean;
  fdaApproved?: boolean;
  medicalGrade?: boolean;
  [key: string]: unknown;
}

interface GeneralTabInformationProps {
  product: Product;
}

const TradeInformation: React.FC<GeneralTabInformationProps> = ({
  product,
}) => {
  // Available quantity logic with enhanced styling
  const renderAvailableQuantity = () => {
    if (product?.stock && product.stock > 0) {
      return (
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
          <div>
            <p className="text-sm font-medium text-gray-700">Available Quantity</p>
            <p className="text-lg font-bold text-gray-900">
              {product.stock} {product.uom}
            </p>
          </div>
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            In Stock
          </Badge>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
        <div>
          <p className="text-sm font-medium text-gray-700">Available Quantity</p>
          <p className="text-lg font-bold text-gray-900">0 {product.uom}</p>
        </div>
        <Badge variant="destructive">
          <AlertCircle className="w-4 h-4 mr-1" />
          Out of Stock
        </Badge>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Order Information */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-500">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Order Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {product.minimum_order_quantity && (
            <LabelValue 
              label="Minimum Order Quantity" 
              value={`${product.minimum_order_quantity} ${product.uom}`} 
              compact 
            />
          )}
          {product.uom && (
            <LabelValue label="Unit of Sale" value={product.uom} compact />
          )}
          {product.price && (
            <LabelValue label="Price per Unit" value={product.price} compact />
          )}
          {product.priceTerms && (
            <LabelValue label="Price Terms" value={product.priceTerms} compact />
          )}
        </div>
        
        {/* Stock Status */}
        <div className="mt-4">
          {renderAvailableQuantity()}
        </div>

        {/* Incoterms */}
        {product.incoterms && product.incoterms.length > 0 && (
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Incoterms</label>
            <div className="flex flex-wrap gap-1">
              {product.incoterms.map((item, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                  {item.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Packaging & Logistics */}
      <div className="bg-white rounded-lg p-4 border shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-bold text-gray-900">Packaging & Logistics</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {product.packagingWeight && (
            <LabelValue label="Packaging Weight" value={product.packagingWeight} compact />
          )}
          {product.storageConditions && (
            <LabelValue label="Storage Conditions" value={product.storageConditions} compact />
          )}
          {product.shelfLife && (
            <LabelValue label="Shelf Life" value={product.shelfLife} compact />
          )}
        </div>

        {/* Packaging Types */}
        {product.packagingType && product.packagingType.length > 0 && (
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Packaging Types</label>
            <div className="flex flex-wrap gap-1">
              {product.packagingType.map((item, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  {item.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Environmental & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Environmental */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold text-gray-900">Environmental</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Recyclable</span>
              <Badge variant={product.recyclable ? "default" : "secondary"} className="text-xs">
                {product.recyclable ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                {product.recyclable ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Biodegradable</span>
              <Badge variant={product.bioDegradable ? "default" : "secondary"} className="text-xs">
                {product.bioDegradable ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                {product.bioDegradable ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-500">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-bold text-gray-900">Certifications</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">FDA Approved</span>
              <Badge variant={product.fdaApproved ? "default" : "secondary"} className="text-xs">
                {product.fdaApproved ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                {product.fdaApproved ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Medical Grade</span>
              <Badge variant={product.medicalGrade ? "default" : "secondary"} className="text-xs">
                {product.medicalGrade ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                {product.medicalGrade ? "Yes" : "No"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      {(product?.technical_data_sheet || product?.safety_data_sheet || product?.certificate_of_analysis) && (
        <div className="bg-white rounded-lg p-4 border shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-bold text-gray-900">Documents</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {product?.technical_data_sheet && typeof product.technical_data_sheet === 'object' && 'fileUrl' in product.technical_data_sheet && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                <FileText className="w-4 h-4 text-red-500" />
                <FileViewer
                  previewFile={product.technical_data_sheet as { fileUrl: string; name: string; type: string; }}
                  triggerComp={
                    <span className="text-sm text-gray-700 hover:text-gray-900 cursor-pointer">
                      Technical Data Sheet
                    </span>
                  }
                />
                <Download className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
            )}
            {product?.safety_data_sheet && typeof product.safety_data_sheet === 'object' && 'fileUrl' in product.safety_data_sheet && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                <FileText className="w-4 h-4 text-red-500" />
                <FileViewer
                  previewFile={product.safety_data_sheet as { fileUrl: string; name: string; type: string; }}
                  triggerComp={
                    <span className="text-sm text-gray-700 hover:text-gray-900 cursor-pointer">
                      Safety Data Sheet
                    </span>
                  }
                />
                <Download className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
            )}
            {product?.certificate_of_analysis && typeof product.certificate_of_analysis === 'object' && 'fileUrl' in product.certificate_of_analysis && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                <FileText className="w-4 h-4 text-red-500" />
                <FileViewer
                  previewFile={product.certificate_of_analysis as { fileUrl: string; name: string; type: string; }}
                  triggerComp={
                    <span className="text-sm text-gray-700 hover:text-gray-900 cursor-pointer">
                      Certificate of Analysis
                    </span>
                  }
                />
                <Download className="w-4 h-4 text-gray-400 ml-auto" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeInformation;
