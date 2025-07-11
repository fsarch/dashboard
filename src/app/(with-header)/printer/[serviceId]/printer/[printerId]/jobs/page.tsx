import { printerService } from "@/services/printer/printer.service";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import Section from "@/components/universals/section/Section";
import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import Badge from "@/components/universals/badge/badge.component";
import { datetimeUtils } from "@/utils/datetime.utils";

export default async function JobsPage({ params }: { params: Promise<{ printerId: string }> }) {
  const printerId = (await params).printerId;
  const jobs = await printerService.getJobs(printerId);

  return (
    <DefaultPage>
      <Section name="Printer Jobs">
        <List>
          {jobs.map((job) => (
            <ListItem
              key={job.id}
              right={<Badge>{datetimeUtils.formatDate(job.creationTime)}</Badge>}
            >
              {job.id}
            </ListItem>
          ))}
        </List>
      </Section>
    </DefaultPage>
  );
}