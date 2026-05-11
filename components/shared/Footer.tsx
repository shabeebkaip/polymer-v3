"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Footer: React.FC = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const socials = [
    { label: "Facebook",  icon: "/icons/facebook.png",  link: "https://www.facebook.com/" },
    { label: "Twitter",   icon: "/icons/x.png",         link: "https://x.com/" },
    { label: "LinkedIn",  icon: "/icons/linkedIn.png",  link: "https://www.linkedin.com/" },
    { label: "Instagram", icon: "/icons/instagram.png", link: "https://www.instagram.com/" },
  ];

  const quickLinks = [
    { label: "Home",     path: "/" },
    { label: "Products", path: "/products" },
    { label: "Suppliers",path: "/suppliers" },
    { label: "About Us", path: "/about" },
    { label: "Contact",  path: "/contact" },
  ];

  const services = [
    "Polymer Trading",
    "Supply Chain Solutions",
    "Quality Assurance",
    "Market Intelligence",
    "Technical Support",
  ];

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <footer className="relative text-white overflow-hidden bg-[#060d09]">

      {/* ── Background: hero skyline, flipped & darkened ── */}
      <div className="absolute inset-0">
        <Image
          src="/assets/hero-bg.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top opacity-20 scale-x-[-1]"
          aria-hidden="true"
        />
        {/* dark gradient: transparent at top → black at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(6,13,9,0.55) 0%, rgba(6,13,9,0.80) 40%, rgba(6,13,9,0.96) 75%, #060d09 100%)",
          }}
        />
        {/* green glow blobs — mirrors hero atmosphere */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ── Islamic geometric border-top ── */}
      <div className="relative z-10">
        <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
        {/* chevron notch */}
        <div className="flex justify-center -mt-[1px]">
          <svg width="60" height="16" viewBox="0 0 60 16" fill="none">
            <path d="M0 0 L30 14 L60 0" stroke="#136F47" strokeWidth="2" fill="none"/>
          </svg>
        </div>
      </div>

      {/* ── Saudi identity badge — same style as hero ── */}
      <div className="relative z-10 flex justify-center mt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-sm">
          <span role="img" aria-label="Saudi Arabia flag" className="text-sm leading-none flex-shrink-0">🇸🇦</span>
          <span className="text-[11px] font-medium text-gray-300">Built in Saudi Arabia</span>
          <span className="text-gray-600 select-none">·</span>
          <span className="text-[11px] font-semibold text-primary-400">صنع في المملكة العربية السعودية</span>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 container mx-auto px-4 pt-10 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand column */}
          <div className="lg:col-span-1 space-y-5">
            <div className="flex items-center gap-3">
              <Image src="/onlylogo.png" alt="PolymersHub Logo" width={64} height={64} className="drop-shadow-md" />
              <Image src="/assets/Title.svg" alt="PolymersHub" width={140} height={36} className="w-36 h-auto" />
            </div>

            {/* Arabic brand tagline */}
            <p className="text-primary-400 text-xs font-medium tracking-wide text-right" dir="rtl">
              بوابتك الموثوقة للحلول البوليمرية في الشرق الأوسط
            </p>

            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Your trusted gateway to premium polymer solutions in the Middle East. Connecting industry professionals with verified suppliers worldwide.
            </p>

            <button
              onClick={() => router.push("/contact")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary-900/40"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Us
            </button>

            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/5 hover:bg-primary-600 border border-white/10 hover:border-primary-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Image src={s.icon} alt={s.label} width={18} height={18} className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-[2px] bg-primary-500 rounded-full inline-block" />
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => router.push(link.path)}
                    className="text-gray-400 hover:text-primary-400 text-sm transition-all duration-200 hover:translate-x-1 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-[2px] bg-primary-500 rounded-full inline-block" />
              Our Services
            </h3>
            <ul className="space-y-2.5">
              {services.map((svc) => (
                <li key={svc} className="flex items-center gap-2 text-gray-400 text-sm">
                  <svg className="w-3 h-3 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {svc}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-5">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-[2px] bg-primary-500 rounded-full inline-block" />
              Get in Touch
            </h3>
            <div className="space-y-3">
              {[
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  ),
                  text: "+966 537 346 577",
                  sub: "هاتف",
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  ),
                  text: "info@polymershub.com",
                  sub: "البريد الإلكتروني",
                },
                {
                  icon: (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </>
                  ),
                  text: "Riyadh, Saudi Arabia",
                  sub: "الرياض، المملكة العربية السعودية",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 bg-white/5 border border-white/8 rounded-xl hover:bg-white/8 hover:border-primary-700/40 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-primary-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.icon}
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-200 text-sm font-medium leading-tight">{item.text}</p>
                    <p className="text-gray-500 text-[10px]" dir={i === 2 ? "rtl" : "ltr"}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Vision 2030 strip ── */}
        <div className="border-t border-white/8 pt-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Palm-and-sword inspired SVG mark */}
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="opacity-70">
                <path d="M14 2 C14 2 10 8 10 14 C10 18 12 20 14 22 C16 20 18 18 18 14 C18 8 14 2 14 2Z" fill="#136F47" opacity="0.7"/>
                <path d="M14 22 L14 26" stroke="#136F47" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 26 L20 26" stroke="#136F47" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="14" cy="14" r="2" fill="#136F47"/>
              </svg>
              <div>
                <p className="text-xs text-gray-400 leading-tight">Proudly aligned with</p>
                <p className="text-sm font-semibold text-primary-400">Saudi Vision 2030 · رؤية ٢٠٣٠</p>
              </div>
            </div>

            {/* Geometric divider dots */}
            <div className="hidden sm:flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="block rounded-full bg-primary-600/40"
                  style={{
                    width:  i === 2 ? "8px" : "4px",
                    height: i === 2 ? "8px" : "4px",
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">🌿</span>
              <span className="text-gray-400 text-xs">Sustainable polymer trade for the future</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="relative z-10 border-t border-white/6">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <p className="text-gray-500 text-xs">
                &copy; {new Date().getFullYear()} PolymersHub. All rights reserved.
              </p>
              <span className="hidden md:flex items-center gap-1.5 text-xs text-primary-500 font-medium">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
                Made with ❤️ in Riyadh
              </span>
            </div>

            {/* Bilingual made-in badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/8 bg-white/4">
              <span className="text-xs">🇸🇦</span>
              <span className="text-[10px] text-gray-400">صنع في المملكة</span>
            </div>

            <div className="flex items-center gap-4">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((p) => (
                <button key={p} className="text-gray-500 hover:text-primary-400 text-xs transition-colors duration-200">
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
