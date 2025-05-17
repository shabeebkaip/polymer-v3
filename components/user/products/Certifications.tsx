import React from "react";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { ProductFormData } from "@/types/product"; // Adjust path if needed

interface CertificationProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: boolean) => void;
}

const Certification: React.FC<CertificationProps> = ({
  data,
  onFieldChange,
}) => {
  return (
    <>
      <div className="col-span-3 mb-2">
        <h4 className="text-xl">Certification</h4>
      </div>
      <div className="flex gap-10 flex-wrap">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="fdaApproved"
            checked={data.fdaApproved}
            onCheckedChange={(checked) =>
              onFieldChange("fdaApproved", Boolean(checked))
            }
          />
          <Label htmlFor="fdaApproved">FDA Approved</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="medicalGrade"
            checked={data.medicalGrade}
            onCheckedChange={(checked) =>
              onFieldChange("medicalGrade", Boolean(checked))
            }
          />
          <Label htmlFor="medicalGrade">Medical Grade</Label>
        </div>
      </div>
    </>
  );
};

export default Certification;
