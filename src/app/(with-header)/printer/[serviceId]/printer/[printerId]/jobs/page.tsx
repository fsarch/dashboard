import AutoPrintMonitor from '@/app/(with-header)/printer/[serviceId]/printer/[printerId]/jobs/_components/AutoPrintMonitor.component';
import LocalPrinterPrintIcon from '@/app/(with-header)/printer/[serviceId]/printer/[printerId]/jobs/_components/LocalPrinterPrintIcon.component';
import LocalPrinterSettings from '@/app/(with-header)/printer/[serviceId]/printer/[printerId]/jobs/_components/LocalPrinterSettings.component';
import Badge from '@/components/universals/badge/badge.component';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import { printerService } from '@/services/printer/printer.service';
import { datetimeUtils } from '@/utils/datetime.utils';

export default async function JobsPage({
  params,
}: {
  params: Promise<{ printerId: string }>;
}) {
  const printerId = (await params).printerId;
  const jobs = await printerService.getNonPrinterJobs(printerId);

  return (
    <DefaultPage>
      <LocalPrinterSettings>
        <AutoPrintMonitor printerId={printerId} jobs={jobs} />
        <Section name="Printer Jobs">
          <List>
            {jobs.map((job) => (
              <ListItem
                key={job.id}
                right={
                  <>
                    <Badge>{datetimeUtils.formatDate(job.creationTime)}</Badge>
                    <LocalPrinterPrintIcon job={job} />
                  </>
                }
              >
                {job.id}
              </ListItem>
            ))}
          </List>
        </Section>
      </LocalPrinterSettings>
    </DefaultPage>
  );
}
