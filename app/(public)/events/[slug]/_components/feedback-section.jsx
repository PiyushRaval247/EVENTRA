"use client";

import { useState } from "react";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Star, MessageSquare, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function FeedbackSection({ eventId, canLeaveFeedback }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(canLeaveFeedback);

  const { data: feedbackList, isLoading } = useConvexQuery(api.events.getEventFeedback, {
    eventId,
  });

  const { mutate: addFeedback, isLoading: isSubmitting } = useConvexMutation(
    api.events.addFeedback
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await addFeedback({ eventId, rating, comment });
      toast.success("Thank you for your feedback!");
      setComment("");
      setShowForm(false);
    } catch (error) {
      toast.error(error.message || "Failed to submit feedback");
    }
  };

  const averageRating = feedbackList?.length 
    ? (feedbackList.reduce((acc, f) => acc + f.rating, 0) / feedbackList.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8 mt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-purple-500" />
          Event Feedback
        </h2>
        {averageRating > 0 && (
          <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full border border-purple-100 dark:border-purple-800">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-lg">{averageRating}</span>
            <span className="text-muted-foreground text-sm">({feedbackList.length} reviews)</span>
          </div>
        )}
      </div>

      {showForm && (
        <Card className="border-2 border-purple-500/20 overflow-hidden">
          <CardHeader className="bg-purple-500/5">
            <CardTitle className="text-lg">Share your experience</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className={`p-1 transition-transform hover:scale-110 ${
                        s <= rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    >
                      <Star className={`w-8 h-8 ${s <= rating ? "fill-yellow-500" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Comment</label>
                <Textarea
                  placeholder="What did you like or what could be improved?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px] bg-white/50 dark:bg-black/20"
                  required
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full gap-2 bg-purple-600 hover:bg-purple-700">
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : !feedbackList || feedbackList.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed">
            <p className="text-muted-foreground">No feedback yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {feedbackList.map((feedback) => (
              <Card key={feedback._id} className="bg-white/50 dark:bg-white/5">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={feedback.userImage} />
                        <AvatarFallback>{feedback.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{feedback.userName}</p>
                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= feedback.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-4 text-muted-foreground leading-relaxed italic">
                    &quot;{feedback.comment}&quot;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
