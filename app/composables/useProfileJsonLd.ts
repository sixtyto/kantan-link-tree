interface ProfileJsonLdData {
  name: string;
  username: string;
  bio?: string | null;
  avatar?: string | null;
  links?: Array<{ title: string; url: string }>;
}

export function useProfileJsonLd(profile: ProfileJsonLdData) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: profile.name || profile.username,
    description: profile.bio || `${profile.username}'s link tree`,
    image: profile.avatar,
    url: `https://kantan-link-tree.vercel.app/u/${profile.username}`,
    mainEntity: {
      "@type": "Person",
      name: profile.name || profile.username,
      description: profile.bio,
      image: profile.avatar,
      identifier: profile.username,
      url: `https://kantan-link-tree.vercel.app/u/${profile.username}`,
    },
  };

  useHead({
    script: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify(jsonLd),
      },
    ],
  });
}
