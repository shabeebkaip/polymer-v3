import React from "react";
import FileUpload from "@/components/shared/FileUpload";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { FileText, Shield, AlertTriangle, CheckCircle2, Upload } from "lucide-react";
import { UploadedFile, ProductFormData } from "@/types/product";

interface DocumentsProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: UploadedFile[]) => void;
}

// Document type configurations
const DOCUMENT_TYPES = [
  {
    key: "safety_data_sheet" as keyof ProductFormData,
    title: "Safety Data Sheet (SDS)",
    description: "Essential safety information and handling procedures",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    required: false,
    acceptedFormats: "PDF, DOC, DOCX"
  },
  {
    key: "technical_data_sheet" as keyof ProductFormData,
    title: "Technical Data Sheet (TDS)",
    description: "Detailed technical specifications and properties",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    required: false,
    acceptedFormats: "PDF, DOC, DOCX"
  },
  {
    key: "certificate_of_analysis" as keyof ProductFormData,
    title: "Certificate of Analysis (COA)",
    description: "Quality assurance and testing results",
    icon: Shield,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    required: false,
    acceptedFormats: "PDF, DOC, DOCX"
  }
];

const Documents: React.FC<DocumentsProps> = ({ data, onFieldChange }) => {
  const getTotalUploaded = () => {
    return DOCUMENT_TYPES.reduce((count, docType) => {
      const files = data[docType.key];
      return count + (Array.isArray(files) && files.length > 0 ? 1 : 0);
    }, 0);
  };

  return (
    <>
      <div className="col-span-full mb-6">
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-orange-800 mb-2">Supporting Documents</h4>
                <p className="text-sm text-orange-600">Upload certificates and technical documentation</p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                  {getTotalUploaded()} / {DOCUMENT_TYPES.length} Uploaded
                </Badge>
                <p className="text-xs text-orange-600 mt-1">All documents are optional</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {DOCUMENT_TYPES.map((docType) => {
        const Icon = docType.icon;
        const files = data[docType.key];
        const hasFiles = Array.isArray(files) && files.length > 0;

        return (
          <div key={docType.key} className="col-span-full mb-6">
            <Card className={`transition-all duration-200 hover:shadow-md ${docType.borderColor} ${hasFiles ? 'ring-2 ring-green-200' : ''}`}>
              <CardHeader className={`${docType.bgColor} pb-3`}>
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-white ${docType.borderColor} border`}>
                    <Icon className={`w-5 h-5 ${docType.color}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold text-gray-800 flex items-center gap-2">
                      {docType.title}
                      {hasFiles && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                      {docType.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{docType.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>📁 Accepted: {docType.acceptedFormats}</span>
                      <span>📏 Max size: 10MB</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4">
                <FileUpload
                  onFileUpload={(uploadedFiles) => {
                    onFieldChange(docType.key, uploadedFiles);
                  }}
                  buttonText={
                    hasFiles 
                      ? `Replace ${docType.title}` 
                      : `Upload ${docType.title}`
                  }
                  existingFiles={Array.isArray(files) ? files : []}
                  multiple={false}
                  setCloudinaryImage={(url) => {
                    console.log("Cloudinary image URL:", url);
                  }}
                />
                
                {hasFiles && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="font-medium">Document uploaded successfully</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      This document will be available to buyers after purchase approval
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}

      {/* Tips and Guidelines */}
      <div className="col-span-full mt-4">
        <Card className="border-gray-200 bg-gray-50/50">
          <CardContent className="p-4">
            <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Document Guidelines
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="space-y-2">
                <h6 className="font-medium text-gray-700">📋 Best Practices:</h6>
                <ul className="space-y-1 text-xs">
                  <li>• Use clear, high-resolution documents</li>
                  <li>• Ensure all text is readable</li>
                  <li>• Include latest revision dates</li>
                  <li>• Use official letterheads when applicable</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h6 className="font-medium text-gray-700">🔒 Security:</h6>
                <ul className="space-y-1 text-xs">
                  <li>• Documents are securely stored</li>
                  <li>• Only shared with qualified buyers</li>
                  <li>• Compliance with data protection</li>
                  <li>• Regular security audits performed</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Documents;
