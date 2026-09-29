import type { Metadata } from "next";
import { CareerDetail } from "@/components/careers";
import { Footer, Navbar } from "@/components/layout";

export const metadata: Metadata = { title: "Career details | CareerQuest" };

export default async function CareerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <div className="flex min-h-screen flex-col bg-background"><Navbar /><CareerDetail slug={slug} /><Footer /></div>;
}
