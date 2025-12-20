import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import Section from "@/components/universals/section/Section";
import { materialTypeService } from "@/services/material-tracing/material-type.service";
import { manufacturerService } from "@/services/material-tracing/manufacturer.service";
import { createAutomaticMetadata } from "@/utils/createAutomaticMetadata";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export const generateMetadata = createAutomaticMetadata();

export default async function ArchivePage() {
  const manufacturers = await manufacturerService.listManufacturers();
  const materialTypes = await materialTypeService.listMaterialTypes({ isArchived: true });

  return (
    <DefaultPage>
      <h2>Archivierte Material-Types</h2>
      {manufacturers.map((manufacturer) => (
        <Section name={manufacturer.name} key={manufacturer.id}>
          <List>
            {materialTypes.filter(mat => mat.manufacturerId === manufacturer.id).map(async (materialType) => (
              <Link
                key={materialType.id}
                href={await getServiceLocalUrl(`/material-type/${materialType.id}`)}
              >
                <ListItem>
                  {materialType.name}
                </ListItem>
              </Link>
            ))}
          </List>
        </Section>
      ))}
    </DefaultPage>
  );
}

