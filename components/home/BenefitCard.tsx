import Image from "next/image";

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
    <div className="flex flex-col items-center justify-center gap-5 p-10 rounded-lg shadow-[0_25px_50px_-12px_rgba(5,150,105,0.4)]">
      <div className="flex flex-col items-center justify-center text-center gap-1">
        <h3 className="text-xs font-normal text-[var(--green-main)] ">
          {subtitle}
        </h3>
        <h2 className="md:text-[27px] ">{title}</h2>
      </div>
      <ul className="space-y-2">
        {benefits.map((item, index) => (
          <li
            key={index}
            className="flex items-baselin gap-2 text-[var(--text-gray-tertiary)] text-xs md:text-lg"
          >
            <Image
              src="/icons/Check icon.png"
              alt="Check Icon"
              width={20}
              height={20}
              className="w-8 h-8"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <a
        href={registerLink}
        className="text-xs md:text-lg  px-4 py-2 bg-blue-500 text-white rounded-lg bg-gradient-to-r
              from-[var(--green-gradient-from)]
              via-[var(--green-gradient-via)]
              to-[var(--green-gradient-to)]"
      >
        Register Now
      </a>
    </div>
  );
};

export default BenefitCard;
