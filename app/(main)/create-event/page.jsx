"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles, Send } from "lucide-react";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import UnsplashImagePicker from "@/components/unsplash-image-picker";
import UpgradeModal from "@/components/upgrade-modal";
import AIEventCreator from "./_components/ai-event-creator";

// Step Components
import StepBasicInfo from "./_components/step-basic-info";
import StepLocation from "./_components/step-location";
import StepTicketing from "./_components/step-ticketing";
import StepExtras from "./_components/step-extras";

// HH:MM in 24h
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const eventSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  startTime: z.string().regex(timeRegex, "Start time must be HH:MM"),
  endTime: z.string().regex(timeRegex, "End time must be HH:MM"),
  locationType: z.enum(["physical", "online"]).default("physical"),
  venue: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  ticketType: z.enum(["free", "paid"]).default("free"),
  ticketPrice: z.number().optional(),
  ticketTiers: z.array(
    z.object({
      name: z.string().min(1, "Tier name is required"),
      price: z.number().min(0, "Price must be >= 0"),
      capacity: z.number().min(1, "Capacity must be >= 1"),
    })
  ).optional(),
  promoCodes: z.array(
    z.object({
      code: z.string().min(3, "Code must be at least 3 chars"),
      discountType: z.enum(["percentage", "fixed"]),
      discountValue: z.number().min(1, "Discount must be > 0"),
      expiresAt: z.date().optional(),
    })
  ).optional(),
  coverImage: z.string().optional(),
  images: z.array(z.string()).max(5, "Max 5 images").optional(),
  sponsors: z.array(
    z.object({
      name: z.string().min(1, "Sponsor name is required"),
      logo: z.string().min(1, "Logo URL is required"),
      link: z.string().optional(),
      tier: z.string().min(1, "Tier is required"),
    })
  ).optional(),
  swagBag: z.array(
    z.object({
      title: z.string().min(1, "Title is required"),
      url: z.string().min(1, "URL is required"),
      type: z.enum(["link", "file", "code"]),
      description: z.string().optional(),
    })
  ).optional(),
});

export default function CreateEventPage() {
  const router = useRouter();
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("limit"); // "limit" or "color"

  // Check if user has Pro plan
  const { has } = useAuth();
  const hasPro = has?.({ plan: "pro" });

  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const { mutate: createEvent, isLoading } = useConvexMutation(
    api.events.createEvent
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      locationType: "physical",
      ticketType: "free",
      capacity: 50,
      category: "",
      state: "",
      city: "",
      startTime: "",
      endTime: "",
      ticketTiers: [{ name: "General Admission", price: 0, capacity: 50 }],
      promoCodes: [],
      images: [],
      sponsors: [],
      swagBag: [],
    },
  });

  const coverImage = watch("coverImage");

  const combineDateTime = (date, time) => {
    if (!date || !time) return null;
    const [hh, mm] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(hh, mm, 0, 0);
    return d;
  };

  const onSubmit = async (data) => {
    try {
      const start = combineDateTime(data.startDate, data.startTime);
      const end = combineDateTime(data.endDate, data.endTime);

      if (!start || !end) {
        toast.error("Please select both date and time for start and end.");
        return;
      }
      if (end.getTime() <= start.getTime()) {
        toast.error("End date/time must be after start date/time.");
        return;
      }

      // Check event limit for Free users
      if (!hasPro && currentUser?.freeEventsCreated >= 1) {
        setUpgradeReason("limit");
        setShowUpgradeModal(true);
        return;
      }

      await createEvent({
        title: data.title,
        description: data.description,
        category: data.category,
        tags: [data.category],
        startDate: start.getTime(),
        endDate: end.getTime(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locationType: data.locationType,
        venue: data.venue || undefined,
        address: data.address || undefined,
        city: data.city,
        state: data.state || undefined,
        country: "India",
        capacity: data.ticketTiers?.reduce((acc, t) => acc + t.capacity, 0) || data.capacity,
        ticketType: data.ticketType,
        ticketPrice: data.ticketTiers?.[0]?.price || data.ticketPrice || 0,
        coverImage: data.coverImage || undefined,
        ticketTiers: data.ticketTiers,
        images: data.images,
        sponsors: data.sponsors,
        swagBag: data.swagBag,
        promoCodes: data.promoCodes?.map(p => ({
          ...p,
          expiresAt: p.expiresAt?.getTime()
        })),
        hasPro,
      });

      toast.success("Event created successfully! 🎉");
      router.push("/my-events");
    } catch (error) {
      toast.error(error.message || "Failed to create event");
    }
  };

  const handleAIGenerate = (generatedData) => {
    setValue("title", generatedData.title);
    setValue("description", generatedData.description);
    setValue("category", generatedData.category);
    setValue("capacity", generatedData.suggestedCapacity);
    setValue("ticketType", generatedData.suggestedTicketType);
    toast.success("Event details filled! Customize as needed.");
  };

  return (
    <div className="min-h-screen transition-colors duration-300 px-4 pt-0 md:-mt-8 pb-12 md:px-8 bg-[#FBFBFE]">
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-gray-900">Create Event</h1>
          <div className="flex items-center justify-start gap-3 mt-3">

            {!hasPro && (
              <p className="text-sm text-muted-foreground">
                Free: <span className="font-bold text-gray-900">{currentUser?.freeEventsCreated || 0}/1</span> events created
              </p>
            )}
          </div>
        </div>
        <AIEventCreator onEventGenerated={handleAIGenerate} />
      </div>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Main Form Container */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="glass p-6 md:p-8 rounded-2xl shadow-lg shadow-gray-200/50 bg-white border border-gray-100">
            <StepBasicInfo register={register} errors={errors} control={control} watch={watch} setValue={setValue} />
          </div>

          {/* Section 2: Location */}
          <div className="glass p-6 md:p-8 rounded-2xl shadow-lg shadow-gray-200/50 bg-white border border-gray-100">
            <StepLocation register={register} errors={errors} watch={watch} setValue={setValue} />
          </div>

          {/* Section 3: Ticketing */}
          <div className="glass p-6 md:p-8 rounded-2xl shadow-lg shadow-gray-200/50 bg-white border border-gray-100">
            <StepTicketing register={register} errors={errors} watch={watch} setValue={setValue} />
          </div>

          {/* Section 4: Media & Extras */}
          <div className="glass p-6 md:p-8 rounded-2xl shadow-lg shadow-gray-200/50 bg-white border border-gray-100">
            <StepExtras 
              register={register} 
              errors={errors} 
              control={control} 
              watch={watch} 
              setValue={setValue} 
              setShowImagePicker={setShowImagePicker}
              coverImage={coverImage}
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end pt-4 pb-8">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-10 rounded-2xl shadow-xl shadow-purple-500/30 text-lg font-bold transition-all hover:scale-[1.02] active:scale-95 group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  Publishing Event...
                </>
              ) : (
                <>
                  Publish Event
                  <Sparkles className="w-5 h-5 ml-2 group-hover:animate-pulse" />
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Unsplash Picker */}
        {showImagePicker && (
          <UnsplashImagePicker
            isOpen={showImagePicker}
            onClose={() => setShowImagePicker(false)}
            onSelect={(url) => {
              setValue("coverImage", url);
              setShowImagePicker(false);
            }}
          />
        )}

        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          trigger={upgradeReason}
        />
      </div>
    </div>
  );
}
