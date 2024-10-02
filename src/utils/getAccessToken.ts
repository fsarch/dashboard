import { getServerSession } from "next-auth";
import { AUTH_OPTIONS } from "@/constants/auth-options";

export async function getAccessToken(): Promise<string | undefined> {
  const session = await getServerSession({
    ...AUTH_OPTIONS,
    callbacks: {
      ...AUTH_OPTIONS.callbacks,
      session: async ({ token }) => {
        return {
          accessToken: (token as any).accessToken,
        };
      },
    },
  });

  return (session as any)?.accessToken;
}
