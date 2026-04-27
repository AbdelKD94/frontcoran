import { Suspense } from "react";
import { GuidanceExperience } from "@/components/guidance/GuidanceExperience";
import { LoadingGuidanceState } from "@/components/guidance/GuidanceStates";

export default function GuidancePage() {
  return (
    <Suspense fallback={<LoadingGuidanceState />}>
      <GuidanceExperience />
    </Suspense>
  );
}
