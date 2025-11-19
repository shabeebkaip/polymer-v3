import React from "react";
import FileUpload from "@/components/shared/FileUpload";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { FileText, Shield, AlertTriangle, CheckCircle2, Upload } from "lucide-react";
import { UploadedFile, ProductFormData, DocumentsProps } from "@/types/product";

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
    acceptedFormats: "PDF only",
    maxSize: "5MB"
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
    acceptedFormats: "PDF only",
    maxSize: "5MB"
  },
  {
    key: "certificate_of_analysis" as keyof ProductFormData,
    title: "Certificate of Analysis (COA)",
    description: "Quality assurance and testing results",
    icon: Shield,
    color: "text-primary-500",
    bgColor: "bg-primary-50",
    borderColor: "border-primary-500/30",
    required: false,
    acceptedFormats: "PDF only",
    maxSize: "5MB"
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
          <div key={docType.key} className="col-span-full">
            <Card className={`${hasFiles ? 'border-primary-500/30 bg-primary-50/20' : 'border-gray-200'}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`p-2 rounded-lg ${docType.bgColor}`}>
                      <Icon className={`w-5 h-5 ${docType.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-800">{docType.title}</h3>
                        {hasFiles && <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{docType.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-600">{docType.acceptedFormats}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600">Max {docType.maxSize}</span>
                      </div>
                    </div>
                  </div>
                  <FileUpload
                  onFileUpload={(uploadedFiles) => {
                    onFieldChange(docType.key, uploadedFiles);
                  }}
                  buttonText={
                    hasFiles 
                      ? `Replace` 
                      : `Upload`
                  }
                  existingFiles={Array.isArray(files) ? files : []}
                  multiple={false}
                  setCloudinaryImage={(url) => {
                    console.log("Cloudinary image URL:", url);
                  }}
                />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}

      {/* Upload Instructions */}
      <div className="col-span-full mt-4">
        <Card className="border-blue-200 bg-blue-50/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-gray-800 mb-2">Upload Requirements</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2 border border-blue-200">
                    <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">PDF Only</p>
                      <p className="text-gray-500">No other formats</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2 border border-blue-200">
                    <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">Max 5MB</p>
                      <p className="text-gray-500">Per document</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2 border border-blue-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">Clear & Legible</p>
                      <p className="text-gray-500">High quality scans</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Documents;
