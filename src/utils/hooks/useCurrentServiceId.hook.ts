import { useParams } from "next/navigation";

export function useCurrentServiceId(): string {
  return useParams<{ serviceId: string }>().serviceId;
}
