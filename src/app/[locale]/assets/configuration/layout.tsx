import { ReactNode } from "react";
import { ConfigurationLayout } from "@/components/modules/assets/configuration/ConfigurationLayout";

export default function ConfigurationLayoutRoot({
  children,
}: {
  children: ReactNode;
}) {
  return <ConfigurationLayout>{children}</ConfigurationLayout>;
}
