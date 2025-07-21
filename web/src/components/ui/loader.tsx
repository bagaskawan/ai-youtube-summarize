import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

export const LoaderCircle = ({
  className,
  ...props
}: React.ComponentProps<typeof Loader>) => {
  return <Loader className={cn("animate-spin", className)} {...props} />;
};
