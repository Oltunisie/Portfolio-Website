import TrajectoryPage from "@/components/TrajectoryPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trajectory — Omar Lemkecher",
  description: "The flight path of Omar Lemkecher — from Sfax to UCLA Samueli, through CNES, Project X, and beyond.",
};

export default function Page() {
  return <TrajectoryPage />;
}
