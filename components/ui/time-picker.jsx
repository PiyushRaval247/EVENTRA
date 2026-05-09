"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function TimePicker({ value, onChange, disabled, className }) {
  const [open, setOpen] = React.useState(false);

  // Parse initial value "HH:mm"
  const parseTime = (timeStr) => {
    if (!timeStr) return { h: 12, m: 0, period: "AM" };
    const [hoursStr, minutesStr] = timeStr.split(":");
    let h24 = parseInt(hoursStr, 10);
    const m = parseInt(minutesStr, 10) || 0;
    const period = h24 >= 12 ? "PM" : "AM";
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    return { h: h12, m, period };
  };

  const [time, setTime] = React.useState(() => parseTime(value));

  // Sync state if value changes externally
  React.useEffect(() => {
    if (value) {
      setTime(parseTime(value));
    }
  }, [value]);

  const updateTime = (newTime) => {
    setTime(newTime);
    let h24 = newTime.h;
    if (newTime.period === "PM" && h24 !== 12) h24 += 12;
    if (newTime.period === "AM" && h24 === 12) h24 = 0;
    
    const formatted = `${h24.toString().padStart(2, "0")}:${newTime.m.toString().padStart(2, "0")}`;
    if (onChange) onChange(formatted);
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ["AM", "PM"];

  // Format display string
  const displayTime = value 
    ? `${time.h}:${time.m.toString().padStart(2, "0")} ${time.period}`
    : "--:-- --";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex items-center justify-between rounded-2xl border border-purple-500/20 bg-purple-50/30 px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-purple-50/50",
            className
          )}
        >
          <span className="truncate">{displayTime}</span>
          <Clock className="h-4 w-4 shrink-0 opacity-50 ml-2 text-purple-600" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[240px] p-0 border-purple-500/20 shadow-xl shadow-purple-500/10 rounded-2xl bg-white/95 backdrop-blur-md overflow-hidden" 
        align="start"
      >
        <div className="flex h-48 divide-x divide-purple-500/10">
          {/* Hours Column */}
          <div className="flex-1 overflow-y-auto p-1 overscroll-contain" onWheel={(e) => e.stopPropagation()}>
            <div className="text-xs font-bold text-center py-2 text-purple-400 sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-purple-500/10">Hr</div>
            <div className="flex flex-col gap-1 mt-1">
              {hours.map((h) => (
                <button
                  key={h}
                  onClick={() => updateTime({ ...time, h })}
                  className={cn(
                    "rounded-lg py-1.5 text-sm transition-all hover:bg-purple-50",
                    time.h === h ? "bg-purple-100 text-purple-900 font-bold" : "text-gray-600"
                  )}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Minutes Column */}
          <div className="flex-1 overflow-y-auto p-1 overscroll-contain" onWheel={(e) => e.stopPropagation()}>
            <div className="text-xs font-bold text-center py-2 text-purple-400 sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-purple-500/10">Min</div>
            <div className="flex flex-col gap-1 mt-1">
              {minutes.map((m) => (
                <button
                  key={m}
                  onClick={() => updateTime({ ...time, m })}
                  className={cn(
                    "rounded-lg py-1.5 text-sm transition-all hover:bg-purple-50",
                    time.m === m ? "bg-purple-100 text-purple-900 font-bold" : "text-gray-600"
                  )}
                >
                  {m.toString().padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>

          {/* AM/PM Column */}
          <div className="flex-1 overflow-y-auto p-1 overscroll-contain" onWheel={(e) => e.stopPropagation()}>
            <div className="text-xs font-bold text-center py-2 text-purple-400 sticky top-0 bg-white/95 backdrop-blur-md z-10 border-b border-purple-500/10">AM/PM</div>
            <div className="flex flex-col gap-1 mt-1">
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => updateTime({ ...time, period: p })}
                  className={cn(
                    "rounded-lg py-1.5 text-sm transition-all hover:bg-purple-50",
                    time.period === p ? "bg-purple-100 text-purple-900 font-bold" : "text-gray-600"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
