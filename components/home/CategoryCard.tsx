// components/CategoryCard.tsx
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

interface CategoryCardProps {
  name: string;
  image: string;
  selectedCategory?: string;
  id: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  image,
  selectedCategory,
  id,
}) => {
  const router = useRouter();
  const handleClick = () => {
    if (selectedCategory === "industries") {
      router.push(`/products?industry=${id}`);
    } else if (selectedCategory === "families") {
      router.push(`/products?productFamily=${id}`);
    }
  };
  return (
    <div
      className="relative w-full aspect-[4/3] rounded-t-2xl rounded-b-xl md:rounded-t-4xl md:rounded-b-3xl overflow-hidden shadow-lg cursor-pointer"
      onClick={handleClick}
    >
      {/* Background image fills card */}
      <Image src={image} alt={"category"} fill className="object-cover" />

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-transparent p-4">
        <h3 className="text-white text-sm md:text-2xl md:font-semibold">
          {name}
        </h3>
      </div>
    </div>
  );
};

export default CategoryCard;
