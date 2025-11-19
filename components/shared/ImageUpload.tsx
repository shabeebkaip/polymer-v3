"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X, Eye } from "lucide-react";
import Image from "next/image";
import { imageUpload } from "@/apiServices/shared";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ImageUploadProps, UploadedFile } from "@/types/shared";

const ImageUpload: React.FC<ImageUploadProps> = ({
  onFilesUpload,
  previews = [],
  setPreviews,
  onImageClick,
  width = "100%",
  height = "150px",
}) => {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Clear previous error
      setError(null);

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        setError("Only JPG/PNG up to 3MB allowed");
        return;
      }

      if (!acceptedFiles.length) return;

      setLoading(true);
      const uploadedFiles: UploadedFile[] = [];

      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const { fileUrl, id } = await imageUpload(formData);
          uploadedFiles.push({
            fileUrl,
            id,
            name: "file",
            type: "image",
          });
        } catch (error) {
          console.error("Error uploading file:", error);
          setError("Failed to upload image. Please try again.");
        }
      }

      if (uploadedFiles.length) {
        onFilesUpload(uploadedFiles);
      }

      setLoading(false);
    },
    [onFilesUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"]
    },
    maxSize: 3 * 1024 * 1024, // 3MB
    multiple: true,
  });

  const handleRemoveImage = (index: number) => {
    setPreviews(index);
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 text-center cursor-pointer",
        isDragActive ? "bg-blue-50" : "bg-muted"
      )}
      style={{ width, minHeight: height }}
    >
      <input {...getInputProps()} />

      {loading ? (
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 animate-spin rounded-full" />
          <span className="text-sm text-gray-600">Uploading images...</span>
        </div>
      ) : previews.length > 0 ? (
        <ScrollArea className="w-full max-h-[300px] mt-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
            {previews.map((url, index) => (
              <div key={index} className="relative group">
                <div className="w-full h-[120px] rounded-lg border-2 border-gray-200 overflow-hidden relative cursor-pointer hover:border-primary-500 transition-all duration-200 shadow-sm hover:shadow-md">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                  
                  {/* Action Buttons - Inside Image */}
                  <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="default"
                      size="icon"
                      className="h-7 w-7 rounded-full shadow-lg bg-primary-500 hover:bg-primary-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(url);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-7 w-7 rounded-full shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(index);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Image Number Badge */}
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              {previews.length} image{previews.length !== 1 ? 's' : ''} uploaded • Hover to view or delete
            </p>
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/assets/drop.svg"
            alt="upload icon"
            width={30}
            height={30}
          />
          <span className="text-sm font-medium">Upload Images</span>
          <p className="text-xs text-gray-500 mt-1">Only JPG/PNG up to 3MB allowed</p>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}
      
      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={(e) => {
            e.stopPropagation();
            setPreviewImage(null);
          }}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                setPreviewImage(null);
              }}
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="relative w-full h-full">
              <Image
                src={previewImage}
                alt="Preview"
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
