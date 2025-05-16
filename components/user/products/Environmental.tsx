import React from "react";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";

interface EnvironmentalProps {
  data: {
    recyclable?: boolean;
    bioDegradable?: boolean;
  };
  onFieldChange: (field: string, value: boolean) => void;
}

const Environmental: React.FC<EnvironmentalProps> = ({
  data,
  onFieldChange,
}) => {
  return (
    <>
      <div className="col-span-3 mb-2">
        <h4 className="text-xl">Environmental</h4>
      </div>
      <div className="flex gap-10 flex-wrap">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="recyclable"
            checked={data.recyclable || false}
            onCheckedChange={(checked) =>
              onFieldChange("recyclable", Boolean(checked))
            }
          />
          <Label htmlFor="recyclable">Recyclable</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="bioDegradable"
            checked={data.bioDegradable || false}
            onCheckedChange={(checked) =>
              onFieldChange("bioDegradable", Boolean(checked))
            }
          />
          <Label htmlFor="bioDegradable">Bio Degradable</Label>
        </div>
      </div>
    </>
  );
};

export default Environmental;
