"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import { State, City } from "country-state-city";
import { useMemo, useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";

export default function StepLocation({ register, errors, watch, setValue }) {
  const locationType = watch("locationType");
  const selectedState = watch("state");
  
  // Local state for keeping track of the selected state code for city fetching
  const [selectedStateCode, setSelectedStateCode] = useState("");

  const indianStates = useMemo(() => State.getStatesOfCountry("IN"), []);
  const cities = useMemo(() => {
    if (!selectedStateCode) return [];
    return City.getCitiesOfState("IN", selectedStateCode);
  }, [selectedStateCode]);

  // Sync initial state if it's already set (e.g. going back in wizard)
  useEffect(() => {
    if (selectedState) {
      const stateObj = indianStates.find(s => s.name === selectedState);
      if (stateObj) setSelectedStateCode(stateObj.isoCode);
    }
  }, [selectedState, indianStates]);

  useEffect(() => {
    register("locationType");
    register("state");
    register("city");
  }, [register]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-sm font-bold flex items-center gap-2 text-purple-600 uppercase tracking-widest">
          <MapPin className="w-4 h-4" />
          Location details
        </Label>
        
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
              locationType === "physical"
                ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-500/10 scale-[1.02]"
                : "border-gray-100 hover:border-purple-200"
            }`}
            onClick={() => setValue("locationType", "physical", { shouldValidate: true })}
          >
            <div className="font-bold text-gray-900">Physical Venue</div>
            <div className="text-sm text-gray-500">In-person event</div>
          </div>
          <div
            className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
              locationType === "online"
                ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-500/10 scale-[1.02]"
                : "border-gray-100 hover:border-purple-200"
            }`}
            onClick={() => setValue("locationType", "online", { shouldValidate: true })}
          >
            <div className="font-bold text-gray-900">Online</div>
            <div className="text-sm text-gray-500">Virtual event</div>
          </div>
        </div>

        {locationType === "online" ? (
          <div className="space-y-3 mt-6">
            <Label className="text-sm font-bold">Event Link / URL</Label>
            <Input
              {...register("venue")}
              placeholder="https://zoom.us/j/..."
              className="border-purple-500/20 bg-purple-50/30 rounded-2xl h-11 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 transition-all shadow-sm"
            />
            {errors.venue && (
              <p className="text-xs text-red-500">{errors.venue.message}</p>
            )}
          </div>
        ) : (
          <div className="space-y-4 mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-500 uppercase">State</Label>
                <SearchableSelect
                  value={selectedState || ""}
                  onValueChange={(val) => {
                    setValue("state", val, { shouldValidate: true });
                    const stateObj = indianStates.find(s => s.name === val);
                    setSelectedStateCode(stateObj?.isoCode || "");
                    setValue("city", "", { shouldValidate: true });
                  }}
                  placeholder="Select State"
                  searchPlaceholder="Search state..."
                  options={indianStates.map(s => ({ label: s.name, value: s.name }))}
                  className="w-full h-11 px-4 rounded-2xl bg-purple-50/30 border-purple-500/20 text-sm focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 hover:bg-purple-50/50 shadow-sm transition-all"
                  contentClassName="w-[300px]"
                />
                {errors.state && (
                  <p className="text-xs text-red-500">{errors.state.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-500 uppercase">City</Label>
                <SearchableSelect
                  value={watch("city") || ""}
                  onValueChange={(val) => setValue("city", val, { shouldValidate: true })}
                  placeholder="Select City"
                  searchPlaceholder="Search city..."
                  disabled={!selectedState}
                  options={cities.map(c => ({ label: c.name, value: c.name }))}
                  className="w-full h-11 px-4 rounded-2xl bg-purple-50/30 border-purple-500/20 text-sm focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 hover:bg-purple-50/50 shadow-sm transition-all disabled:opacity-50"
                  contentClassName="w-[300px]"
                />
                {errors.city && (
                  <p className="text-xs text-red-500">{errors.city.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase">Venue Name</Label>
              <Input
                {...register("venue")}
                placeholder="e.g. Jio World Convention Centre"
                className="border-purple-500/20 bg-purple-50/30 rounded-2xl h-11 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 transition-all shadow-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-500 uppercase">Address</Label>
              <Input
                {...register("address")}
                placeholder="Full address / street / building (optional)"
                className="border-purple-500/20 bg-purple-50/30 rounded-2xl h-11 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 transition-all shadow-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
