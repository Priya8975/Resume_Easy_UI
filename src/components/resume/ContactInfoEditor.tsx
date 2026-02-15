import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { useResumeStore } from '@/hooks/useResumeStore';

export default function ContactInfoEditor() {
  const contactInfo = useResumeStore((s) => s.masterResume.contactInfo);
  const isReadOnly = useResumeStore((s) => s.activeTailoredConfigId === null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Contact Information</CardTitle>
        {isReadOnly && (
          <CardDescription className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            Master resume is read-only. Edit in code (sample-resume.ts) or create a tailored resume.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input value={contactInfo.name} disabled={isReadOnly} readOnly />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input value={contactInfo.email} disabled={isReadOnly} readOnly />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Phone</label>
            <Input value={contactInfo.phone} disabled={isReadOnly} readOnly />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Location</label>
            <Input value={contactInfo.location || ''} disabled={isReadOnly} readOnly />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">LinkedIn</label>
            <Input value={contactInfo.linkedin || ''} disabled={isReadOnly} readOnly />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">GitHub</label>
            <Input value={contactInfo.github || ''} disabled={isReadOnly} readOnly />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
