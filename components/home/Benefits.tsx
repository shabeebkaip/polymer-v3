import { register } from "module";
import React from "react";

const Benefits: React.FC = () => {
  const benefits = [
    {
      title: "Benefits for Buyers",
      subtitle: "Free For Buyers",
      list: [
        "Buyers can access the platform for free, allowing them to explore a wide range of products and suppliers without any upfront costs.",
        "Buyers can easily compare products and suppliers, helping them make informed decisions based on their specific needs.",
        "Buyers can access a diverse range of suppliers and products, increasing their options and opportunities for sourcing materials.",
      ],
      registerLink: "/register?userType=buyer",
    },
    {
      title: "Benefits for Sellers",
      subtitle: "Free For Sellers",
      list: [
        "Sellers can showcase their products to a global audience, increasing their visibility and potential customer base.",
        "Sellers can connect with buyers directly, facilitating communication and negotiation.",
        "Sellers can access valuable market insights and analytics to optimize their offerings and strategies.",
      ],
      registerLink: "/register?userType=seller",
    },
  ];
  return (
    <section className="container mx-auto px-4 mt-20 mb-10">
      <div className="flex flex-col items-center gap-14">
        <div className="flex flex-col items-center justify-center text-center gap-5">
          <h1 className="text-5xl">
            Unique Advantages of{" "}
            <span
              className=" bg-gradient-to-r
              from-[var(--green-gradient-from)]
              via-[var(--green-gradient-via)]
              to-[var(--green-gradient-to)]
              bg-clip-text
              text-transparent"
            >
              Polymers Hub
            </span>
          </h1>
          <p className="text-[var(--text-gray-tertiary)] font-normal text-lg text-center max-w-2xl">
            As new technologies like cryptocurrency develop, the real estate
            sector is changing drastically. It is important to understand both
            how these technologies and the traditional real estate market work.{" "}
          </p>
        </div>
      </div>
      <div className="">

      </div>
    </section>
  );
};

export default Benefits;
