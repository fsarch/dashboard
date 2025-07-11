import { printerService } from "@/services/printer/printer.service";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import Section from "@/components/universals/section/Section";
import Link from "next/link";
import Button from "@/components/universals/forms/Button";

export default async function Home({ params }: { params: Promise<{ printerId: string, serviceId: string }> }) {
  const { printerId, serviceId } = await params;
  const printer = await printerService.getPrinter(printerId);

  return (
    <DefaultPage>
      <Section name="Printer Details">
        <p>{printer.name}</p>
        <Link href={`/printer/${serviceId}/printer/${printerId}/jobs`}>
          <Button type="button">
            Jobs anzeigen
          </Button>
        </Link>
      </Section>
    </DefaultPage>
  );
}
