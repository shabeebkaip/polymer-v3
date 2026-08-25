import { useEffect, useId, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownItem, MultiSelectProps } from "@/types/shared";

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  id,
  ariaLabelledby,
  placeholder = "Select",
  options,
  selected,
  onChange,
  error = false,
  helperText,
  onFocus,
}) => {
  const generatedId = useId().replace(/:/g, "");
  const triggerId = id ?? `multi-select-${generatedId}`;
  const labelId = `${triggerId}-label`;
  const listboxId = `${triggerId}-listbox`;
  const searchId = `${triggerId}-search`;
  const helperId = `${triggerId}-error`;
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const closeAndFocusTrigger = () => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const focusOption = (mode: "next" | "previous" | "first" | "last", current?: HTMLElement) => {
    const options = Array.from(listboxRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    if (options.length === 0) return;
    const index = current ? options.indexOf(current) : -1;
    const target = mode === "first" ? 0
      : mode === "last" ? options.length - 1
      : mode === "previous" ? (index > 0 ? index - 1 : options.length - 1)
      : (index >= 0 && index < options.length - 1 ? index + 1 : 0);
    options[target]?.focus();
  };

  return (
    <div
      className="relative space-y-1"
      ref={containerRef}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          closeAndFocusTrigger();
          return;
        }
        const option = (event.target as HTMLElement).closest<HTMLElement>('[role="option"]');
        if (option && ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          focusOption(
            event.key === "ArrowDown" ? "next"
              : event.key === "ArrowUp" ? "previous"
                : event.key === "Home" ? "first" : "last",
            option,
          );
        } else if (option && event.key === "Tab") {
          setOpen(false);
          setSearchQuery("");
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
        aria-labelledby={ariaLabelledby ?? (label ? labelId : undefined)}
        aria-label={!ariaLabelledby && !label ? placeholder : undefined}
        aria-describedby={error && helperText ? helperId : undefined}
        className={cn(
          "flex min-h-[44px] w-full justify-between items-center px-4 py-2 border rounded-md bg-white cursor-pointer text-sm text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2",
          open && "ring-1 ring-ring",
          error && "border-destructive ring-destructive/20"
        )}
        onClick={() => setOpen((prev) => !prev)}
        onFocus={onFocus}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span className="truncate">
          {selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder}
        </span>
        <ChevronDown aria-hidden="true" className="ms-2 h-4 w-4 shrink-0 opacity-50 motion-reduce:transition-none" />
      </button>

      {open && (
        <div
          id={listboxId}
          ref={listboxRef}
          role="listbox"
          aria-multiselectable="true"
          aria-labelledby={ariaLabelledby ?? (label ? labelId : undefined)}
          aria-label={!ariaLabelledby && !label ? placeholder : undefined}
          className="absolute z-50 mt-1 max-h-[400px] w-full rounded-md border bg-white shadow-lg"
        >
          {/* Search Input */}
          <div className="sticky top-0 p-2 border-b bg-white">
            <input
              ref={searchRef}
              id={searchId}
              type="text"
              placeholder="Search..."
              aria-label={`Search ${label || placeholder} options`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={event => {
                if (["ArrowDown", "Home"].includes(event.key)) {
                  event.preventDefault();
                  focusOption("first");
                } else if (["ArrowUp", "End"].includes(event.key)) {
                  event.preventDefault();
                  focusOption("last");
                }
              }}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Grouped Options */}
          <div className="overflow-y-auto max-h-[320px] p-2">
            {Object.keys(groupedOptions).length === 0 ? (
              <div role="status" aria-live="polite" className="py-6 text-center text-sm text-gray-500">
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
                        <button
                          key={opt._id}
                          type="button"
                          role="option"
                          aria-selected={selected.includes(opt._id)}
                          onClick={() => toggleOption(opt._id)}
                          className="flex min-h-[44px] w-full items-center gap-2 px-2 py-2 hover:bg-primary-50 rounded cursor-pointer transition-colors text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                              selected.includes(opt._id) ? "border-primary bg-primary text-primary-foreground" : "border-primary"
                            )}
                          >
                            {selected.includes(opt._id) && <Check className="h-3 w-3" />}
                          </span>
                          <span className="text-sm">{opt.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {error && helperText && (
        <p id={helperId} className="text-sm text-destructive mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default MultiSelect;
