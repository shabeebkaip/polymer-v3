import React, { useState } from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar } from "../../ui/calendar";
import { uomDropdown } from "@/lib/utils";
import { ProductFormData } from "@/types/product"; // update with your actual path
import MultiSelect from "@/components/shared/MultiSelect";

interface DropdownItem {
  _id: string;
  name: string;
}

interface TradeInformationProps {
  data: ProductFormData;
  onFieldChange: (field: keyof ProductFormData, value: any) => void;
  incoterms?: DropdownItem[];
  paymentTerms?: DropdownItem[];
  error: Partial<Record<keyof ProductFormData, string>>;
  onFieldError: (field: keyof ProductFormData) => void;
}

const TradeInformation: React.FC<TradeInformationProps> = ({
  data,
  onFieldChange,
  incoterms = [],
  paymentTerms = [],
  error,
  onFieldError,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <>
      <div className="col-span-3">
        <h4 className="text-xl">Trade Information</h4>
      </div>

      <div>
        <Label htmlFor="minimum_order_quantity" className="block mb-1">
          Minimum Order Quantity
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Minimum Order Quantity"
          value={data.minimum_order_quantity ?? ""}
          onChange={(e) =>
            onFieldChange("minimum_order_quantity", Number(e.target.value))
          }
          onFocus={() => onFieldError("minimum_order_quantity")} // Clear error on focus
          error={error?.minimum_order_quantity ? true : false} // Show error state
          helperText={error?.minimum_order_quantity} // Show error message
        />
      </div>

      <div>
        <Label htmlFor="stock" className="block mb-1">
          Stock
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Stock"
          value={data.stock ?? ""}
          onChange={(e) => onFieldChange("stock", Number(e.target.value))}
          onFocus={() => onFieldError("stock")} // Clear error on focus
          error={error?.stock ? true : false} // Show error state
          helperText={error?.stock} // Show error message
        />
      </div>

      <div>
        <Label htmlFor="uom" className="block mb-1">
          UOM
        </Label>
        <Select
          value={data.uom}
          onValueChange={(val) => onFieldChange("uom", val)}
        >
          <SelectTrigger
            className="px-4 w-full"
            onFocus={() => onFieldError("uom")} // Clear error on focus
            error={error?.uom ? true : false} // Show error state
            helperText={error?.uom} // Show error message
          >
            <SelectValue placeholder="Select UOM" />
          </SelectTrigger>
          <SelectContent>
            {uomDropdown.map((uom: string) => (
              <SelectItem key={uom} value={uom}>
                {uom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="price" className="block mb-1">
          Price
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Price"
          value={data.price ?? ""}
          onChange={(e) => onFieldChange("price", Number(e.target.value))}
          onFocus={() => onFieldError("price")} // Clear error on focus
          error={error?.price ? true : false} // Show error state
          helperText={error?.price} // Show error message
        />
      </div>

      <div>
        <Label htmlFor="priceTerms" className="block mb-1">
          Price Terms
        </Label>
        <Select
          value={data.priceTerms}
          onValueChange={(val) =>
            onFieldChange("priceTerms", val as "fixed" | "negotiable")
          }
        >
          <SelectTrigger className="px-4 w-full">
            <SelectValue placeholder="Select Price Terms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed">Fixed</SelectItem>
            <SelectItem value="negotiable">Negotiable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <MultiSelect
          label="Incoterms"
          placeholder="Select Incoterms"
          options={incoterms}
          selected={data.incoterms || []}
          onChange={(val) => onFieldChange("incoterms", val)}
        />
      </div>

      <div className="relative">
        <Label htmlFor="leadTime" className="block mb-1">
          Lead Time
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Lead Time"
          value={data.leadTime ?? ""}
          onChange={(e) => onFieldChange("leadTime", e.target.value)}
          onFocus={() => onFieldError("leadTime")} // Clear error on focus
          error={error?.leadTime ? true : false} // Show error state
          helperText={error?.leadTime} // Show error message
        />
        <span className="absolute right-4  top-6 text-sm text-gray-500 pointer-events-none border-l pl-2">
          days
        </span>
      </div>

      <div>
        <Label htmlFor="paymentTerms" className="block mb-1">
          Payment Terms
        </Label>
        <Select
          value={data.paymentTerms}
          onValueChange={(val) => onFieldChange("paymentTerms", val)}
        >
          <SelectTrigger className="px-4 w-full">
            <SelectValue placeholder="Select Payment Terms" />
          </SelectTrigger>
          <SelectContent>
            {paymentTerms.map((term) => (
              <SelectItem key={term._id} value={term._id}>
                {term.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default TradeInformation;
