"use client";

import { useMemo } from "react";
import Loading from "@/components/Loading";
import SettingsForm from "@/components/SettingsForm";
import type { SettingsFormData } from "@/lib/schemas";
import { useGetAuthUserQuery, useUpdateManagerSettingsMutation } from "@/state/api";

const ManagerSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateManager] = useUpdateManagerSettingsMutation();

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
    await updateManager({ cognitoId: authUser.cognitoInfo.userId, ...data }).unwrap();
  };

  return <SettingsForm initialData={initialData} onSubmit={handleSubmit} userType="manager" />;
};

export default ManagerSettings;
