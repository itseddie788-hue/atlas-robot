import { Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ComingSoonDialog({
  open,
  onOpenChange,
  title,
  description,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="hud-panel border-primary/40">
        <DialogHeader>
          <span className="mb-2 flex w-fit items-center gap-2 rounded-full border border-primary/40 px-3 py-1 text-[0.65rem] tracking-[0.3em] text-primary uppercase">
            <Clock className="h-3 w-3" />
            Coming Soon
          </span>
          <DialogTitle className="font-display tracking-wide">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
