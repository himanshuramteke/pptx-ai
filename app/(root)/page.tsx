import { getCurrentUser } from "@/modules/authentication/actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();
  if (!user) {
    return redirect("/login");
  }
  return <div></div>;
}
