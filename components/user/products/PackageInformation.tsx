import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Card, CardContent } from '../../ui/card';
import { Package } from 'lucide-react';
import MultiSelect from '@/components/shared/MultiSelect';
import { PackageInformationProps } from '@/types/product';

const PackageInformation: React.FC<PackageInformationProps> = ({
  data,
  onFieldChange,
  packagingTypes = [],
  clearAiField,
}) => {
  return (
    <>
      {/* Packaging Details */}
      <div className="col-span-full">
        <Card className="border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Package aria-hidden="true" className="w-4 h-4 text-gray-700" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    Package & Storage Information
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Define packaging specifications and storage requirements
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                Optional
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label id="packagingType-label" htmlFor="packagingType" className="text-xs font-medium text-gray-700">Packaging Type</Label>
                <MultiSelect
                  id="packagingType"
                  ariaLabelledby="packagingType-label"
                  label=""
                  placeholder="Select packaging types"
                  options={packagingTypes}
                  selected={data.packagingType || []}
                  onChange={(selected) => { clearAiField?.('packagingType'); onFieldChange('packagingType', selected); }}
                />
                <p className="text-xs text-gray-500">e.g., Bags, Drums, Bulk containers</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="packagingWeight" className="text-xs font-medium text-gray-700">
                  Package Weight
                </Label>
                <div className="relative">
                  <Input
                    id="packagingWeight"
                    type="text"
                    placeholder="e.g., 25 kg"
                    value={data.packagingWeight || ''}
                    onChange={(e) => { clearAiField?.('packagingWeight'); onFieldChange('packagingWeight', e.target.value); }}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => { clearAiField?.('packagingWeight'); onFieldChange('packagingWeight', '25'); }}
                    className="min-h-[44px] px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
                  >
                    25 kg
                  </button>
                  <button
                    type="button"
                    onClick={() => { clearAiField?.('packagingWeight'); onFieldChange('packagingWeight', '50'); }}
                    className="min-h-[44px] px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
                  >
                    50 kg
                  </button>
                  <button
                    type="button"
                    onClick={() => { clearAiField?.('packagingWeight'); onFieldChange('packagingWeight', '200'); }}
                    className="min-h-[44px] px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
                  >
                    200 kg
                  </button>
                  <button
                    type="button"
                    onClick={() => { clearAiField?.('packagingWeight'); onFieldChange('packagingWeight', '1000'); }}
                    className="min-h-[44px] px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2"
                  >
                    1000 kg
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="storageConditions" className="text-xs font-medium text-gray-700">
                  Storage Conditions
                </Label>
                <Input
                  id="storageConditions"
                  placeholder="e.g., Cool, dry place at 15-25°C"
                  value={data.storageConditions || ''}
                  onChange={(e) => { clearAiField?.('storageConditions'); onFieldChange('storageConditions', e.target.value); }}
                  className="h-9 text-sm"
                />
                <p className="text-xs text-gray-500">Temperature, humidity requirements</p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="shelfLife" className="text-xs font-medium text-gray-700">
                  Shelf Life
                </Label>
                <div className="relative">
                  <Input
                    id="shelfLife"
                    placeholder="e.g., 24 months"
                    value={data.shelfLife || ''}
                    onChange={(e) => { clearAiField?.('shelfLife'); onFieldChange('shelfLife', e.target.value); }}
                    className="pe-16 h-9 text-sm"
                  />
                  <div dir="ltr" className="absolute end-3 top-2 text-xs text-gray-500 pointer-events-none">
                    months
                  </div>
                </div>
                <p className="text-xs text-gray-500">Under recommended storage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PackageInformation;
