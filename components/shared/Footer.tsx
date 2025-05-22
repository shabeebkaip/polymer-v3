"use client";
import Image from "next/image";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

const Footer: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const socials = [
    {
      label: "Facebook",
      icon: "/icons/facebook.png",
      link: "https://www.facebook.com/",
    },
    {
      label: "Twitter",
      icon: "/icons/x.png",
      link: "https://x.com/",
    },
    {
      label: "LinkedIn",
      icon: "/icons/linkedIn.png",
      link: "https://www.linkedin.com/",
    },
    {
      label: "Instagram",
      icon: "/icons/instagram.png",
      link: "https://www.instagram.com/",
    },
  ];

  if (pathname.includes("auth")) return null;

  return (
    <footer className="bg-[var(--footer-background)] text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Desktop View */}
        <div className="hidden md:flex justify-between gap-20">
          {/* Logo & Contact Info */}
          <div className="flex flex-col gap-6 w-[260px] items-start">
            <Image
              src="/assets/Title.svg"
              alt="Polymer Hub Logo"
              width={180}
              height={150}
              className="object-contain"
            />
            <h3 className="text-[#BBBABA] text-2xl font-semibold leading-tight">
              How can we help you
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <Image src="/icons/phone-call.png" alt="Phone" width={24} height={24} />
                </div>
                <a href="tel:+966537346577" className="text-base font-medium hover:underline">
                  +966 537346577
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <Image src="/icons/mail.png" alt="Email" width={16} height={16} />
                </div>
                <a
                  href="mailto:info@polymershub.com"
                  className="text-base font-medium hover:underline"
                >
                  info@polymershub.com
                </a>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div className="flex flex-col gap-4 w-[180px] items-start">
            <h3 className="font-semibold text-xl">USEFUL LINKS</h3>
            <ul className="flex flex-col gap-2 text-sm font-thin">
              <li
                onClick={() => router.push("/")}
                className="cursor-pointer hover:font-normal transition"
              >
                Home
              </li>
              <li
                onClick={() => router.push("/suppliers")}
                className="cursor-pointer hover:font-normal transition"
              >
                Suppliers
              </li>
              <li
                onClick={() => router.push("/products")}
                className="cursor-pointer hover:font-normal transition"
              >
                Products
              </li>
            </ul>
          </div>

          {/* Social Icons */}
          <div className="flex flex-col gap-6 w-[200px] items-start">
            <h3 className="font-semibold text-xl">FOLLOW US</h3>
            <div className="flex flex-col gap-4">
              {socials.map(({ label, icon, link }) => (
                <a
                  key={label}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={icon}
                    alt={label}
                    width={28}
                    height={28}
                    className="object-contain"
                    quality={100}
                  />
                  <span className="text-sm">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex flex-col items-center gap-10 text-center">
          <Image
            src="/assets/Title.svg"
            alt="Polymer Hub Logo"
            width={140}
            height={120}
            className="object-contain"
          />

          <div>
            <h3 className="text-[#BBBABA] text-2xl font-semibold mb-3">
              How can we help you
            </h3>
            <div className="flex flex-col gap-4 items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <Image src="/icons/phone-call.png" alt="Phone" width={16} height={16} />
                </div>
                <a href="tel:+966537346577" className="text-sm font-medium hover:underline">
                  +966 537346577
                </a>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <Image src="/icons/mail.png" alt="Email" width={16} height={16} />
                </div>
                <a
                  href="mailto:info@polymershub.com"
                  className="text-sm font-medium hover:underline"
                >
                  info@polymershub.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">USEFUL LINKS</h3>
            <ul className="space-y-1 text-sm font-thin">
              <li
                onClick={() => router.push("/")}
                className="cursor-pointer hover:font-normal transition"
              >
                Home
              </li>
              <li
                onClick={() => router.push("/suppliers")}
                className="cursor-pointer hover:font-normal transition"
              >
                Suppliers
              </li>
              <li
                onClick={() => router.push("/products")}
                className="cursor-pointer hover:font-normal transition"
              >
                Products
              </li>
            </ul>
          </div>

          <div className="flex gap-6">
            {socials.map(({ label, icon, link }) => (
              <a
                key={label}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Image
                  src={icon}
                  alt={label}
                  width={28}
                  height={28}
                  className="object-contain"
                  quality={100}
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="bg-[var(--footer-background-secondary)] text-center p-6 mt-12">
        <p className="text-lg font-semibold tracking-wide">
          &copy; {new Date().getFullYear()} POLYMERS HUB. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
