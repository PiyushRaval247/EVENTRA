"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Tag, FileText } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { TimePicker } from "@/components/ui/time-picker";
import { Controller } from "react-hook-form";

export default function StepBasicInfo({ register, errors, control, watch, setValue }) {
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <Label className="text-sm font-bold text-purple-600 mb-2 block uppercase tracking-widest">Event Title</Label>
        <Input
          {...register("title")}
          placeholder="Enter a catchy event name..."
          className="text-4xl font-black bg-transparent border-none focus-visible:ring-4 focus-visible:ring-purple-500/10 p-4 rounded-2xl placeholder:opacity-30 h-auto transition-all"
        />
        {errors.title && (
          <p className="text-sm text-red-400 mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Date + Time */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Start */}
        <div className="space-y-3">
          <Label className="text-sm font-bold flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-purple-500" />
            Start Date & Time
          </Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 justify-between border-purple-500/20 bg-purple-50/30 hover:bg-purple-100/50 transition-all focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 shadow-sm rounded-2xl h-11"
                >
                  {startDate ? format(startDate, "PPP") : "Pick date"}
                  <CalendarIcon className="w-4 h-4 opacity-40" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => setValue("startDate", date)}
                />
              </PopoverContent>
            </Popover>
            <Controller
              control={control}
              name="startTime"
              render={({ field }) => (
                <TimePicker
                  value={field.value}
                  onChange={field.onChange}
                  className="w-[120px] h-11"
                />
              )}
            />
          </div>
          {(errors.startDate || errors.startTime) && (
            <p className="text-xs text-red-500 mt-1">
              {errors.startDate?.message || errors.startTime?.message}
            </p>
          )}
        </div>

        {/* End */}
        <div className="space-y-3">
          <Label className="text-sm font-bold flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-purple-500" />
            End Date & Time
          </Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 justify-between border-purple-500/20 bg-purple-50/30 hover:bg-purple-100/50 transition-all focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 shadow-sm rounded-2xl h-11"
                >
                  {endDate ? format(endDate, "PPP") : "Pick date"}
                  <CalendarIcon className="w-4 h-4 opacity-40" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => setValue("endDate", date)}
                  disabled={(date) => date < (startDate || new Date())}
                />
              </PopoverContent>
            </Popover>
            <Controller
              control={control}
              name="endTime"
              render={({ field }) => (
                <TimePicker
                  value={field.value}
                  onChange={field.onChange}
                  className="w-[120px] h-11"
                />
              )}
            />
          </div>
          {(errors.endDate || errors.endTime) && (
            <p className="text-xs text-red-500 mt-1">
              {errors.endDate?.message || errors.endTime?.message}
            </p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-4">
        <Label className="text-sm font-bold flex items-center gap-2 text-purple-600 uppercase tracking-widest">
          <Tag className="w-4 h-4" />
          Category
        </Label>
        <div className="relative">
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <SearchableSelect
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select a category"
                searchPlaceholder="Search categories..."
                options={CATEGORIES.map(c => ({ label: c.label, value: c.id }))}
                className="w-full h-11 px-4 rounded-2xl bg-purple-50/30 border-purple-500/20 text-sm focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 hover:bg-purple-50/50 shadow-sm transition-all"
              />
            )}
          />
        </div>
        {errors.category && (
          <p className="text-xs text-red-500 mt-1">
            {errors.category.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-3">
        <Label className="text-sm font-bold flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-500" />
          Description
        </Label>
        <Textarea
          {...register("description")}
          placeholder="Tell people about your event..."
          rows={6}
          className="border-purple-500/20 bg-purple-50/30 rounded-2xl resize-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 transition-all"
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
}
