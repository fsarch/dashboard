import { attributeService } from "@/services/product/attribute.service";
import AttributeEditForm from "@/components/apps/product/attribute/AttributeEditForm";
import { localizationService } from "@/services/product/localization.service";
import AttributeLocalization from "@/components/apps/product/attribute/localization/AttributeLocalization";

export default async function Home({ params }: { params: { catalogId: string; attributeId: string; } }) {
  const attribute = await attributeService.getAttribute(params.catalogId, params.attributeId, {
    include: ['localizations'],
  });
  const localizations = await localizationService.listLocalizations();

  return (
    <main>
      Attribute
      <AttributeEditForm
        attribute={attribute}
      />
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
    </main>
  );
}
