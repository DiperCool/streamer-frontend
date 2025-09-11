import { redirect } from 'next/navigation';

export default function ContentRootPage({ params }: { params: { username: string } }) {
  redirect(`/dashboard/${params.username}/content/vods`);
}