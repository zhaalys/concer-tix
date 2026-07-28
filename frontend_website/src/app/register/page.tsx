import { AuthForm } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Akun - Concer TIX",
  description: "Daftar akun Concer TIX baru dan dapatkan kemudahan membeli tiket konser musik dan wahana.",
};

export default function RegisterPage() {
  return <AuthForm initialMode="register" />;
}
