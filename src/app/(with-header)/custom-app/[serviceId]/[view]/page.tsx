import { getServiceConfigurationById } from "@/utils/configuration.utils";
import { customAppUtils } from "@/components/apps/custom-app/custom-app.utils";
import { PageNotFoundError } from "next/dist/shared/lib/utils";
import CustomAppViewComponent from "@/components/apps/custom-app/CustomAppView.component";
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";

export default async function Home({ params, searchParams }: Readonly<{ params: Promise<{ serviceId: string; view: string }>; searchParams: Promise<Record<string, string>> }>) {
  const customApp = await getServiceConfigurationById((await params).serviceId);

  const customAppConfig = await customAppUtils.getCustomAppConfig((await params).serviceId);
  if (!customAppConfig || !customApp || customApp.type !== 'custom-app') {
    throw new PageNotFoundError('');
  }

  const viewString = (await params).view;
  const view = customAppConfig.views.find(v => v.id === viewString);
  if (!view) {
    throw new PageNotFoundError('view not found');
  }

  return (
    <DefaultPage>
      <CustomAppViewComponent
        view={view}
        app={customApp}
        searchParams={await searchParams}
      />
    </DefaultPage>
  );
}
