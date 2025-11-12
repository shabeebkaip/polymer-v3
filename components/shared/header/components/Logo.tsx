import React from "react";
import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link 
      href="/"
      className="inline-block cursor-pointer"
    >
      <Image
        src="/logo.png"
        alt="Polymers Hub Logo"
        width={200}
        height={200}
        className="md:h-16 h-12 w-auto"
      />
    </Link>
  );
};

export default Logo;
