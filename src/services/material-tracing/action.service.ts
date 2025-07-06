import { fetchService } from "@/utils/fetchService";
import { TManufacturer } from "@/services/material-tracing/manufacturer.type";
import { TAction } from "@/services/material-tracing/action.type";

const listActions = async (): Promise<Array<TAction>> => {
  const userInterfaceResponse = await fetchService('/v1/.meta/user-interface');
  const userInterface = await userInterfaceResponse.json();

  return userInterface.customActions as Array<TAction>;
};

const listActionsByResource = async (resource: string): Promise<Array<TManufacturer>> => {
  const actions = await listActions();

  return actions.filter(action => action.resources.includes(resource));
};

export const actionService = {
  listActionsByResource,
};
