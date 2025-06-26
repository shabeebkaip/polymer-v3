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
interface SampleRequestModalProps {
  className?: string;
  productId: string;
  uom: string;
  buttonText?: string;
  children?: React.ReactNode;
}

const SampleRequestModal = ({
  className,
  productId,
  uom,
  buttonText = "Request for Sample",
  children,
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
    neededBy: undefined as Date | undefined,
    samplePrice: "",
    forFree: false,
    message: "",
    request_document: "",
  });
  const [grades, setGrades] = useState<Grade[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarOpen2, setCalendarOpen2] = useState(false);

  const handletrigger = () => {
    if (token) {
      setOpen(true);
      getGrades()
        .then((gradesRes) => {
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
    const toastId = toast.loading("Creating Sample Request...");
    const errors: string[] = [];
    if (!data?.quantity) errors.push("Please enter the quantity");
    if (!data?.city) errors.push("Please enter the city");
    if (!data?.address) errors.push("Please enter the address");

    if (!data?.country) errors.push("Please enter the country");

    if (errors.length > 0) {
      toast.dismiss(toastId);
      errors.forEach((err) => toast.error(err));
      return;
    }

    try {
      createSampleRequest(data).then((response) => {
        toast.dismiss(toastId);
        toast.success("Sample request created successfully.");
        setOpen(false);
      });
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Something went wrong while creating the sample request.");
    }
  };

  return (
    <>
      <button className={className} onClick={handletrigger}>
        {children || buttonText}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-[#f5f5f5] md:max-h-none md:overflow-visible ">
          <DialogHeader>
            <DialogTitle className="text-3xl">Request For Sample</DialogTitle>
          </DialogHeader>
          {/* KEEP ONLY THIS GRID SECTION! */}
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

            {/* Needed By Calendar */}
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
                onFocus={() => setCalendarOpen2(true)}
              />
              <CalendarIcon
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />
              {calendarOpen2 && (
                <div className="absolute z-10 bg-white shadow-lg rounded-lg p-2">
                  <Calendar
                    mode="single"
                    selected={
                      data?.neededBy ? new Date(data.neededBy) : undefined
                    }
                    onSelect={(date) => {
                      onFieldChange("neededBy", date);
                      setCalendarOpen2(false);
                    }}
                  />
                </div>
              )}
            </div>
            {/* Order Date Calendar */}
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
                    : ""
                }
                className="bg-white cursor-pointer w-full pr-10"
                onFocus={() => setCalendarOpen(true)}
                placeholder="Expected Purchase Date"
              />
              <CalendarIcon
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />
              {
                calendarOpen && (
                  <div className="absolute z-10 bg-white shadow-lg rounded-lg p-2">
                    <Calendar
                      mode="single"
                      selected={
                        data?.orderDate ? new Date(data.orderDate) : undefined
                      }
                      onSelect={(date) => {
                        onFieldChange("orderDate", date);
                        setCalendarOpen(false);
                      }}
                    />
                  </div>
                )}

            </div>
            <Input
              placeholder="Enter City"
              className="bg-white w-full"
              type="text"
              onChange={(e) => onFieldChange("city", e.target.value)}
              value={data?.city}
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
          {/* END GRID SECTION */}
          {/* DO NOT REPEAT THE FIELDS BELOW */}

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
    </>
  );
};

export default SampleRequestModal;
