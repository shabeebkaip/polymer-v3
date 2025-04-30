import React from "react";

interface SellerLogoContainerProps {
  logoUrl: string;
}

const SellerLogoContainer: React.FC<SellerLogoContainerProps> = ({
  logoUrl,
}) => {
  return (
    <div className="border border-[var(--green-light)] rounded-3xl p-4 flex items-center justify-center ">
      <img src={logoUrl} alt={"img"} className="w-32 h-32" />
    </div>
  );
};

export default SellerLogoContainer;
