<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import z from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type ChangePasswordType = z.infer<typeof changePasswordSchema>;

const passwordLoading = ref(false);

const passwordFields: AuthFormField[] = [
  {
    name: "currentPassword",
    type: "password",
    label: "Current Password",
    placeholder: "Enter your current password",
    required: true,
  },
  {
    name: "newPassword",
    type: "password",
    label: "New Password",
    placeholder: "Enter your new password",
    required: true,
  },
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirm New Password",
    placeholder: "Confirm your new password",
    required: true,
  },
];

async function handlePasswordChange(
  event: FormSubmitEvent<ChangePasswordType>
) {
  passwordLoading.value = true;

  try {
    await $fetch("/api/user/change-password", {
      method: "POST",
      body: {
        currentPassword: event.data.currentPassword,
        newPassword: event.data.newPassword,
      },
    });

    const toast = useToast();
    toast.add({
      title: "Password Changed",
      description: "Your password has been changed successfully.",
      color: "success",
    });
  } catch {
    const toast = useToast();
    toast.add({
      title: "Password Change Failed",
      description:
        "Failed to change password. Please check your current password.",
      color: "error",
    });
  } finally {
    passwordLoading.value = false;
  }
}
</script>

<template>
  <UPageCard
    title="Change Password"
    description="Update your password to keep your account secure"
  >
    <UAuthForm
      :schema="changePasswordSchema"
      :fields="passwordFields"
      :loading="passwordLoading"
      submit-label="Change Password"
      @submit="handlePasswordChange"
    />
  </UPageCard>
</template>
