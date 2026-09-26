import Link from 'next/link';
import type React from 'react';
import PartMaterialDeleteButton from '@/components/apps/material-tracing/short-code/part/part-material/PartMaterialDeleteButton.component';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import { partService } from '@/services/material-tracing/part.service';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

type PartMaterialListProps = {
  partId: string;
};

const PartMaterialList: React.FunctionComponent<
  PartMaterialListProps
> = async ({ partId }) => {
  const materials = await partService.listMaterials(partId);

  if (!materials?.length) {
    return <div>Keine Materials verbunden.</div>;
  }

  return (
    <List>
      {materials.map(async (material) => (
        <Link
          href={await getServiceLocalUrl(`/material/${material.id}`)}
          key={material.id}
        >
          <ListItem
            right={
              <PartMaterialDeleteButton
                partId={partId}
                materialId={material.id}
              />
            }
          >
            {material.name}
          </ListItem>
        </Link>
      ))}
    </List>
  );
};

export default PartMaterialList;
