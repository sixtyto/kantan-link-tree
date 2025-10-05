<script setup lang="ts">
import type { ButtonProps, PageCardProps } from "@nuxt/ui";

const cards = ref<PageCardProps[]>([
  {
    title: "Easy Setup",
    description:
      "Create your personalized link tree in minutes with our intuitive drag-and-drop interface.",
    icon: "i-lucide-zap",
  },
  {
    title: "Custom Branding",
    description:
      "Make it uniquely yours with custom themes, colors, and your own profile picture.",
    icon: "i-lucide-palette",
  },
  {
    title: "Analytics & Insights",
    description:
      "Track your link performance with detailed analytics to optimize your reach.",
    icon: "i-lucide-bar-chart-3",
  },
]);

const links = ref<ButtonProps[]>([
  {
    label: "Create Your Link Tree",
    color: "primary",
    to: "/register",
  },
  {
    label: "View Examples",
    color: "neutral",
    variant: "subtle",
    trailingIcon: "i-lucide-arrow-right",
  },
]);
</script>

<template>
  <UPage>
    <UPageBody>
      <UPageHero
        title="Kantan Link Tree"
        description="The easiest way to create a beautiful, personalized link tree that drives traffic to all your important links."
        headline="Your links, beautifully organized"
        :links
      />

      <UPageGrid>
        <UPageCard v-for="card in cards" :key="card.title" v-bind="card" />
      </UPageGrid>

      <UPageCTA
        title="Join thousands of creators and influencers"
        description="Perfect for social media bios, business cards, and anywhere you need to share multiple links. Start building your professional presence today."
        :links
      />
    </UPageBody>
  </UPage>
</template>
