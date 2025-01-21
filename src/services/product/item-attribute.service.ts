import { fetchService } from "@/utils/fetchService";

const setItemAttribute = async (
  catalogId: string,
  itemId: string,
  attributeId: string,
  setDto: unknown
): Promise<{ id: string } | null> => {
  const res = await fetchService(`/v1/catalogs/${catalogId}/items/${itemId}/attributes/${attributeId}`, {
    method: 'PUT',
    body: JSON.stringify(setDto),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await res.json();
};

export const itemAttributeService = {
  setItemAttribute,
};
