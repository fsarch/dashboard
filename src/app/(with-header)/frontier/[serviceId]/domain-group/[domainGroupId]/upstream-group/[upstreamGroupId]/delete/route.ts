import { frontierService } from '@/services/frontier/frontier.service';
import { NextResponse } from 'next/server';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ domainGroupId: string; upstreamGroupId: string }> }
) {
  const { domainGroupId, upstreamGroupId } = await params;

  try {
    await frontierService.deleteUpstreamGroup(domainGroupId, upstreamGroupId);
    const redirectUrl = await getServiceLocalUrl(`/domain-group/${domainGroupId}`);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete upstream group' }, { status: 500 });
  }
}
