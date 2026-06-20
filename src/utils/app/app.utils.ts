import { TIcon } from "@/components/universals/icon/Icon.type";
import { EServiceType } from "@/utils/configuration.type";
import { getServiceConfigurations } from "@/utils/configuration.utils";
import { uacUtils } from "@/utils/uac.utils";

export type AppType = { icon?: TIcon; name: string; path: string; };

type TVisibleApp = AppType;
type TConfiguredApp = TVisibleApp & { serviceType: EServiceType; };

const apps: Array<TConfiguredApp> = [{
  icon: 'tag',
  name: 'Product',
  path: '/product',
  serviceType: EServiceType.PIM,
},/* {
  icon: 'table',
  name: 'DataTable',
  path: '/datatable',
  serviceType: EServiceType.DATATABLE,
}, {
  icon: 'message',
  name: 'Customer Communication',
  path: '/ccm',
  serviceType: EServiceType.CUSTOMER_COMMUNICATION,
},*/ {
  icon: 'image',
  name: 'Image Server',
  path: '/image',
  serviceType: EServiceType.IMAGE,
}, {
  icon: 'industry',
  name: 'Material Tracing',
  path: '/material-tracing',
  serviceType: EServiceType.MATERIAL_TRACING,
}, {
  icon: 'file-pdf',
  name: 'PDF Render',
  path: '/pdf-render',
  serviceType: EServiceType.PDF_RENDER,
}, {
  icon: 'code',
  name: 'Functions',
  path: '/function',
  serviceType: EServiceType.FUNCTION,
}, {
  icon: 'print',
  name: 'Printer',
  path: '/printer',
  serviceType: EServiceType.PRINTER,
}, {
  icon: 'robot',
  name: 'AI',
  path: '/ai',
  serviceType: EServiceType.AI,
}, {
  icon: 'message',
  name: 'Email',
  path: '/email',
  serviceType: EServiceType.EMAIL_SERVER,
}, {
  icon: 'shield',
  name: 'Frontier',
  path: '/frontier',
  serviceType: EServiceType.FRONTIER,
}, {
  icon: 'gavel',
  name: 'Credence',
  path: '/credence',
  serviceType: EServiceType.CREDENCE,
}, {
  icon: 'shield-halved',
  name: 'Bot Protection',
  path: '/bot-protection',
  serviceType: EServiceType.BOT_PROTECTION,
}];

const getApps = async () => {
  const availableApps: TVisibleApp[] = [];

  for (const app of apps) {
    const services = await getServiceConfigurations(app.serviceType);

    const hasServiceAccess = services.length === 0
      ? true
      : (await Promise.all(
        services.map((service) => uacUtils.hasAppPermission(app.serviceType, service.id)),
      )).some(Boolean);

    if (hasServiceAccess) {
      availableApps.push(app);
    }
  }

  if (await uacUtils.hasPermission('dev')) {
    availableApps.push({
      icon: 'wrench',
      name: 'Development',
      path: '/development',
    });
  }

  return availableApps;
};

export const appUtils = {
  getApps,
};
