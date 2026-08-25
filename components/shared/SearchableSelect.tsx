import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownItem } from "@/types/shared";

interface SearchableSelectProps {
  id?: string;
  ariaLabelledby?: string;
  label?: string;
  placeholder?: string;
  options: DropdownItem[];
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  onFocus?: () => void;
  className?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id, ariaLabelledby, label, placeholder = "Select", options, value, onChange,
  error = false, helperText, onFocus, className,
}) => {
  const generatedId = useId().replace(/:/g, "");
  const triggerId = id ?? `searchable-select-${generatedId}`;
  const labelId = `${triggerId}-label`;
  const listboxId = `${triggerId}-listbox`;
  const helperId = `${triggerId}-error`;
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const filteredOptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return [...options]
      .filter(option => !query || option.name.toLowerCase().includes(query))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [options, searchQuery]);

  const selectedOption = options.find(option => option._id === value);
  const accessibleName = ariaLabelledby ?? (label ? labelId : undefined);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    setSearchQuery("");
    setFocusedIndex(-1);
    if (returnFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const focusOption = useCallback((index: number) => {
    if (filteredOptions.length === 0) return;
    const next = Math.max(0, Math.min(index, filteredOptions.length - 1));
    setFocusedIndex(next);
    optionRefs.current[next]?.focus();
  }, [filteredOptions.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) close();
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [close, open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  return (
    <div
      className={cn("relative space-y-1", className)}
      ref={containerRef}
      onKeyDown={event => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          close(true);
          return;
        }
        const optionIndex = optionRefs.current.indexOf(event.target as HTMLButtonElement);
        if (optionIndex < 0) return;
        if (event.key === "ArrowDown") {
          event.preventDefault();
          focusOption((optionIndex + 1) % filteredOptions.length);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          focusOption((optionIndex - 1 + filteredOptions.length) % filteredOptions.length);
        } else if (event.key === "Home") {
          event.preventDefault();
          focusOption(0);
        } else if (event.key === "End") {
          event.preventDefault();
          focusOption(filteredOptions.length - 1);
        } else if (event.key === "Tab") {
          setOpen(false);
          setSearchQuery("");
          setFocusedIndex(-1);
        }
      }}
    >
      {label && <Label id={labelId} htmlFor={triggerId} className="mb-1 block">{label}</Label>}

      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-labelledby={accessibleName}
        aria-label={!accessibleName ? placeholder : undefined}
        aria-describedby={error && helperText ? helperId : undefined}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border bg-white px-3 py-2 text-start text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2",
          open && "ring-1 ring-ring",
          error && "border-red-300",
        )}
        onClick={() => setOpen(previous => !previous)}
        onFocus={onFocus}
        onKeyDown={event => {
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className={cn("min-w-0 break-words", !value && "text-gray-500")}>
          {selectedOption?.name || placeholder}
        </span>
        <ChevronDown aria-hidden="true" className="ms-2 h-4 w-4 shrink-0 opacity-50 motion-reduce:transition-none" />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={accessibleName}
          aria-label={!accessibleName ? placeholder : undefined}
          className="absolute z-50 mt-1 max-h-[400px] w-full min-w-0 rounded-md border bg-white shadow-lg"
        >
          <div className="sticky top-0 border-b bg-white p-2">
            <input
              ref={searchRef}
              type="search"
              placeholder="Search..."
              aria-label={`Search ${label || placeholder} options`}
              value={searchQuery}
              onChange={event => { setSearchQuery(event.target.value); setFocusedIndex(-1); }}
              onKeyDown={event => {
                if (["ArrowDown", "Home"].includes(event.key) && filteredOptions.length > 0) {
                  event.preventDefault();
                  focusOption(0);
                } else if (["ArrowUp", "End"].includes(event.key) && filteredOptions.length > 0) {
                  event.preventDefault();
                  focusOption(filteredOptions.length - 1);
                }
              }}
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          <div className="max-h-[320px] overflow-y-auto p-2">
            {filteredOptions.length === 0 ? (
              <div role="status" aria-live="polite" className="py-6 text-center text-sm text-gray-500">No options found</div>
            ) : filteredOptions.map((option, index) => (
              <button
                key={option._id}
                ref={element => { optionRefs.current[index] = element; }}
                type="button"
                role="option"
                aria-selected={value === option._id}
                tabIndex={focusedIndex === index ? 0 : -1}
                onFocus={() => setFocusedIndex(index)}
                onClick={() => { onChange(option._id); close(true); }}
                className={cn(
                  "flex min-h-[44px] w-full items-center justify-between rounded px-2 py-2 text-start hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700",
                  value === option._id && "bg-primary-50",
                )}
              >
                <span className="min-w-0 break-words text-sm">{option.name}</span>
                {value === option._id && <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-primary-500" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && helperText && <p id={helperId} className="mt-1 text-xs text-red-600">{helperText}</p>}
    </div>
  );
};

export default SearchableSelect;
