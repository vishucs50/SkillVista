import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CriticalSkillGaps() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Critical Gaps</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <Gap title="Logical Reasoning" level="CRITICAL" />
        <Gap title="Core CS Fundamentals" level="MEDIUM" />
        <Gap title="Interview Communication" level="LOW" />
      </CardContent>
    </Card>
  )
}

function Gap({ title, level }) {
  const variant =
    level === "CRITICAL"
      ? "destructive"
      : level === "MEDIUM"
      ? "secondary"
      : "outline"

  return (
    <div className="flex justify-between items-center p-4 border border-border rounded-xl">
      <p className="text-sm font-semibold">{title}</p>
      <Badge variant={variant}>{level}</Badge>
    </div>
  )
}
