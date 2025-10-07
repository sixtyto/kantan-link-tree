<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const { user, loggedIn, clear } = useUserSession();

const handleLogout = async () => {
  await clear();
  await navigateTo("/login");
};

const userMenuItems: DropdownMenuItem[] = [
  [
    {
      label: "Profile",
      icon: "i-heroicons-user",
      to: "/profile",
    },
    {
      label: "Settings",
      icon: "i-heroicons-cog-6-tooth",
      to: "/settings",
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-right-on-rectangle",
      onSelect: handleLogout,
    },
  ],
];
</script>

<template>
  <UDashboardGroup>
    <UDashboardPanel>
      <template #header>
        <UDashboardNavbar>
          <template #title>
            <NuxtLink
              class="flex items-center gap-1.5 font-semibold text-highlighted truncate"
              to="/"
            >
              <UIcon name="i-lucide-link" />
              Kantan Link Tree
            </NuxtLink>
          </template>

          <template #right>
            <UColorModeButton />

            <template v-if="!loggedIn">
              <UButton to="/login" variant="ghost"> Login </UButton>
              <UButton to="/register" variant="solid"> Register </UButton>
            </template>

            <UDropdownMenu v-else :items="userMenuItems">
              <UButton variant="ghost" class="flex items-center gap-2">
                <UAvatar :text="user?.username?.charAt(0).toUpperCase()" />
                <span class="hidden sm:inline">{{ user?.username }}</span>
                <UIcon name="i-heroicons-chevron-down" class="w-4 h-4" />
              </UButton>
            </UDropdownMenu>
          </template>
        </UDashboardNavbar>
      </template>

      <template #body>
        <slot />
        <ConfirmModal />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
