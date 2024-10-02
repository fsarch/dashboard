import { AuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const AUTH_OPTIONS: AuthOptions = {
  providers: [
    KeycloakProvider({
      name: 'OIDC',
      id: 'oidc-mgmt',
      issuer: process.env.AUTH_ISSUER!,
      clientId: process.env.AUTH_CLIENT_ID!,
      clientSecret: process.env.AUTH_CLIENT_SECRET!,
      style: {
        logo: '',
        text: '#FFFFFF',
        bg: '#000000',
      },
    }),
  ],
  callbacks: {
    async jwt({token, user, account, profile}) {
      /*console.log("Token: ");
      console.log(token);

      console.log("User: ");
      console.log(user);

      console.log("Account: ");
      console.log(account);

      console.log("Profile: ");
      console.log(profile);
      */
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
};
