'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { createFinanceRequest } from '@/apiServices/user';
import { CreateFinanceHeader } from '@/components/user/finance-requests/CreateFinanceHeader';
import { FinanceRequestForm } from '@/components/user/finance-requests/FinanceRequestForm';
import { useFinanceForm } from '@/hooks/useFinanceForm';
import { useProductData } from '@/hooks/useProductData';

const CreateFinanceRequest = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    loadingProducts,
    selectedProduct,
    productOptions,
    handleProductChange: handleProductDataChange,
  } = useProductData(productId);

  const {
    formData,
    inputValues,
    handleInputChange,
    handlePriceInputChange,
    handleTextInputChange,
    handlePriceBlur,
    calculateMonthlyEMI,
    updateProductData,
    updateEstimatedPrice,
  } = useFinanceForm(productId, selectedProduct);

  // Update estimated price when product, quantity change
  useEffect(() => {
    if (selectedProduct?.pricePerUnit && formData.quantity) {
      const totalPrice = selectedProduct.pricePerUnit * formData.quantity;
      updateEstimatedPrice(totalPrice);
    }
  }, [selectedProduct, formData.quantity, updateEstimatedPrice]);

  const handleProductChange = (productId: string) => {
    const product = handleProductDataChange(productId);
    handleInputChange('productId', productId);
    updateProductData(product);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productId) {
      toast.error('Please select a product');
      return;
    }

    if (!formData.notes.trim()) {
      toast.error('Please provide notes about your finance request');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        desiredDeliveryDate: formData.desiredDeliveryDate?.toISOString(),
      };

      await createFinanceRequest(submitData);
      toast.success('Finance request submitted successfully!');
      router.push('/user/finance-requests');
    } catch (error) {
      const errMsg =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'message' in error.response.data
          ? (error.response.data.message as string)
          : undefined;
      console.error('Error submitting finance request:', error);
      toast.error(errMsg || 'Failed to submit finance request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <CreateFinanceHeader onBack={() => router.back()} />

        <FinanceRequestForm
          formData={formData}
          inputValues={inputValues}
          productOptions={productOptions}
          selectedProduct={selectedProduct}
          loadingProducts={loadingProducts}
          isSubmitting={isSubmitting}
          calculateMonthlyEMI={calculateMonthlyEMI}
          onProductChange={handleProductChange}
          onQuantityChange={(qty) => handleInputChange('quantity', qty)}
          onEmiMonthsChange={(months) => handleInputChange('emiMonths', months)}
          onPriceChange={handlePriceInputChange}
          onPriceBlur={handlePriceBlur}
          onProductGradeChange={(value) => handleInputChange('productGrade', value)}
          onNotesChange={handleTextInputChange('notes')}
          onDeliveryDateChange={(date) => handleInputChange('desiredDeliveryDate', date)}
          onDestinationChange={handleTextInputChange('destination')}
          onCountryChange={(value) => handleInputChange('country', value)}
          onPaymentTermsChange={(value) => handleInputChange('paymentTerms', value)}
          onLogisticsChange={(value) => handleInputChange('requireLogisticsSupport', value)}
          onPreviousPurchaseChange={handleTextInputChange('previousPurchaseHistory')}
          onAdditionalNotesChange={handleTextInputChange('additionalNotes')}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default function FinanceRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-gray-600">
          Loading...
        </div>
      }
    >
      <CreateFinanceRequest />
    </Suspense>
  );
}
