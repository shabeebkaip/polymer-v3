"use client";
import React, { useState } from "react";
import { useDropdowns } from "@/lib/useDropdowns";
import GeneralInformation from "./products/GeneralInformation";
import ProductDetails from "./products/ProductDetails";
import ProductImages from "./products/ProductImages";
import TechnicalProperties from "./products/TechnicalProperties";
import TradeInformation from "./products/TradeInformation";
import PackageInformation from "./products/PackageInformation";
import Environmental from "./products/Environmental";
import Certification from "./products/Certifications";
import Documents from "./products/Documents";
import { ProductFormData } from "@/types/product";
import type { UploadedFile } from "@/types/product";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ChevronLeft, ChevronRight, Save, RotateCcw, CheckCircle, Package, Settings, Image, FileText, Truck, Box, Leaf, Shield, Upload } from "lucide-react";
import { createProduct, updateProduct } from "@/apiServices/products";
import { initialFormData } from "@/apiServices/constants/userProductCrud";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// 🛠️ Interface to type the error state
type ValidationErrors = Partial<Record<keyof ProductFormData, string>>;
interface RequiredField {
  field: keyof ProductFormData;
  label: string;
}

// Form steps configuration
const FORM_STEPS = [
  {
    id: 1,
    title: "General Information",
    description: "Basic product details",
    icon: Package,
    component: "general"
  },
  {
    id: 2,
    title: "Product Details", 
    description: "Technical specifications",
    icon: Settings,
    component: "details"
  },
  {
    id: 3,
    title: "Product Images",
    description: "Upload product photos",
    icon: Image,
    component: "images"
  },
  {
    id: 4,
    title: "Technical Properties",
    description: "Material properties",
    icon: FileText,
    component: "technical"
  },
  {
    id: 5,
    title: "Trade Information",
    description: "Pricing & terms",
    icon: Truck,
    component: "trade"
  },
  {
    id: 6,
    title: "Package Information",
    description: "Packaging details",
    icon: Box,
    component: "package"
  },
  {
    id: 7,
    title: "Environmental",
    description: "Environmental data",
    icon: Leaf,
    component: "environmental"
  },
  {
    id: 8,
    title: "Certifications",
    description: "Quality certifications",
    icon: Shield,
    component: "certification"
  },
  {
    id: 9,
    title: "Documents",
    description: "Supporting documents",
    icon: Upload,
    component: "documents"
  }
];
interface AddEditProductProps {
  product?: ProductFormData;
  id?: string;
}

const AddEditProduct = ({ product, id }: AddEditProductProps) => {
  const router = useRouter();
  const isEditMode = id ? true : false;

  const {
    chemicalFamilies,
    polymersTypes,
    industry,
    physicalForms,
    packagingTypes,
    grades,
    incoterms,
    paymentTerms,
    productFamilies,
  } = useDropdowns();

  const [data, setData] = useState<ProductFormData>(
    product ? product : initialFormData
  );
  const [error, setError] = useState<ValidationErrors>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const onFieldChange = (key: keyof ProductFormData, value: string | number | boolean | UploadedFile[] | undefined) => {
    setData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const onFieldError = (key: keyof ProductFormData) => {
    setError((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  // Navigation helpers
  const nextStep = () => {
    if (currentStep < FORM_STEPS.length) {
      setCompletedSteps(prev => new Set(prev).add(currentStep));
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const resetForm = () => {
    setData(initialFormData);
    setError({});
    setCurrentStep(1);
    setCompletedSteps(new Set());
  };

  // Helper function to get fields for each step
  const getStepFields = (stepComponent: string): (keyof ProductFormData)[] => {
    switch (stepComponent) {
      case 'general':
        return ['productName', 'chemicalName', 'tradeName'];
      case 'details':
        return ['chemicalFamily', 'product_family', 'polymerType', 'physicalForm', 'industry'];
      case 'images':
        return ['productImages'];
      case 'technical':
        return ['density', 'mfi', 'tensileStrength'];
      case 'trade':
        return ['minimum_order_quantity', 'stock', 'uom', 'price', 'incoterms', 'paymentTerms'];
      case 'package':
        return ['packagingType', 'packagingWeight'];
      case 'environmental':
        return ['recyclable', 'bioDegradable'];
      case 'certification':
        return ['fdaApproved', 'medicalGrade'];
      case 'documents':
        return ['safety_data_sheet', 'technical_data_sheet', 'certificate_of_analysis'];
      default:
        return [];
    }
  };

  const handleSubmit = () => {
    const toastId = toast.loading(
      isEditMode ? "Updating Product" : "Creating product..."
    );
    const validationErrors: ValidationErrors = {};

    // For edit mode, only validate required fields if they're completely empty
    // For create mode, validate all required fields strictly
    const requiredFields: RequiredField[] = [
      { field: "productName", label: "Product Name" },
      { field: "chemicalName", label: "Chemical Name" },
      { field: "tradeName", label: "Trade Name" },
      { field: "chemicalFamily", label: "Chemical Family" },
      { field: "product_family", label: "Product Family" },
      { field: "polymerType", label: "Polymer Type" },
      { field: "physicalForm", label: "Physical Form" },
      { field: "minimum_order_quantity", label: "Minimum Order Quantity" },
      { field: "stock", label: "Stock" },
      { field: "uom", label: "UOM" },
      { field: "price", label: "Price" },
    ];

    if (!isEditMode) {
      // Strict validation for new products - ALL required fields
      requiredFields.forEach(({ field, label }) => {
        const value = data[field];
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          validationErrors[field] = `${label} is required`;
        }
      });

      if (data.industry.length === 0) {
        validationErrors.industry = "At least one industry must be selected";
      }

      if (data.incoterms.length === 0) {
        validationErrors.incoterms = "At least one incoterm must be selected";
      }

      if (data.productImages.length === 0) {
        validationErrors.productImages = "At least one product image is required";
      }
    } else {
      // Smart validation for editing - validate core business fields
      const coreRequiredFields = [
        { field: "productName", label: "Product Name" },
        { field: "chemicalName", label: "Chemical Name" },
        { field: "tradeName", label: "Trade Name" },
        { field: "chemicalFamily", label: "Chemical Family" },
        { field: "polymerType", label: "Polymer Type" },
        { field: "physicalForm", label: "Physical Form" },
        { field: "price", label: "Price" },
        { field: "uom", label: "Unit of Measure" }
      ];

      coreRequiredFields.forEach(({ field, label }) => {
        const value = data[field];
        if (!value || value === "" || (Array.isArray(value) && value.length === 0)) {
          validationErrors[field] = `${label} is required`;
        }
      });

      // Validate at least one industry for business logic
      if (data.industry.length === 0) {
        validationErrors.industry = "At least one industry must be selected";
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      console.warn("Validation errors:", validationErrors);
      
      const errorCount = Object.keys(validationErrors).length;
      const errorMessage = isEditMode 
        ? `Please fill in ${errorCount} required field${errorCount > 1 ? 's' : ''} to save changes`
        : `Please complete ${errorCount} required field${errorCount > 1 ? 's' : ''} to create the product`;
      
      toast.error(errorMessage, { id: toastId });

      setError(validationErrors);
      
      // Navigate to the first step that has errors
      const stepWithError = FORM_STEPS.find(step => {
        const stepFields = getStepFields(step.component);
        return stepFields.some((field: keyof ProductFormData) => validationErrors[field]);
      });
      
      if (stepWithError && stepWithError.id !== currentStep) {
        setCurrentStep(stepWithError.id);
        toast.info(`Navigated to ${stepWithError.title} section to fix errors`, {
          duration: 3000
        });
      }
      
      return;
    }

    // Format data according to backend schema requirements
    const formatDataForAPI = (formData: ProductFormData) => {
      const formatted = { ...formData } as Record<string, unknown>;

      // Convert price from string to number (required in schema)
      if (formatted.price) {
        formatted.price = Number(formatted.price);
      }

      // Ensure leadTime is a string (keep as-is if already string)
      if (formatted.leadTime && typeof formatted.leadTime !== 'string') {
        formatted.leadTime = String(formatted.leadTime);
      }

      // Fix paymentTerms - should be single ObjectId, not array
      if (Array.isArray(formatted.paymentTerms) && formatted.paymentTerms.length > 0) {
        formatted.paymentTerms = formatted.paymentTerms[0]; // Take first selected payment term
      } else if (Array.isArray(formatted.paymentTerms)) {
        delete formatted.paymentTerms; // Remove if empty array
      }

      // Convert document arrays to single objects (backend expects objects, not arrays)
      if (Array.isArray(formatted.safety_data_sheet)) {
        formatted.safety_data_sheet = formatted.safety_data_sheet.length > 0 
          ? formatted.safety_data_sheet[0] 
          : undefined;
      }

      if (Array.isArray(formatted.technical_data_sheet)) {
        formatted.technical_data_sheet = formatted.technical_data_sheet.length > 0 
          ? formatted.technical_data_sheet[0] 
          : undefined;
      }

      if (Array.isArray(formatted.certificate_of_analysis)) {
        formatted.certificate_of_analysis = formatted.certificate_of_analysis.length > 0 
          ? formatted.certificate_of_analysis[0] 
          : undefined;
      }

      // Map frontend field names to backend schema field names
      const fieldMappings = {
        'melt_flow_index': 'mfi',
        'tensile_strength': 'tensileStrength',
        'elongation_at_break': 'elongationAtBreak',
        'shore_hardness': 'shoreHardness',
        'water_absorption': 'waterAbsorption'
      };

      Object.entries(fieldMappings).forEach(([frontendField, backendField]) => {
        if (formatted[frontendField] !== undefined) {
          formatted[backendField] = formatted[frontendField];
          delete formatted[frontendField];
        }
      });

      // Convert numeric string fields to numbers based on schema
      const numericFields = [
        'minimum_order_quantity', 'stock', 'density', 'mfi', 
        'tensileStrength', 'elongationAtBreak', 'shoreHardness', 'waterAbsorption'
      ];

      numericFields.forEach(field => {
        if (formatted[field] && typeof formatted[field] === 'string') {
          const numValue = Number(formatted[field]);
          if (!isNaN(numValue)) {
            formatted[field] = numValue;
          }
        }
      });

      // Handle packagingWeight - schema expects String, not Number
      if (formatted.packagingWeight && typeof formatted.packagingWeight === 'number') {
        formatted.packagingWeight = formatted.packagingWeight.toString();
      }

      // Ensure arrays are properly formatted for schema
      const arrayFields = ['industry', 'grade', 'incoterms', 'packagingType', 'product_family'];
      arrayFields.forEach(field => {
        if (formatted[field] && !Array.isArray(formatted[field])) {
          formatted[field] = [formatted[field]];
        } else if (!formatted[field]) {
          formatted[field] = [];
        }
      });

      // Remove fields that don't exist in schema or are empty
      const fieldsToRemove = [
        'melting_point', 'glass_transition_temperature', 'heat_deflection_temperature',
        'moisture_content', 'ash_content', 'dielectric_strength', 'volume_resistivity',
        'flexural_modulus', 'grades' // Remove 'grades' if it exists (should be 'grade')
      ];

      fieldsToRemove.forEach(field => {
        delete formatted[field];
      });

      // Remove empty strings, null, and undefined values
      Object.keys(formatted).forEach(key => {
        const value = formatted[key];
        if (value === '' || value === null || value === undefined || 
            (Array.isArray(value) && value.length === 0)) {
          delete formatted[key];
        }
      });

      return formatted;
    };

    const formattedData = formatDataForAPI(data);

    const apiCall = () =>
      isEditMode ? updateProduct(id as string, formattedData) : createProduct(formattedData);

    apiCall()
      .then((res) => {
        if (res?.success) {
          toast.success(
            isEditMode ? "Product updated successfully" : "Product created successfully", 
            { id: toastId }
          );
          setData(initialFormData);
          setTimeout(() => {
            router.push("/user/products");
          }, 1000);
        } else {
          toast.error(
            isEditMode ? "Error updating product" : "Error creating product", 
            { id: toastId }
          );
          console.error("API Error Response:", res);
        }
      })
      .catch((err) => {
        console.error("Error with product operation:", err);
        
        // More detailed error handling
        let errorMessage = isEditMode ? "Error updating product" : "Error creating product";
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        toast.error(errorMessage, { id: toastId });
      });
  };

  // Render the current step component
  const renderCurrentStep = () => {
    const currentComponent = FORM_STEPS[currentStep - 1].component;
    
    switch (currentComponent) {
      case 'general':
        return (
          <GeneralInformation
            data={data}
            onFieldChange={onFieldChange}
            error={error}
            onFieldError={onFieldError}
          />
        );
      case 'details':
        return (
          <ProductDetails
            data={data}
            onFieldChange={(field, value) => onFieldChange(field, value as string | number | boolean | UploadedFile[] | undefined)}
            chemicalFamilies={chemicalFamilies}
            polymersTypes={polymersTypes}
            industry={industry}
            physicalForms={physicalForms}
            productFamilies={productFamilies}
            error={error}
            onFieldError={onFieldError}
          />
        );
      case 'images':
        return <ProductImages data={data} onFieldChange={onFieldChange} />;
      case 'technical':
        return (
          <TechnicalProperties
            data={data}
            onFieldChange={(field, value) => onFieldChange(field, value as string | number | boolean | UploadedFile[] | undefined)}
            grades={grades}
          />
        );
      case 'trade':
        return (
          <TradeInformation
            data={data}
            onFieldChange={(field, value) => onFieldChange(field, value as string | number | boolean | UploadedFile[] | undefined)}
            incoterms={incoterms}
            paymentTerms={paymentTerms}
            error={error}
            onFieldError={onFieldError}
          />
        );
      case 'package':
        return (
          <PackageInformation
            data={data}
            onFieldChange={(field, value) => onFieldChange(field, value as string | number | boolean | UploadedFile[] | undefined)}
            packagingTypes={packagingTypes}
          />
        );
      case 'environmental':
        return <Environmental data={data} onFieldChange={onFieldChange} />;
      case 'certification':
        return <Certification data={data} onFieldChange={onFieldChange} />;
      case 'documents':
        return <Documents data={data} onFieldChange={onFieldChange} />;
      default:
        return null;
    }
  };

  console.log("Errors", error);
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            {isEditMode ? 'Update your product information' : 'Create a comprehensive product listing'}
          </p>
        </div>

        {/* Progress Stepper */}
        <Card className="mb-6 sm:mb-8 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Step {currentStep} of {FORM_STEPS.length}
              </h2>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 text-xs sm:text-sm">
                {Math.round(((currentStep - 1) / FORM_STEPS.length) * 100)}% Complete
              </Badge>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4 sm:mb-6">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep - 1) / FORM_STEPS.length) * 100}%` }}
              />
            </div>

            {/* Current step info for mobile */}
            <div className="mb-4 sm:hidden text-center">
              <p className="text-sm font-medium text-gray-600">
                {FORM_STEPS[currentStep - 1].title}
              </p>
            </div>

            {/* Step indicators */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-1 sm:gap-2">
              {FORM_STEPS.map((step) => {
                const Icon = step.icon;
                const isCompleted = completedSteps.has(step.id);
                const isCurrent = currentStep === step.id;
                const isAccessible = step.id <= currentStep || completedSteps.has(step.id);

                return (
                  <button
                    key={step.id}
                    onClick={() => isAccessible && goToStep(step.id)}
                    disabled={!isAccessible}
                    className={`
                      p-2 sm:p-3 rounded-lg text-center transition-all duration-300 group relative min-h-[3rem] sm:min-h-[4rem]
                      ${isCurrent 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105' 
                        : isCompleted
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 active:bg-green-300'
                        : isAccessible
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:bg-gray-300'
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" />
                    <div className="text-xs font-medium truncate hidden sm:block">{step.title}</div>
                    <div className="text-xs font-medium truncate sm:hidden">{step.id}</div>
                    {isCompleted && (
                      <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3 mx-auto mt-1 text-green-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Form Content */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 p-4 sm:p-6">
            <div className="flex items-center space-x-3">
              {React.createElement(FORM_STEPS[currentStep - 1].icon, { 
                className: "w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" 
              })}
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg sm:text-xl text-gray-800 truncate">
                  {FORM_STEPS[currentStep - 1].title}
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {FORM_STEPS[currentStep - 1].description}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {renderCurrentStep()}
            </div>
          </CardContent>
        </Card>

        {/* Navigation and Actions */}
        <div className="mt-6 sm:mt-8 flex flex-col gap-4 items-center">
          {/* Primary Navigation */}
          <div className="flex gap-3 w-full sm:w-auto justify-center">
            <Button
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="outline"
              size="lg"
              className="flex items-center gap-2 border-green-300 text-green-700 hover:bg-green-50 px-6 py-3 min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>
            
            {currentStep < FORM_STEPS.length ? (
              <Button
                onClick={nextStep}
                size="lg"
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 min-h-[44px]"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                size="lg"
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg px-6 py-3 min-h-[44px]"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">{isEditMode ? 'Update Product' : 'Create Product'}</span>
                <span className="sm:hidden">{isEditMode ? 'Update' : 'Create'}</span>
              </Button>
            )}
          </div>

          {/* Secondary Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            {/* Save Changes button - always visible in edit mode */}
            {isEditMode && (
              <Button
                onClick={handleSubmit}
                size="lg"
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg px-6 py-3 min-h-[44px]"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save Changes</span>
                <span className="sm:hidden">Save</span>
              </Button>
            )}
            
            <Button
              onClick={resetForm}
              variant="outline"
              size="lg"
              className="flex items-center gap-2 border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-3 min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset Form</span>
              <span className="sm:hidden">Reset</span>
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="mt-4 sm:mt-6 border-0 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-wrap gap-1 sm:gap-2 justify-center">
              <Badge variant="secondary" className="text-xs">
                💡 <span className="hidden sm:inline">Tip: You can navigate between completed steps</span>
                <span className="sm:hidden">Navigate steps</span>
              </Badge>
              <Badge variant="secondary" className="text-xs">
                📝 <span className="hidden sm:inline">Required fields are marked with validation</span>
                <span className="sm:hidden">Required fields marked</span>
              </Badge>
              <Badge variant="secondary" className="text-xs">
                💾 <span className="hidden sm:inline">Your progress is automatically saved</span>
                <span className="sm:hidden">Auto-saved</span>
              </Badge>
              {isEditMode && (
                <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                  ✨ <span className="hidden sm:inline">Use &quot;Save Changes&quot; button to save edits at any step</span>
                  <span className="sm:hidden">Save anytime</span>
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Floating Save Button for Edit Mode */}
        {isEditMode && (
          <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
            <Button
              onClick={handleSubmit}
              size="lg"
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-2xl rounded-full px-4 py-3 sm:px-6 animate-pulse hover:animate-none transition-all duration-300"
            >
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Save Changes</span>
              <span className="sm:hidden">Save</span>
            </Button>
          </div>
        )}

        {/* Note about product name restrictions */}
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-xs mt-2">Please avoid using &quot;test&quot; or &quot;sample&quot; in product names for production listings.</p>
        </div>
      </div>
    </div>
  );
};

export default AddEditProduct;
