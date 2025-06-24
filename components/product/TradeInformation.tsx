import React from "react";
import LabelValue from "../shared/LabelValue";
import { FileText } from "lucide-react";
import FileViewer from "../shared/FileViewer";

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
  [key: string]: any;
}

interface GeneralTabInformationProps {
  product: Product;
}

const TradeInformation: React.FC<GeneralTabInformationProps> = ({
  product,
}) => {
  const renderIfExists = (label: string, value?: string | number | null) =>
    value !== undefined && value !== null && value !== "" ? (
      <LabelValue label={label} value={value} />
    ) : null;

  const renderArray = (label: string, data?: NamedItem[]) =>
    data && data.length > 0 ? (
      <LabelValue
        label={label}
        value={data.map((item) => item.name).join(", ")}
      />
    ) : null;

  console.log("product", product);
  // Available quantity logic with color
  const renderAvailableQuantity = () => {
    if (product?.stock && product.stock > 0) {
      return (
        <LabelValue
          label="Available Quantity"
          value={
            <span className=" ">
              {product.stock} {product.uom} <span className="text-green-600">(In Stock)</span>
            </span>
          }
        />
      );
    }
    return (
      <LabelValue
        label="Available Quantity"
        value={<span className="text-red-600 ">Out of Stock</span>}
      />
    );
  };

  return (
    <div className="grid grid-cols-1 text-gray-700 gap-2">
      {/* Basic Info */}
      {renderIfExists(
        "Minimum Order Quantity (MOQ)",
        `${product.minimum_order_quantity} ${product.uom}`
      )}

      {renderAvailableQuantity()}

      {renderIfExists("Unit of Sale (KG, Ton, Bag, etc)", product.uom)}
      {renderIfExists("Price per Unit", product.price)}
      {renderIfExists("Price Terms", product.priceTerms)}
      {renderArray("Incoterms", product.incoterms)}
      {/* {renderIfExists("Lead Time", format(new Date(), "MMM dd, yyyy"))} */}

      {/* Divider */}
      <hr className="my-6" />

      {/* Product Details */}
      <h4 className="font-normal text-2xl text-[var(--dark-main)]">
        Packaging Details
      </h4>
      {renderArray("Packaging Type", product.packagingType)}
      {renderIfExists("Packaging Weight", product.packagingWeight)}
      {renderIfExists("Storage Conditions", product.storageConditions)}
      {renderIfExists("Shelf Life", product.shelfLife)}

      {/* Divider */}
      <hr className="my-6" />

      {/* Environmental Details */}
      <h4 className="font-normal text-2xl text-[var(--dark-main)]">
        Environmental Details
      </h4>
      {renderIfExists("Recyclable", product.recyclable ? "Yes" : "No")}
      {renderIfExists("Biodegradable", product.bioDegradable ? "Yes" : "No")}

      {/* Divider */}
      <hr className="my-6" />

      {/* Certification Details */}
      <h4 className="font-normal text-2xl text-[var(--dark-main)]">
        Certification Details
      </h4>
      {renderIfExists("FDA Approved", product.fdaApproved ? "Yes" : "No")}
      {renderIfExists(
        "Medical Grade Certified",
        product.medicalGrade ? "Yes" : "No"
      )}

      <hr className="my-6" />

      {/* Additional Information */}
      <div>
        {
          product?.technical_data_sheet || product?.safety_data_sheet || product?.certificate_of_analysis ?

            <h4 className="font-normal text-2xl text-[var(--dark-main)]">
              Documents
            </h4> : null
        }
        <div className="flex items-center gap-6 mt-4 ">
          {
            product?.technical_data_sheet &&
            <div className="flex items-center mb-2 cursor-pointer ">
              <FileText
                className="inline-block mr-2 text-red-500"
                size={24}
              />
              <FileViewer
                previewFile={product?.technical_data_sheet}
                triggerComp={
                  <span className="text-gray-700 hover:text-[var(--dark-main)]">
                    Technical Data Sheet
                  </span>
                }
              />
            </div>
          }
          {
            product?.safety_data_sheet &&
            <div className="flex items-center mb-2 cursor-pointer">
              <FileText
                className="inline-block mr-2 text-red-500"
                size={24}
              />
              <FileViewer
                previewFile={product?.safety_data_sheet}
                triggerComp={
                  <span className="text-gray-700 hover:text-[var(--dark-main)]">
                    Safety Data Sheet
                  </span>
                }
              />
            </div>
          }
          {
            product?.certificate_of_analysis &&
            <div className="flex items-center mb-2 cursor-pointer">
              <FileText
                className="inline-block mr-2 text-red-500"
                size={24}
              />
              <FileViewer
                previewFile={product?.certificate_of_analysis}
                triggerComp={
                  <span className="text-gray-700 hover:text-[var(--dark-main)]">
                    Certificate of Analysis
                  </span>
                }
              />
            </div>
          }

        </div>
      </div>


    </div>


  );
};

export default TradeInformation;
