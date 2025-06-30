// service: product-server
// interface: ProductServerApi

namespace FsArchApiCatalog {
  type Item = {
    id: string;
    itemTypeId: string;
    parentItemId?: string;
    name: string;
    externalId?: string;
    attributes: Array<{
      id: string;
      value: unknown;
      attribute: {
        id: string;
        attributeTypeId: string;
        externalId?: string;
      }
    }>;
  };

  type ListAttributeElementsOptions = {
    include: Array<'localization'>;
  };

  interface ProductItemApi {
    /**
     * Receive a single item by its itemId
     * @param itemId
     */
    get(itemId: string): Item;
  }

  interface ProductElementApi {
    /**
     * List all elements of the given attribute.
     * Attribute has to be of type list.
     * @param attributeId
     * @param options
     */
    listByAttributeId(attributeId: string, options?: ListAttributeElementsOptions);
  }

  interface ProductAttributeApi {
    /**
     * Manage attribute elements inside the Product server.
     * This api is only available on attributes of the type list.
     */
    readonly elements: ProductElementApi;
  }

  declare interface ProductServerApi {
    /**
     * Manage items inside the Product server
     */
    readonly items: ProductItemApi;

    /**
     * Manage attributes inside the Product server
     */
    readonly attributes: ProductAttributeApi;
  }
}
