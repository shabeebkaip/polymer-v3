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
      className="relative w-full aspect-[4/3] rounded-t-2xl rounded-b-xl md:rounded-t-4xl md:rounded-b-3xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 duration-300 transition" 
      onClick={handleClick}
    >
      <Image src={image} alt={"category"} fill className="object-cover" />

      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/20 via-black/60 to-transparent p-4">
        <h3 className="text-white text-sm md:text-2xl md:font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
          {name}
        </h3>
      </div>
    </div>
  );
};

export default CategoryCard;
