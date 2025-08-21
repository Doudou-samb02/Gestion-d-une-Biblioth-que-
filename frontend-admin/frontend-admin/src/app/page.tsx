import { redirect } from "next/navigation";

export default function Home() {
  redirect("/admin-login"); // Redirige directement vers login
}

//pour modifier le login tu vas dans (auth)/admin-login/page.tsx