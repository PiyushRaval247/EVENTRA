"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tag, Plus, Trash2 } from "lucide-react";

export default function StepTicketing({ register, errors, watch, setValue }) {
  const ticketType = watch("ticketType");
  const ticketTiers = watch("ticketTiers") || [];

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-purple-500" />
            Ticketing
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div
            className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
              ticketType === "free"
                ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-500/10 scale-[1.02]"
                : "border-gray-100 hover:border-purple-200"
            }`}
            onClick={() => {
              setValue("ticketType", "free");
              setValue("ticketTiers", []);
            }}
          >
            <div className="font-bold text-gray-900">Free Event</div>
            <div className="text-sm text-gray-500">Open to everyone</div>
          </div>
          <div
            className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
              ticketType === "paid"
                ? "border-purple-500 bg-purple-50 shadow-md shadow-purple-500/10 scale-[1.02]"
                : "border-gray-100 hover:border-purple-200"
            }`}
            onClick={() => {
              setValue("ticketType", "paid");
              if (ticketTiers.length === 0) {
                setValue("ticketTiers", [{ name: "General Admission", price: 0, capacity: 100 }]);
              }
            }}
          >
            <div className="font-bold text-gray-900">Paid Event</div>
            <div className="text-sm text-gray-500">Sell tickets</div>
          </div>
        </div>

        {ticketType === "free" ? (
          <div className="space-y-2 mt-6">
            <Label className="text-sm font-bold text-gray-500 uppercase">Total Capacity</Label>
            <Input
              type="number"
              {...register("capacity", { valueAsNumber: true })}
              placeholder="e.g. 500"
              className="border-purple-500/20 bg-purple-50/30 rounded-2xl h-11 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 transition-all shadow-sm max-w-[200px]"
            />
            {errors.capacity && (
              <p className="text-xs text-red-500">{errors.capacity.message}</p>
            )}
          </div>
        ) : (
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold text-gray-500 uppercase">Ticket Tiers</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setValue("ticketTiers", [
                    ...ticketTiers,
                    { name: "", price: 0, capacity: 100 },
                  ]);
                }}
                className="gap-2 border-purple-500/20 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-full px-4"
              >
                <Plus className="w-4 h-4" /> Add Tier
              </Button>
            </div>

            <div className="space-y-4">
              {ticketTiers.map((tier, index) => (
                <div key={index} className="grid grid-cols-[1fr_120px_120px_auto] gap-4 items-end bg-purple-50/30 p-4 rounded-2xl border border-purple-500/5">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-purple-600 uppercase">Tier Name</Label>
                    <Input
                      {...register(`ticketTiers.${index}.name`)}
                      placeholder="e.g. VIP"
                      className="bg-white border-purple-500/10 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 transition-all rounded-xl"
                    />
                    {errors.ticketTiers?.[index]?.name && (
                      <p className="text-xs text-red-500">{errors.ticketTiers[index].name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-purple-600 uppercase">Price (₹)</Label>
                    <Input
                      type="number"
                      {...register(`ticketTiers.${index}.price`, { valueAsNumber: true })}
                      placeholder="e.g. 1500"
                      className="bg-white border-purple-500/10 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 transition-all rounded-xl"
                    />
                    {errors.ticketTiers?.[index]?.price && (
                      <p className="text-xs text-red-500">{errors.ticketTiers[index].price.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-purple-600 uppercase">Capacity</Label>
                    <Input
                      type="number"
                      {...register(`ticketTiers.${index}.capacity`, { valueAsNumber: true })}
                      placeholder="e.g. 50"
                      className="bg-white border-purple-500/10 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 transition-all rounded-xl"
                    />
                    {errors.ticketTiers?.[index]?.capacity && (
                      <p className="text-xs text-red-500">{errors.ticketTiers[index].capacity.message}</p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full mb-1"
                    onClick={() => {
                      const currentTiers = [...ticketTiers];
                      currentTiers.splice(index, 1);
                      setValue("ticketTiers", currentTiers);
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
              {ticketTiers.length === 0 && (
                <p className="text-sm text-red-500">Paid events require at least one ticket tier.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
