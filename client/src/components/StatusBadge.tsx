import { CheckCircle2, CircleDashed, Clock, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ApplicationStatus, PaymentStatus } from "@/types/models";

type Status = ApplicationStatus | PaymentStatus | "Active" | "Ended";

const config: Record<
  Status,
  { variant: "success" | "warning" | "danger" | "info" | "secondary"; icon: React.ElementType; label?: string }
> = {
  Approved: { variant: "success", icon: CheckCircle2 },
  Paid: { variant: "success", icon: CheckCircle2 },
  Active: { variant: "success", icon: CheckCircle2 },
  Pending: { variant: "warning", icon: Clock },
  PartiallyPaid: { variant: "warning", icon: CircleDashed, label: "Partially paid" },
  Denied: { variant: "danger", icon: XCircle },
  Overdue: { variant: "danger", icon: AlertTriangle },
  Ended: { variant: "secondary", icon: CircleDashed },
};

const StatusBadge = ({ status, className }: { status: Status; className?: string }) => {
  const c = config[status] ?? config.Pending;
  const Icon = c.icon;
  return (
    <Badge variant={c.variant} className={className}>
      <Icon className="h-3 w-3" />
      {c.label ?? status}
    </Badge>
  );
};

export default StatusBadge;
