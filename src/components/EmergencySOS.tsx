import { useState, useCallback } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertTriangle, Phone, MapPin, MessageCircle, Users, X, Check, Loader2 } from "lucide-react";
import NeonButton from "./NeonButton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EmergencySOSProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SOSStep = "confirm" | "sending" | "sent";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export default function EmergencySOS({ open, onOpenChange }: EmergencySOSProps) {
  const [step, setStep] = useState<SOSStep>("confirm");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [shareLocation, setShareLocation] = useState(true);
  const [customMessage, setCustomMessage] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Demo contacts - in production, these would come from user's saved contacts
  const emergencyContacts: EmergencyContact[] = [
    { id: "1", name: "Campus Security", phone: "911", relationship: "Emergency" },
    { id: "2", name: "Mental Health Hotline", phone: "988", relationship: "Crisis Support" },
    { id: "3", name: "Trusted Friend", phone: "+1234567890", relationship: "Friend" },
  ];

  const toggleContact = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const getLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Location error:", error);
          toast.error("Could not get location. Alerts will be sent without location.");
        }
      );
    }
  }, []);

  const handleSendSOS = async () => {
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one contact");
      return;
    }

    setStep("sending");

    // Get location if enabled
    if (shareLocation && !location) {
      getLocation();
    }

    // Simulate sending alerts
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In production, this would:
    // 1. Call an edge function to send SMS/notifications
    // 2. Log the SOS event
    // 3. Trigger any emergency workflows

    setStep("sent");
    toast.success("Emergency alerts sent successfully");
  };

  const handleClose = () => {
    setStep("confirm");
    setSelectedContacts([]);
    setCustomMessage("");
    onOpenChange(false);
  };

  const emergencyResources = [
    { name: "National Suicide Prevention", number: "988", description: "24/7 crisis support" },
    { name: "Crisis Text Line", number: "Text HOME to 741741", description: "Text-based support" },
    { name: "SAMHSA Helpline", number: "1-800-662-4357", description: "Mental health support" },
  ];

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
              {/* Warning Banner */}
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-sm text-red-300">
                  This will send an emergency alert to your selected contacts with your current status and location.
                </p>
              </div>

              {/* Contact Selection */}
              <div className="space-y-3">
                <h3 className="text-sm font-orbitron uppercase tracking-wider text-muted-foreground">
                  Select Contacts to Alert
                </h3>
                {emergencyContacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => toggleContact(contact.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border transition-all text-left",
                      selectedContacts.includes(contact.id)
                        ? "bg-red-500/20 border-red-500/50"
                        : "bg-muted/20 border-border/30 hover:border-red-500/30"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            selectedContacts.includes(contact.id)
                              ? "bg-red-500/30"
                              : "bg-muted/30"
                          )}
                        >
                          <Users className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                        </div>
                      </div>
                      {selectedContacts.includes(contact.id) && (
                        <Check className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Location Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border/30">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Share Location</p>
                    <p className="text-xs text-muted-foreground">Include your current location</p>
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
                  placeholder="Add any additional details..."
                  className="w-full p-3 rounded-xl bg-muted/20 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-red-500/50"
                  rows={3}
                />
              </div>

              {/* Send Button */}
              <NeonButton
                variant="danger"
                className="w-full"
                onClick={handleSendSOS}
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Send Emergency Alert
              </NeonButton>

              {/* Crisis Resources */}
              <div className="space-y-3 pt-4 border-t border-border/30">
                <h3 className="text-sm font-orbitron uppercase tracking-wider text-muted-foreground">
                  Crisis Resources
                </h3>
                {emergencyResources.map((resource, i) => (
                  <a
                    key={i}
                    href={`tel:${resource.number.replace(/\D/g, "")}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/10 border border-border/20 hover:border-primary/30 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{resource.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {resource.number} • {resource.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
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
              <p className="text-lg font-orbitron text-foreground">Sending Alerts...</p>
              <p className="text-sm text-muted-foreground text-center">
                Contacting emergency contacts and sharing your location
              </p>
            </div>
          )}

          {step === "sent" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-10 h-10 text-emerald-400" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-orbitron text-foreground">Alerts Sent</p>
                <p className="text-sm text-muted-foreground">
                  {selectedContacts.length} contact(s) have been notified
                </p>
                {shareLocation && location && (
                  <p className="text-xs text-primary">Location shared successfully</p>
                )}
              </div>
              <div className="space-y-3 w-full">
                <p className="text-sm text-muted-foreground text-center">
                  Help is on the way. Stay where you are if safe to do so.
                </p>
                <NeonButton onClick={handleClose} className="w-full">
                  Close
                </NeonButton>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
