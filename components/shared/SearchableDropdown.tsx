"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export interface DropdownOption {
  _id: string;
  name: string;
  disabled?: boolean;
  [key: string]: any;
}

interface SearchableDropdownProps {
  options: DropdownOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;
  loading?: boolean;
  error?: boolean;
  helperText?: string;
}

export function SearchableDropdown({
  options = [],
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  disabled = false,
  className,
  allowClear = true,
  loading = false,
  error = false,
  helperText,
}: SearchableDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Find the selected option
  const selectedOption = React.useMemo(
    () => options.find((option) => option._id === value),
    [options, value]
  );

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    
    const query = searchQuery.toLowerCase();
    return options.filter((option) =>
      option.name.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  // Reset highlighted index when filtered options change
  React.useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions]);

  // Auto-focus search input when popover opens
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setSearchQuery("");
    }
  }, [open]);

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (open && listRef.current && filteredOptions.length > 0) {
      const listContainer = listRef.current;
      const highlightedElement = listContainer.children[highlightedIndex] as HTMLElement;
      
      if (highlightedElement) {
        const containerRect = listContainer.getBoundingClientRect();
        const elementRect = highlightedElement.getBoundingClientRect();
        
        if (elementRect.bottom > containerRect.bottom) {
          highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else if (elementRect.top < containerRect.top) {
          highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }
  }, [highlightedIndex, open, filteredOptions.length]);

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setOpen(false);
    setSearchQuery("");
    setHighlightedIndex(0);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex] && !filteredOptions[highlightedIndex].disabled) {
          handleSelect(filteredOptions[highlightedIndex]._id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        setSearchQuery("");
        setHighlightedIndex(0);
        break;
      case 'Tab':
        setOpen(false);
        setSearchQuery("");
        setHighlightedIndex(0);
        break;
    }
  };

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full justify-between transition-all duration-200",
              !value && "text-muted-foreground",
              error && "border-red-300 focus:border-red-500 focus:ring-red-200",
              !error && "border-gray-300 focus:border-primary-500 focus:ring-primary-500/30",
              className
            )}
            disabled={disabled || loading}
          >
            <span className="truncate text-left">
              {loading
                ? "Loading..."
                : selectedOption
                ? selectedOption.name
                : placeholder}
            </span>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              {allowClear && value && !disabled && (
                <X
                  className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                  onClick={handleClear}
                />
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0" 
          align="start"
          sideOffset={4}
        >
          {/* Search Input */}
          <div className="flex items-center border-b px-3 py-2 bg-gray-50/50">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={inputRef}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 w-full border-0 p-0 bg-transparent focus-visible:outline-none focus-visible:ring-0 text-sm"
            />
            {searchQuery && (
              <X
                className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100 cursor-pointer transition-opacity"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>

          {/* Scrollable Options List */}
          <div 
            ref={listRef}
            className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1"
          >
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {emptyText}
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={option._id}
                  onClick={() => !option.disabled && handleSelect(option._id)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors",
                    option.disabled
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-primary-50 hover:text-primary-900",
                    value === option._id && "bg-primary-100 text-primary-900 font-medium",
                    highlightedIndex === index && value !== option._id && "bg-gray-100"
                  )}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 flex-shrink-0",
                      value === option._id ? "opacity-100 text-primary-500" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{option.name}</span>
                </div>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Helper Text / Error Message */}
      {helperText && (
        <p className={cn(
          "text-xs mt-1",
          error ? "text-red-600" : "text-gray-500"
        )}>
          {helperText}
        </p>
      )}
    </div>
  );
}
