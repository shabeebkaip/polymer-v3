import React, { useState } from 'react';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Shield, CheckCircle2, Crown, Plus, Trash2, GripVertical } from 'lucide-react';
import { ProductFormData, CertificationProps, ProductCertificate } from '@/types/product';
import { UploadedFile } from '@/types/shared';
import FileUpload from '@/components/shared/FileUpload';

// Certification configuration
const CERTIFICATIONS = [
  {
    key: 'fdaApproved' as keyof ProductFormData,
    title: 'FDA Approved',
    description: 'Approved by the U.S. Food and Drug Administration',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    level: 'Premium',
    benefits: 'Required for medical and food contact applications',
  },
  {
    key: 'medicalGrade' as keyof ProductFormData,
    title: 'Medical Grade',
    description: 'Meets medical industry standards and regulations',
    icon: Crown,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    level: 'Premium',
    benefits: 'Essential for healthcare and pharmaceutical uses',
  },
];

const Certification: React.FC<CertificationProps> = ({ data, onFieldChange }) => {
  const [certificates, setCertificates] = useState<ProductCertificate[]>(data.certificates || []);

  const getSelectedCount = () => {
    return CERTIFICATIONS.filter((cert) => data[cert.key]).length;
  };

  const addCertificate = () => {
    const newCertificate: ProductCertificate = {
      name: '',
      issuingAuthority: '',
      certificateNumber: '',
      issueDate: '',
      expiryDate: '',
      document: null,
      description: '',
    };
    const updatedCertificates = [...certificates, newCertificate];
    setCertificates(updatedCertificates);
    onFieldChange('certificates', updatedCertificates);
  };

  const removeCertificate = (index: number) => {
    const updatedCertificates = certificates.filter((_, i) => i !== index);
    setCertificates(updatedCertificates);
    onFieldChange('certificates', updatedCertificates);
  };

  const updateCertificate = (
    index: number,
    field: keyof ProductCertificate,
    value: ProductCertificate[keyof ProductCertificate] | null
  ) => {
    const updatedCertificates = [...certificates];
    updatedCertificates[index] = {
      ...updatedCertificates[index],
      [field]: value,
    };
    setCertificates(updatedCertificates);
    onFieldChange('certificates', updatedCertificates);
  };

  return (
    <>
      <div className="col-span-full mb-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div>
            <h4 className="text-base font-semibold text-gray-900">Quality Certifications</h4>
            <p className="text-xs text-gray-600 mt-0.5">
              Showcase regulatory compliance and industry standards
            </p>
          </div>
          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 text-xs">
            {getSelectedCount()} / {CERTIFICATIONS.length} Selected
          </Badge>
        </div>
      </div>

      {/* Certifications */}
      <div className="col-span-full space-y-3">
        {CERTIFICATIONS.map((cert) => {
          const Icon = cert.icon;
          const isSelected = data[cert.key];
          const certificateFieldKey =
            cert.key === 'fdaApproved' ? 'fdaCertificate' : 'medicalCertificate';
          const certificateData = data[certificateFieldKey] as Record<string, unknown> | undefined;
          const hasCertificate = certificateData && 
            typeof certificateData === 'object' && 
            'id' in certificateData && 
            'fileUrl' in certificateData;

          return (
            <Card
              key={String(cert.key)}
              className={`transition-all ${
                isSelected ? 'border-gray-400 bg-gray-50' : 'border-gray-200 bg-white'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-gray-200' : 'bg-gray-100'}`}>
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Checkbox
                          id={String(cert.key)}
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            onFieldChange(cert.key, Boolean(checked));
                            if (!checked) {
                              onFieldChange(certificateFieldKey, {});
                            }
                          }}
                          className="mt-0.5 flex-shrink-0"
                        />
                        <Label
                          htmlFor={String(cert.key)}
                          className="text-sm font-semibold text-gray-900 cursor-pointer truncate"
                        >
                          {cert.title}
                        </Label>
                        {isSelected && hasCertificate && (
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-amber-50 border-amber-200 text-amber-700 text-xs px-2 py-0 flex-shrink-0"
                      >
                        Premium
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 mb-3 ml-6">{cert.description}</p>

                    {/* Certificate Upload Section */}
                    {isSelected && (
                      <div className="ml-6 pt-3 border-t border-gray-200">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Label className="text-xs font-medium text-gray-700">
                                Certificate Document <span className="text-red-500">*</span>
                              </Label>
                              {hasCertificate ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 border-green-200 text-xs px-1.5 py-0"
                                >
                                  ✓ Uploaded
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-red-50 text-red-700 border-red-200 text-xs px-1.5 py-0"
                                >
                                  Required
                                </Badge>
                              )}
                            </div>
                            <FileUpload
                              onFileUpload={(files) => {
                                if (files && files.length > 0) {
                                  onFieldChange(certificateFieldKey, files[0]);
                                }
                              }}
                              buttonText={hasCertificate ? 'Replace' : 'Upload PDF'}
                              existingFiles={
                                hasCertificate && certificateData ? [certificateData as unknown as UploadedFile] : []
                              }
                              multiple={false}
                              setCloudinaryImage={(url) => console.log(url)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Custom Certificates Section */}
      <div className="col-span-full mt-6">
        <Card className="border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
              <div>
                <h5 className="text-sm font-semibold text-gray-900">Additional Certificates</h5>
                <p className="text-xs text-gray-600 mt-0.5">
                  Add custom ISO, quality, or industry-specific certifications
                </p>
              </div>
              <Badge
                variant="outline"
                className="bg-gray-100 text-gray-700 border-gray-300 text-xs"
              >
                {certificates.length} Added
              </Badge>
            </div>

            {/* Certificate List */}
            {certificates.length > 0 && (
              <div className="space-y-3 mb-4">
                {certificates.map((cert, index) => (
                  <Card key={index} className="border-gray-200 bg-white">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <div className="cursor-move mt-1">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                        </div>

                        <div className="flex-1 space-y-3">
                          {/* First Row: Name and Document Upload */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label
                                htmlFor={`cert-name-${index}`}
                                className="text-xs font-medium text-gray-700"
                              >
                                Certificate Name <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id={`cert-name-${index}`}
                                placeholder="e.g., ISO 9001:2015"
                                value={cert.name}
                                onChange={(e) => updateCertificate(index, 'name', e.target.value)}
                                className="mt-1 h-9 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-700 mb-1 block">
                                Document <span className="text-gray-400">(Optional - PDF)</span>
                              </Label>
                              <FileUpload
                                onFileUpload={(files) =>
                                  updateCertificate(index, 'document', files[0])
                                }
                                buttonText={cert.document ? 'Replace' : 'Upload'}
                                existingFiles={cert.document ? [cert.document] : []}
                                multiple={false}
                                setCloudinaryImage={(url) => console.log(url)}
                              />
                            </div>
                          </div>

                          {/* Second Row: Authority, Number, Dates */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <div>
                              <Label
                                htmlFor={`cert-authority-${index}`}
                                className="text-xs font-medium text-gray-700"
                              >
                                Authority <span className="text-gray-400">(Opt)</span>
                              </Label>
                              <Input
                                id={`cert-authority-${index}`}
                                placeholder="ISO, FDA"
                                value={cert.issuingAuthority}
                                onChange={(e) =>
                                  updateCertificate(index, 'issuingAuthority', e.target.value)
                                }
                                className="mt-1 h-9 text-sm"
                              />
                            </div>

                            <div>
                              <Label
                                htmlFor={`cert-number-${index}`}
                                className="text-xs font-medium text-gray-700"
                              >
                                Number <span className="text-gray-400">(Opt)</span>
                              </Label>
                              <Input
                                id={`cert-number-${index}`}
                                placeholder="ABC-123"
                                value={cert.certificateNumber}
                                onChange={(e) =>
                                  updateCertificate(index, 'certificateNumber', e.target.value)
                                }
                                className="mt-1 h-9 text-sm"
                              />
                            </div>

                            <div>
                              <Label
                                htmlFor={`cert-issue-${index}`}
                                className="text-xs font-medium text-gray-700"
                              >
                                Issue <span className="text-gray-400">(Opt)</span>
                              </Label>
                              <Input
                                id={`cert-issue-${index}`}
                                type="date"
                                value={cert.issueDate}
                                onChange={(e) =>
                                  updateCertificate(index, 'issueDate', e.target.value)
                                }
                                className="mt-1 h-9 text-sm"
                              />
                            </div>

                            <div>
                              <Label
                                htmlFor={`cert-expiry-${index}`}
                                className="text-xs font-medium text-gray-700"
                              >
                                Expiry <span className="text-gray-400">(Opt)</span>
                              </Label>
                              <Input
                                id={`cert-expiry-${index}`}
                                type="date"
                                value={cert.expiryDate}
                                onChange={(e) =>
                                  updateCertificate(index, 'expiryDate', e.target.value)
                                }
                                className="mt-1 h-9 text-sm"
                              />
                            </div>
                          </div>

                          {/* Third Row: Description */}
                          <div>
                            <Label
                              htmlFor={`cert-desc-${index}`}
                              className="text-xs font-medium text-gray-700"
                            >
                              Description <span className="text-gray-400">(Optional)</span>
                            </Label>
                            <Textarea
                              id={`cert-desc-${index}`}
                              placeholder="Brief description..."
                              value={cert.description}
                              onChange={(e) =>
                                updateCertificate(index, 'description', e.target.value)
                              }
                              className="mt-1 min-h-[60px] text-sm"
                            />
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeCertificate(index);
                          }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Add Certificate Button */}
            <Button
              variant="outline"
              onClick={addCertificate}
              className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Certificate
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Section */}
      <div className="col-span-full mt-4">
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="p-3">
            <p className="text-xs font-medium text-gray-700 mb-2">Why Certify?</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                <span>Build trust and credibility with buyers</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                <span>Access regulated markets and industries</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                <span>Command premium pricing for your products</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Certification;
