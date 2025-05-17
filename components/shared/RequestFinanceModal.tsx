"use client";
import React, { useState } from "react";
import { format } from "date-fns";
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
import { createFinanceRequest, createQuoteRequest } from "@/apiServices/user";

interface RequestFinanceModalProps {
  className?: string;
  productId: string;
  uom: string;
}

const RequestFinanceModal = ({
  className,
  productId,
  uom,
}: RequestFinanceModalProps) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    productId: productId, // id
    emiMonths: "",
    quantity: "",
    uom: uom,
    estimatedPrice: "",
    notes: "",
  });

  const handletrigger = () => {
    setOpen(true);
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
    if (!data?.emiMonths) errors.push("Please select EMI months");
    if (!data?.estimatedPrice) errors.push("Please enter the estimated price");
    if (!data?.uom) errors.push("Please select a unit of measurement");
    if (!data?.notes) errors.push("Please enter any additional notes");

    // If any validation errors exist, show all and exit
    if (errors.length > 0) {
      toast.dismiss(toastId); // Close loading toast
      errors.forEach((err) => toast.error(err)); // Show all error toasts
      return;
    }

    try {
      // Proceed with the request if no errors
      console.log("All validations passed. Proceeding...");
      createFinanceRequest(data).then((response) => {
        console.log("Finance Request in progress   ", response);
        toast.dismiss(toastId);
        toast.success(
          "Finance request created successfully. Our team will reach out to you soon."
        );
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
        <button className={className}>Request Finance</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-[#f5f5f5] md:max-h-none md:overflow-visible ">
        <DialogHeader>
          <DialogTitle className="text-3xl">Request Finance</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            So our team can reach out to you on time
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1  gap-4 mt-4">
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
          <Input
            placeholder="Enter the Estimated Price"
            className="bg-white"
            type="number"
            onChange={(e) => onFieldChange("estimatedPrice", e.target.value)}
            value={data?.estimatedPrice}
          />
          <Select
            onValueChange={(val) => onFieldChange("emiMonths", val)}
            defaultValue={data?.emiMonths}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select EMI Months" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 36 }, (_, i) => (
                <SelectItem key={i + 1} value={`${i + 1}`}>
                  {`${i + 1} Month${i > 0 ? "s" : ""}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Enter any additional notes"
            className="bg-white"
            onChange={(e) => onFieldChange("notes", e.target.value)}
            value={data?.notes}
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

export default RequestFinanceModal;
