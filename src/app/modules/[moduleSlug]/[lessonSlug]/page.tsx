import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { getModule, getLesson, getAdjacentLessons } from "@/lib/curriculum";
import { LessonView } from "@/components/LessonView";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}) {
  const { moduleSlug, lessonSlug } = await params;
  const mod = getModule(moduleSlug);
  const lesson = getLesson(moduleSlug, lessonSlug);
  if (!mod || !lesson) notFound();

  const filePath = path.join(process.cwd(), "content", moduleSlug, `${lessonSlug}.md`);
  let content: string;
  try {
    content = fs.readFileSync(filePath, "utf-8");
  } catch {
    notFound();
  }

  const { prev, next } = getAdjacentLessons(moduleSlug, lessonSlug);

  return (
    <LessonView
      moduleSlug={moduleSlug}
      lessonSlug={lessonSlug}
      moduleTitle={mod.title}
      title={lesson.title}
      content={content}
      prev={prev}
      next={next}
      isLastLesson={!next}
    />
  );
}
