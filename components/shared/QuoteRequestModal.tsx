"use client";
import React, { useState } from "react";
import countryCodesList from "country-codes-list";
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
import { Checkbox } from "@/components/ui/checkbox";
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

const QuoteRequestModal = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    product: "", // id
    quantity: "",
    uom: "KG",
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
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [incoterms, setIncoterms] = useState<Incoterm[]>([]);
  const [packagingTypes, setPackagingTypes] = useState<PackagingType[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [documents, setDocuments] = useState<{ sds: boolean; tds: boolean }>({
    sds: true,
    tds: false,
  });
  const countriesList: string[] = countryCodesList
    .all()
    .map((country) => country.countryNameEn);
  const handletrigger = () => {
    setOpen(true);
    getGrades().then((response) => {
      setGrades(response.data);
    });
    getIncoterms().then((response) => {
      setIncoterms(response.data);
    });
    getPackagingTypes().then((response) => {
      setPackagingTypes(response.data);
    });
  };
  console.log("grades");
  const onFieldChange = (field: string, value: string | Date | undefined) => {
    setData((prev) => ({
      ...prev,
      [field]: value instanceof Date ? value.toISOString() : value || "",
    }));
  };
  const handleSubmit = () => {
    
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={handletrigger}>
        <button>Request Quote</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-[#f5f5f5] md:max-h-none md:overflow-visible ">
        <DialogHeader>
          <DialogTitle className="text-3xl">Request Quote</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            So our team can reach out to you on time
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

          <Select>
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

          <Select
            value={data.country}
            onValueChange={(value) => onFieldChange("country", value)}
          >
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countriesList.map((country, index) => (
                <SelectItem key={index} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Enter City"
            className="bg-white"
            type="text"
            onChange={(e) => onFieldChange("city", e.target.value)}
            value={data?.city}
          />
          <Input
            placeholder="Enter Postal Code"
            className="bg-white"
            type="text"
            onChange={(e) => onFieldChange("postCode", e.target.value)}
            value={data?.postCode}
          />
          <Input
            placeholder="Enter Destination"
            className="bg-white"
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
            className="bg-white"
            type="text"
            onChange={(e) => onFieldChange("packaging_size", e.target.value)}
            value={data?.packaging_size}
          />

          <div className="relative w-full">
            <Input
              placeholder="Expecte Annual Quantity"
              className=" bg-white"
              type="number"
              onChange={(e) =>
                onFieldChange("expected_annual_volume", e.target.value)
              }
              value={data?.expected_annual_volume}
            />
          </div>

          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Input
                readOnly
                value={
                  data?.delivery_date
                    ? format(data?.delivery_date, "MMM dd, yyyy")
                    : "Select Delivery Date"
                }
                className="bg-white cursor-pointer"
              />
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
            className="bg-white"
            type="number"
            onChange={(e) => onFieldChange("pricing", e.target.value)}
            value={data?.pricing}
          />

          <Textarea
            placeholder="What will this product be used for?"
            className="col-span-2 bg-white"
            onChange={(e) => onFieldChange("application", e.target.value)}
            value={data?.application}
          />

          <Textarea
            placeholder="Add additional information to the supplier"
            className="col-span-2 bg-white"
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
