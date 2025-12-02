import React from 'react';
import FileUpload from '@/components/shared/FileUpload';
import { Card, CardContent } from '../../ui/card';
import { FileText, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ProductFormData, DocumentsProps } from '@/types/product';

// Document type configurations
const DOCUMENT_TYPES = [
  {
    key: 'safety_data_sheet' as keyof ProductFormData,
    title: 'Safety Data Sheet (SDS)',
    description: 'Essential safety information and handling procedures',
    icon: AlertTriangle,
    required: false,
  },
  {
    key: 'technical_data_sheet' as keyof ProductFormData,
    title: 'Technical Data Sheet (TDS)',
    description: 'Detailed technical specifications and properties',
    icon: FileText,
    required: false,
  },
  {
    key: 'certificate_of_analysis' as keyof ProductFormData,
    title: 'Certificate of Analysis (COA)',
    description: 'Quality assurance and testing results',
    icon: Shield,
    required: false,
  },
];

const Documents: React.FC<DocumentsProps> = ({ data, onFieldChange }) => {
  return (
    <>
      <div className="col-span-full">
        <Card className="border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Supporting Documents</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Upload certificates and technical documentation
                </p>
              </div>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                Optional
              </span>
            </div>

            <div className="space-y-3">
              {DOCUMENT_TYPES.map((docType) => {
                const Icon = docType.icon;
                const doc = data[docType.key];
                const hasDoc = doc && typeof doc === 'object' && Object.keys(doc).length > 0;

                return (
                  <div
                    key={docType.key}
                    className={`flex items-center justify-between gap-4 p-3 rounded-lg border ${
                      hasDoc ? 'bg-gray-50 border-gray-300' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Icon className="w-5 h-5 text-gray-700 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-900">{docType.title}</h3>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              docType.required
                                ? 'bg-red-50 text-red-600'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {docType.required ? 'Required' : 'Optional'}
                          </span>
                          {hasDoc && (
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{docType.description}</p>
                        <p className="text-xs text-gray-400 mt-1">PDF only • Max 5MB</p>
                      </div>
                    </div>
                    <FileUpload
                      onFileUpload={(uploadedFiles) => {
                        onFieldChange(docType.key, uploadedFiles);
                      }}
                      buttonText={hasDoc ? 'Upload' : 'Upload'}
                      existingFiles={hasDoc && doc ? [doc] : []}
                      multiple={false}
                      setCloudinaryImage={(url) => {
                        console.log('Cloudinary image URL:', url);
                      }}
                    />
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

export default Documents;
