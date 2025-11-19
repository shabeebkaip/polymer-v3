import { useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownItem, MultiSelectProps } from "@/types/shared";

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  placeholder = "Select",
  options,
  selected,
  onChange,
  error = false,
  helperText,
  onFocus,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleOption = (id: string) => {
    const updated = selected.includes(id)
      ? selected.filter((item) => item !== id)
      : [...selected, id];
    onChange(updated);
  };

  const selectedLabels = options
    .filter((opt) => selected.includes(opt._id))
    .map((opt) => opt.name);

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
    <div className="relative space-y-1" ref={containerRef}>
      <Label className="mb-1 block">{label}</Label>

      <div
        className={cn(
          "flex justify-between items-center px-4 py-2 border rounded-md bg-white cursor-pointer text-sm",
          open && "ring-1 ring-ring",
          error && "border-destructive ring-destructive/20"
        )}
        onClick={() => setOpen((prev) => !prev)}
        onFocus={onFocus} // 👈 now triggers when tabbed into
        tabIndex={0} // 👈 makes the div focusable via keyboard
      >
        <span className="truncate">
          {selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder}
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
                        <label
                          key={opt._id}
                          className="flex items-center gap-2 px-2 py-1.5 hover:bg-primary-50 rounded cursor-pointer transition-colors"
                        >
                          <Checkbox
                            checked={selected.includes(opt._id)}
                            onCheckedChange={() => toggleOption(opt._id)}
                          />
                          <span className="text-sm">{opt.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {error && helperText && (
        <p className="text-sm text-destructive mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default MultiSelect;
