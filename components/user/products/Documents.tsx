import React from "react";
import FileUpload from "@/components/shared/FileUpload";

interface UploadedFile {
  id: string;
  fileUrl: string;
  type?: string;
  name?: string;
}

interface DocumentsProps {
  data?: any; // Update this with a stricter type if you plan to use it
  onFieldChange?: (field: string, value: UploadedFile[]) => void;
}

const Documents: React.FC<DocumentsProps> = ({ data, onFieldChange }) => {
  return (
    <>
      <div className="col-span-3">
        <h4 className="text-xl">Upload Documents</h4>
      </div>

      <div className="col-span-3">
        <FileUpload
          onFileUpload={(file) => {
            console.log("File uploaded:", file);
            onFieldChange?.("safetyDataSheet", file);
          }}
          buttonText="Upload Safety Data Sheet"
          existingFiles={[]}
          multiple={false}
          setCloudinaryImage={(url) => {
            console.log("Cloudinary image URL:", url);
          }}
        />
      </div>

      <div className="col-span-3">
        <FileUpload
          onFileUpload={(file) => {
            console.log("File uploaded:", file);
            onFieldChange?.("technicalDataSheet", file);
          }}
          buttonText="Upload Technical Data Sheet"
          existingFiles={[]}
          multiple={false}
          setCloudinaryImage={(url) => {
            console.log("Cloudinary image URL:", url);
          }}
        />
      </div>

      <div className="col-span-3">
        <FileUpload
          onFileUpload={(file) => {
            console.log("File uploaded:", file);
            onFieldChange?.("certificateOfAnalysis", file);
          }}
          buttonText="Upload Certificate of Analysis"
          existingFiles={[]}
          multiple={false}
          setCloudinaryImage={(url) => {
            console.log("Cloudinary image URL:", url);
          }}
        />
      </div>
    </>
  );
};

export default Documents;
