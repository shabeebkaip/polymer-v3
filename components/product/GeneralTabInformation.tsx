import React from "react";
import LabelValue from "../shared/LabelValue";
import Image from "next/image";
import { FileImage, FileText } from "lucide-react";
import FileViewer from "../shared/FileViewer";

interface NamedItem {
  name: string;
}

interface Product {
  productName: string;
  chemicalName?: string;
  tradeName?: string;
  description?: string;
  chemicalFamily?: NamedItem;
  polymerType?: NamedItem;
  industry?: NamedItem[];
  grade?: NamedItem[];
  manufacturingMethod?: string;
  physicalForm?: NamedItem;
  countryOfOrigin?: string;
  color?: string;
  density?: string | number;
  mfi?: string | number;
  tensileStrength?: string | number;
  elongationAtBreak?: string | number;
  shoreHardness?: string | number;
  waterAbsorption?: string | number;
  [key: string]: any;
}

interface GeneralTabInformationProps {
  product: Product;
}

const GeneralTabInformation: React.FC<GeneralTabInformationProps> = ({
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


  return (
    <div className="grid grid-cols-1 text-gray-700 gap-2">
      {/* Basic Info */}
      {renderIfExists("Product Name", product.productName)}
      {renderIfExists("Chemical Name", product.chemicalName)}
      {renderIfExists("Trade Name", product.tradeName)}
      {renderIfExists("Description", product.description)}

      {/* Divider */}
      <hr className="my-6" />

      {/* Product Details */}
      <h4 className="font-normal text-2xl text-[var(--dark-main)]">
        Product Details
      </h4>
      {renderIfExists("Chemical Family", product.chemicalFamily?.name)}
      {renderIfExists("Polymer Type", product.polymerType?.name)}
      {renderArray("Industry", product.industry)}
      {renderArray("Application Grade", product.grade)}
      {renderIfExists("Manufacturing Method", product.manufacturingMethod)}
      {renderIfExists("Physical Form", product.physicalForm?.name)}
      {renderIfExists("Country of Origin", product.countryOfOrigin)}
      {renderIfExists("Color", product.color)}

      {/* Divider */}
      <hr className="my-6" />

      {/* Technical Properties */}
      <h4 className="font-normal text-2xl text-[var(--dark-main)]">
        Technical Properties
      </h4>
      {renderIfExists("Density (g/cm3)", product.density)}
      {renderIfExists("Melt Flow Index (MFI)", product.mfi)}
      {renderIfExists("Tensile Strength", product.tensileStrength)}
      {renderIfExists("Elongation at Break (%)", product.elongationAtBreak)}
      {renderIfExists("Shore Hardness", product.shoreHardness)}
      {renderIfExists("Water Absorption", product.waterAbsorption)}

      {/* Divider */}
      <hr className="my-6" />

      {/* Additional Information */}
      <h4 className="font-normal text-2xl text-[var(--dark-main)]">
        Documents
      </h4>
      <div className="flex items-center mb-2 cursor-pointer">
        <FileText
          className="inline-block mr-2 text-gray-500"
          size={24}
        />
        <FileViewer
          previewFile={product?.technical_data_sheet}
          triggerComp={
            <span className="text-gray-700">
              {product?.technical_data_sheet?.name || "Technical Data Sheet"}
            </span>
          }
        />
      </div>

    </div>
  );
};

export default GeneralTabInformation;
