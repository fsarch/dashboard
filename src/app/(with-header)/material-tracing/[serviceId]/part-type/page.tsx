import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Section from "@/components/universals/section/Section";
import {
  MaterialTypeCreateForm
} from "@/components/apps/material-tracing/material-type/MaterialTypeCreateForm.component";
import Link from "next/link";
import { partTypeService } from "@/services/material-tracing/part-type.service";
import GeneratedForm from "@/components/universals/forms/generated/GeneratedForm.component";
import { MATERIAL_TYPE_CREATE_FORM } from "@/services/material-tracing/material-type.forms";
import { PART_TYPE_CREATE_FORM } from "@/services/material-tracing/part-type.forms";

export default async function Home() {
  const partTypes = await partTypeService.listPartTypes();

  return (
    <main>
      <Section name="Part-Types">
        <List>
          {partTypes.map(async (partType) => (
            <Link
              key={partType.id}
              href={await getServiceLocalUrl(`/part-type/${partType.id}`)}
            >
              <ListItem>
                {partType.name}
              </ListItem>
            </Link>
          ))}
        </List>
      </Section>
      <Section name="PartType erstellen">
        <GeneratedForm
          definition={PART_TYPE_CREATE_FORM}
        />
      </Section>
    </main>
  );
}
