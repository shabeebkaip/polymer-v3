import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

interface SellerLogoContainerProps {
  logoUrl: string;
  redirectUrl: string;
}

const SellerLogoContainer: React.FC<SellerLogoContainerProps> = ({
  logoUrl,
}) => {
  const router = useRouter();
  return (
    <div className="border border-[var(--green-light)] rounded-[10px] p-4 flex items-center justify-center w-32 h-32 hover:scale-105 duration-300 ease-in-out cursor-pointer">
      <Image
        src={logoUrl}
        alt={"img"}
        width={100}
        height={100}
        className="w-full"
      />
    </div>
  );
};

export default SellerLogoContainer;
