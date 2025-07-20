import React from "react";
import { Award, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";

interface ProductDocumentDetailsProps {
  product: Product;
}

const ProductDocumentDetails: React.FC<ProductDocumentDetailsProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
      <div className="p-6 lg:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Documents & Certificates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {product.safety_data_sheet && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-6 h-6 text-red-600" />
                <div>
                  <h4 className="font-semibold text-red-900">Safety Data Sheet</h4>
                  <p className="text-sm text-red-700">{product.safety_data_sheet?.name || ""}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => window.open(product.safety_data_sheet?.fileUrl || "", "_blank")}
              >
                Download PDF
              </Button>
            </div>
          )}
          {product.technical_data_sheet && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">Technical Data Sheet</h4>
                  <p className="text-sm text-blue-700">{product.technical_data_sheet?.name || ""}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                onClick={() => window.open(product.technical_data_sheet?.fileUrl || "", "_blank")}
              >
                Download PDF
              </Button>
            </div>
          )}
          {product.certificate_of_analysis && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">Certificate of Analysis</h4>
                  <p className="text-sm text-green-700">{product.certificate_of_analysis?.name || ""}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-green-300 text-green-600 hover:bg-green-50"
                onClick={() => window.open(product.certificate_of_analysis?.fileUrl || "", "_blank")}
              >
                Download PDF
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductDocumentDetails;