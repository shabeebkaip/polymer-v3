import { Check } from "lucide-react";

interface BenefitCardProps {
  benefits: string[];
  subtitle: string;
  title: string;
  registerLink: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({
  benefits,
  subtitle,
  title,
  registerLink,
}) => {
  return (
    <div className="flex flex-col items-start justify-between gap-6 p-8 md:p-10 rounded-2xl border border-gray-100  shadow-lg hover:shadow-xl transition-all duration-300 group min-h-[340px] w-full">
      <div className="w-full">
        <h3 className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
          {subtitle}
        </h3>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-snug">
          {title}
        </h2>
        <ul className="space-y-3">
          {benefits.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-3 text-gray-700 text-sm md:text-base "
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-50">
                <Check className="w-10 h-10 text-green-600" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <a
        href={registerLink}
        className="inline-flex items-center gap-2 text-sm md:text-base px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow hover:from-green-700 hover:to-emerald-700 transition-all duration-200 focus:ring-2 focus:ring-green-300"
      >
        Register Now
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </a>
    </div>
  );
};

export default BenefitCard;
