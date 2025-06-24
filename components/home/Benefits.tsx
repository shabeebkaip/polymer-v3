import React from "react";
import BenefitCard from "./BenefitCard";
import { useCmsStore } from "@/stores/cms";

const Benefits: React.FC = () => {
  const { buyersBenefits, suppliersBenefits } = useCmsStore();
  return (
    <section className="container mx-auto px-4 mt-20 mb-10">
      <div className="flex flex-col items-center gap-14">
        <div className="flex flex-col items-center justify-center text-center gap-5">
          <h1 className="text-3xl md:text-5xl">
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
          <p className="text-[var(--text-gray-tertiary)] font-normal text-[16px] md:text-lg text-center max-w-2xl">
            As new technologies like cryptocurrency develop, the real estate
            sector is changing drastically. It is important to understand both
            how these technologies and the traditional real estate market work.{" "}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        <BenefitCard
          subtitle="Free For Buyers"
          title="Benefits for Buyers"
          registerLink="auth/register?role=buyer"
          benefits={buyersBenefits?.content?.description || []}
        />
        <BenefitCard
          subtitle="Free For Suppliers"
          title="Benefits for Suppliers"
          registerLink="auth/register?role=seller"
          benefits={suppliersBenefits?.content?.description || []}
        />
      </div>
    </section>
  );
};

export default Benefits;
