'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  Globe,
  MapPin,
  Mail,
  Building2,
  Users,
  Calendar,
  Award,
  Truck,
  Shield,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { getSellerDetail } from '@/apiServices/shared';
import { useUserInfo } from '@/lib/useUserInfo';
import { Skeleton } from '@/components/ui/skeleton';
import { Supplier } from '@/types/seller';
import Image from 'next/image';

const SupplierDetail = () => {
  const params = useParams();
  const { user } = useUserInfo();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSupplierDetails = useCallback(async () => {
    try {
      const response = await getSellerDetail(params.id as string);
      setSupplier(response.data);
    } catch (error) {
      console.error('Error fetching supplier details:', error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (params.id) {
      fetchSupplierDetails();
    }
  }, [params.id, fetchSupplierDetails]);

  if (loading) {
    return (
      <section className="container mt-10 mx-auto px-4">
        <div className="animate-pulse">
          <div className="bg-primary-50 rounded-2xl p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <Skeleton className="w-32 h-32 rounded-xl" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!supplier) {
    return (
      <section className="container mt-10 mx-auto px-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Supplier Not Found</h1>
          <p className="text-gray-600">
            {"The supplier you're looking for doesn't exist or has been removed."}
          </p>
        </div>
      </section>
    );
  }
  console.log('supplier', supplier);
  return (
    <section className="container mt-10 mx-auto px-4 pb-12">
      {/* Hero Section */}
      <div className="bg-primary-50 rounded-2xl p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-shrink-0">
            <Image
              src={supplier.company_logo}
              alt={supplier.company}
              width={128}
              height={128}
              className="w-32 h-32 object-contain rounded-xl border-2 border-white shadow-lg"
              priority
            />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{supplier.company}</h1>
            <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-500" />
                <span>{supplier.location}</span>
              </div>
              {supplier.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary-500" />
                  <a
                    href={supplier.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:text-primary-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="bg-primary-50 text-primary-600">
                <Building2 className="w-4 h-4 mr-1" />
                Verified Supplier
              </Badge>
              {supplier.yearsInBusiness && (
                <Badge variant="secondary" className="bg-primary-50 text-primary-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  {supplier.yearsInBusiness}+ Years
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-primary-500 hover:bg-primary-600"
                onClick={() => window.open(`mailto:${supplier.email}`, '_blank')}
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Supplier
              </Button>
              {supplier.website && (
                <Button
                  variant="outline"
                  className="border-primary-500 text-primary-500 hover:bg-primary-50"
                  onClick={() => window.open(supplier.website, '_blank')}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Visit Website
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* About Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About {supplier.company}</h2>
            <div
              className="text-gray-600 leading-relaxed mb-4"
              dangerouslySetInnerHTML={{
                __html: `
                  <style>
                    .supplier-about strong { color: #136F47; font-weight: bold; }
                    .supplier-about em { color: #136F47; font-style: italic; }
                    .supplier-about ul { margin: 1em 0 1em 1.5em; list-style: disc; color: #136F47; }
                    .supplier-about li { margin-bottom: 0.5em; }
                    .supplier-about h3, .supplier-about h2 { color: #136F47; font-size: 1.25em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; }
                    .supplier-about a { color: #136F47; text-decoration: underline; }
                    .supplier-about blockquote { border-left: 4px solid #136F47; padding-left: 1em; color: #136F47; background: #e8f5f0; margin: 1em 0; }
                  </style>
                  <div class="supplier-about">
                    ${supplier.about_us || `${supplier.company} is a <strong>trusted supplier</strong> in the polymer and chemical industry, committed to providing <em>high-quality products</em> and exceptional service to customers worldwide. With years of experience in the market, we specialize in delivering <strong>innovative solutions</strong> that meet the evolving needs of our clients.`}
                  </div>
                `,
              }}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
                <Shield className="w-6 h-6 text-primary-500" />
                <div>
                  <p className="font-semibold text-gray-900">Quality Assured</p>
                  <p className="text-sm text-gray-600">Certified products & processes</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg">
                <Truck className="w-6 h-6 text-primary-500" />
                <div>
                  <p className="font-semibold text-gray-900">Fast Delivery</p>
                  <p className="text-sm text-gray-600">Reliable logistics network</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Industry</p>
                  <p className="text-sm text-gray-600">{supplier?.industry}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Products</p>
                  <p className="text-sm text-gray-600">
                    {supplier?.products.length} Products Available
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">{supplier.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          {supplier.certifications && supplier.certifications.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                <Award className="w-5 h-5 inline mr-2" />
                Certifications
              </h3>
              <div className="space-y-2">
                {supplier.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Products & Services</h2>
          <Badge variant="outline" className="text-sm">
            {supplier?.products.length} Products
          </Badge>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <Skeleton className="w-full h-48 rounded-lg mb-4" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : supplier?.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {supplier?.products.map((product) => (
              <ProductCard key={product._id} product={product} userType={user?.user_type} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Available</h3>
            <p className="text-gray-600">{"This supplier hasn't added any products yet."}</p>
          </div>
        )}
      </div>

      {/* Contact CTA */}
      <div className="bg-primary-500 rounded-2xl p-8 mt-8 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Connect?</h2>
        <p className="text-primary-50 mb-6 max-w-2xl mx-auto">
          {`Get in touch with ${supplier.company} to discuss your requirements,
          request quotes, or learn more about their products and services.`}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            className="bg-white text-primary-500 hover:bg-primary-50 cursor-pointer"
            onClick={() => window.open(`mailto:${supplier.email}`, '_blank')}
          >
            <Mail className="w-5 h-5 mr-2" />
            Send Message
          </Button>
          {supplier.website && (
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-primary-500 hover:bg-primary-50 cursor-pointer"
              onClick={() => window.open(supplier.website, '_blank')}
            >
              <Globe className="w-5 h-5 mr-2" />
              Visit Website
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default SupplierDetail;
