import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function LearningPath() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Learning Path</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Step text="Complete Logical Reasoning Level 1" />
        <Step text="Revise DSA Basics (Arrays & Strings)" />
        <Step text="Mock Interview – Technical Round" />

        <Button className="w-full">
          Continue Learning
        </Button>
      </CardContent>
    </Card>
  )
}

function Step({ text }) {
  return (
    <div className="p-3 border border-border rounded-lg text-sm">
      {text}
    </div>
  )
}
