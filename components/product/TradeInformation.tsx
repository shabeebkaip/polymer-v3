import React from "react";
import LabelValue from "../shared/LabelValue";

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
  console.log("Product", product);

  return (
    <div className="grid grid-cols-1 text-gray-700 gap-2">
      {/* Basic Info */}
      {renderIfExists(
        "Minimum Order Quantity (MOQ)",
        `${product.minimum_order_quantity} ${product.uom}`
      )}
      {renderIfExists("Available Quantity", `${product.stock} ${product.uom}`)}
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
    </div>
  );
};

export default TradeInformation;
