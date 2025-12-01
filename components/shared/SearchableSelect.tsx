import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownItem } from "@/types/shared";

interface SearchableSelectProps {
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
  label,
  placeholder = "Select",
  options,
  value,
  onChange,
  error = false,
  helperText,
  onFocus,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectOption = (id: string) => {
    onChange(id);
    setOpen(false);
    setSearchQuery("");
  };

  const selectedOption = options.find((opt) => opt._id === value);
  const displayValue = selectedOption?.name || placeholder;

  // Filter and group options alphabetically
  const filteredAndGroupedOptions = () => {
    const filtered = searchQuery
      ? options.filter((opt) =>
          opt.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

    // Group by first letter
    const grouped: Record<string, DropdownItem[]> = {};
    filtered.forEach((opt) => {
      const firstLetter = opt.name.charAt(0).toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(opt);
    });

    // Sort each group alphabetically
    Object.keys(grouped).forEach((letter) => {
      grouped[letter].sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
  };

  const groupedOptions = filteredAndGroupedOptions();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearchQuery("");
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className={cn("relative space-y-1", className)} ref={containerRef}>
      {label && <Label className="mb-1 block">{label}</Label>}

      <div
        className={cn(
          "flex justify-between items-center px-3 py-2 border rounded-md bg-white cursor-pointer h-9 text-sm",
          open && "ring-1 ring-ring",
          error && "border-red-300"
        )}
        onClick={() => setOpen((prev) => !prev)}
        onFocus={onFocus}
        tabIndex={0}
      >
        <span className={cn("truncate", !value && "text-gray-500")}>
          {displayValue}
        </span>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </div>

      {open && (
        <div className="absolute z-10 mt-1 max-h-[400px] w-full rounded-md border bg-white shadow-lg">
          {/* Search Input */}
          <div className="sticky top-0 p-2 border-b bg-white">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>

          {/* Grouped Options */}
          <div className="overflow-y-auto max-h-[320px] p-2">
            {Object.keys(groupedOptions).length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">
                No options found
              </div>
            ) : (
              Object.keys(groupedOptions)
                .sort()
                .map((letter) => (
                  <div key={letter} className="mb-3">
                    {/* Letter Header */}
                    <div className="sticky top-0 bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600 rounded">
                      {letter}
                    </div>

                    {/* Options under this letter */}
                    <div className="mt-1 space-y-0.5">
                      {groupedOptions[letter].map((opt) => (
                        <div
                          key={opt._id}
                          className={cn(
                            "flex items-center justify-between px-2 py-1.5 hover:bg-primary-50 rounded cursor-pointer transition-colors",
                            value === opt._id && "bg-primary-50"
                          )}
                          onClick={() => selectOption(opt._id)}
                        >
                          <span className="text-sm">{opt.name}</span>
                          {value === opt._id && (
                            <Check className="h-4 w-4 text-primary-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {error && helperText && (
        <p className="text-xs text-red-600 mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default SearchableSelect;
