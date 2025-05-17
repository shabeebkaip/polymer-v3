"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";
import Image from "next/image";
import { imageUpload } from "@/apiServices/shared";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface UploadedFile {
  fileUrl: string;
  id: string;
  name: string;
  type: string;
  [key: string]: any;
}

interface ImageUploadProps {
  onFilesUpload: (files: UploadedFile[]) => void;
  previews: string[];
  setPreviews: (index: number) => void;
  onImageClick?: (index: number) => void;
  width?: string;
  height?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onFilesUpload,
  previews = [],
  setPreviews,
  onImageClick,
  width = "100%",
  height = "150px",
}) => {
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
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
    accept: { "image/*": [] },
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
        <Skeleton className="w-6 h-6 animate-spin rounded-full" />
      ) : previews.length > 0 ? (
        <ScrollArea className="w-full max-h-40 mt-2">
          <div className="grid grid-cols-3 gap-2">
            {previews.map((url, index) => (
              <div key={index} className="relative group">
                <div
                  onClick={() => onImageClick?.(index)}
                  className="w-full h-24 rounded-md border overflow-hidden relative cursor-pointer"
                >
                  <Image
                    src={url}
                    alt={`Preview ${index}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 z-10 p-1 bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex items-center gap-2">
          <Image
            src="/assets/drop.svg"
            alt="upload icon"
            width={30}
            height={30}
          />
          <span className="text-sm font-medium">Upload Images</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
