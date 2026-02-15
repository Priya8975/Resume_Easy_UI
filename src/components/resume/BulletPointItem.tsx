import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useResumeStore } from '@/hooks/useResumeStore';
import type { BulletPoint } from '@/types/resume';

interface BulletPointItemProps {
  sectionId: string;
  entryId: string;
  bullet: BulletPoint;
  readOnly?: boolean;
  isEntryEditing?: boolean;
}

export default function BulletPointItem({
  sectionId,
  entryId,
  bullet,
  readOnly = false,
  isEntryEditing = false,
}: BulletPointItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(bullet.text);
  const [cancelled, setCancelled] = useState(false);

  const toggleBullet = useResumeStore((s) => s.toggleBullet);
  const updateBulletText = useResumeStore((s) => s.updateBulletText);
  const removeBullet = useResumeStore((s) => s.removeBullet);

  function handleToggle() {
    if (readOnly) return;
    toggleBullet(sectionId, entryId, bullet.id);
  }

  function handleTextClick() {
    if (!isEntryEditing) return;
    setEditText(bullet.text);
    setIsEditing(true);
  }

  function handleSave() {
    if (!editText.trim()) return;
    updateBulletText(sectionId, entryId, bullet.id, editText.trim());
    setIsEditing(false);
  }

  function handleCancel() {
    if (!bullet.text) {
      removeBullet(sectionId, entryId, bullet.id);
      return;
    }
    setIsEditing(false);
    setEditText(bullet.text);
    setCancelled(true);
  }

  function handleDelete() {
    if (readOnly) return;
    removeBullet(sectionId, entryId, bullet.id);
  }

  const showTextarea = isEntryEditing && (isEditing || (!bullet.text && !cancelled));

  return (
    <div className="group flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50">
      {isEntryEditing && (
        <input
          type="checkbox"
          checked={bullet.enabled}
          onChange={handleToggle}
          className="mt-1 h-4 w-4 shrink-0 rounded border-border"
        />
      )}

      {showTextarea ? (
        <div className="flex-1 space-y-2">
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[60px] text-sm"
            placeholder="Enter bullet point text..."
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={!editText.trim()}>Save</Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
          </div>
        </div>
      ) : (
        <span
          onClick={handleTextClick}
          className={`flex-1 text-sm leading-relaxed ${
            isEntryEditing ? 'cursor-pointer hover:bg-muted/50 rounded px-1' : ''
          } ${
            bullet.enabled
              ? 'text-foreground'
              : 'text-muted-foreground line-through'
          }`}
        >
          {bullet.text}
        </span>
      )}

      {isEntryEditing && !showTextarea && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={handleDelete}
        >
          <X className="h-3.5 w-3.5 text-destructive" />
        </Button>
      )}
    </div>
  );
}
