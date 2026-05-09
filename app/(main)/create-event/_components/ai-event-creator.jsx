"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AIEventCreator({ onEventGenerated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const generateEvent = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe your event");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/generate-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to generate event");
      }

      onEventGenerated(data);
      setIsOpen(false);
      setPrompt("");
    } catch (error) {
      toast.error("Failed to generate event. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline" 
        className="gap-2 border-purple-500/30 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-full shadow-lg shadow-purple-500/10"
      >
        <Sparkles className="w-4 h-4" />
        Generate with AI
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              AI Event Architect
            </DialogTitle>
            <DialogDescription>
              Describe your event idea and let AI draft the details for you.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: A tech meetup about React 19 for developers in Bangalore. It should cover new features like Actions and use hook improvements..."
              rows={5}
              className="resize-none"
            />

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={generateEvent}
                disabled={loading || !prompt.trim()}
                className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Draft
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
