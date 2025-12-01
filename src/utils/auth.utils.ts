import { getAccessToken } from "@/utils/getAccessToken";
import { forbidden } from "next/navigation";

async function requireAuth() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return forbidden();
  }
}

export const authUtils = {
  requireAuth,
};
