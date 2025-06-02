import { Metadata } from "next";
import { getCurrentServiceBaseConfiguration } from "@/utils/configuration.utils";
import { SERVICES } from "@/constants/services";

export function createAutomaticMetadata(): () => Promise<Metadata> {
  return async () => {
    const serviceConfiguration = await getCurrentServiceBaseConfiguration();
    const serviceTypeName = SERVICES[serviceConfiguration.type].name

    const parts = [];
    parts.push(serviceTypeName);
    parts.push(serviceConfiguration.name ?? 'Unknown');

    return {
      title: parts.join(' - '),
    };
  };
}
