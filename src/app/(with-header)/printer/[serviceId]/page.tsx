import Link from 'next/link';
import { PrinterCreateForm } from '@/components/apps/printer/PrinterCreateForm.component';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { printerService } from '@/services/printer/printer.service';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

export default async function Home() {
  const printers = await printerService.listPrinters();

  return (
    <DefaultPage>
      <Section name="Printers">
        <List>
          {printers.map(async (printer) => (
            <Link
              key={printer.id}
              href={await getServiceLocalUrl(`/printer/${printer.id}`)}
            >
              <ListItem>{printer.name}</ListItem>
            </Link>
          ))}
        </List>
      </Section>
      <Section name="Create Printer">
        <PrinterCreateForm />
      </Section>
    </DefaultPage>
  );
}
