'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubmitSectionProps {
  isSubmitting: boolean;
  isFormValid: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function SubmitSection({ isSubmitting, isFormValid, onSubmit }: SubmitSectionProps) {
  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-600">
          <AlertCircle className="w-4 h-4 inline mr-1.5 text-amber-500" />
          All requests are subject to credit approval.
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          onClick={onSubmit}
          className="px-6 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium shadow-sm hover:shadow transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Submit Request
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
