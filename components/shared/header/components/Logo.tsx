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
        alt="PolymersHub Icon"
        width={48}
        height={48}
        className="md:h-12 h-10 w-auto"
      />
      <Image
        src="/typography.svg"
        alt="PolymersHub"
        width={150}
        height={40}
        className="md:h-8 h-6 w-auto"
      />
    </Link>
  );
};

export default Logo;
