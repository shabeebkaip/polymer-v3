import React from "react";
import { MessageSquareShare } from "lucide-react";
import VisitShopButton from "@/components/suppliers/VisitShopButton";
import RequestFinanceModal from "../shared/RequestFinanceModal";
import QuoteRequestModal from "../shared/QuoteRequestModal";
import SampleRequestModal from "../shared/SampleRequestModal";

interface CompanyDetailsProps {
  companyDetails: {
    _id: string;
    company: string;
    company_logo: string;
    location?: string;
    website?: string;
    [key: string]: any;
  };
  productId: string;
  uom: string;
  userType?: string; // Optional prop for user type
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({
  companyDetails,
  productId,
  uom,
  userType,
}) => {
  return (
    <div className="border border-[var(--green-main)] rounded-xl p-3 hover:shadow-lg transition-shadow duration-300 h-full">
      <div className="flex items-center justify-start gap-4">
        <div>
          <img
            src={companyDetails?.company_logo}
            alt="Company Logo"
            className="w-40 h-40 object-contain"
          />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <h4 className="font-normal text-3xl">{companyDetails?.company}</h4>
          <p className="text-sm text-gray-600">{companyDetails?.location}</p>
          <a
            className="text-blue-500 hover:text-blue-800 flex items-center gap-2"
            href={companyDetails?.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {companyDetails?.website}
            <MessageSquareShare size={16} />
          </a>
          <VisitShopButton supplierId={companyDetails?._id} />
        </div>
      </div>
      {userType === "buyer" && (
        <div className="flex items-center md:flex-row flex-col  gap-2 mt-4">
          <QuoteRequestModal
            productId={productId}
            uom={uom}
            className=" w-full px-4 py-2 bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white rounded-lg hover:opacity-90 cursor-pointer"
          />
          <SampleRequestModal
            productId={productId}
            uom={uom}
            className="w-full flex items-center justify-center px-4 py-2 border border-[var(--green-main)] text-[var(--green-main)] rounded-lg hover:bg-green-50 transition cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
