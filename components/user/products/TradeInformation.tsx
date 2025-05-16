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
import { format } from "date-fns";
import { Calendar } from "../../ui/calendar";
import { useDropdowns } from "@/lib/useDropdowns";
import { uomDropdown } from "@/lib/utils";

interface TradeInformationProps {
  data: {
    minimum_order_quantity?: string;
    stock?: string;
    uom?: string;
    price?: string;
    priceTerms?: string;
    incoterms?: string;
    leadTime?: Date;
    paymentTerms?: string;
    [key: string]: any;
  };
  onFieldChange: (field: string, value: any) => void;
}

const TradeInformation: React.FC<TradeInformationProps> = ({
  data,
  onFieldChange,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { incoterms, paymentTerms } = useDropdowns();

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
          value={data?.minimum_order_quantity || ""}
          onChange={(e) =>
            onFieldChange("minimum_order_quantity", e.target.value)
          }
        />
      </div>

      <div>
        <Label htmlFor="stock" className="block mb-1">
          Stock
        </Label>
        <Input
          className="text-lg px-4"
          placeholder="Stock"
          value={data?.stock || ""}
          onChange={(e) => onFieldChange("stock", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="uom" className="block mb-1">
          UOM
        </Label>
        <Select
          value={data?.uom || ""}
          onValueChange={(val) => onFieldChange("uom", val)}
        >
          <SelectTrigger className="px-4 w-full">
            <SelectValue placeholder="Select UOM" />
          </SelectTrigger>
          <SelectContent>
            {uomDropdown?.map((uom: string) => (
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
          value={data?.price || ""}
          onChange={(e) => onFieldChange("price", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="priceTerms" className="block mb-1">
          Price Terms
        </Label>
        <Select
          value={data?.priceTerms || ""}
          onValueChange={(val) => onFieldChange("priceTerms", val)}
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
        <Label htmlFor="incoterms" className="block mb-1">
          Incoterms
        </Label>
        <Select
          value={data?.incoterms || ""}
          onValueChange={(val) => onFieldChange("incoterms", val)}
        >
          <SelectTrigger className="px-4 w-full">
            <SelectValue placeholder="Select Incoterms" />
          </SelectTrigger>
          <SelectContent>
            {incoterms?.map((term) => (
              <SelectItem key={term._id} value={term._id}>
                {term.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="leadTime" className="block mb-1">
          Lead Time
        </Label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Input
              readOnly
              value={
                data?.leadTime
                  ? format(data.leadTime, "MMM dd, yyyy")
                  : "Select Lead Time"
              }
              className="bg-white cursor-pointer text-lg px-4"
            />
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Calendar
              mode="single"
              selected={data.leadTime}
              onSelect={(date) => {
                onFieldChange("leadTime", date);
                setCalendarOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label htmlFor="paymentTerms" className="block mb-1">
          Payment Terms
        </Label>
        <Select
          value={data?.paymentTerms || ""}
          onValueChange={(val) => onFieldChange("paymentTerms", val)}
        >
          <SelectTrigger className="px-4 w-full">
            <SelectValue placeholder="Select Payment Terms" />
          </SelectTrigger>
          <SelectContent>
            {paymentTerms?.map((term) => (
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
