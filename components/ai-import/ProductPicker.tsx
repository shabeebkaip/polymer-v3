"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Search } from "lucide-react";
import type { ExtractedProduct } from "@/types/ai";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getLabel(p: ExtractedProduct) {
  return p.productName?.value ?? p.tradeName?.value ?? "Unnamed product";
}

function countFilledFields(product: ExtractedProduct): number {
  const fields = [
    product.productName, product.tradeName, product.chemicalName,
    product.description, product.polymerType, product.chemicalFamily,
    product.physicalForm, product.density, product.mfi,
    product.tensileStrength, product.countryOfOrigin, product.uom,
  ];
  return fields.filter(f => f != null && (f as { value?: unknown }).value != null).length;
}

function RichnessIndicator({ fieldCount }: { fieldCount: number }) {
  const level = fieldCount >= 9 ? 4 : fieldCount >= 6 ? 3 : fieldCount >= 3 ? 2 : fieldCount >= 1 ? 1 : 0;
  return (
    <div
      className="flex gap-0.5 shrink-0"
      aria-label={`Data richness: ${level} of 4`}
      title={`${fieldCount} fields extracted`}
    >
      {[1, 2, 3, 4].map(i => (
        <span
          key={i}
          aria-hidden="true"
          className={`w-1.5 h-1.5 rounded-full ${i <= level ? "bg-teal-400" : "bg-gray-200"}`}
        />
      ))}
    </div>
  );
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-teal-100 text-teal-900 rounded not-italic">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ProductPickerProps {
  items: ExtractedProduct[];
  usedIndices?: Set<number>;
  onPick: (idx: number) => void;
}

export default function ProductPicker({ items, usedIndices = new Set(), onPick }: ProductPickerProps) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "richness">("name");
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Reset focused row when search changes
  useEffect(() => { setFocusedIdx(-1); }, [query]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let results = items.map((item, originalIndex) => ({ item, originalIndex }));

    if (q) {
      results = results.filter(({ item: p }) => {
        const name = p.productName?.value ?? p.tradeName?.value ?? "";
        const desc = p.description?.value ?? "";
        const type = p.polymerType?.value ?? "";
        const grade = p.grade?.join(" ") ?? "";
        return [name, desc, type, grade].some(s => s.toLowerCase().includes(q));
      });
    }

    if (sortBy === "richness") {
      results.sort((a, b) => countFilledFields(b.item) - countFilledFields(a.item));
    } else {
      results.sort((a, b) => getLabel(a.item).localeCompare(getLabel(b.item)));
    }

    return results;
  }, [items, query, sortBy]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && filtered.length > 0) {
      e.preventDefault();
      setFocusedIdx(0);
      rowRefs.current[0]?.focus();
    }
  };

  const handleListKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = focusedIdx < filtered.length - 1 ? focusedIdx + 1 : 0;
      setFocusedIdx(next);
      rowRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = focusedIdx > 0 ? focusedIdx - 1 : filtered.length - 1;
      setFocusedIdx(prev);
      rowRefs.current[prev]?.focus();
    } else if ((e.key === "Enter" || e.key === " ") && focusedIdx >= 0) {
      e.preventDefault();
      const { originalIndex } = filtered[focusedIdx];
      if (!usedIndices.has(originalIndex)) onPick(originalIndex);
    }
  }, [filtered, focusedIdx, usedIndices, onPick]);

  return (
    <div className="flex flex-col gap-3 min-w-0">
      <p className="text-sm text-gray-500">
        Claude found{" "}
        <span className="font-semibold text-gray-900">{items.length} products</span>{" "}
        in this catalog — choose one to fill the form.
      </p>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="search"
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          placeholder="Search by name, type, or grade…"
          aria-label="Search products"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-400 focus:bg-white transition-all"
        />
      </div>

      {/* Count + Sort */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Showing {filtered.length} of {items.length}
        </span>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as "name" | "richness")}
          aria-label="Sort by"
          className="text-xs text-gray-500 border-0 bg-transparent cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-400 rounded"
        >
          <option value="name">A–Z</option>
          <option value="richness">Most data first</option>
        </select>
      </div>

      {/* List */}
      <div
        role="listbox"
        aria-label="Product list"
        className="max-h-72 w-full overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-50"
        onKeyDown={handleListKeyDown}
      >
        {filtered.map(({ item: product, originalIndex }, displayIdx) => {
          const isUsed = usedIndices.has(originalIndex);
          const label = getLabel(product);
          const sub = [
            product.polymerType?.value,
            product.grade?.join(", "),
            product.description?.value?.slice(0, 60),
          ].filter(Boolean).join(" · ");

          return (
            <button
              key={originalIndex}
              ref={el => { rowRefs.current[displayIdx] = el; }}
              role="option"
              aria-selected={false}
              aria-disabled={isUsed}
              aria-label={isUsed ? `${label} — already added` : label}
              type="button"
              tabIndex={isUsed ? -1 : 0}
              onClick={() => !isUsed && onPick(originalIndex)}
              onFocus={() => setFocusedIdx(displayIdx)}
              className={[
                "w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-inset",
                isUsed
                  ? "opacity-50 pointer-events-none cursor-default bg-transparent"
                  : "hover:bg-teal-50/60 active:bg-teal-50",
              ].join(" ")}
            >
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  <HighlightMatch text={label} query={query} />
                </p>
                {sub && (
                  <p className="text-xs text-gray-500 truncate">{sub}</p>
                )}
              </div>
              {/* Right */}
              <div className="flex items-center gap-2 shrink-0">
                <RichnessIndicator fieldCount={countFilledFields(product)} />
                {isUsed
                  ? <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  : <span className="shrink-0 text-xs font-semibold text-teal-600">Use →</span>
                }
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-gray-400">
            No products match &ldquo;{query}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
