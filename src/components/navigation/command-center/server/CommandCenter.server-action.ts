'use server';

import { AppType, appUtils } from "@/utils/app/app.utils";

export type QueryResponseType = {
  apps: Array<AppType>;
};

export async function queryData(query: string = ''): Promise<QueryResponseType> {
  return {
    apps: await appUtils.getApps(),
  };
}
