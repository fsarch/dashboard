import { printerService } from "@/services/printer/printer.service";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import Section from "@/components/universals/section/Section";

export default async function Home({ params }: { params: Promise<{ printerId: string }> }) {
  const printerId = (await params).printerId;
  const printer = await printerService.getPrinter(printerId);

  return (
    <DefaultPage>
      <Section name="Printer Details">
        <p>{printer.name}</p>
      </Section>
    </DefaultPage>
  );
}