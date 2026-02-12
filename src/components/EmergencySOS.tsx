import { useState, useCallback } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertTriangle, Phone, MapPin, Loader2, Check } from "lucide-react";
import NeonButton from "./NeonButton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EmergencySOSProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SOSStep = "confirm" | "sending" | "sent";

export default function EmergencySOS({ open, onOpenChange }: EmergencySOSProps) {
  const [step, setStep] = useState<SOSStep>("confirm");
  const [shareLocation, setShareLocation] = useState(true);
  const [customMessage, setCustomMessage] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  /* ---------------- LOCAL STORAGE HELPERS ---------------- */

  const getPrimaryContact = () => {
    const saved = localStorage.getItem("primary_emergency_contact");
    return saved ? JSON.parse(saved) : null;
  };

  const savePrimaryContact = (phone: string) => {
    localStorage.setItem(
      "primary_emergency_contact",
      JSON.stringify({ phone })
    );
  };

  const changePrimaryContact = () => {
    const number = prompt("Enter primary WhatsApp number with country code (e.g. 919876543210)");
    if (!number) return;
    savePrimaryContact(number);
    toast.success("Primary contact updated");
  };

  /* ---------------- LOCATION ---------------- */

  const getLocation = useCallback(async (): Promise<{ lat: number; lng: number } | null> => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation not supported");
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(coords);
          resolve(coords);
        },
        () => {
          toast.error("Could not get location");
          resolve(null);
        }
      );
    });
  }, []);

  /* ---------------- MAIN SOS LOGIC ---------------- */

  const handleSendSOS = async () => {
    setStep("sending");

    let contact = getPrimaryContact();

    // Ask for number if not saved
    if (!contact) {
      const number = prompt(
        "Enter primary WhatsApp number with country code\nExample: 919876543210"
      );

      if (!number) {
        setStep("confirm");
        return;
      }

      contact = { phone: number };
      savePrimaryContact(number);
    }

    // Get location if enabled
    let coords = location;
    if (shareLocation && !coords) {
      coords = await getLocation();
    }

    // Build message
    let message = "🚨 EMERGENCY! I need help.";

    if (customMessage.trim()) {
      message += `\n\n${customMessage}`;
    }

    if (shareLocation && coords) {
      message += `\n\nMy location:\nhttps://maps.google.com/?q=${coords.lat},${coords.lng}`;
    }

    // Open WhatsApp
    const url = `https://wa.me/${contact.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    setTimeout(() => {
      setStep("sent");
      toast.success("WhatsApp opened with SOS message");
    }, 1200);
  };

  const handleClose = () => {
    setStep("confirm");
    setCustomMessage("");
    onOpenChange(false);
  };

  const primaryContact = getPrimaryContact();

  /* ---------------- UI ---------------- */

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="bg-background/95 backdrop-blur-xl border-l border-red-500/30 w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-orbitron text-xl text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            Emergency SOS
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {step === "confirm" && (
            <>
              {/* Warning */}
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-sm text-red-300">
                  This will open WhatsApp and send your location to your primary emergency contact.
                </p>
              </div>

              {/* Primary Contact Display */}
              <div className="p-4 rounded-xl bg-muted/20 border border-border/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Primary Contact</p>
                    <p className="text-xs text-muted-foreground">
                      {primaryContact?.phone || "Not set"}
                    </p>
                  </div>

                  <button
                    onClick={changePrimaryContact}
                    className="text-xs text-primary underline"
                  >
                    {primaryContact ? "Change" : "Add"}
                  </button>
                </div>
              </div>

              {/* Location Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/30">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Share Location</p>
                    <p className="text-xs text-muted-foreground">
                      Include your current GPS location
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShareLocation(!shareLocation)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    shareLocation ? "bg-red-500" : "bg-muted"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
                      shareLocation ? "translate-x-6" : "translate-x-0.5"
                    )}
                  />
                </button>
              </div>

              {/* Custom Message */}
              <div className="space-y-2">
                <label className="text-sm font-orbitron uppercase tracking-wider text-muted-foreground">
                  Additional Message (Optional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Add details like injury, danger, etc..."
                  className="w-full p-3 rounded-xl bg-muted/20 border border-border/30 text-sm resize-none focus:outline-none focus:border-red-500/50"
                  rows={3}
                />
              </div>

              {/* SEND SOS */}
              <NeonButton variant="danger" className="w-full" onClick={handleSendSOS}>
                <AlertTriangle className="w-5 h-5 mr-2" />
                Send SOS via WhatsApp
              </NeonButton>
            </>
          )}

          {step === "sending" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                  <Loader2 className="w-10 h-10 text-red-400 animate-spin" />
                </div>
                <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-red-500/50 animate-ping" />
              </div>
              <p className="text-lg font-orbitron">Preparing SOS...</p>
            </div>
          )}

          {step === "sent" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-10 h-10 text-emerald-400" />
              </div>

              <div className="text-center">
                <p className="text-lg font-orbitron">WhatsApp Opened</p>
                <p className="text-sm text-muted-foreground">
                  Press SEND in WhatsApp to notify your contact.
                </p>
              </div>

              <NeonButton onClick={handleClose} className="w-full">
                Close
              </NeonButton>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
