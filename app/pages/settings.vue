<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <UPage>
    <UPageHeader
      headline="Account Settings"
      title="Manage Your Account"
      description="Update your profile, change your password, or manage your account settings."
    />

    <UPageBody>
      <UPageGrid>
        <div>
          <SettingsProfileSettings />
        </div>

        <div>
          <SettingsPasswordSettings />
        </div>

        <div>
          <SettingsDeleteAccount />
        </div>
      </UPageGrid>
    </UPageBody>
  </UPage>
</template>
