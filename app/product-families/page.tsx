"use client";
import React, { useEffect, useState } from "react";
import CategoryCard from "@/components/home/CategoryCard";
import { getProductFamilies } from "@/apiServices/shared";
import { Package, Layers, Zap, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductFamily {
  _id: string;
  name: string;
  image: string;
}

const Page: React.FC = () => {
  const [productFamilies, setProductFamilies] = useState<ProductFamily[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductFamilies()
      .then((response) => {
        const data = response?.data?.map((item: ProductFamily) => ({
          _id: item._id,
          name: item.name,
          image: item.image,
        }));
        setProductFamilies(data);
      })
      .catch((error) => {
        console.error("Error fetching product families:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 mb-12">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Package className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Product Families
          </h1>
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {
              "Explore our comprehensive range of polymer and chemical product families. Each family represents a category of specialized materials designed to meet specific industrial applications and performance requirements."
            }
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-3 mb-3">
                <Layers className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-gray-900">Diverse Range</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Comprehensive selection of polymer materials
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-gray-900">
                  High Performance
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Advanced materials for demanding applications
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6 text-green-600" />
                <h3 className="font-semibold text-gray-900">Quality Assured</h3>
              </div>
              <p className="text-gray-600 text-sm">
                {"Certified products meeting international standards"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Families Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Explore Product Families
        </h2>
        <p className="text-gray-600 mb-8">
          Browse through our product families to find the right materials for
          your specific applications and requirements.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <Skeleton className="w-full h-48 rounded-xl mb-4" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      ) : productFamilies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {productFamilies.map((family) => (
            <div key={family._id} className="group">
              <CategoryCard
                name={family.name}
                image={family.image}
                id={family._id}
                selectedCategory="product-families"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Product Families Available
          </h3>
          <p className="text-gray-600">
            {
              "Product families data is currently being updated. Please check back later."
            }
          </p>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 mt-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Need Custom Solutions?</h2>
        <p className="text-green-100 mb-6 max-w-2xl mx-auto">
          {
            "Can't find the exact product family you're looking for? Our team can develop custom polymer solutions tailored to your specific requirements and applications."
          }
        </p>
        <button className="bg-white border-2 border-[var(--green-main)] text-[var(--green-main)] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Request Custom Solution
        </button>
      </div>
    </section>
  );
};

export default Page;
