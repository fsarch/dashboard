// service: material-tracing-server
// interface: MaterialTracingServerApi

namespace FsArchApiCatalog {
  type Part = {
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

  declare interface MaterialTracingServerApi {
    /**
     * Manage parts inside the Material-Tracing server
     */
    readonly parts: MaterialTracingPartsApi;
  }
}
