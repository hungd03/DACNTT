import { Suspense } from "react";
import CategoryProducts from "./CategoryProducts";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryProducts slug={slug} />
    </Suspense>
  );
}
