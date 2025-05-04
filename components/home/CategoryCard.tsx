// components/CategoryCard.tsx
import Image from "next/image";
import React from "react";

interface CategoryCardProps {
  label: string;
  image: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ label, image }) => {
  return (
    <div className="relative w-full aspect-[4/3] rounded-t-2xl rounded-b-xl md:rounded-t-4xl md:rounded-b-3xl overflow-hidden shadow-lg">
      {/* Background image fills card */}
      <Image src={image} alt={label} fill className="object-cover" />

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-transparent p-4">
        <h3 className="text-white text-sm md:text-2xl md:font-semibold">
          {label}
        </h3>
      </div>
    </div>
  );
};

export default CategoryCard;
