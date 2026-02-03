import { Card, CardContent } from "@/components/ui/card";
import useResultStore from "@/store/useResultStore";

function getNextBestAction({
  employabilityIndex,
  aptitudeScore,
  skillsCount,
  hasProjects,
}) {
  if (aptitudeScore < 50) {
    return {
      title: "Strengthen Logical & Analytical Reasoning",
      description:
        "Your aptitude performance is currently limiting interview readiness. Improving logical reasoning will positively influence problem-solving ability and interview confidence.",
    };
  }

  if (!hasProjects) {
    return {
      title: "Build End-to-End Project Experience",
      description:
        "Your profile shows limited practical project depth. Recruiters heavily rely on real-world projects to evaluate technical readiness.",
    };
  }

  if (skillsCount < 5) {
    return {
      title: "Expand Core Technical Skill Set",
      description:
        "Your current skill breadth is narrow for your target role. Adding core technologies will improve profile relevance across roles.",
    };
  }

  return {
    title: "Prepare for Technical & HR Interviews",
    description:
      "Your fundamentals are in place. Focusing on interview communication and structured answers will now yield the highest impact.",
  };
}

export default function NextBestAction() {
  const state = useResultStore((state) => state);

  const employabilityIndex = state.employabilityIndex || 0;
  const aptitudeScore = state.aptitude?.score || 0;
  const skillsCount = state.basicDetails?.skills?.length || 0;
  const hasProjects =
    state.basicDetails?.projectExperience === "End-to-end projects";

  const action = getNextBestAction({
    employabilityIndex,
    aptitudeScore,
    skillsCount,
    hasProjects,
  });

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="space-y-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Next Best Focus
        </p>

        <p className="text-sm font-semibold text-foreground">{action.title}</p>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {action.description}
        </p>

        <p className="text-xs text-muted-foreground italic">
          Suggested based on your current assessment profile.
        </p>
      </CardContent>
    </Card>
  );
}
