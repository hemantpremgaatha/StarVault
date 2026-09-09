import type { Metadata } from "next";
import { VaultApp } from "@/components/app/VaultApp";

export const metadata: Metadata = {
  title: "StarVault — Vault",
  description: "Unlock your encrypted StarVault: permissions, the data access barrier, the network layer, and the privacy scanner."
};

export default function VaultAppPage() {
  return <VaultApp />;
}
