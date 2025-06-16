"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { getGrades } from "@/apiServices/shared";
import { createSampleRequest } from "@/apiServices/user";
import { Calendar as CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

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
interface SampleRequestModalProps {
  className?: string;
  productId: string;
  uom: string;
}

const SampleRequestModal = ({
  className,
  productId,
  uom,
}: SampleRequestModalProps) => {
  const token = Cookies.get("token");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    product: productId,
    quantity: "",
    uom: uom,
    streetName: "",
    address: "",
    postCode: "",
    city: "",
    country: "",
    grade: "",
    application: "",
    expected_annual_volume: "",
    orderDate: undefined as Date | undefined,
    samplePrice: "",
    forFree: false,
    neededBy: "",
    message: "",
    request_document: "",
  });
  const [grades, setGrades] = useState<Grade[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarOpen2, setCalendarOpen2] = useState(false);

  const handletrigger = () => {
    if (token) {
      setOpen(true);
      Promise.all([getGrades()])
        .then(([gradesRes]) => {
          setGrades(gradesRes.data);
        })
        .catch((err) => {
          console.error("Error fetching dropdowns", err);
        });
    } else {
      toast.error("Please login to request a sample.");
      setOpen(false);
      router.push("/auth/login");
    }
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
    if (!data?.streetName) errors.push("Please enter the street name");
    if (!data?.address) errors.push("Please enter the address");
    if (!data?.postCode) errors.push("Please enter the postal code");
    if (!data?.city) errors.push("Please enter the city");
    if (!data?.country) errors.push("Please enter the country");

    // If any validation errors exist, show all and exit
    if (errors.length > 0) {
      toast.dismiss(toastId); // Close loading toast
      errors.forEach((err) => toast.error(err)); // Show all error toasts
      return;
    }

    try {
      // Proceed with the request if no errors
      createSampleRequest(data).then((response) => {
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
        <button className={className}>Request for Sample</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-[#f5f5f5] md:max-h-none md:overflow-visible ">
        <DialogHeader>
          <DialogTitle className="text-3xl">Request For Sample</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <div className="flex gap-2">
            <div className="relative w-full">
              <Input
                placeholder="Enter the Quantity"
                className="pr-16 bg-white w-full"
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

          <Input
            placeholder="Expected Annual Quantity"
            className="bg-white w-full"
            type="number"
            onChange={(e) =>
              onFieldChange("expected_annual_volume", e.target.value)
            }
            value={data?.expected_annual_volume}
          />

          <Textarea
            placeholder="What will this product be used for?"
            className="col-span-1 lg:col-span-2 bg-white w-full"
            onChange={(e) => onFieldChange("application", e.target.value)}
            value={data?.application}
          />

          <Popover open={calendarOpen2} onOpenChange={setCalendarOpen2}>
            <PopoverTrigger asChild>
              <div className="relative w-full">
                <Input
                  readOnly
                  value={
                    data?.neededBy
                      ? new Date(data?.neededBy).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      : ""
                  }
                  placeholder="Needed By"
                  className="bg-white cursor-pointer w-full pr-10"
                />
                <CalendarIcon
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={18}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar
                mode="single"
                selected={data?.neededBy ? new Date(data.neededBy) : undefined}
                onSelect={(date) => {
                  onFieldChange("neededBy", date);
                  setCalendarOpen2(false);
                }}
              />
            </PopoverContent>
          </Popover>

          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <div className="relative w-full">
                <Input
                  readOnly
                  value={
                    data?.orderDate
                      ? new Date(data?.orderDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      : "When do you plan to order?"
                  }
                  className="bg-white cursor-pointer w-full pr-10" // add padding for icon space
                />
                <CalendarIcon
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={18}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Calendar
                mode="single"
                selected={data?.orderDate}
                onSelect={(date) => {
                  onFieldChange("orderDate", date);
                  setCalendarOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>

          <Input
            placeholder="Enter Street Name"
            className="bg-white w-full"
            type="text"
            onChange={(e) => onFieldChange("streetName", e.target.value)}
            value={data?.streetName}
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
            placeholder="Enter Country"
            className="bg-white w-full"
            type="text"
            onChange={(e) => onFieldChange("country", e.target.value)}
            value={data?.country}
          />

          <Textarea
            placeholder="Enter Address"
            className="bg-white col-span-1 lg:col-span-2 w-full"
            onChange={(e) => onFieldChange("address", e.target.value)}
            value={data?.address}
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
          <DialogClose asChild>
            <Button
              variant={"outline"}
              className="border border-[var(--green-main)] text-[var(--green-main)] rounded-lg hover:bg-green-50 transition hover:text-[var(--green-main)]"
            >
              Cancel
            </Button>
          </DialogClose>
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

export default SampleRequestModal;
