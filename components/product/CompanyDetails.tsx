import React from "react";
import Image from "next/image";
import { Globe, MapPin, Shield, Award, Users, ExternalLink } from "lucide-react";
import VisitShopButton from "@/components/suppliers/VisitShopButton";
import QuoteRequestModal from "../shared/QuoteRequestModal";
import SampleRequestModal from "../shared/SampleRequestModal";
import { Badge } from "@/components/ui/badge";
import { FALLBACK_COMPANY_IMAGE } from "@/lib/fallbackImages";

interface CompanyDetailsProps {
  companyDetails: {
    _id: string;
    company: string;
    company_logo: string;
    location?: string;
    website?: string;
    name?: string;
    email?: string;
    phone?: number;
    address?: string;
    [key: string]: unknown;
  };
  productId: string;
  uom: string;
  userType?: string;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({
  companyDetails,
  productId,
  uom,
  userType,
}) => {
  return (
    <div className="space-y-6">
      {/* Company Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Supplier Information
        </h2>
      </div>

      {/* Company Card */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg p-3 border">
              {companyDetails?.company_logo ? (
                <Image
                  src={companyDetails.company_logo}
                  alt={companyDetails.company}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_COMPANY_IMAGE;
                  }}
                />
              ) : (
                <Image
                  src={FALLBACK_COMPANY_IMAGE}
                  alt={companyDetails.company}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>

          {/* Company Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Shield className="w-3 h-3 mr-1" /> Verified Supplier
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Award className="w-3 h-3 mr-1" /> Premium Partner
              </Badge>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {companyDetails?.company}
            </h3>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600 mb-4">
              {companyDetails?.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{companyDetails.location}</span>
                </div>
              )}
              {companyDetails?.address && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{companyDetails.address}</span>
                </div>
              )}
              {companyDetails?.phone && (
                <div className="flex items-center gap-1">
                  <span className="text-sm">📞 {companyDetails.phone}</span>
                </div>
              )}
            </div>

            {companyDetails?.website && (
              <a
                href={companyDetails.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">Visit Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Visit Shop Button */}
        <div className="mt-6 text-center">
          <VisitShopButton supplierId={companyDetails?._id} />
        </div>
      </div>

      {/* Action Buttons */}
      {userType === "buyer" && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <QuoteRequestModal
              productId={productId}
              uom={uom}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all font-medium shadow-lg hover:shadow-xl"
            />
            <SampleRequestModal
              productId={productId}
              uom={uom}
              className="w-full px-6 py-3 border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-all font-medium"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
