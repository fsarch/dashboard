import { attributeService } from "@/services/product/attribute.service";
import { localizationService } from "@/services/product/localization.service";
import AttributeElementLocalization
  from "@/components/apps/product/attribute/list/element-localization/AttributeElementLocalization";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function Home(
  props: { params: Promise<{ catalogId: string; attributeId: string; elementId: string; }> }
) {
  const params = await props.params;
  const attributeLocalizations = await attributeService.listAttributeElementLocalizations(params.catalogId, params.attributeId, params.elementId);
  const localizations = await localizationService.listLocalizations();

  return (
    <DefaultPage>
      Element-Localizations
      {localizations.map((localization) => (
        <div key={localization.id}>
          <h3>{localization.name}</h3>
          <AttributeElementLocalization
            catalogId={params.catalogId}
            attributeId={params.attributeId}
            elementId={params.elementId}
            localizationId={localization.id}
            elementLocalization={attributeLocalizations.find(l => l.localizationId === localization.id)}
          />
        </div>
      ))}
    </DefaultPage>
  );
}
