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
} from "lucide-react";
import { postFileUpload } from "@/apiServices/shared";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface UploadedFile {
  id: string;
  fileUrl: string;
  type?: string;
  name?: string;
}

interface FileUploadProps {
  onFileUpload: (files: UploadedFile[]) => void;
  existingFiles?: UploadedFile[];
  multiple?: boolean;
  setCloudinaryImage?: (url: string) => void;
  buttonText?: string;
}

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

  useEffect(() => {
    setFiles(existingFiles);
  }, [existingFiles]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setLoading(true);
      const newFiles: UploadedFile[] = [];

      for (const file of acceptedFiles) {
        const formData = new FormData();
        formData.append("file", file);
        try {
          const { fileUrl, id } = await postFileUpload(formData);
          const uploadedFile: UploadedFile = {
            fileUrl,
            id,
          };
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
    accept: { "application/pdf": [".pdf"] },
    multiple,
  });

  const handleRemoveFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
    if (setCloudinaryImage) setCloudinaryImage("");
  };

  const getFileIcon = (type: string | undefined) => {
    if (!type) return <FileImage className="w-6 h-6" />;
    if (type.includes("pdf")) return <FileText className="w-6 h-6" />;
    if (type.includes("mp4") || type.includes("video"))
      return <FileVideo className="w-6 h-6" />;
    if (type.includes("mp3") || type.includes("audio"))
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

      <ScrollArea className="flex gap-4 flex-wrap max-h-[200px]">
        {files.map((file, index) => (
          <div
            key={file.id || index}
            className="relative flex flex-col items-center border rounded-md p-2 w-28 text-center"
            onClick={() => setPreviewFile(file)}
          >
            {getFileIcon(file.type)}
            <span className="truncate text-xs w-full mt-1">
              view
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
          <DialogContent className="w-full max-w-4xl h-[80vh] flex flex-col items-center justify-center">
            <DialogTitle className="sr-only">File Preview</DialogTitle>

            {/* Enhanced PDF detection for Cloudinary/raw URLs */}
            {(
              (previewFile.type && previewFile.type.includes("pdf")) ||
              (previewFile.fileUrl && previewFile.fileUrl.includes("/raw/")) ||
              (previewFile.name && previewFile.name.endsWith(".pdf"))
            ) ? (
              <iframe
                src={previewFile.fileUrl}
                title="PDF Preview"
                className="w-full h-full border-none"
              />
            ) : previewFile.type?.includes("video") ? (
              <video
                src={previewFile.fileUrl}
                controls
                className="max-w-full max-h-full"
              />
            ) : previewFile.type?.includes("audio") ? (
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
