import React from "react";
import FileUpload from "@/components/shared/FileUpload";
import { UploadedFile, ProductFormData } from "@/types/product"; // Adjust path as needed

interface DocumentsProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: UploadedFile[]) => void;
}

const Documents: React.FC<DocumentsProps> = ({ data, onFieldChange }) => {
  return (
    <>
      <div className="col-span-3">
        <h4 className="text-xl">Upload Documents</h4>
      </div>

      <div className="col-span-3">
        <FileUpload
          onFileUpload={(files) => {
            onFieldChange("safety_data_sheet", files);
          }}
          buttonText="Upload Safety Data Sheet"
          existingFiles={
            Array.isArray(data.safety_data_sheet) ? data.safety_data_sheet : []
          }
          multiple={false}
          setCloudinaryImage={(url) => {
            console.log("Cloudinary image URL:", url);
          }}
        />
      </div>

      <div className="col-span-3">
        <FileUpload
          onFileUpload={(files) => {
            onFieldChange("technical_data_sheet", files);
          }}
          buttonText="Upload Technical Data Sheet"
          existingFiles={
            Array.isArray(data.technical_data_sheet)
              ? data.technical_data_sheet
              : []
          }
          multiple={false}
          setCloudinaryImage={(url) => {
            console.log("Cloudinary image URL:", url);
          }}
        />
      </div>

      <div className="col-span-3">
        <FileUpload
          onFileUpload={(files) => {
            onFieldChange("certificate_of_analysis", files);
          }}
          buttonText="Upload Certificate of Analysis"
          existingFiles={
            Array.isArray(data.certificate_of_analysis)
              ? data.certificate_of_analysis
              : []
          }
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
