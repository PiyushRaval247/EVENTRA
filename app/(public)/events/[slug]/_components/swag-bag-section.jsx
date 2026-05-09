"use client";

import { Gift, Lock, ExternalLink, Download, Copy, Hash, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function SwagBagSection({ swagBag, isRegistered, onRegister }) {
  if (!swagBag || swagBag.length === 0) return null;

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Promo code copied to clipboard!");
  };

  const getIcon = (type) => {
    switch (type) {
      case "file": return <FileText className="w-5 h-5" />;
      case "code": return <Hash className="w-5 h-5" />;
      default: return <ExternalLink className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 mt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Gift className="w-8 h-8 text-pink-500" />
          Digital Swag Bag
        </h2>
        {!isRegistered && (
          <Badge variant="outline" className="bg-pink-50 text-pink-600 border-pink-100 flex gap-1">
            <Lock className="w-3 h-3" /> Exclusive
          </Badge>
        )}
      </div>

      <div className="relative group">
        <div className={`grid gap-4 ${!isRegistered ? 'blur-md pointer-events-none select-none opacity-50' : ''}`}>
          {swagBag.map((item, idx) => (
            <Card key={idx} className="bg-white/50 dark:bg-white/5 border-0 overflow-hidden hover:shadow-lg transition-all group/item">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.title}</h4>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  </div>

                  {isRegistered && (
                    <div className="flex gap-2">
                      {item.type === "code" ? (
                        <Button 
                          variant="secondary" 
                          className="gap-2 bg-pink-50 hover:bg-pink-100 text-pink-600 dark:bg-pink-900/20"
                          onClick={() => handleCopyCode(item.url)}
                        >
                          <Copy className="w-4 h-4" />
                          Copy Code
                        </Button>
                      ) : (
                        <Button 
                          asChild 
                          variant="secondary"
                          className="gap-2 bg-pink-50 hover:bg-pink-100 text-pink-600 dark:bg-pink-900/20"
                        >
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            {item.type === "file" ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                            {item.type === "file" ? "Download" : "Visit"}
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Locked Overlay */}
        {!isRegistered && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 rounded-3xl border border-dashed border-pink-500/30 p-8 text-center backdrop-blur-[2px] z-10">
            <div className="w-16 h-16 rounded-full bg-pink-500 text-white flex items-center justify-center mb-6 shadow-xl animate-bounce">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-3">Exclusive Content Locked!</h3>
            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
              Register for this event to unlock free eBooks, exclusive promo codes, and downloadable workshop assets.
            </p>
            <Button onClick={onRegister} className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-8 py-6 h-auto text-lg shadow-lg hover:scale-105 transition-transform">
              Register to Unlock 🎁
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
