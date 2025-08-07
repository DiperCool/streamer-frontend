import Link from "next/link"
import InstagramIcon from "@/public/instagram.svg";
import YoutubeIcon from "@/public/youtube.svg";
import DiscordIcon from "@/public/discord.svg";
interface SocialMediaLinkProps {
  platform: "instagram" | "youtube" | "discord"
  username: string
  href: string
}
const icons = {
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  discord: DiscordIcon,
};
export function SocialMediaLink({ platform, username, href }: SocialMediaLinkProps) {
  const IconComponent = icons[platform];
  return (
      <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors"
      >
        <IconComponent className="h-4 w-4 fill-current flex-shrink-0" />
        <span className="text-sm">{username}</span>
      </Link>
  )
}