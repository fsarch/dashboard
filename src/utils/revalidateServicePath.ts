import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

const ensureLeadingSlash = (value: string): string => value.startsWith('/') ? value : `/${value}`;

export async function revalidateServicePath(path: string): Promise<void> {
  const requestHeaders = await headers();
  const serviceId = requestHeaders.get('X-Service-Id');
  const serviceType = requestHeaders.get('X-Service-Type');

  if (!serviceId || !serviceType) {
    return;
  }

  revalidatePath(`/${serviceType}/${serviceId}${ensureLeadingSlash(path)}`);
}

