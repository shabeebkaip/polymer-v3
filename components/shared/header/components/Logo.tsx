import React from "react";
import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link 
      href="/"
      className="inline-flex items-center gap-2 cursor-pointer"
    >
      <Image
        src="/onlylogo.png"
        alt="Polymers Hub Icon"
        width={48}
        height={48}
        className="md:h-12 h-10 w-auto"
      />
      <h4 className="text-primary-500 font-bold text-xl md:text-2xl">
        POLYMERS HUB
      </h4>
      
    </Link>
  );
};

export default Logo;
