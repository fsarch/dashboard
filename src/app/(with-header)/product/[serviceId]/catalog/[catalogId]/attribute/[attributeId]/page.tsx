import { attributeService } from "@/services/product/attribute.service";
import AttributeEditForm from "@/components/apps/product/attribute/AttributeEditForm";
import { localizationService } from "@/services/product/localization.service";
import AttributeLocalization from "@/components/apps/product/attribute/localization/AttributeLocalization";
import { AttributeType } from "@/services/product/attribute.const";
import ListAttributeElementList from "@/components/apps/product/attribute/list/ListAttributeElementList";
import ListAttributeElementCreateForm from "@/components/apps/product/attribute/list/ListAttributeElementCreateForm";
import Section from "@/components/universals/section/Section";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function Home(props: { params: Promise<{ catalogId: string; attributeId: string; }> }) {
  const params = await props.params;
  const attribute = await attributeService.getAttribute(params.catalogId, params.attributeId, {
    include: ['localizations'],
  });
  const localizations = await localizationService.listLocalizations();

  return (
    <DefaultPage>
      <AttributeEditForm
        catalogId={params.catalogId}
        attribute={attribute}
      />
      {attribute.attributeTypeId === AttributeType.LIST && (
        <Section
          name="Listeneinträge"
        >
          <ListAttributeElementList
            catalogId={params.catalogId}
            attributeId={attribute.id}
          />
          <ListAttributeElementCreateForm catalogId={params.catalogId} attributeId={params.attributeId}/>
        </Section>
      )}
      <Section
        name="Localizations"
      >
        {localizations.map((localization) => (
          <div key={localization.id}>
            <h3>{localization.name}</h3>
            <AttributeLocalization
              catalogId={params.catalogId}
              attributeId={attribute.id}
              localizationId={localization.id}
              attributeLocalization={attribute.localizations.find(l => l.localizationId === localization.id)}
            />
          </div>
        ))}
      </Section>
    </DefaultPage>
  );
}
