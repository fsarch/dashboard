import React from 'react';
import { partService } from "@/services/material-tracing/part.service";
import List from "@/components/universals/list/List";
import ListItem from "@/components/universals/list/ListItem";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";

type PartMaterialListProps = {
  partId: string;
};

const PartMaterialList: React.FunctionComponent<PartMaterialListProps> = async ({
  partId,
}) => {
  const materials = await partService.listMaterials(partId);

  return (
    <List>
      {materials.map(async (material) => (
        <Link href={await getServiceLocalUrl(`/material/${material.id}`)} key={material.id}>
          <ListItem>
            {material.name}
          </ListItem>
        </Link>
      ))}
    </List>
  );
};

export default PartMaterialList;
