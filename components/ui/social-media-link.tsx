import Image from "next/image"
import Link from "next/link"

interface SocialMediaLinkProps {
  platform: "instagram" | "youtube" | "discord"
  username: string
  href: string
}

export function SocialMediaLink({ platform, username, href }: SocialMediaLinkProps) {
  return (
    <Link 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
    >
      <Image
        src={`/icons/${platform}.svg`}
        alt={`${platform} icon`}
        width={16}
        height={16}
        className="flex-shrink-0"
      />
      <span className="text-sm">{username}</span>
    </Link>
  )
}