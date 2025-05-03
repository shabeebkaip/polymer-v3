import Image from "next/image";
import React from "react";

interface SellerLogoContainerProps {
  logoUrl: string;
}

const SellerLogoContainer: React.FC<SellerLogoContainerProps> = ({
  logoUrl,
}) => {
  return (
    <div className="border border-[var(--green-light)] rounded-3xl p-4 flex items-center justify-center w-32 h-32 md">
      <Image src={logoUrl} alt={"img"}
        width={100}
        height={100}
        className="w-full" />
    </div>
  );
};

export default SellerLogoContainer;
