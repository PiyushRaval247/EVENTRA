"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function SearchableSelect({
  options = [],
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  disabled = false,
  className,
  contentClassName,
  renderOption,
}) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    const lowerQuery = searchQuery.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(lowerQuery)
    );
  }, [options, searchQuery]);

  const selectedOption = React.useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-between rounded-xl border border-purple-500/20 bg-background px-4 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-purple-50/50",
            className
          )}
        >
          <span className="truncate">
            {selectedOption ? (renderOption ? renderOption(selectedOption) : selectedOption.label) : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className={cn("p-0 border-purple-500/20 shadow-xl shadow-purple-500/10 rounded-xl bg-white/95 backdrop-blur-md overflow-hidden", contentClassName)} 
        style={{ width: contentClassName ? undefined : "var(--radix-popover-trigger-width)" }}
        align="start"
        side="bottom"
      >
        <div className="flex items-center border-b border-purple-500/10 px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-purple-600" />
          <input
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div 
          className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1 overscroll-contain pointer-events-auto"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 px-3 text-sm outline-none transition-colors hover:bg-purple-50 hover:text-purple-900 focus:bg-purple-50 focus:text-purple-900",
                    value === option.value ? "bg-purple-50 font-medium text-purple-900" : "",
                    index !== filteredOptions.length - 1 ? "border-b border-purple-500/5" : "" // The separator line
                  )}
                  onClick={() => {
                    onValueChange(option.value);
                    setOpen(false);
                    setSearchQuery(""); // reset search
                  }}
                >
                  <div className="flex-1 truncate">
                    {renderOption ? renderOption(option) : option.label}
                  </div>
                  {value === option.value && (
                    <Check className="ml-2 h-4 w-4 text-purple-600 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
