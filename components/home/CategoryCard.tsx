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
      className="relative w-full aspect-[4/3] rounded-xl sm:rounded-t-2xl sm:rounded-b-xl lg:rounded-t-3xl lg:rounded-b-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer hover:scale-105 focus:scale-105 focus:shadow-xl focus:ring-2 focus:ring-green-300 duration-300 transition group"
      tabIndex={0}
      onClick={handleClick}
      onKeyPress={(e) => {
        if (e.key === "Enter") handleClick();
      }}
      aria-label={name}
    >
      <Image
        src={image}
        alt={"category"}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/50 to-transparent p-2 sm:p-3 lg:p-4">
        <h3 className="text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium sm:font-semibold leading-tight">
          {name}
        </h3>
      </div>
    </div>
  );
};

export default CategoryCard;
