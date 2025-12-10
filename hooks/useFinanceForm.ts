import { useState, useCallback, useMemo } from 'react';
import { FinanceFormData, Product } from '@/types/finance';

export const useFinanceForm = (productId: string | null, selectedProduct: Product | null) => {
  const [formData, setFormData] = useState<FinanceFormData>({
    productId: productId || '',
    emiMonths: 12,
    quantity: 1,
    estimatedPrice: 0,
    notes: '',
    productGrade: '',
    desiredDeliveryDate: undefined,
    destination: '',
    paymentTerms: '',
    requireLogisticsSupport: 'No',
    previousPurchaseHistory: '',
    additionalNotes: '',
    country: '',
  });

  const [inputValues, setInputValues] = useState({
    estimatedPrice: '',
    notes: '',
    productGrade: '',
    destination: '',
    previousPurchaseHistory: '',
    additionalNotes: '',
  });

  const handleInputChange = useCallback(
    (field: keyof FinanceFormData, value: string | number | boolean | Date | undefined) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handlePriceInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValues((prev) => ({ ...prev, estimatedPrice: value }));

    const cleanValue = value.replace(/[^0-9.]/g, '');
    const parts = cleanValue.split('.');
    const formattedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleanValue;
    const numericValue = formattedValue === '' ? 0 : parseFloat(formattedValue) || 0;

    setFormData((prev) => ({ ...prev, estimatedPrice: numericValue }));
  }, []);

  const handleTextInputChange = useCallback(
    (field: keyof typeof inputValues) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInputValues((prev) => ({ ...prev, [field]: value }));
        setFormData((prev) => ({ ...prev, [field]: value }));
      },
    []
  );

  const handlePriceBlur = useCallback(() => {
    if (formData.estimatedPrice > 0) {
      const formatted = parseFloat(formData.estimatedPrice.toString()).toFixed(2);
      const formattedValue = parseFloat(formatted);
      setFormData((prev) => ({
        ...prev,
        estimatedPrice: formattedValue,
      }));
      setInputValues((prev) => ({
        ...prev,
        estimatedPrice: formattedValue.toString(),
      }));
    }
  }, [formData.estimatedPrice]);

  const calculateMonthlyEMI = useMemo(() => {
    if (formData.estimatedPrice && formData.emiMonths) {
      return (formData.estimatedPrice / formData.emiMonths).toFixed(2);
    }
    return '0.00';
  }, [formData.estimatedPrice, formData.emiMonths]);

  const updateProductData = useCallback((product: Product | null) => {
    if (product) {
      setFormData((prev) => ({
        ...prev,
        productGrade: product?.grade?.name || '',
      }));
      setInputValues((prev) => ({
        ...prev,
        productGrade: product?.grade?.name || '',
      }));
    }
  }, []);

  const updateEstimatedPrice = useCallback((price: number) => {
    const priceString = price.toString();
    setFormData((prev) => ({ ...prev, estimatedPrice: price }));
    setInputValues((prev) => ({ ...prev, estimatedPrice: priceString }));
  }, []);

  return {
    formData,
    inputValues,
    handleInputChange,
    handlePriceInputChange,
    handleTextInputChange,
    handlePriceBlur,
    calculateMonthlyEMI,
    updateProductData,
    updateEstimatedPrice,
  };
};
