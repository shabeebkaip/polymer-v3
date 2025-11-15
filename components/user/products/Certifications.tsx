import React from "react";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { Card, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Shield, Award, CheckCircle2, Star, Crown, Zap } from "lucide-react";
import { ProductFormData, CertificationProps } from "@/types/product";

// Certification configuration
const CERTIFICATIONS = [
  {
    key: "fdaApproved" as keyof ProductFormData,
    title: "FDA Approved",
    description: "Approved by the U.S. Food and Drug Administration",
    icon: Shield,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    level: "Premium",
    benefits: "Required for medical and food contact applications"
  },
  {
    key: "medicalGrade" as keyof ProductFormData,
    title: "Medical Grade",
    description: "Meets medical industry standards and regulations",
    icon: Crown,
    color: "text-purple-600",
    bgColor: "bg-purple-50", 
    borderColor: "border-purple-200",
    level: "Premium",
    benefits: "Essential for healthcare and pharmaceutical uses"
  }
];

const Certification: React.FC<CertificationProps> = ({
  data,
  onFieldChange,
}) => {
  const getSelectedCount = () => {
    return CERTIFICATIONS.filter(cert => data[cert.key]).length;
  };

  return (
    <>
      <div className="col-span-full mb-6">
        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-purple-800 mb-2">Quality Certifications</h4>
                <p className="text-sm text-purple-600">Showcase quality standards and regulatory compliance</p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                  {getSelectedCount()} / {CERTIFICATIONS.length} Certified
                </Badge>
                <p className="text-xs text-purple-600 mt-1">Build buyer confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certifications */}
      <div className="col-span-full space-y-4">
        {CERTIFICATIONS.map((cert) => {
          const Icon = cert.icon;
          const isSelected = data[cert.key];

          return (
            <Card 
              key={String(cert.key)} 
              className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
                isSelected ? `ring-2 ring-purple-300 ${cert.borderColor}` : 'border-gray-200'
              }`}
              onClick={() => onFieldChange(cert.key, !isSelected)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${cert.bgColor} ${isSelected ? 'ring-2 ring-purple-300' : ''}`}>
                    <Icon className={`w-6 h-6 ${cert.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Checkbox
                        id={String(cert.key)}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          onFieldChange(cert.key, Boolean(checked))
                        }
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <Label 
                        htmlFor={String(cert.key)} 
                        className="text-base font-semibold text-gray-800 cursor-pointer flex items-center gap-2"
                      >
                        {cert.title}
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                      </Label>
                      <Badge variant="outline" className="text-xs font-medium">
                        {cert.level}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{cert.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Star className="w-3 h-3" />
                      <span>{cert.benefits}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Custom Certification */}
      <div className="col-span-full mt-4">
        <Card className="border-dashed border-2 border-gray-300 hover:border-purple-300 transition-colors duration-200">
          <CardContent className="p-4 text-center">
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Award className="w-6 h-6" />
              <p className="text-sm font-medium">Have other certifications?</p>
              <p className="text-xs">Contact support to add custom certifications to your listing</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Section */}
      <div className="col-span-full mt-6">
        <Card className="border-blue-200 bg-blue-50/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-blue-600" />
              <h6 className="font-medium text-gray-800">Certification Benefits</h6>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Trust & Credibility</p>
                  <p className="text-xs">Certifications build immediate buyer confidence</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Market Access</p>
                  <p className="text-xs">Required for regulated industries and applications</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Premium Value</p>
                  <p className="text-xs">Certified products command higher prices</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Certification;
