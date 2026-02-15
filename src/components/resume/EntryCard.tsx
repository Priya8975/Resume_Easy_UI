import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Pencil, Trash2, GraduationCap, GripVertical } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useResumeStore } from '@/hooks/useResumeStore';
import BulletPointItem from '@/components/resume/BulletPointItem';
import type {
  ResumeEntry,
  EntryData,
  EducationData,
  SkillsData,
  ExperienceData,
  ProjectData,
  AchievementData,
} from '@/types/resume';

function SortableCheckboxItem({ id, label, onUncheck }: { id: string; label: string; onUncheck: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <button type="button" {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground/40 hover:text-muted-foreground">
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <input
        type="checkbox"
        checked={true}
        onChange={onUncheck}
        className="h-3 w-3 rounded border-border"
      />
      {label}
    </div>
  );
}

const COURSEWORK_PREFIX = '\\textbf{Coursework:} ';

function stripCourseworkPrefix(text: string): string {
  return text.startsWith(COURSEWORK_PREFIX) ? text.slice(COURSEWORK_PREFIX.length) : text;
}

function addCourseworkPrefix(text: string): string {
  return COURSEWORK_PREFIX + text;
}

interface EntryCardProps {
  sectionId: string;
  entry: ResumeEntry;
  readOnly?: boolean;
  dragHandleProps?: {
    attributes: Record<string, unknown>;
    listeners: Record<string, unknown> | undefined;
  };
}

export default function EntryCard({ sectionId, entry, readOnly = false, dragHandleProps }: EntryCardProps) {
  const [expanded, setExpanded] = useState(entry.bulletPoints.length > 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EntryData>(entry.data);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const toggleEntry = useResumeStore((s) => s.toggleEntry);
  const removeEntry = useResumeStore((s) => s.removeEntry);
  const updateEntryData = useResumeStore((s) => s.updateEntryData);
  const addBullet = useResumeStore((s) => s.addBullet);
  const updateBulletText = useResumeStore((s) => s.updateBulletText);

  const sortedBullets = [...entry.bulletPoints].sort((a, b) => a.displayOrder - b.displayOrder);
  const courseworkBullet = entry.data.type === 'education'
    ? sortedBullets.find((b) => b.text.startsWith(COURSEWORK_PREFIX))
    : null;
  const nonCourseworkBullets = courseworkBullet
    ? sortedBullets.filter((b) => b.id !== courseworkBullet.id)
    : sortedBullets;

  function handleToggle() {
    if (readOnly) return;
    toggleEntry(sectionId, entry.id);
  }

  function handleDelete() {
    removeEntry(sectionId, entry.id);
  }

  function handleEditStart() {
    setEditData(entry.data);
    setIsEditing(true);
  }

  function handleEditSave() {
    updateEntryData(sectionId, entry.id, editData);
    setIsEditing(false);
  }

  function handleEditCancel() {
    setIsEditing(false);
    setEditData(entry.data);
  }

  function handleAddBullet() {
    addBullet(sectionId, entry.id, {
      id: uuidv4(),
      text: '',
      enabled: true,
      displayOrder: entry.bulletPoints.length,
    });
    setExpanded(true);
  }

  function renderEntryHeader() {
    const data = entry.data;

    switch (data.type) {
      case 'education': {
        const d = data as EducationData;
        return (
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{d.institution}</p>
            <p className="text-xs text-muted-foreground truncate">
              {d.degree} in {d.field}
              {d.gpa ? ` | GPA: ${d.gpa}` : ''}
            </p>
            <p className="text-xs text-muted-foreground">
              {d.startDate} - {d.endDate}
              {d.location ? ` | ${d.location}` : ''}
            </p>
          </div>
        );
      }
      case 'skills': {
        const d = data as SkillsData;
        return (
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{d.category}</p>
            <p className="text-xs text-muted-foreground truncate">{d.items}</p>
          </div>
        );
      }
      case 'experience': {
        const d = data as ExperienceData;
        return (
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {d.company} - {d.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {d.startDate} - {d.endDate}
            </p>
          </div>
        );
      }
      case 'projects': {
        const d = data as ProjectData;
        return (
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {d.url ? (
                <button
                  type="button"
                  className="text-primary underline hover:text-primary/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(d.url, '_blank', 'noopener,noreferrer');
                  }}
                >
                  {d.name}
                </button>
              ) : (
                d.name
              )}
            </p>
            {(d.startDate || d.endDate) && (
              <p className="text-xs text-muted-foreground">
                {d.startDate}
                {d.startDate && d.endDate ? ' - ' : ''}
                {d.endDate}
              </p>
            )}
          </div>
        );
      }
      case 'achievements': {
        const d = data as AchievementData;
        return (
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{d.description}</p>
          </div>
        );
      }
      default:
        return null;
    }
  }

  function renderEditForm() {
    switch (editData.type) {
      case 'education': {
        const d = editData as EducationData;
        const update = (fields: Partial<EducationData>) =>
          setEditData({ ...d, ...fields });
        return (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">Institution</label>
              <Input value={d.institution} onChange={(e) => update({ institution: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Degree</label>
              <Input value={d.degree} onChange={(e) => update({ degree: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Field</label>
              <Input value={d.field} onChange={(e) => update({ field: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">GPA</label>
              <Input value={d.gpa || ''} onChange={(e) => update({ gpa: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Start Date</label>
              <Input value={d.startDate} onChange={(e) => update({ startDate: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">End Date</label>
              <Input value={d.endDate} onChange={(e) => update({ endDate: e.target.value })} />
            </div>
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-medium">Location</label>
              <Input value={d.location || ''} onChange={(e) => update({ location: e.target.value })} />
            </div>
          </div>
        );
      }
      case 'skills': {
        const d = editData as SkillsData;
        const update = (fields: Partial<SkillsData>) => setEditData({ ...d, ...fields });
        return (
          <div className="space-y-1">
            <label className="text-xs font-medium">Category</label>
            <Input value={d.category} onChange={(e) => update({ category: e.target.value })} />
          </div>
        );
      }
      case 'experience': {
        const d = editData as ExperienceData;
        const update = (fields: Partial<ExperienceData>) => setEditData({ ...d, ...fields });
        return (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">Company</label>
              <Input value={d.company} onChange={(e) => update({ company: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Title</label>
              <Input value={d.title} onChange={(e) => update({ title: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Start Date</label>
              <Input value={d.startDate} onChange={(e) => update({ startDate: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">End Date</label>
              <Input value={d.endDate} onChange={(e) => update({ endDate: e.target.value })} />
            </div>
          </div>
        );
      }
      case 'projects': {
        const d = editData as ProjectData;
        const update = (fields: Partial<ProjectData>) => setEditData({ ...d, ...fields });
        return (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium">Name</label>
              <Input value={d.name} onChange={(e) => update({ name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">URL</label>
              <Input value={d.url || ''} onChange={(e) => update({ url: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">Start Date</label>
              <Input value={d.startDate || ''} onChange={(e) => update({ startDate: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium">End Date</label>
              <Input value={d.endDate || ''} onChange={(e) => update({ endDate: e.target.value })} />
            </div>
          </div>
        );
      }
      case 'achievements': {
        const d = editData as AchievementData;
        const update = (fields: Partial<AchievementData>) => setEditData({ ...d, ...fields });
        return (
          <div className="space-y-1">
            <label className="text-xs font-medium">Description</label>
            <Input value={d.description} onChange={(e) => update({ description: e.target.value })} />
          </div>
        );
      }
      default:
        return null;
    }
  }

  return (
    <Card className={`transition-colors ${entry.enabled ? '' : 'opacity-50'}`}>
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          {dragHandleProps && (
            <button
              type="button"
              {...dragHandleProps.attributes}
              {...dragHandleProps.listeners}
              className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground/40 hover:text-muted-foreground"
            >
              <GripVertical className="h-4 w-4" />
            </button>
          )}
          <input
            type="checkbox"
            checked={entry.enabled}
            onChange={handleToggle}
            disabled={readOnly}
            className="h-4 w-4 shrink-0 rounded border-border disabled:opacity-50"
          />
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          {renderEntryHeader()}
          {!readOnly && (
            <div className="flex shrink-0 items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleEditStart}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDelete}>
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          )}
        </div>

        {isEditing && !readOnly && (
          <div className="mt-3 space-y-3 rounded-md border border-border bg-muted/30 p-3">
            {renderEditForm()}
            <div className="flex gap-2">
              <Button size="sm" onClick={handleEditSave}>Save</Button>
              <Button size="sm" variant="outline" onClick={handleEditCancel}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Show coursework as checkboxes for education entries */}
        {entry.data.type === 'education' && courseworkBullet && (() => {
          const eduData = entry.data as EducationData;
          // Get the current (effective) courses from the bullet text
          // Strip trailing period from the text before parsing
          const rawText = stripCourseworkPrefix(courseworkBullet.text).replace(/\.\s*$/, '');
          const currentCourses = rawText
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean);
          const currentSet = new Set(currentCourses);

          // Get the full available course list from availableCoursework field,
          // falling back to the bullet text for entries without it
          const allCourses = eduData.availableCoursework
            ? eduData.availableCoursework.split(',').map((c) => c.trim()).filter(Boolean)
            : currentCourses;

          const uncheckedCourses = allCourses.filter((c) => !currentSet.has(c));

          const saveCourses = (updated: string[]) => {
            updateBulletText(
              sectionId,
              entry.id,
              courseworkBullet.id,
              addCourseworkPrefix(updated.join(', ') + '.'),
            );
          };

          const handleDragEnd = (event: DragEndEvent) => {
            const { active, over } = event;
            if (over && active.id !== over.id) {
              const oldIndex = currentCourses.indexOf(active.id as string);
              const newIndex = currentCourses.indexOf(over.id as string);
              saveCourses(arrayMove(currentCourses, oldIndex, newIndex));
            }
          };

          return (
            <div className="mt-2 ml-10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                <span className="font-semibold">Coursework</span>
              </div>
              <div className="ml-5 flex flex-col gap-1">
                {isEditing ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext items={currentCourses} strategy={verticalListSortingStrategy}>
                      {currentCourses.map((course) => (
                        <SortableCheckboxItem
                          key={course}
                          id={course}
                          label={course}
                          onUncheck={() => saveCourses(currentCourses.filter((c) => c !== course))}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                ) : (
                  currentCourses.map((course) => (
                    <label key={course} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <input type="checkbox" checked={true} disabled className="h-3 w-3 rounded border-border" />
                      {course}
                    </label>
                  ))
                )}
                {/* Unchecked courses */}
                {uncheckedCourses.map((course) => (
                  <label key={course} className="flex items-center gap-1.5 text-xs text-muted-foreground/50 line-through">
                    <input
                      type="checkbox"
                      checked={false}
                      disabled={!isEditing}
                      onChange={() => saveCourses([...currentCourses, course])}
                      className="h-3 w-3 rounded border-border"
                    />
                    {course}
                  </label>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Show skill items as checkboxes for skills entries */}
        {entry.data.type === 'skills' && (() => {
          const skillsData = entry.data as SkillsData;
          const rawItems = skillsData.items.replace(/\.\s*$/, '');
          const currentItems = rawItems.split(',').map((s) => s.trim()).filter(Boolean);
          const currentSet = new Set(currentItems);

          const allItems = skillsData.availableItems
            ? skillsData.availableItems.split(',').map((s) => s.trim()).filter(Boolean)
            : currentItems;

          const uncheckedItems = allItems.filter((s) => !currentSet.has(s));

          const saveSkillItems = (updated: string[]) => {
            const newItems = updated.join(', ') + '.';
            const newData = { ...skillsData, items: newItems };
            updateEntryData(sectionId, entry.id, newData);
            // Keep editData in sync so handleEditSave doesn't overwrite with stale data
            setEditData((prev) => ({ ...(prev as SkillsData), items: newItems }));
          };

          const handleSkillDragEnd = (event: DragEndEvent) => {
            const { active, over } = event;
            if (over && active.id !== over.id) {
              const oldIndex = currentItems.indexOf(active.id as string);
              const newIndex = currentItems.indexOf(over.id as string);
              saveSkillItems(arrayMove(currentItems, oldIndex, newIndex));
            }
          };

          return (
            <div className="mt-2 ml-10 space-y-1">
              <div className="ml-5 flex flex-col gap-1">
                {isEditing ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleSkillDragEnd}
                  >
                    <SortableContext items={currentItems} strategy={verticalListSortingStrategy}>
                      {currentItems.map((item) => (
                        <SortableCheckboxItem
                          key={item}
                          id={item}
                          label={item}
                          onUncheck={() => saveSkillItems(currentItems.filter((s) => s !== item))}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                ) : (
                  currentItems.map((item) => (
                    <label key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <input type="checkbox" checked={true} disabled className="h-3 w-3 rounded border-border" />
                      {item}
                    </label>
                  ))
                )}
                {uncheckedItems.map((item) => (
                  <label key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground/50 line-through">
                    <input
                      type="checkbox"
                      checked={false}
                      disabled={!isEditing}
                      onChange={() => saveSkillItems([...currentItems, item])}
                      className="h-3 w-3 rounded border-border"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          );
        })()}

        {expanded && (
          <div className="mt-2 ml-6 space-y-0.5 border-l-2 border-border pl-3">
            {nonCourseworkBullets.map((bullet) => (
              <BulletPointItem
                key={bullet.id}
                sectionId={sectionId}
                entryId={entry.id}
                bullet={bullet}
                readOnly={readOnly}
                isEntryEditing={isEditing}
              />
            ))}
            {!readOnly && isEditing && (
              <Button variant="ghost" size="sm" className="mt-1 text-xs" onClick={handleAddBullet}>
                <Plus className="mr-1 h-3.5 w-3.5" />
                Add Bullet
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
