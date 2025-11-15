import React from "react";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Card, CardContent } from "../../ui/card";
import { uomDropdown } from "@/lib/utils";
import { ProductFormData, TradeInformationProps } from "@/types/product";
import MultiSelect from "@/components/shared/MultiSelect";
import { DropdownItem } from "@/types/shared";

const TradeInformation: React.FC<TradeInformationProps> = ({
  data,
  onFieldChange,
  incoterms = [],
  paymentTerms = [],
  error,
  onFieldError,
}) => {

  return (
    <>
      <div className="col-span-full mb-4 sm:mb-6">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-3 sm:p-4">
            <h4 className="text-base sm:text-lg font-semibold text-blue-800 mb-2">Trade & Pricing Information</h4>
            <p className="text-xs sm:text-sm text-blue-600">Set pricing, quantities, and trade terms</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <Label htmlFor="minimum_order_quantity" className="text-sm font-medium text-gray-700 flex items-center gap-1">
          Minimum Order Quantity
          <span className="text-red-500">*</span>
        </Label>
        <Input
          id="minimum_order_quantity"
          type="number"
          placeholder="Enter minimum order quantity"
          value={data.minimum_order_quantity ?? ""}
          onChange={(e) => {
            onFieldChange("minimum_order_quantity", e.target.value);
            onFieldError("minimum_order_quantity");
          }}
          error={error?.minimum_order_quantity ? true : false}
          helperText={error?.minimum_order_quantity}
          className={`transition-all duration-200 ${
            error?.minimum_order_quantity 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          }`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="stock" className="text-sm font-medium text-gray-700 flex items-center gap-1">
          Stock Quantity
          <span className="text-red-500">*</span>
        </Label>
        <Input
          id="stock"
          type="number"
          placeholder="Enter stock quantity"
          value={data.stock ?? ""}
          onChange={(e) => {
            onFieldChange("stock", e.target.value);
            onFieldError("stock");
          }}
          error={error?.stock ? true : false}
          helperText={error?.stock}
          className={`transition-all duration-200 ${
            error?.stock 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
          }`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="uom" className="text-sm font-medium text-gray-700 flex items-center gap-1">
          Unit of Measurement
          <span className="text-red-500">*</span>
        </Label>
        <Select
          value={data.uom}
          onValueChange={(val) => {
            onFieldChange("uom", val);
            onFieldError("uom");
          }}
        >
          <SelectTrigger 
            className={`transition-all duration-200 ${
              error?.uom 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }`}
          >
            <SelectValue placeholder="Select Unit of Measurement" />
          </SelectTrigger>
          <SelectContent>
            {uomDropdown.map((uom: string) => (
              <SelectItem key={uom} value={uom}>
                {uom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error?.uom && (
          <p className="text-xs text-red-600 mt-1">{error.uom}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price" className="text-sm font-medium text-gray-700 flex items-center gap-1">
          Price per Unit
          <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="Enter price per unit"
            value={data.price ?? ""}
            onChange={(e) => {
              onFieldChange("price", e.target.value);
              onFieldError("price");
            }}
            error={error?.price ? true : false}
            helperText={error?.price}
            className={`pr-16 sm:pr-20 transition-all duration-200 ${
              error?.price 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
            }`}
          />
          <div className="absolute right-2 sm:right-3 top-2.5 text-xs sm:text-sm text-gray-500 pointer-events-none">
            USD / {data.uom || 'unit'}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
          Incoterms
          <span className="text-red-500">*</span>
        </Label>
        <MultiSelect
          label=""
          placeholder="Select Incoterms"
          options={incoterms}
          selected={data.incoterms || []}
          onChange={(selected) => {
            onFieldChange("incoterms", selected);
            onFieldError("incoterms");
          }}
        />
        {error?.incoterms && (
          <p className="text-xs text-red-600 mt-1">{error.incoterms}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">
          Payment Terms
          <span className="text-gray-400 text-xs ml-1">(Optional)</span>
        </Label>
        <Select
          value={typeof data.paymentTerms === 'string' ? data.paymentTerms : ''}
          onValueChange={(val) => onFieldChange("paymentTerms", val)}
        >
          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200">
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

      <div className="space-y-2">
        <Label htmlFor="priceTerms" className="text-sm font-medium text-gray-700">
          Price Terms
          <span className="text-gray-400 text-xs ml-1">(Optional)</span>
        </Label>
        <Select
          value={data.priceTerms}
          onValueChange={(val) =>
            onFieldChange("priceTerms", val as "fixed" | "negotiable")
          }
        >
          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200">
            <SelectValue placeholder="Select Price Terms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fixed">Fixed</SelectItem>
            <SelectItem value="negotiable">Negotiable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="leadTime" className="text-sm font-medium text-gray-700">
          Lead Time
          <span className="text-gray-400 text-xs ml-1">(Optional)</span>
        </Label>
        <div className="relative">
          <Input
            id="leadTime"
            type="number"
            placeholder="Enter lead time"
            value={data.leadTime ?? ""}
            onChange={(e) => onFieldChange("leadTime", e.target.value)}
            className="pr-16 border-gray-300 focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
          />
          <div className="absolute right-3 top-2.5 text-sm text-gray-500 pointer-events-none">
            days
          </div>
        </div>
      </div>
    </>
  );
};

export default TradeInformation;
