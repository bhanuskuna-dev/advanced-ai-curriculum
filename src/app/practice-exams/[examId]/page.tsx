import { notFound } from "next/navigation";
import { getExam } from "@/content/exams";
import { ExamRunner } from "@/components/ExamRunner";

export default async function ExamPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  const exam = getExam(examId);
  if (!exam) notFound();

  return <ExamRunner exam={exam} />;
}
