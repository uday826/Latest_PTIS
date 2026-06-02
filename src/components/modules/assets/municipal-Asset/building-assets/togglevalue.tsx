'use client';

import React from 'react';
import { Building, Building2, ChevronDown, Search } from 'lucide-react';

import { Button, Checkbox, Input } from '@/components/common';

const ALL_ASSETS_VALUE = 'All Assets';

function useClickOutside<T extends HTMLElement>(onOutsideClick: () => void) {
  const ref = React.useRef<T | null>(null);

  React.useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    }

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [onOutsideClick]);

  return ref;
}

function getAssetTypeLabel(selectedAssetTypes: string[]) {
  const selectedCount = selectedAssetTypes.filter((value) => value !== ALL_ASSETS_VALUE).length;
  if (selectedCount === 0) return 'Asset Type';
  return `${selectedCount} Selected`;
}

type ToggleValueProps = {
  options: Array<{ label: string; value: string }>;
  selectedValues: string[];
  onChange: (values: string[]) => void;
};

export function ToggleValue({ options, selectedValues, onChange }: ToggleValueProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const dropdownRef = useClickOutside<HTMLDivElement>(() => setOpen(false));

  const filteredOptions = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) => option.label.toLowerCase().includes(query));
  }, [options, search]);

  function toggleValue(option: { label: string; value: string }) {
    if (option.value === ALL_ASSETS_VALUE) {
      onChange([ALL_ASSETS_VALUE]);
      return;
    }

    const withoutAll = selectedValues.filter((value) => value !== ALL_ASSETS_VALUE);
    const exists = withoutAll.includes(option.value);
    const next = exists
      ? withoutAll.filter((value) => value !== option.value)
      : [...withoutAll, option.value];

    onChange(next.length > 0 ? next : [ALL_ASSETS_VALUE]);
  }

  return (
    <div ref={dropdownRef} className="relative">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setOpen((value) => !value)}
        className="
          flex h-9 min-w-[170px] items-center justify-between gap-2 rounded-lg
          border border-blue-200 bg-white px-3 text-xs font-semibold text-[#063b6f]
          shadow-sm transition-all hover:border-blue-300 hover:bg-[#f8fbff] hover:shadow
          focus:outline-none focus:ring-2 focus:ring-blue-200
        "
      >
        <span className="flex min-w-0 flex-1 items-center gap-2 leading-none">
          <Building2 className="h-4 w-4 text-[#1A86E8]" />
          <span className="max-w-[150px] truncate">{getAssetTypeLabel(selectedValues)}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </span>
      </Button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[340px] rounded-xl border border-blue-200 bg-white p-3 shadow-xl">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search asset types..."
              className="h-9 w-full rounded-lg border border-blue-300 bg-white pl-9 pr-3 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="mt-2 flex items-center justify-between border-b border-slate-200 px-2 pb-2 text-sm">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange([ALL_ASSETS_VALUE, ...options.map((option) => option.value).filter((value) => value !== ALL_ASSETS_VALUE)])}
              className="h-auto px-0 text-blue-600 hover:bg-transparent hover:underline"
            >
              Select All
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange([ALL_ASSETS_VALUE])}
              className="h-auto px-0 text-red-500 hover:bg-transparent hover:underline"
            >
              Clear All
            </Button>
          </div>

          <div className="mt-2 max-h-[320px] overflow-y-auto pr-1">
            {filteredOptions.map((option) => {
              const selected = selectedValues.includes(option.value);
              return (
                <div
                  key={option.value}
                  className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition ${
                    selected ? 'bg-blue-50 text-[#063b6f]' : 'text-[#063b6f] hover:bg-blue-50'
                  }`}
                >
                  <Checkbox
                    checked={selected}
                    onCheckedChange={() => toggleValue(option)}
                    className="border-blue-200"
                    aria-label={`Select ${option.label}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleValue(option)}
                    className="h-auto flex-1 justify-start px-0 py-0 text-left text-xs font-semibold text-inherit hover:bg-transparent"
                  >
                    <span className="min-w-0 flex-1 truncate font-semibold">{option.label}</span>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
