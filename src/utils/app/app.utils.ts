import { TIcon } from "@/components/universals/icon/Icon.type";
import { uacUtils } from "@/utils/uac.utils";

export type AppType = { icon?: TIcon; name: string; path: string; };

const apps: Array<AppType> = [{
  icon: 'tag',
  name: 'Product',
  path: '/product',
},/* {
  icon: 'table',
  name: 'DataTable',
  path: '/datatable',
}, {
  icon: 'message',
  name: 'Customer Communication',
  path: '/ccm',
},*/ {
  icon: 'image',
  name: 'Image Server',
  path: '/image',
}, {
  icon: 'industry',
  name: 'Material Tracing',
  path: '/material-tracing',
}, {
  icon: 'file-pdf',
  name: 'PDF Render',
  path: '/pdf-render',
}, {
  icon: 'code',
  name: 'Functions',
  path: '/function',
}, {
  icon: 'print',
  name: 'Printer',
  path: '/printer',
}, {
  icon: 'robot',
  name: 'AI',
  path: '/ai',
}, {
  icon: 'message',
  name: 'Email',
  path: '/email',
}, {
  icon: 'shield',
  name: 'Frontier',
  path: '/frontier',
}];

const getApps = async () => {
  const availableApps = [...apps];

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
