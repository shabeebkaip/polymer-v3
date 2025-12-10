import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

interface StatusCardProps {
  statusConfig: {
    bgColor: string;
    textColor: string;
    borderColor: string;
    text: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  createdAt: string;
}

export const StatusCard = ({ statusConfig, createdAt }: StatusCardProps) => {
  const StatusIcon = statusConfig.icon;

  return (
    <Card className={`${statusConfig.borderColor} border-l-4`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <StatusIcon className={`h-4 w-4 ${statusConfig.textColor}`} />
          Status
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={`${statusConfig.bgColor} ${statusConfig.textColor} p-3 rounded-lg`}>
          <p className="font-semibold text-sm">{statusConfig.text}</p>
          <p className="text-xs opacity-75 mt-1">
            {formatDate(createdAt)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
