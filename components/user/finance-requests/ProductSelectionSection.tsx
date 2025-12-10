'use client';

import { Package, Calculator } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SearchableDropdown } from '@/components/shared/SearchableDropdown';
import { DropdownOption } from '@/types/shared';

interface ProductSelectionSectionProps {
  productOptions: DropdownOption[];
  selectedProductId: string;
  quantity: number;
  selectedProductUom?: string;
  emiMonths: number;
  emiMonthsOptions: DropdownOption[];
  loadingProducts: boolean;
  onProductChange: (productId: string) => void;
  onQuantityChange: (quantity: number) => void;
  onEmiMonthsChange: (months: number) => void;
}

export function ProductSelectionSection({
  productOptions,
  selectedProductId,
  quantity,
  selectedProductUom,
  emiMonths,
  emiMonthsOptions,
  loadingProducts,
  onProductChange,
  onQuantityChange,
  onEmiMonthsChange,
}: ProductSelectionSectionProps) {
  return (
    <div className="space-y-4">
      {/* Product Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <Package className="w-4 h-4 inline mr-1.5 text-primary-600" />
          Select Product *
        </label>
        <SearchableDropdown
          options={productOptions}
          value={selectedProductId}
          onValueChange={onProductChange}
          placeholder={loadingProducts ? 'Loading products...' : 'Choose a product'}
          searchPlaceholder="Search products..."
          emptyText="No products found"
          disabled={loadingProducts}
          loading={loadingProducts}
          className="h-10"
        />
      </div>

      {/* Quantity and EMI Months Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            <Package className="w-4 h-4 inline mr-1.5 text-primary-600" />
            Quantity *
          </label>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
            className="h-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Enter quantity"
          />
          {selectedProductUom && (
            <p className="text-sm text-gray-500 mt-1">Unit: {selectedProductUom}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            <Calculator className="w-4 h-4 inline mr-1.5 text-primary-600" />
            EMI Months *
          </label>
          <SearchableDropdown
            options={emiMonthsOptions}
            value={emiMonths.toString()}
            onValueChange={(value) => onEmiMonthsChange(parseInt(value))}
            placeholder="Select EMI months"
            searchPlaceholder="Search months..."
            emptyText="No options found"
            allowClear={false}
            className="h-10"
          />
        </div>
      </div>
    </div>
  );
}
