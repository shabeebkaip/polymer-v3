"use client";
import React, { useEffect, useState } from "react";
import CategoryCard from "@/components/home/CategoryCard";
import { getIndustryList } from "@/apiServices/shared";
import { Building2, Factory, Zap, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { IndustryItem } from "@/types/industries";



const Page: React.FC = () => {
  const [industries, setIndustries] = useState<IndustryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getIndustryList()
      .then((response) => {
        const data = response?.data?.map((item: IndustryItem) => ({
          _id: item._id,
          name: item.name,
          image: item.bg, // Normalizing bg to image
          bg: item.bg,
        }));
        setIndustries(data);
      })
      .catch((error) => {
        console.error("Error fetching industries:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="bg-primary-50 rounded-2xl p-8 mb-12">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Factory className="w-12 h-12 text-primary-500" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Industries We Serve
          </h1>
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            Discover the diverse range of industries that rely on our polymer
            materials and chemical solutions. From automotive to healthcare, we
            provide specialized products tailored to meet the unique demands of
            each sector.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-6 h-6 text-primary-500" />
                <h3 className="font-semibold text-gray-900">Global Reach</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Serving industries across 50+ countries worldwide
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-6 h-6 text-primary-500" />
                <h3 className="font-semibold text-gray-900">Innovation</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Cutting-edge solutions for modern challenges
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex items-center gap-3 mb-3">
                <Briefcase className="w-6 h-6 text-primary-500" />
                <h3 className="font-semibold text-gray-900">Expertise</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Decades of experience in polymer applications
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Industries Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Explore Industries
        </h2>
        <p className="text-gray-600 mb-8">
          Click on any industry to discover specific products, applications, and
          solutions designed for that sector.
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
      ) : industries.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {industries.map((industry) => (
            <div key={industry._id} className="group">
              <CategoryCard
                name={industry.name}
                image={industry.image}
                id={industry._id}
                selectedCategory="industries"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Factory className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Industries Available
          </h3>
          <p className="text-gray-600">
            Industries data is currently being updated. Please check back later.
          </p>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-primary-500 rounded-2xl p-8 mt-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          {"Don't See Your Industry?"}
        </h2>
        <p className="text-primary-50 mb-6 max-w-2xl mx-auto">
          {
            "We work with many specialized industries and can develop custom solutions for your unique requirements. Contact us to discuss your specific needs."
          }
        </p>
        <button className="bg-white border-2 border-primary-500 text-primary-500 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
          {"Contact Our Experts"}
        </button>
      </div>
    </section>
  );
};

export default Page;
