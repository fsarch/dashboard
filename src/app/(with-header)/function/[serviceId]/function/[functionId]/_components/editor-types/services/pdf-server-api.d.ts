// service: pdf-server
// interface: PdfServerApi

namespace FsArchApiCatalog {
  type RenderPdfOptions = {
    /**
     * Sets the viewport of the document on which the PDF should be generated.
     * The viewport could change the positioning and rendering of the given html (e.g. mobile view).
     */
    viewport: {
      /**
       * The width of the viewport in px
       */
      width: number;
      /**
       * The height of the viewport in px
       */
      height: number;
    };
    /**
     * Specifies the format and settings of the generated PDF file
     */
    export: {
      /**
       * Use a fixed format (e.g. DIN A4, DIN A5)
       */
      format: 'A4';
    };
  };

  declare interface PdfServerApi {

    /**
     * Creates a pdf document from the given html code
     * @param html
     * @param options
     */
    renderPdf(html: string, options?: RenderPdfOptions): Promise<void>;
  }
}
