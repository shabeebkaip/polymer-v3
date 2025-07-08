import React from "react";
import VisitShopButton from "./VisitShopButton";
import Image from "next/image";

interface SupplierCardProps {
  name: string;
  location: string;
  logo: string;
  website?: string;
  supplierId: string; // Made it required for type safety
}

const SupplierCard: React.FC<SupplierCardProps> = ({
  name,
  location,
  logo,
  website,
  supplierId,
}) => {
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 flex items-center justify-center  hover:bg-green-50 hover:scale-105 duration-300 ease-in-out">
      <div className="rounded-xl p-4 w-full flex items-center border border-gray-200">
        <Image
          src={logo}
          alt={name}
          width={100}
          height={100}
          className="w-18 h-18 md:w-25 md:h-25 mr-4"
        />
        <div>
          <h2 className="md:text-2xl font-normal text-[var(--dark-main)]">
            {name}
          </h2>
          <p className="text-gray-500 text-sm md:text-xl">{location}</p>
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--green-main)] text-sm hover:underline block"
            >
              {website}
            </a>
          )}
          <VisitShopButton supplierId={supplierId} />
        </div>
      </div>
    </div>
  );
};

export default SupplierCard;
