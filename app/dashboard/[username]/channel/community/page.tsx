import { redirect } from 'next/navigation';

export default function CommunityRootPage({ params }: { params: { username: string } }) {
  redirect(`/dashboard/${params.username}/channel/community/followers`);
}