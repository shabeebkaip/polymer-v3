"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  FileImage,
  X,
  FileAudio,
  FileVideo,
  FileText,
  Download,
} from "lucide-react";
import { postFileUpload } from "@/apiServices/shared";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FileUploadProps, UploadedFile } from "@/types/shared";
import { toast } from "sonner";

// Helper to construct full viewUrl from relative path
const getFullViewUrl = (file: UploadedFile): string => {
  console.log("getFullViewUrl called with file:", { 
    viewUrl: file.viewUrl, 
    id: file.id, 
    resourceType: file.resourceType,
    format: file.format,
    type: file.type
  });
  
  // If viewUrl exists, use it (it's relative, e.g., /api/files/view/...)
  if (file.viewUrl) {
    // If already absolute, return as-is
    if (file.viewUrl.startsWith("http")) {
      console.log("Using absolute viewUrl:", file.viewUrl);
      return file.viewUrl;
    }
    
    // Prefix with API base URL (without trailing /api since viewUrl includes it)
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const baseWithoutApi = apiBase.replace(/\/api$/, "");
    const fullUrl = `${baseWithoutApi}${file.viewUrl}`;
    console.log("Constructed full viewUrl:", fullUrl);
    return fullUrl;
  }
  
  // Fallback: construct viewUrl from file.id if viewUrl is missing
  if (file.id) {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const baseWithoutApi = apiBase.replace(/\/api$/, "");
    
    // Determine resourceType from available fields
    // Check if it's an image type, otherwise default to raw
    const isImage = file.resourceType === "image" || 
                    file.type?.startsWith("image/") || 
                    file.format?.startsWith("image/") ||
                    ["jpg", "jpeg", "png", "gif", "webp"].includes(file.format?.toLowerCase() || "");
    const resourceType = isImage ? "image" : "raw";
    
    const constructedUrl = `${baseWithoutApi}/api/files/view/${encodeURIComponent(file.id)}?resourceType=${resourceType}`;
    console.log("Constructed fallback URL:", constructedUrl);
    return constructedUrl;
  }
  
  // Last resort: return fileUrl (will force download)
  console.log("Falling back to fileUrl:", file.fileUrl);
  return file.fileUrl;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  existingFiles = [],
  multiple = true,
  setCloudinaryImage,
  buttonText,
}) => {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setFiles(existingFiles);
  }, [existingFiles]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setLoading(true);
      setErrorMessage("");

      const validFiles = acceptedFiles.filter((file) => file.size <= MAX_FILE_SIZE);
      const invalidCount = acceptedFiles.length - validFiles.length;

      if (invalidCount > 0) {
        const message = "Files must be 5MB or smaller";
        setErrorMessage(message);
        toast.error(message);
      }

      if (!validFiles.length) {
        setLoading(false);
        return;
      }

      const newFiles: UploadedFile[] = [];

      for (const file of validFiles) {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const uploadedFile = await postFileUpload(formData);
          // postFileUpload now returns complete UploadedFile with all fields
          newFiles.push(uploadedFile);
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }

      if (newFiles.length) {
        setFiles((prev) => (multiple ? [...prev, ...newFiles] : newFiles));
        onFileUpload(newFiles);
      }
      setLoading(false);
    },
    [onFileUpload, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      "application/pdf": [".pdf"]
    },
    multiple,
    maxSize: MAX_FILE_SIZE,
    onDropRejected: () => {
      const message = "Files must be 5MB or smaller";
      setErrorMessage(message);
      toast.error(message);
    },
  });

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
    if (setCloudinaryImage) setCloudinaryImage("");
  };

  const getFileIcon = (file: UploadedFile) => {
    const format = file.format || file.type;
    if (!format) return <FileImage className="w-6 h-6" />;
    if (format.includes("pdf")) return <FileText className="w-6 h-6" />;
    if (format.includes("mp4") || format.includes("video"))
      return <FileVideo className="w-6 h-6" />;
    if (format.includes("mp3") || format.includes("audio"))
      return <FileAudio className="w-6 h-6" />;
    return <FileImage className="w-6 h-6" />;
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "w-fit p-2 border rounded-lg cursor-pointer",
          isDragActive ? "bg-blue-100" : "bg-gray-200"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex items-center gap-2 w-full">
          <UploadCloud className="w-4 h-4" />
          {loading ? (
            <span className="text-sm">Uploading...</span>
          ) : (
            <span className="text-sm">
              Upload {buttonText ? buttonText : "PDF"}
            </span>
          )}
        </div>
      </div>

      {errorMessage && (
        <p className="text-xs text-red-600">{errorMessage}</p>
      )}

      <ScrollArea className="flex gap-4 flex-wrap max-h-[200px]">
        {files.map((file, index) => (
          <div
            key={file.id || index}
            className="relative flex flex-col items-center border rounded-md p-2 w-28 text-center"
            onClick={() => setPreviewFile(file)}
          >
            {getFileIcon(file)}
            <span className="truncate text-xs w-full mt-1" title={file.originalFilename || file.name}>
              {file.originalFilename || file.name || "view"}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-0 right-0"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile(file.id);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </ScrollArea>

      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        {previewFile && (
          <DialogContent className="w-full max-w-7xl h-[80vh] flex flex-col">
            <DialogTitle className="flex justify-between items-center">
              <span>{previewFile.originalFilename || previewFile.name || "File Preview"}</span>
              {previewFile.resourceType === "raw" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(previewFile.downloadUrl || previewFile.fileUrl, "_blank")}
                  className="ml-auto"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </DialogTitle>

            <div className="flex-1 flex items-center justify-center overflow-hidden">
              {/* Use viewUrl for raw files (PDFs, docs), fileUrl for images */}
              {(previewFile.resourceType === "raw" || 
                previewFile.format === "pdf" || 
                previewFile.type === "pdf" ||
                previewFile.type === "application/pdf") ? (
                <iframe
                  src={getFullViewUrl(previewFile)}
                  title="Document Preview"
                  className="w-full h-full border-none"
                  onError={(e) => {
                    // Fallback to download if inline preview fails
                    console.error("Preview failed, falling back to download link");
                    window.open(previewFile.downloadUrl || previewFile.fileUrl, "_blank");
                  }}
                />
              ) : (previewFile.format?.includes("video") || previewFile.type?.includes("video")) ? (
                <video
                  src={previewFile.fileUrl}
                  controls
                  className="max-w-full max-h-full"
                />
              ) : (previewFile.format?.includes("audio") || previewFile.type?.includes("audio")) ? (
                <audio src={previewFile.fileUrl} controls className="w-full" />
              ) : (
                <Image
                  src={previewFile.fileUrl}
                  alt="Preview"
                  width={600}
                  height={400}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default FileUpload;
// Usage example
// <FileUpload
//   onFileUpload={(files) => console.log(files)}
//   existingFiles={[
//     {
//       id: "1",
//       fileUrl: "https://example.com/file1.pdf",
//       type: "application/pdf",
//       name: "File 1",
//     },
//     {
//       id: "2",
//       fileUrl: "https://example.com/file2.mp4",
//       type: "video/mp4",
//       name: "File 2",
//     },
//   ]}
//   multiple={true}
//   setCloudinaryImage={(url) => console.log(url)}
// />
