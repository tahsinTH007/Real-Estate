"use client";

import { useMemo } from "react";
import Loading from "@/components/Loading";
import SettingsForm from "@/components/SettingsForm";
import type { SettingsFormData } from "@/lib/schemas";
import { useGetAuthUserQuery, useUpdateTenantSettingsMutation } from "@/state/api";

const TenantSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateTenant] = useUpdateTenantSettingsMutation();

  const initialData = useMemo<SettingsFormData>(
    () => ({
      name: authUser?.userInfo.name ?? "",
      email: authUser?.userInfo.email ?? "",
      phoneNumber: authUser?.userInfo.phoneNumber ?? "",
    }),
    [authUser],
  );

  if (isLoading || !authUser) return <Loading />;

  const handleSubmit = async (data: SettingsFormData) => {
    await updateTenant({ cognitoId: authUser.cognitoInfo.userId, ...data }).unwrap();
  };

  return <SettingsForm initialData={initialData} onSubmit={handleSubmit} userType="tenant" />;
};

export default TenantSettings;
