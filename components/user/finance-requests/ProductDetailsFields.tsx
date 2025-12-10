'use client';

import { FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ProductDetailsFieldsProps {
  productGrade: string;
  notes: string;
  onProductGradeChange: (value: string) => void;
  onNotesChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function ProductDetailsFields({
  productGrade,
  notes,
  onProductGradeChange,
  onNotesChange,
}: ProductDetailsFieldsProps) {
  return (
    <>
      {/* Product Grade */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Product Grade
        </label>
        <Input
          value={productGrade}
          onChange={(e) => onProductGradeChange(e.target.value)}
          className="h-10 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="e.g., A+, Standard"
        />
      </div>

      {/* Request Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          <FileText className="w-4 h-4 inline mr-1.5 text-primary-600" />
          Request Notes *
        </label>
        <Textarea
          value={notes}
          onChange={onNotesChange}
          className="min-h-[100px] border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Describe your finance requirements, business use case, and any specific terms you need..."
          required
        />
      </div>
    </>
  );
}
