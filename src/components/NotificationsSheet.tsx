import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Bell } from "lucide-react";

interface NotificationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NotificationsSheet({ open, onOpenChange }: NotificationsSheetProps) {
  // No fake notifications - only real-time notifications will be shown here
  // In a real implementation, this would connect to a notification service

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background border-l border-border w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="font-orbitron text-xl text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Empty state - only real notifications will appear here */}
        <div className="flex flex-col items-center justify-center py-12 text-center mt-6">
          <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">No notifications yet</p>
          <p className="text-sm text-muted-foreground/70 mt-2 max-w-[200px]">
            You'll see real-time updates here when something important happens
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
