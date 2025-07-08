import React, { useState } from "react";
import ImageUpload from "../../shared/ImageUpload";
import { Card, CardContent } from "../../ui/card";
import { ProductFormData, UploadedFile } from "@/types/product";

interface ProductImagesProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: Array<{ id: string; fileUrl: string }>) => void;
}

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
      <div className="col-span-full mb-6">
        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-4">
            <h4 className="text-lg font-semibold text-purple-800 mb-2">Product Images</h4>
            <p className="text-sm text-purple-600">Upload high-quality images to showcase your product</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-purple-700">
              <span className="px-2 py-1 bg-purple-100 rounded">Required</span>
              <span>At least 1 image needed</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="col-span-full">
        <ImageUpload
          onFilesUpload={handleFilesUpload}
          previews={previews}
          setPreviews={(index: number) => handleRemoveImage(index)}
          onImageClick={handleImageClick}
          width="100%"
          height="200px"
        />
      </div>
    </>
  );
};

export default ProductImages;
