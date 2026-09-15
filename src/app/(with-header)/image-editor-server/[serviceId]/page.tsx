import { redirect } from 'next/navigation';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

export default async function Home() {
  const projectUrl = await getServiceLocalUrl('/project');
  redirect(projectUrl);
}
