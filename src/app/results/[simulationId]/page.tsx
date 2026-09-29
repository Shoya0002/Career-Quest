import { Footer, Navbar } from "@/components/layout";
import { ExperienceReport } from "@/components/simulation";
export default async function ResultsPage({ params }: { params: Promise<{ simulationId: string }> }) { const { simulationId } = await params; return <div className="flex min-h-screen flex-col bg-background"><Navbar /><ExperienceReport simulationId={simulationId} /><Footer /></div>; }
