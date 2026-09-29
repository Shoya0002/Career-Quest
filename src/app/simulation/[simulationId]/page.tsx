import { Footer, Navbar } from "@/components/layout";
import { SimulationPlayer } from "@/components/simulation";
export default async function SimulationPage({ params }: { params: Promise<{ simulationId: string }> }) { const { simulationId } = await params; return <div className="flex min-h-screen flex-col bg-background"><Navbar /><SimulationPlayer simulationId={simulationId} /><Footer /></div>; }
