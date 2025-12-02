import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Card, CardContent } from '../../ui/card';
import { uomDropdown } from '@/lib/utils';
import { TradeInformationProps } from '@/types/product';
import MultiSelect from '@/components/shared/MultiSelect';
import SearchableSelect from '@/components/shared/SearchableSelect';

const TradeInformation: React.FC<TradeInformationProps> = ({
  data,
  onFieldChange,
  incoterms = [],
  paymentTerms = [],
  error,
  onFieldError,
}) => {
  const [moqError, setMoqError] = React.useState<string>('');
  const [stockError, setStockError] = React.useState<string>('');
  const [priceError, setPriceError] = React.useState<string>('');

  const validateNumber = (value: string, fieldName: string): string => {
    if (!value || value.trim() === '') return '';

    // Check if it's a valid number
    if (isNaN(Number(value)) || !/^\d*\.?\d*$/.test(value)) {
      return `${fieldName} must be a number`;
    }

    // Check if it's not negative
    if (Number(value) < 0) {
      return `${fieldName} cannot be negative`;
    }

    return '';
  };

  return (
    <>
      <div className="col-span-full">
        <Card className="border-gray-200 bg-white">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Trade & Pricing Information</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Set pricing, quantities, and trade terms
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="minimum_order_quantity"
                  className="text-xs font-medium text-gray-700 flex items-center gap-1"
                >
                  Minimum Order Quantity
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="minimum_order_quantity"
                  type="text"
                  placeholder="Enter minimum order quantity"
                  value={data.minimum_order_quantity ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const validationError = validateNumber(value, 'MOQ');
                    setMoqError(validationError);

                    if (!validationError) {
                      onFieldChange('minimum_order_quantity', value);
                      onFieldError('minimum_order_quantity');
                    }
                  }}
                  error={!!(moqError || error?.minimum_order_quantity)}
                  helperText={moqError || error?.minimum_order_quantity}
                  className={`h-9 text-sm ${
                    moqError || error?.minimum_order_quantity ? 'border-red-300' : ''
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="stock"
                  className="text-xs font-medium text-gray-700 flex items-center gap-1"
                >
                  Stock Quantity
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="stock"
                  type="text"
                  placeholder="e.g., 500"
                  value={data.stock || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    const validationError = validateNumber(value, 'Stock');
                    setStockError(validationError);

                    if (!validationError) {
                      onFieldChange('stock', value);
                      onFieldError('stock');
                    }
                  }}
                  error={!!(stockError || error?.stock)}
                  helperText={stockError || error?.stock}
                  className={`h-9 text-sm ${stockError || error?.stock ? 'border-red-300' : ''}`}
                />
              </div>

              <div className="space-y-1.5">
                <SearchableSelect
                  label="Unit of Measurement"
                  placeholder="Select Unit"
                  options={uomDropdown.map((uom) => ({ _id: uom, name: uom }))}
                  value={data.uom}
                  onChange={(val) => {
                    onFieldChange('uom', val);
                    onFieldError('uom');
                  }}
                  error={!!error?.uom}
                  helperText={error?.uom}
                  onFocus={() => onFieldError('uom')}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="price"
                  className="text-xs font-medium text-gray-700 flex items-center gap-1"
                >
                  Price per Unit
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="text"
                    placeholder="e.g., 1250"
                    value={data.price || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      const validationError = validateNumber(value, 'Price');
                      setPriceError(validationError);

                      if (!validationError) {
                        onFieldChange('price', value);
                        onFieldError('price');
                      }
                    }}
                    error={!!(priceError || error?.price)}
                    helperText={priceError || error?.price}
                    className={`pr-20 h-9 text-sm ${
                      priceError || error?.price ? 'border-red-300' : ''
                    }`}
                  />
                  <div className="absolute right-3 top-2 text-xs text-gray-500 pointer-events-none">
                    USD / {data.uom || 'unit'}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  Incoterms
                  <span className="text-red-500">*</span>
                </Label>
                <MultiSelect
                  label=""
                  placeholder="Select Incoterms"
                  options={incoterms}
                  selected={data.incoterms || []}
                  onChange={(selected) => {
                    onFieldChange('incoterms', selected);
                    onFieldError('incoterms');
                  }}
                />
                {error?.incoterms && <p className="text-xs text-red-600 mt-1">{error.incoterms}</p>}
              </div>

              <div className="space-y-1.5">
                <SearchableSelect
                  label="Payment Terms"
                  placeholder="Select Payment Terms"
                  options={paymentTerms}
                  value={typeof data.paymentTerms === 'string' ? data.paymentTerms : ''}
                  onChange={(val) => onFieldChange('paymentTerms', val)}
                />
              </div>

              <div className="space-y-1.5">
                <SearchableSelect
                  label="Price Terms"
                  placeholder="Select Price Terms"
                  options={[
                    { _id: 'fixed', name: 'Fixed' },
                    { _id: 'negotiable', name: 'Negotiable' },
                  ]}
                  value={data.priceTerms}
                  onChange={(val) => onFieldChange('priceTerms', val as 'fixed' | 'negotiable')}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="leadTime" className="text-xs font-medium text-gray-700">
                  Lead Time
                  <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="leadTime"
                    type="number"
                    placeholder="Enter lead time"
                    value={data.leadTime ?? ''}
                    onChange={(e) => onFieldChange('leadTime', e.target.value)}
                    className="pr-16 h-9 text-sm"
                  />
                  <div className="absolute right-3 top-2 text-xs text-gray-500 pointer-events-none">
                    days
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default TradeInformation;
