import React, { useState } from "react";
import ImageUpload from "../../shared/ImageUpload";
import { ProductFormData, UploadedFile } from "@/types/product";

interface ProductImagesProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: any) => void;
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
  console.log("Previews:", previews);
  return (
    <>
      <div className="col-span-3">
        <h4 className="text-xl">Product Images</h4>
      </div>
      <div className="col-span-3">
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
