"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, ClipboardList, ArrowRight, CheckCircle } from "lucide-react";

export default function AssessmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  const assessments = [
    {
      id: "career",
      title: "Career Assessment",
      description: "Complete profile evaluation with skills, aptitude, and career alignment",
      icon: ClipboardList,
      route: "/assessment",
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/20",
      features: [
        "Basic details & profile",
        "Skill inventory",
        "Role & goal alignment",
        "Experience readiness",
        "Aptitude test",
      ],
      completed: session?.user?.hasAssessment,
    },
    {
      id: "mental",
      title: "Mental Ability Test",
      description: "Test your logical reasoning, aptitude,pattern recoginition & quantitative skills",
      icon: Brain,
      route: "/assessment/hub",
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/20",
      features: [
        "15 questions",
        "Multiple categories",
        "Timed assessment",
        "Instant results",
        "Progress tracking",
      ],
      completed: false,
    },
  ];

  return (
    <div className="min-h-10 bg-background py-1 px-1">
      <div className="max-w-7xl mx-auto space-y-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Assessments</h1>
          <p className="text-muted-foreground">
            Evaluate your skills and track your progress with our comprehensive assessments
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {assessments.map((assessment) => {
            const Icon = assessment.icon;
            
            return (
              <Card
                key={assessment.id}
                className="border-2 hover:border-primary/40 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${assessment.bg}`}>
                      <Icon className={`w-6 h-6 ${assessment.color}`} />
                    </div>
                    {assessment.completed && (
                      <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-xl">{assessment.title}</CardTitle>
                  <CardDescription className="text-base">
                    {assessment.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">
                      What is included:
                    </p>
                    <ul className="space-y-1">
                      {assessment.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-sm flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => router.push(assessment.route)}
                    className="w-full mt-auto"
                    size="lg"
                  >
                    {assessment.completed ? "View Results" : "Start Assessment"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-accent/50">
          <CardContent className="py-1">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ClipboardList className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Why take assessments?</h3>
                <p className="text-sm text-muted-foreground">
                  Our assessments help you understand your strengths, identify skill gaps, 
                  and create personalized learning paths. Regular testing tracks your improvement 
                  and keeps you prepared for career opportunities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
