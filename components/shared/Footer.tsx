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
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,_rgba(34,197,94,0.3)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,_rgba(16,185,129,0.3)_0%,_transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600"></div>
      </div>

      <div className="container mx-auto px-4 pt-16 pb-8 relative">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex justify-center lg:justify-start">
              <div className="relative group">
                <Image
                  src="/assets/Title.svg"
                  alt="Polymers Hub Logo"
                  width={180}
                  height={60}
                  className="w-44 h-auto transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed text-center lg:text-left max-w-sm mx-auto lg:mx-0">
              Your trusted gateway to premium polymer solutions in the Middle East. Connecting industry professionals with verified suppliers worldwide.
            </p>
            <div className="flex justify-center lg:justify-start gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-600 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 group"
                >
                  <Image
                    src={social.icon}
                    alt={social.label}
                    width={20}
                    height={20}
                    className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white relative">
              Quick Links
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "Products", path: "/products" },
                { label: "Suppliers", path: "/suppliers" },
                { label: "About Us", path: "/about" },
                { label: "Contact", path: "/contact" }
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigateTo(link.path)}
                    className="text-gray-300 hover:text-green-400 transition-all duration-200 hover:translate-x-1 text-sm font-medium group flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white relative">
              Our Services
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
            </h3>
            <ul className="space-y-3">
              {[
                "Polymer Trading",
                "Supply Chain Solutions", 
                "Quality Assurance",
                "Market Intelligence",
                "Technical Support"
              ].map((service) => (
                <li key={service} className="text-gray-300 text-sm font-medium flex items-center gap-2">
                  <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white relative">
              Get in Touch
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
            </h3>
            <div className="space-y-4">
              <div className="group">
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm font-medium">+966 537 346 577</span>
                </div>
              </div>
              
              <div className="group">
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm font-medium">info@polymershub.com</span>
                </div>
              </div>

              <div className="group">
                <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-300 text-sm font-medium">Riyadh, Saudi Arabia</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators & Stats */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                500+
              </div>
              <div className="text-gray-400 text-sm">Verified Suppliers</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-gray-400 text-sm">Products Listed</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                50+
              </div>
              <div className="text-gray-400 text-sm">Countries Served</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-gray-400 text-sm">Expert Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 relative">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Polymers Hub. All rights reserved.
              </p>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-medium">Trusted Platform</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <button className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200">
                Privacy Policy
              </button>
              <button className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200">
                Terms of Service
              </button>
              <button className="text-gray-400 hover:text-green-400 text-sm transition-colors duration-200">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
