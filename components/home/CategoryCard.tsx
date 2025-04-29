// components/CategoryCard.tsx
import Image from "next/image";
import React from "react";

interface CategoryCardProps {
  id: string;
  label: string;
  image: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, label, image }) => {
  return (
    <div className="relative rounded-t-4xl rounded-b-2xl  overflow-hidden shadow-lg">
      {/* Background image */}
      <Image
        src={image}
        alt={label}
        width={300}
        height={200}
        className="object-cover"
      />

      {/* Bottom green overlay */}
      <div
        className="absolute bottom-0 left-0 w-full bg-gradient-to-t  from-[var(--green-gradient-from)]
              via-[var(--green-gradient-via)]
               to-transparent  p-4"
      >
        <h3 className="text-white text-2xl font-semibold">{label}</h3>
      </div>
    </div>
  );
};

export default CategoryCard;
