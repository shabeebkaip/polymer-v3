import React from "react";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";

interface CertificationsProps {
  data: {
    fdaApproved?: boolean;
    medicalGrade?: boolean;
  };
  onFieldChange: (field: string, value: boolean) => void;
}

const Certification: React.FC<CertificationsProps> = ({
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
            checked={data.fdaApproved || false}
            onCheckedChange={(checked) =>
              onFieldChange("fdaApproved", Boolean(checked))
            }
          />
          <Label htmlFor="fdaApproved">FDA Approved</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="medicalGrade"
            checked={data.medicalGrade || false}
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
