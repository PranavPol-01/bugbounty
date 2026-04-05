import Badge from "@/components/ui/Badge";
export default function ReportStatusBadge({ status }) {
  return <Badge variant={status?.toLowerCase() || "pending"}>{status || "Pending"}</Badge>;
}
