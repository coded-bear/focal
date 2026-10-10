import { getDictionary } from "@/i18n/dictionaries";

export default async function Home() {
  const dict = await getDictionary();

  return <h1>{dict.home.title}</h1>;
}
