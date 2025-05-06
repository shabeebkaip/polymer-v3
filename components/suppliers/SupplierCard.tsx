import React from "react";

interface SupplierCardProps {
  name: string;
  location: string;
  logo: string;
}

const SupplierCard: React.FC<SupplierCardProps> = ({
  name,
  location,
  logo,
}) => {
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4 flex items-center justify-center cursor-pointer">
      <div className="rounded-xl p-4 w-full flex items-center border border-gray-200 ">
        <img
          src={logo}
          alt={name}
          className="w-18 h-18 md:w-25 md:sh-25 mr-4"
        />
        <div>
          <h2 className=" md:text-2xl font-normal text-[var(--dark-main)]">
            {name}
          </h2>
          <p className="text-gray-500 text-sm md:text-xl">{location}</p>
        </div>
      </div>
    </div>
  );
};

export default SupplierCard;
