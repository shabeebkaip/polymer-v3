import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';
import { FileViewerProps } from '@/types/shared';

const FileViewer: React.FC<FileViewerProps> = ({ previewFile, triggerComp }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerComp}</DialogTrigger>

      {previewFile && (
        <DialogContent className="w-full max-w-4xl h-[80vh] flex flex-col items-center justify-center">
          <DialogTitle className="sr-only">File Preview</DialogTitle>

          {previewFile.fileUrl?.endsWith('.pdf') ? (
            <iframe
              src={previewFile.fileUrl}
              title="PDF Preview"
              className="w-full h-full border-none"
            />
          ) : previewFile.type?.includes('video') ? (
            <video src={previewFile.fileUrl} controls className="max-w-full max-h-full" />
          ) : previewFile.type?.includes('audio') ? (
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
  );
};

export default FileViewer;
// Usage example
// <FileViewer
//   previewFile={{
//     fileUrl: "https://example.com/file.pdf",
//     type: "application/pdf"
//   }}
//   triggerComp={
//     <button className="px-4 py-2 bg-blue-500 text-white rounded">
//       Open File Preview
//     </button>
//   }
// />
