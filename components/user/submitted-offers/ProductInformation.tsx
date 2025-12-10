import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

interface ProductInformationProps {
  product: {
    productName: string;
    tradeName?: string;
    chemicalName?: string;
    description?: string;
    color?: string;
    countryOfOrigin?: string;
    productImages?: Array<{
      _id: string;
      fileUrl: string;
    }>;
  };
  deliveryLocation: {
    city?: string;
    country?: string;
  };
  deliveryDate?: string;
  orderStatus?: string;
}

export const ProductInformation = ({ 
  product, 
  deliveryLocation, 
  deliveryDate, 
  orderStatus 
}: ProductInformationProps) => {
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

  const handleImageError = (imageId: string) => {
    setImageLoading(prev => ({ ...prev, [imageId]: false }));
  };

  const handleImageLoad = (imageId: string) => {
    setImageLoading(prev => ({ ...prev, [imageId]: false }));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Package className="h-4 w-4 text-green-600" />
          Product Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div>
          <h3 className="font-semibold text-base text-gray-900 mb-1">
            {product.productName}
          </h3>
          {product.tradeName && (
            <p className="text-sm text-gray-600 mb-1">
              Trade Name: {product.tradeName}
            </p>
          )}
          {product.chemicalName && (
            <p className="text-sm text-gray-600 mb-1">
              Chemical Name: {product.chemicalName}
            </p>
          )}
          {product.description && (
            <p className="text-sm text-gray-600">
              {product.description}
            </p>
          )}
        </div>

        <div className="border-t border-gray-200 my-3"></div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {product.color && (
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Color</label>
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-4 h-4 rounded border border-gray-300" 
                  style={{ backgroundColor: product.color }}
                />
                <p className="text-sm text-gray-900 capitalize">{product.color}</p>
              </div>
            </div>
          )}
          {product.countryOfOrigin && (
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Origin</label>
              <p className="text-sm text-gray-900">{product.countryOfOrigin}</p>
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Delivery City</label>
            <p className="text-sm text-gray-900">{deliveryLocation.city || "N/A"}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Delivery Country</label>
            <p className="text-sm text-gray-900">{deliveryLocation.country || "N/A"}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Delivery Date</label>
            <p className="text-sm text-gray-900">{deliveryDate ? formatDate(deliveryDate) : "N/A"}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Order Status</label>
            <p className="text-sm text-gray-900 capitalize">{orderStatus || "N/A"}</p>
          </div>
        </div>

        {product.productImages && product.productImages.length > 0 && (
          <>
            <div className="border-t border-gray-200 my-3"></div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">Product Images</label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {product.productImages.map((image) => (
                  <div key={image._id} className="relative group">
                    <Image
                      src={image.fileUrl}
                      alt="Product image"
                      width={80}
                      height={80}
                      className="w-full h-20 object-cover rounded border border-gray-200"
                      onError={() => handleImageError(image._id)}
                      onLoad={() => handleImageLoad(image._id)}
                    />
                    {imageLoading[image._id] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
