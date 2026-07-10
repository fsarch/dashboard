import { frontierService } from '@/services/frontier/frontier.service';
import { NextResponse } from 'next/server';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ domainGroupId: string; upstreamGroupId: string; upstreamId: string }> }
) {
  const { domainGroupId, upstreamGroupId, upstreamId } = await params;

  try {
    await frontierService.deleteUpstream(domainGroupId, upstreamGroupId, upstreamId);
    const redirectUrl = await getServiceLocalUrl(`/domain-group/${domainGroupId}/upstream-group/${upstreamGroupId}`);
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete upstream' }, { status: 500 });
  }
}
