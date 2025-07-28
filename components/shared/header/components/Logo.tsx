import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Logo = () => {
  const router = useRouter();
  return (
    <div
      className="relative overflow-hidden rounded-lg p-1 group-hover:bg-green-50 transition-all duration-200"
      onClick={() => router.push("/")}
    >
      <Image
        src="/typography.svg"
        alt="Polymers Hub Logo"
        width={120}
        height={50}
        className="md:h-12 h-8 w-auto transition-transform duration-200 group-hover:scale-105"
      />
    </div>
  );
};

export default Logo;
