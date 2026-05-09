"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { Percent, Handshake, Gift, Plus, Trash2, Images } from "lucide-react";
import Image from "next/image";

export default function StepExtras({ 
  register, 
  errors, 
  control, 
  watch, 
  setValue,
  setShowImagePicker,
  coverImage
}) {
  const promoCodes = watch("promoCodes") || [];
  const sponsors = watch("sponsors") || [];
  const swagBag = watch("swagBag") || [];

  return (
    <div className="space-y-12">
      
      {/* Event Media */}
      <div className="space-y-6">
        <Label className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Images className="w-6 h-6 text-purple-500" />
          Event Media
        </Label>
        <div
          className="aspect-video w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-purple-500/30 bg-purple-50 hover:bg-purple-100/50 transition-all group"
          onClick={() => setShowImagePicker(true)}
        >
          {coverImage ? (
            <Image
              src={coverImage}
              alt="Cover"
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
              width={800}
              height={450}
              priority
            />
          ) : (
            <>
              <Plus className="w-10 h-10 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-base font-bold text-purple-600">
                Click to add event cover
              </span>
              <span className="text-xs text-purple-400 mt-2">
                1920x1080 recommended
              </span>
            </>
          )}
        </div>
      </div>



      {/* Promo Codes */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <Label className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Percent className="w-6 h-6 text-purple-500" />
            Promo Codes
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setValue("promoCodes", [
                ...promoCodes,
                { code: "", discountType: "percentage", discountValue: 10 },
              ]);
            }}
            className="gap-2 border-purple-500/20 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-full px-4"
          >
            <Plus className="w-4 h-4" /> Add Code
          </Button>
        </div>

        <div className="space-y-4">
          {promoCodes.map((promo, index) => (
            <div key={index} className="grid grid-cols-[1fr_120px_120px_auto] gap-4 items-end bg-purple-50/30 p-4 rounded-2xl border border-purple-500/5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-purple-600 uppercase">Code</Label>
                <Input
                  {...register(`promoCodes.${index}.code`)}
                  placeholder="EARLYBIRD"
                  className="bg-white border-purple-500/10 uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-purple-600 uppercase">Type</Label>
                <Controller
                  control={control}
                  name={`promoCodes.${index}.discountType`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-white border-purple-500/10 h-11 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 hover:bg-purple-50/50 shadow-sm transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-purple-500/20 shadow-xl shadow-purple-500/10 rounded-2xl bg-white/95 backdrop-blur-md">
                        <SelectItem value="percentage" className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer rounded-xl">%</SelectItem>
                        <SelectItem value="fixed" className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer rounded-xl">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-purple-600 uppercase">Value</Label>
                <Input
                  type="number"
                  {...register(`promoCodes.${index}.discountValue`, { valueAsNumber: true })}
                  placeholder="10"
                  className="bg-white border-purple-500/10"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                onClick={() => {
                  const current = [...promoCodes];
                  current.splice(index, 1);
                  setValue("promoCodes", current);
                }}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsors */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <Label className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Handshake className="w-6 h-6 text-purple-500" />
            Sponsors
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setValue("sponsors", [
                ...sponsors,
                { name: "", logo: "", tier: "Platinum" },
              ]);
            }}
            className="gap-2 border-purple-500/20 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-full px-4"
          >
            <Plus className="w-4 h-4" /> Add Sponsor
          </Button>
        </div>

        <div className="space-y-4">
          {sponsors.map((sponsor, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr_120px_auto] gap-4 items-end bg-purple-50/30 p-4 rounded-2xl border border-purple-500/5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-purple-600 uppercase">Sponsor Name</Label>
                <Input
                  {...register(`sponsors.${index}.name`)}
                  placeholder="e.g. Google"
                  className="bg-white border-purple-500/10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-purple-600 uppercase">Logo URL</Label>
                <Input
                  {...register(`sponsors.${index}.logo`)}
                  placeholder="https://..."
                  className="bg-white border-purple-500/10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-purple-600 uppercase">Tier</Label>
                <Controller
                  control={control}
                  name={`sponsors.${index}.tier`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-white border-purple-500/10 h-11 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 hover:bg-purple-50/50 shadow-sm transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-purple-500/20 shadow-xl shadow-purple-500/10 rounded-2xl bg-white/95 backdrop-blur-md">
                        <SelectItem value="Platinum" className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer rounded-xl">Platinum</SelectItem>
                        <SelectItem value="Gold" className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer rounded-xl">Gold</SelectItem>
                        <SelectItem value="Silver" className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer rounded-xl">Silver</SelectItem>
                        <SelectItem value="Bronze" className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer rounded-xl">Bronze</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                onClick={() => {
                  const current = [...sponsors];
                  current.splice(index, 1);
                  setValue("sponsors", current);
                }}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Swag Bag */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <Label className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Gift className="w-6 h-6 text-purple-500" />
            Digital Swag Bag
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setValue("swagBag", [
                ...swagBag,
                { title: "", url: "", type: "link", description: "" },
              ]);
            }}
            className="gap-2 border-purple-500/20 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-full px-4"
          >
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </div>
        <p className="text-xs font-medium text-purple-400 italic bg-purple-50 px-4 py-2 rounded-xl inline-block">
          Pro Tip: These items will only be visible to attendees after registration.
        </p>

        <div className="space-y-4">
          {swagBag.map((item, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr_120px_auto] gap-4 items-end bg-purple-50/30 p-4 rounded-2xl border border-purple-500/5">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-purple-600 uppercase">Item Title</Label>
                <Input
                  {...register(`swagBag.${index}.title`)}
                  placeholder="e.g. Free eBook"
                  className="bg-white border-purple-500/10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-purple-600 uppercase">Link/Code</Label>
                <Input
                  {...register(`swagBag.${index}.url`)}
                  placeholder="https://..."
                  className="bg-white border-purple-500/10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-purple-600 uppercase">Type</Label>
                <Controller
                  control={control}
                  name={`swagBag.${index}.type`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="bg-white border-purple-500/10 h-11 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500/30 hover:bg-purple-50/50 shadow-sm transition-all">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-purple-500/20 shadow-xl shadow-purple-500/10 rounded-2xl bg-white/95 backdrop-blur-md">
                        <SelectItem value="link" className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer rounded-xl">Link</SelectItem>
                        <SelectItem value="file" className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer rounded-xl">File</SelectItem>
                        <SelectItem value="code" className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer rounded-xl">Promo Code</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                onClick={() => {
                  const current = [...swagBag];
                  current.splice(index, 1);
                  setValue("swagBag", current);
                }}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
