import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SearchableDropdown } from '@/components/shared/SearchableDropdown';
import {
  SampleRequestInputProps,
  SampleRequestTextareaProps,
  SampleRequestDropdownProps,
} from '@/types/shared';

// Shared input styles constant
export const INPUT_STYLES = 'bg-white border-gray-200 focus:border-primary-500 focus:ring-primary-500 transition-all duration-200';

// Optimized memoized components
export const MemoizedInput = React.memo<SampleRequestInputProps>(({ 
  placeholder, 
  className = INPUT_STYLES, 
  type = 'text', 
  onChange, 
  value, 
  min, 
  readOnly, 
  onFocus 
}) => (
  <Input
    placeholder={placeholder}
    className={className}
    type={type}
    onChange={onChange}
    value={value}
    min={min}
    readOnly={readOnly}
    onFocus={onFocus}
  />
));

export const MemoizedTextarea = React.memo<SampleRequestTextareaProps>(({ 
  placeholder, 
  className = INPUT_STYLES, 
  onChange, 
  value,
  rows 
}) => (
  <Textarea
    placeholder={placeholder}
    className={className}
    onChange={onChange}
    value={value}
    rows={rows}
  />
));

export const MemoizedSearchableDropdown = React.memo<SampleRequestDropdownProps>(({ 
  value, 
  onValueChange, 
  placeholder, 
  className = INPUT_STYLES, 
  options 
}) => (
  <SearchableDropdown
    value={value}
    onValueChange={onValueChange}
    placeholder={placeholder}
    options={options}
    className={className}
  />
));

MemoizedInput.displayName = 'MemoizedInput';
MemoizedTextarea.displayName = 'MemoizedTextarea';
MemoizedSearchableDropdown.displayName = 'MemoizedSearchableDropdown';
