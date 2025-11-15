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
        <div className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md border bg-white p-2 shadow-md">
          {options.map((opt) => (
            <label
              key={opt._id}
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
            >
              <Checkbox
                checked={selected.includes(opt._id)}
                onCheckedChange={() => toggleOption(opt._id)}
              />
              <span className="text-sm">{opt.name}</span>
            </label>
          ))}
        </div>
      )}

      {error && helperText && (
        <p className="text-sm text-destructive mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default MultiSelect;
