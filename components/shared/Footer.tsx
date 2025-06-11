"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSocialLinks } from "@/apiServices/cms";

const Footer: React.FC = () => {
  const router = useRouter();
  const [socialLinks, setSocialLinks] = React.useState<any[]>([]);

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

  useEffect(() => {
    getSocialLinks().then((response) => {
      setSocialLinks(response?.data);
    });
  }, []);

  const navigateTo = (path: string) => {
    router.push(path);
  };
  console.log("Social Links:", socialLinks);
  return (
    <footer className="bg-[var(--footer-background)] text-white">
      <div className="container mx-auto px-4 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="flex justify-center md:justify-start">
            <Image
              src="/assets/Title.svg"
              alt="Logo"
              width={100}
              height={100}
              className="w-50"
            />
          </div>

          <div className="hidden md:flex flex-row items-center justify-end gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Image
                  src={social.icon}
                  alt={social.label}
                  width={100}
                  height={100}
                  quality={100}
                  className="w-6 h-6"
                />
                <span className="text-sm">{social.label}</span>
              </a>
            ))}
          </div>
        </div>

        <hr className="mt-10 bg-[#353535] text-[#353535] h-px" />

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex flex-col items-center justify-center gap-4 mt-10 text-center">
            <h4 className="text-[#BBBABA] text-3xl">How can we help you</h4>
            <h4 className="underline text-3xl">Get in touch</h4>
          </div>

          <div className="relative flex gap-4 my-8">
            <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-px bg-[#353535]" />

            <div className="flex-1 flex justify-end pr-4">
              <div className="flex flex-col items-end gap-3 pr-2">
                <div className="px-9 py-2 border border-white rounded-full text-xs text-nowrap">
                  +91 1234567890
                </div>
                <div className="px-3.5 py-2 border border-white rounded-full text-xs text-nowrap">
                  info@polymershub.com
                </div>
              </div>
            </div>

            <div className="flex-1 flex items-center pl-2">
              <div className="flex flex-col gap-2">
                <h4 className="text-white font-medium">USEFUL LINKS</h4>
                <ul className="flex flex-col gap-1 text-sm text-center">
                  <li
                    className="font-normal hover:font-semibold cursor-pointer"
                    onClick={() => navigateTo("/")}
                  >
                    Home
                  </li>
                  <li
                    className="font-normal hover:font-semibold cursor-pointer"
                    onClick={() => navigateTo("/suppliers")}
                  >
                    Suppliers
                  </li>
                  <li
                    className="font-normal hover:font-semibold cursor-pointer"
                    onClick={() => navigateTo("/products")}
                  >
                    Product
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-6 mb-8">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
              >
                <Image
                  src={social.icon}
                  alt={social.label}
                  width={24}
                  height={24}
                  quality={100}
                  className="w-6 h-6"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-10 gap-0 h-full">
          <div className="col-span-7 border-r border-[#353535] py-16 grid grid-cols-2 items-center pr-4">
            <div className="flex flex-col gap-2">
              <h4 className="text-[#BBBABA] text-4xl">How can we help you</h4>
              <h4 className="underline text-4xl">Get in Touch</h4>
            </div>
            <div className="flex flex-col gap-3">
              <div className="px-11 py-2 border border-white rounded-full w-fit text-sm">
                +966 537346577
              </div>
              <div className="px-5 py-2 border border-white rounded-full w-fit text-sm">
                info@polymershub.com
              </div>
            </div>
          </div>

          <div className="col-span-3 p-4 flex items-center justify-center">
            <div className="flex flex-col gap-2">
              <h4 className="text-white font-medium">USEFUL LINKS</h4>
              <ul className="text-sm flex flex-col gap-1">
                <li
                  className="font-normal hover:font-semibold cursor-pointer"
                  onClick={() => navigateTo("/")}
                >
                  Home
                </li>
                <li
                  className="font-normal hover:font-semibold cursor-pointer"
                  onClick={() => navigateTo("/suppliers")}
                >
                  Suppliers
                </li>
                <li
                  className="font-normal hover:font-semibold cursor-pointer"
                  onClick={() => navigateTo("/products")}
                >
                  Products
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--footer-background-secondary)] text-center p-4">
        <p>
          &copy; {new Date().getFullYear()} POLYMERS HUB. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
