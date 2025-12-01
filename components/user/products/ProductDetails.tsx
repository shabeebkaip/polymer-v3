import React from 'react';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Card, CardContent } from '../../ui/card';
import { ProductDetailsProps } from '@/types/product';
import MultiSelect from '@/components/shared/MultiSelect';
import SearchableSelect from '@/components/shared/SearchableSelect';

const ProductDetails: React.FC<ProductDetailsProps> = ({
  data,
  onFieldChange,
  chemicalFamilies,
  polymersTypes,
  industry,
  physicalForms,
  productFamilies,
  onFieldError,
  error,
}) => {
  return (
    <>
      <div className="col-span-full">
        <Card className="border-gray-200 bg-white">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Technical Specifications</h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  Define the technical characteristics and categories
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <SearchableSelect
                  label="Chemical Family"
                  placeholder="Select Chemical Family"
                  options={[...chemicalFamilies, { _id: 'other', name: 'Other' }]}
                  value={data.chemicalFamily || ''}
                  onChange={(val) => {
                    onFieldChange('chemicalFamily', val);
                    onFieldError('chemicalFamily');
                  }}
                  error={!!error.chemicalFamily}
                  helperText={error.chemicalFamily}
                  onFocus={() => onFieldError('chemicalFamily')}
                />
                {data.chemicalFamily === 'other' && (
                  <Input
                    placeholder="Specify chemical family"
                    value={data.chemicalFamilyOther || ''}
                    onChange={(e) => onFieldChange('chemicalFamilyOther', e.target.value)}
                    className="mt-2 h-9 text-sm"
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <SearchableSelect
                  label="Polymer Type"
                  placeholder="Select Polymer Type"
                  options={[...polymersTypes, { _id: 'other', name: 'Other' }]}
                  value={data.polymerType || ''}
                  onChange={(val) => {
                    onFieldChange('polymerType', val);
                    onFieldError('polymerType');
                  }}
                  error={!!error.polymerType}
                  helperText={error.polymerType}
                  onFocus={() => onFieldError('polymerType')}
                />
                {data.polymerType === 'other' && (
                  <Input
                    placeholder="Specify polymer type"
                    value={data.polymerTypeOther || ''}
                    onChange={(e) => onFieldChange('polymerTypeOther', e.target.value)}
                    className="mt-2 h-9 text-sm"
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <SearchableSelect
                  label="Physical Form"
                  placeholder="Select Physical Form"
                  options={[...physicalForms, { _id: 'other', name: 'Other' }]}
                  value={data.physicalForm || ''}
                  onChange={(val) => {
                    onFieldChange('physicalForm', val);
                    onFieldError('physicalForm');
                  }}
                  error={!!error.physicalForm}
                  helperText={error.physicalForm}
                  onFocus={() => onFieldError('physicalForm')}
                />
                {data.physicalForm === 'other' && (
                  <Input
                    placeholder="Specify physical form"
                    value={data.physicalFormOther || ''}
                    onChange={(e) => onFieldChange('physicalFormOther', e.target.value)}
                    className="mt-2 h-9 text-sm"
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                  Industries
                  <span className="text-red-500">*</span>
                </Label>
                <MultiSelect
                  label=""
                  placeholder="Select Industries"
                  options={industry}
                  selected={data.industry || []}
                  onChange={(selected) => {
                    onFieldChange('industry', selected);
                    onFieldError('industry');
                  }}
                />
                {error.industry && <p className="text-xs text-red-600 mt-1">{error.industry}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-700">
                  Product Families
                  <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                </Label>
                <MultiSelect
                  label=""
                  placeholder="Select Product Families"
                  options={productFamilies}
                  selected={data.product_family || []}
                  onChange={(selected) => {
                    onFieldChange('product_family', selected);
                    onFieldError('product_family');
                  }}
                />
                {error.product_family && (
                  <p className="text-xs text-red-600 mt-1">{error.product_family}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="manufacturingMethod" className="text-xs font-medium text-gray-700">
                  Manufacturing Method
                  <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                </Label>
                <Input
                  id="manufacturingMethod"
                  placeholder="e.g., Injection Molding"
                  value={data.manufacturingMethod || ''}
                  onChange={(e) => onFieldChange('manufacturingMethod', e.target.value)}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="countryOfOrigin" className="text-xs font-medium text-gray-700">
                  Country of Origin
                  <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                </Label>
                <Input
                  id="countryOfOrigin"
                  placeholder="e.g., Saudi Arabia"
                  value={data.countryOfOrigin || ''}
                  onChange={(e) => onFieldChange('countryOfOrigin', e.target.value)}
                  className="h-9 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="color" className="text-xs font-medium text-gray-700">
                  Color
                  <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                </Label>
                <Input
                  id="color"
                  placeholder="e.g., Natural, White"
                  value={data.color || ''}
                  onChange={(e) => onFieldChange('color', e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProductDetails;
