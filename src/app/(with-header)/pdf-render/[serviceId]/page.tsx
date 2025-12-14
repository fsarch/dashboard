import PdfRenderForm from "@/components/apps/pdf-render/PdfRenderForm";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function Home() {
  return (
    <DefaultPage>
      <PdfRenderForm/>
    </DefaultPage>
  );
}
