import AuthForm from "../components/AuthForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk - Concer TIX",
  description: "Masuk ke akun Concer TIX Anda untuk membeli tiket konser dan event favorit.",
};

export default function LoginPage() {
  return <AuthForm initialMode="login" />;
}
