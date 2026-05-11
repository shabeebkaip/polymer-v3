import { BenefitCardProps } from "@/types/home";
import { ArrowRight, CheckCircle2, ShoppingBag, Building2 } from "lucide-react";

interface ExtendedBenefitCardProps extends BenefitCardProps {
  variant?: "buyer" | "supplier";
}

const BenefitCard: React.FC<ExtendedBenefitCardProps> = ({
  benefits,
  subtitle,
  title,
  registerLink,
  variant = "buyer",
}) => {
  const isBuyer = variant === "buyer";

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Coloured header band */}
      <div className={`relative px-8 pt-8 pb-10 ${
        isBuyer
          ? "bg-gradient-to-br from-primary-500 to-primary-600"
          : "bg-gradient-to-br from-[#0a2118] to-[#0f2d1e]"
      }`}>
        {/* Decorative circle */}
        <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10 bg-white" />
        <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full opacity-5 bg-white" />

        <div className="relative">
          {/* Role badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
            {subtitle}
          </span>

          {/* Title row */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {title}
            </h2>
            <div className="flex-shrink-0 w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center">
              {isBuyer
                ? <ShoppingBag className="w-6 h-6 text-white" />
                : <Building2 className="w-6 h-6 text-white" />
              }
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="px-8 py-7 flex-1">
        <ul className="space-y-4">
          {benefits.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-600 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="px-8 pb-8">
        <a
          href={registerLink}
          className={`group flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
            isBuyer
              ? "bg-primary-600 hover:bg-primary-700 text-white"
              : "bg-[#0f2d1e] hover:bg-[#0a2118] text-white"
          }`}
        >
          Get Started — It&apos;s Free
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};

export default BenefitCard;
