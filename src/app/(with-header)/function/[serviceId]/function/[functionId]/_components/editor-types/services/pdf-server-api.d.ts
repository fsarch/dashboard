// service: pdf-server
// interface: PdfServerApi

namespace FsArchApiCatalog {
  declare interface PdfServerApi {
    renderPdf(): Promise<void>;
  }
}
