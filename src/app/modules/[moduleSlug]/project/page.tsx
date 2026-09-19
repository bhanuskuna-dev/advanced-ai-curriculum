import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { getModule } from "@/lib/curriculum";
import { ProjectView } from "@/components/ProjectView";

export default async function ProjectPage({ params }: { params: Promise<{ moduleSlug: string }> }) {
  const { moduleSlug } = await params;
  const mod = getModule(moduleSlug);
  if (!mod) notFound();

  const filePath = path.join(process.cwd(), "content", moduleSlug, "project.md");
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    notFound();
  }

  return (
    <ProjectView
      moduleSlug={moduleSlug}
      moduleTitle={mod.title}
      title={mod.project.title}
      content={content}
    />
  );
}
