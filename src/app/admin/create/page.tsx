
import { getCategories } from "@/lib/queries";
import CreateNewsForm from "./CreateNewsForm";

export default async function CreateNewsPage() {
  const categories = await getCategories();
  return <CreateNewsForm categories={categories} />;
}
