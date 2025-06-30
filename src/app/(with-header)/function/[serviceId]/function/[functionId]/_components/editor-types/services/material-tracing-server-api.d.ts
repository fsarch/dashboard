// service: material-tracing-server
// interface: MaterialTracingServerApi

namespace FsArchApiCatalog {
  type Part = {
    id: string;
    name: string;
    externalId?: string;
    partTypeId: string;
  };

  type PartType = {
    id: string;
    name: string;
    externalId?: string;
  };

  interface MaterialTracingPartsApi {
    /**
     * Receive a single part by its ID
     * @param partId
     */
    get(partId: string): Part;
  }

  interface MaterialTracingPartTypesApi {
    /**
     * Receive a single part-type by its ID
     * @param partId
     */
    get(partId: string): PartType;
  }

  declare interface MaterialTracingServerApi {
    /**
     * Manage parts inside the Material-Tracing server
     */
    readonly parts: MaterialTracingPartsApi;
  }

  declare interface MaterialTracingServerApi {
    /**
     * Manage part-types inside the Material-Tracing server
     */
    readonly partTypes: MaterialTracingPartTypesApi;
  }
}
