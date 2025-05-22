"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getGrades,
  getIncoterms,
  getPackagingTypes,
} from "@/apiServices/shared";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { create } from "domain";
import { Calendar as CalendarIcon } from "lucide-react";
import { createQuoteRequest } from "@/apiServices/user";

interface Grade {
  _id: string;
  name: string;
}
interface Incoterm {
  _id: string;
  name: string;
}
interface PackagingType {
  _id: string;
  name: string;
}
interface QuoteRequestModalProps {
  className?: string;
  productId: string;
  uom: string;
}

const QuoteRequestModal = ({
  className,
  productId,
  uom,
}: QuoteRequestModalProps) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    product: productId, // id
    quantity: "",
    uom: uom,
    grade: "",
    incoterm: "",
    postCode: "",
    city: "",
    country: "",
    destination: "",
    packagingType: "",
    packaging_size: "",
    expected_annual_volume: "",
    delivery_date: undefined as Date | undefined,
    application: "",
    pricing: "",
    message: "",
    request_document: "",
    open_request: false,
  });
  const [grades, setGrades] = useState<Grade[]>([]);
  const [incoterms, setIncoterms] = useState<Incoterm[]>([]);
  const [packagingTypes, setPackagingTypes] = useState<PackagingType[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handletrigger = () => {
    setOpen(true);
    Promise.all([getGrades(), getIncoterms(), getPackagingTypes()])
      .then(([gradesRes, incotermsRes, packagingRes]) => {
        setGrades(gradesRes.data);
        setIncoterms(incotermsRes.data);
        setPackagingTypes(packagingRes.data);
      })
      .catch((err) => {
        console.error("Error fetching dropdowns", err);
      });
  };

  const onFieldChange = (field: string, value: string | Date | undefined) => {
    setData((prev) => ({
      ...prev,
      [field]: value instanceof Date ? value.toISOString() : value || "",
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted with data:", data);
    const toastId = toast.loading("Creating Quote Request...");

    // Collect all validation errors
    const errors: string[] = [];

    if (!data?.quantity) errors.push("Please enter the quantity");
    if (!data?.grade) errors.push("Please select the grade");
    if (!data?.incoterm) errors.push("Please select the incoterm");
    if (!data?.country) errors.push("Please enter the country");
    if (!data?.city) errors.push("Please enter the city");
    if (!data?.postCode) errors.push("Please enter the postal code");
    if (!data?.destination) errors.push("Please enter the destination");
    if (!data?.packaging_size) errors.push("Please enter the packaging size");
    if (!data?.delivery_date) errors.push("Please select the delivery date");

    // If any validation errors exist, show all and exit
    if (errors.length > 0) {
      toast.dismiss(toastId); // Close loading toast
      errors.forEach((err) => toast.error(err)); // Show all error toasts
      return;
    }

    try {
      // Proceed with the request if no errors
      console.log("All validations passed. Proceeding...");
      createQuoteRequest(data).then((response) => {
        console.log("Quote request created successfully:", response);
        toast.dismiss(toastId);
        toast.success("Quote request created successfully.");
        setOpen(false); // Close the modal
      });
      // your submission logic goes here
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Something went wrong while creating the quote request.");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={handletrigger}>
        <button className={className}>Request Quote</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-[#f5f5f5] md:max-h-none md:overflow-visible ">
        <DialogHeader>
          <DialogTitle className="text-3xl">Request Quote</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            So our team can reach out to you on time
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div className="flex gap-2">
            <div className="relative w-full">
              <Input
                placeholder="Enter the Quantity"
                className="pr-16 bg-white"
                type="number"
                onChange={(e) => onFieldChange("quantity", e.target.value)}
                value={data?.quantity}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none border-l pl-2">
                {data?.uom}
              </span>
            </div>
          </div>

          <Select
            value={data.grade}
            onValueChange={(value) => onFieldChange("grade", value)}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Grade" />
            </SelectTrigger>
            <SelectContent>
              {grades.map((grade, index) => (
                <SelectItem key={index} value={grade?._id}>
                  {grade?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={data.incoterm}
            onValueChange={(value) => onFieldChange("incoterm", value)}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Incoterm" />
            </SelectTrigger>
            <SelectContent>
              {incoterms.map((incoterm, index) => (
                <SelectItem key={index} value={incoterm?._id}>
                  {incoterm?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Enter Country"
            className="bg-white w-full"
            type="text"
            onChange={(e) => onFieldChange("country", e.target.value)}
            value={data?.country}
          />

          <Input
            placeholder="Enter City"
            className="bg-white w-full"
            type="text"
            onChange={(e) => onFieldChange("city", e.target.value)}
            value={data?.city}
          />

          <Input
            placeholder="Enter Postal Code"
            className="bg-white w-full"
            type="text"
            onChange={(e) => onFieldChange("postCode", e.target.value)}
            value={data?.postCode}
          />

          <Input
            placeholder="Enter Destination"
            className="bg-white w-full"
            type="text"
            onChange={(e) => onFieldChange("destination", e.target.value)}
            value={data?.destination}
          />

          <Select
            value={data.packagingType}
            onValueChange={(value) => onFieldChange("packagingType", value)}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Packaging Type" />
            </SelectTrigger>
            <SelectContent>
              {packagingTypes.map((packagingType, index) => (
                <SelectItem key={index} value={packagingType?._id}>
                  {packagingType?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Enter Packaging Size"
            className="bg-white w-full"
            type="text"
            onChange={(e) => onFieldChange("packaging_size", e.target.value)}
            value={data?.packaging_size}
          />

          <div className="relative w-full">
            <Input
              placeholder="Expected Annual Quantity"
              className="bg-white w-full"
              type="number"
              onChange={(e) =>
                onFieldChange("expected_annual_volume", e.target.value)
              }
              value={data?.expected_annual_volume}
            />
          </div>

          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
               <div className="relative w-full">
              <Input
                readOnly
                value={
                  data?.delivery_date
                    ? new Date(data?.delivery_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    )
                    : "Select Delivery Date"
                }
                className="bg-white cursor-pointer w-full"
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
               </div>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar
                mode="single"
                selected={data?.delivery_date}
                onSelect={(date) => {
                  onFieldChange("delivery_date", date);
                  setCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>

          <Input
            placeholder="Price"
            className="bg-white w-full"
            type="number"
            onChange={(e) => onFieldChange("pricing", e.target.value)}
            value={data?.pricing}
          />

          <Textarea
            placeholder="What will this product be used for?"
            className="col-span-1 lg:col-span-2 bg-white w-full"
            onChange={(e) => onFieldChange("application", e.target.value)}
            value={data?.application}
          />

          <Textarea
            placeholder="Add additional information to the supplier"
            className="col-span-1 lg:col-span-2 bg-white w-full"
            rows={3}
            onChange={(e) => onFieldChange("message", e.target.value)}
            value={data?.message}
          />
        </div>

        <DialogFooter className="mt-4 flex justify-between">
          <Button
            variant={"outline"}
            className="border border-[var(--green-main)] text-[var(--green-main)] rounded-lg hover:bg-green-50 transition hover:text-[var(--green-main)]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            variant={"default"}
            className="bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white rounded-lg hover:opacity-90"
          >
            Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteRequestModal;
