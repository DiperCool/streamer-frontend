import { redirect } from 'next/navigation';

export default function BannedUsersPage({ params }: { params: { username: string } }) {
  redirect(`/dashboard/${params.username}/channel/chat`);
}