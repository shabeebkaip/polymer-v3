import { link } from "fs";
import Image from "next/image";
import React from "react";

const Footer: React.FC = () => {
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
  return (
    <footer className="bg-[var(--footer-background)] text-white ">
      <div className="container mx-auto px-4 pt-10">
        {/* top */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Logo - centered on mobile, left-aligned on desktop */}
          <div className="flex justify-center md:justify-start">
            <Image
              src="/assets/Title.svg"
              alt="Logo"
              width={100}
              height={100}
              className="w-50"
            />
          </div>

          {/* Socials - hidden on mobile, visible on desktop */}
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
        {/*  only for mobile device */}
        <div className="md:hidden flex flex-col items-center justify-center gap-4 mt-10">
          <div className="flex flex-col gap-2 text-center">
            <h4 className="text-[#BBBABA] text-normal text-3xl">
              How can we help you{" "}
            </h4>
            <h4 className="underline text-3xl ">Get in Touch</h4>
          </div>
        </div>
        {/* only for mobile device */}
        <div className="md:hidden grid grid-cols-2 gap-4 my-8  items-center ">
          <div className="flex flex-col items-center gap-2 border-r border-[#353535]   ">
            <div className="px-4 py-2 border border-white rounded-full w-fit text-xs">
              <span>+966 537346577</span>
            </div>
            <div className="px-4 py-2 border border-white rounded-full w-fit text-xs break-words">
              <span>info@polymershub.com</span>
            </div>
          </div>
          <div>
            <div className="flex justify-center items-center h-full">
              <div className="flex flex-col gap-2">
                <h4>USEFUL LINKS</h4>
                <ul>
                  <li className="font-thin hover:font-normal cursor-pointer ">
                    Home
                  </li>
                  <li className="font-thin hover:font-normal cursor-pointer">
                    Brands
                  </li>
                  <li className="font-thin hover:font-normal cursor-pointer">
                    Products
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* bottom */}
        <div className=" md:grid grid-cols-10 gap-0 h-full hidden">
          <div className="col-span-7 border-r-1 border-[#353535] py-16 grid grid-cols-2 items-center pr-4">
            <div className="flex flex-col gap-2 ">
              <h4 className="text-[#BBBABA] text-normal text-4xl">
                How can we help you{" "}
              </h4>
              <h4 className="underline text-4xl ">Get in Touch</h4>
            </div>
            <div className="flex flex-col gap-2">
              <div className="px-4 py-2 border border-white rounded-full w-fit ">
                <span>+966 537346577</span>
              </div>
              <div className="px-4 py-2 border border-white rounded-full w-fit">
                <p>info@polymershub.com</p>
              </div>
            </div>
          </div>
          <div className="col-span-3 p-4 ">
            <div className="flex justify-center items-center h-full">
              <div className="flex flex-col gap-2">
                <h4>USEFUL LINKS</h4>
                <ul>
                  <li className="font-thin hover:font-normal cursor-pointer ">
                    Home
                  </li>
                  <li className="font-thin hover:font-normal cursor-pointer">
                    Brands
                  </li>
                  <li className="font-thin hover:font-normal cursor-pointer">
                    Products
                  </li>
                </ul>
              </div>
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
