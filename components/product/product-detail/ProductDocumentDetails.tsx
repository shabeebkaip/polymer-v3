import React from "react";
import { Award, FileText, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product, ProductDocumentDetailsProps } from "@/types/product";

// Helper to get view URL for inline preview
const getViewUrl = (document: any): string => {
  // If viewUrl exists, use it
  if (document.viewUrl) {
    // If already absolute, return as-is
    if (document.viewUrl.startsWith("http")) return document.viewUrl;
    
    // Prefix with API base URL (without trailing /api since viewUrl includes it)
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const baseWithoutApi = apiBase.replace(/\/api$/, "");
    return `${baseWithoutApi}${document.viewUrl}`;
  }
  
  // Fallback: construct viewUrl from document.id if available
  if (document.id) {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const baseWithoutApi = apiBase.replace(/\/api$/, "");
    const resourceType = document.type === "image" ? "image" : "raw";
    return `${baseWithoutApi}/api/files/view/${encodeURIComponent(document.id)}?resourceType=${resourceType}`;
  }
  
  // Last resort: return fileUrl (will force download)
  return document.fileUrl;
};

const ProductDocumentDetails: React.FC<ProductDocumentDetailsProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
      <div className="p-6 lg:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Documents & Certificates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* FDA Certificate */}
          {product.fdaApproved && product.fdaCertificate && product.fdaCertificate.id && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 relative">
              <div className="absolute top-2 right-2">
                <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">Premium</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">FDA Approval</h4>
                  <p className="text-sm text-blue-700">{product.fdaCertificate?.originalFilename || product.fdaCertificate?.name || "FDA Certificate.pdf"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                  onClick={() => window.open(getViewUrl(product.fdaCertificate), "_blank")}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                  onClick={() => window.open(product.fdaCertificate?.downloadUrl || product.fdaCertificate?.fileUrl || "", "_blank")}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          )}

          {/* Medical Grade Certificate */}
          {product.medicalGrade && product.medicalCertificate && product.medicalCertificate.id && (
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 relative">
              <div className="absolute top-2 right-2">
                <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">Premium</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6 text-purple-600" />
                <div>
                  <h4 className="font-semibold text-purple-900">Medical Grade</h4>
                  <p className="text-sm text-purple-700">{product.medicalCertificate?.originalFilename || product.medicalCertificate?.name || "Medical Certificate.pdf"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-purple-300 text-purple-600 hover:bg-purple-50"
                  onClick={() => window.open(getViewUrl(product.medicalCertificate), "_blank")}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-purple-300 text-purple-600 hover:bg-purple-50"
                  onClick={() => window.open(product.medicalCertificate?.downloadUrl || product.medicalCertificate?.fileUrl || "", "_blank")}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          )}

          {product.safety_data_sheet && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-6 h-6 text-red-600" />
                <div>
                  <h4 className="font-semibold text-red-900">Safety Data Sheet</h4>
                  <p className="text-sm text-red-700">{product.safety_data_sheet?.originalFilename || product.safety_data_sheet?.name || "SDS.pdf"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => window.open(getViewUrl(product.safety_data_sheet), "_blank")}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => window.open(product.safety_data_sheet?.downloadUrl || product.safety_data_sheet?.fileUrl || "", "_blank")}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          )}
          {product.technical_data_sheet && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">Technical Data Sheet</h4>
                  <p className="text-sm text-blue-700">{product.technical_data_sheet?.originalFilename || product.technical_data_sheet?.name || "TDS.pdf"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                  onClick={() => window.open(getViewUrl(product.technical_data_sheet), "_blank")}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-blue-300 text-blue-600 hover:bg-blue-50"
                  onClick={() => window.open(product.technical_data_sheet?.downloadUrl || product.technical_data_sheet?.fileUrl || "", "_blank")}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          )}
          {product.certificate_of_analysis && (
            <div className="bg-primary-50 rounded-lg p-4 border border-primary-500/30">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6 text-primary-500" />
                <div>
                  <h4 className="font-semibold text-primary-600">Certificate of Analysis</h4>
                  <p className="text-sm text-primary-600">{product.certificate_of_analysis?.originalFilename || product.certificate_of_analysis?.name || "COA.pdf"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-primary-500 text-primary-600 hover:bg-primary-50"
                  onClick={() => window.open(getViewUrl(product.certificate_of_analysis), "_blank")}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-primary-500 text-primary-600 hover:bg-primary-50"
                  onClick={() => window.open(product.certificate_of_analysis?.downloadUrl || product.certificate_of_analysis?.fileUrl || "", "_blank")}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Additional Certificates */}
        {product.certificates && product.certificates.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Certificates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.certificates.map((cert, index) => (
                <div key={index} className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-start gap-3 mb-3">
                    <Award className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-purple-900 mb-1">{cert.name}</h4>
                      {cert.issuingAuthority && (
                        <p className="text-xs text-purple-700">
                          <span className="font-medium">Authority:</span> {cert.issuingAuthority}
                        </p>
                      )}
                      {cert.certificateNumber && (
                        <p className="text-xs text-purple-700">
                          <span className="font-medium">Number:</span> {cert.certificateNumber}
                        </p>
                      )}
                      {(cert.issueDate || cert.expiryDate) && (
                        <p className="text-xs text-purple-700 mt-1">
                          {cert.issueDate && <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>}
                          {cert.issueDate && cert.expiryDate && <span className="mx-1">•</span>}
                          {cert.expiryDate && <span>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</span>}
                        </p>
                      )}
                      {cert.description && (
                        <p className="text-xs text-purple-600 mt-2 line-clamp-2">{cert.description}</p>
                      )}
                    </div>
                  </div>
                  {cert.document && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-purple-300 text-purple-600 hover:bg-purple-50"
                        onClick={() => window.open(getViewUrl(cert.document), "_blank")}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-purple-300 text-purple-600 hover:bg-purple-50"
                        onClick={() => window.open(cert.document?.downloadUrl || cert.document?.fileUrl || "", "_blank")}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductDocumentDetails;