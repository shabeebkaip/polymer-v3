import React, { useState } from "react";
import ImageUpload from "../../shared/ImageUpload";
import { Card, CardContent } from "../../ui/card";
import { ProductFormData, ProductImagesProps } from "@/types/product";
import { UploadedFile } from "@/types/shared";

const ProductImages: React.FC<ProductImagesProps> = ({
  data,
  onFieldChange,
}) => {
  const [previews, setPreviews] = useState<string[]>(
    data.productImages?.map((img) => img?.fileUrl) || []
  );

  const handleImageClick = (index: number) => {
    console.log("Image clicked:", index);
    // Could open modal preview, etc.
  };

  const handleFilesUpload = (uploadedFiles: UploadedFile[]) => {
    console.log("Files uploaded:", uploadedFiles);

    onFieldChange("productImages", [...data.productImages, ...uploadedFiles]);

    // Update local preview list
    setPreviews((prev) => [...prev, ...uploadedFiles.map((f) => f.fileUrl)]);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...data.productImages];
    updatedImages.splice(index, 1);
    onFieldChange("productImages", updatedImages);

    const updatedPreviews = [...previews];
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);
  };

  return (
    <>
      <div className="col-span-full">
        <Card className="border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Product Images</h4>
                <p className="text-xs text-gray-500 mt-0.5">Upload high-quality images to showcase your product</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded font-medium">Required</span>
                <span className="text-gray-500">Min. 1 image</span>
              </div>
            </div>
            
            <ImageUpload
              onFilesUpload={handleFilesUpload}
              previews={previews}
              setPreviews={(index: number) => handleRemoveImage(index)}
              onImageClick={handleImageClick}
              width="100%"
              height="200px"
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProductImages;
