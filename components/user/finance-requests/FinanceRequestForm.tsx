import React, { useMemo } from 'react';
import { getCountryList } from '@/lib/useCountries';
import { ProductSelectionSection } from '@/components/user/finance-requests/ProductSelectionSection';
import { PricingCalculator } from '@/components/user/finance-requests/PricingCalculator';
import { ProductDetailsFields } from '@/components/user/finance-requests/ProductDetailsFields';
import { DeliveryLogisticsSection } from '@/components/user/finance-requests/DeliveryLogisticsSection';
import { SubmitSection } from '@/components/user/finance-requests/SubmitSection';
import { FinanceFormData, Product } from '@/types/finance';

interface FinanceRequestFormProps {
  formData: FinanceFormData;
  inputValues: {
    estimatedPrice: string;
    notes: string;
    productGrade: string;
    destination: string;
    previousPurchaseHistory: string;
    additionalNotes: string;
  };
  productOptions: Array<{
    _id: string;
    name: string;
    grade?: string;
    company?: string;
  }>;
  selectedProduct: Product | null;
  loadingProducts: boolean;
  isSubmitting: boolean;
  calculateMonthlyEMI: string;
  onProductChange: (productId: string) => void;
  onQuantityChange: (qty: number) => void;
  onEmiMonthsChange: (months: number) => void;
  onPriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPriceBlur: () => void;
  onProductGradeChange: (value: string) => void;
  onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onDeliveryDateChange: (date: Date | undefined) => void;
  onDestinationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCountryChange: (value: string) => void;
  onPaymentTermsChange: (value: string) => void;
  onLogisticsChange: (value: string) => void;
  onPreviousPurchaseChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAdditionalNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const FinanceRequestForm: React.FC<FinanceRequestFormProps> = ({
  formData,
  inputValues,
  productOptions,
  selectedProduct,
  loadingProducts,
  isSubmitting,
  calculateMonthlyEMI,
  onProductChange,
  onQuantityChange,
  onEmiMonthsChange,
  onPriceChange,
  onPriceBlur,
  onProductGradeChange,
  onNotesChange,
  onDeliveryDateChange,
  onDestinationChange,
  onCountryChange,
  onPaymentTermsChange,
  onLogisticsChange,
  onPreviousPurchaseChange,
  onAdditionalNotesChange,
  onSubmit,
}) => {
  const countries = useMemo(() => getCountryList(), []);

  const emiMonthsOptions = useMemo(() => [
    { _id: '3', name: '3 months' },
    { _id: '6', name: '6 months' },
    { _id: '9', name: '9 months' },
    { _id: '12', name: '12 months' },
    { _id: '18', name: '18 months' },
    { _id: '24', name: '24 months' },
    { _id: '36', name: '36 months' },
    { _id: '48', name: '48 months' },
    { _id: '60', name: '60 months' },
  ], []);

  const paymentTermsOptions = useMemo(() => [
    { _id: 'advance', name: 'Advance Payment' },
    { _id: 'net30', name: 'Net 30 Days' },
    { _id: 'net60', name: 'Net 60 Days' },
    { _id: 'net90', name: 'Net 90 Days' },
    { _id: 'cod', name: 'Cash on Delivery' },
    { _id: 'lc', name: 'Letter of Credit' },
  ], []);

  const logisticsOptions = useMemo(() => [
    { _id: 'Yes', name: 'Yes' },
    { _id: 'No', name: 'No' },
  ], []);

  const countryOptions = useMemo(() => 
    countries.map(c => ({ _id: c.name, name: c.name })),
  [countries]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
        <h2 className="text-base font-semibold text-gray-900">Finance Request Details</h2>
        <p className="text-gray-600 text-sm mt-0.5">
          Fill in the details below to submit your finance request
        </p>
      </div>

      <form onSubmit={onSubmit} className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <ProductSelectionSection
              productOptions={productOptions}
              selectedProductId={formData.productId}
              quantity={formData.quantity}
              selectedProductUom={selectedProduct?.uom}
              emiMonths={formData.emiMonths}
              emiMonthsOptions={emiMonthsOptions}
              loadingProducts={loadingProducts}
              onProductChange={onProductChange}
              onQuantityChange={onQuantityChange}
              onEmiMonthsChange={onEmiMonthsChange}
            />

            <PricingCalculator
              estimatedPrice={formData.estimatedPrice}
              estimatedPriceInput={inputValues.estimatedPrice}
              monthlyEMI={calculateMonthlyEMI}
              onPriceChange={onPriceChange}
              onPriceBlur={onPriceBlur}
            />

            <ProductDetailsFields
              productGrade={formData.productGrade}
              notes={inputValues.notes}
              onProductGradeChange={onProductGradeChange}
              onNotesChange={onNotesChange}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <DeliveryLogisticsSection
              desiredDeliveryDate={formData.desiredDeliveryDate}
              destination={inputValues.destination}
              country={formData.country}
              paymentTerms={formData.paymentTerms}
              requireLogisticsSupport={formData.requireLogisticsSupport}
              previousPurchaseHistory={inputValues.previousPurchaseHistory}
              additionalNotes={inputValues.additionalNotes}
              countryOptions={countryOptions}
              paymentTermsOptions={paymentTermsOptions}
              logisticsOptions={logisticsOptions}
              onDeliveryDateChange={onDeliveryDateChange}
              onDestinationChange={onDestinationChange}
              onCountryChange={onCountryChange}
              onPaymentTermsChange={onPaymentTermsChange}
              onLogisticsChange={onLogisticsChange}
              onPreviousPurchaseChange={onPreviousPurchaseChange}
              onAdditionalNotesChange={onAdditionalNotesChange}
            />
          </div>
        </div>

        <SubmitSection
          isSubmitting={isSubmitting}
          isFormValid={!!formData.productId && !!inputValues.notes.trim()}
          onSubmit={onSubmit}
        />
      </form>
    </div>
  );
};
