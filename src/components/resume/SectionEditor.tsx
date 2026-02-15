import { useState } from 'react';
import { Plus, X, ChevronDown, ChevronRight } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useResumeStore } from '@/hooks/useResumeStore';
import EntryCard from '@/components/resume/EntryCard';
import type {
  ResumeSection,
  ResumeEntry,
  EntryData,
  EducationData,
  SkillsData,
  ExperienceData,
  ProjectData,
  AchievementData,
} from '@/types/resume';

function SortableEntryCard({ entry, sectionId, readOnly }: { entry: ResumeEntry; sectionId: string; readOnly: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: entry.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <EntryCard
        sectionId={sectionId}
        entry={entry}
        readOnly={readOnly}
        dragHandleProps={{ attributes, listeners }}
      />
    </div>
  );
}

interface SectionEditorProps {
  section: ResumeSection;
  readOnly?: boolean;
}

function getDefaultEntryData(type: ResumeSection['type']): EntryData {
  switch (type) {
    case 'education':
      return { type: 'education', institution: '', degree: '', field: '', startDate: '', endDate: '' } satisfies EducationData;
    case 'skills':
      return { type: 'skills', category: '', items: '' } satisfies SkillsData;
    case 'experience':
      return { type: 'experience', company: '', title: '', startDate: '', endDate: '' } satisfies ExperienceData;
    case 'projects':
      return { type: 'projects', name: '' } satisfies ProjectData;
    case 'achievements':
      return { type: 'achievements', description: '' } satisfies AchievementData;
  }
}

export default function SectionEditor({ section, readOnly = false }: SectionEditorProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntryData, setNewEntryData] = useState<EntryData>(getDefaultEntryData(section.type));
  const [newBullets, setNewBullets] = useState<string[]>([]);
  const [addingBullet, setAddingBullet] = useState(false);
  const [currentBulletText, setCurrentBulletText] = useState('');

  const toggleSection = useResumeStore((s) => s.toggleSection);
  const addEntry = useResumeStore((s) => s.addEntry);
  const reorderEntries = useResumeStore((s) => s.reorderEntries);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleToggle() {
    if (readOnly) return;
    toggleSection(section.id);
  }

  function handleAddEntry() {
    const bulletPoints = newBullets
      .filter((t) => t.trim())
      .map((text, i) => ({
        id: uuidv4(),
        text: text.trim(),
        enabled: true,
        displayOrder: i,
      }));
    addEntry(section.id, {
      id: uuidv4(),
      enabled: true,
      displayOrder: section.entries.length,
      data: newEntryData,
      bulletPoints,
    });
    setNewEntryData(getDefaultEntryData(section.type));
    setNewBullets([]);
    setAddingBullet(false);
    setCurrentBulletText('');
    setShowAddForm(false);
  }

  function handleCancelAdd() {
    setNewEntryData(getDefaultEntryData(section.type));
    setNewBullets([]);
    setAddingBullet(false);
    setCurrentBulletText('');
    setShowAddForm(false);
  }

  function renderBulletInputs() {
    return (
      <div className="space-y-2">
        <label className="text-xs font-medium">Bullet Points</label>
        {newBullets.map((text, index) => (
          <div key={index} className="group flex items-start gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50">
            <span className="flex-1 text-sm leading-relaxed">{text}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setNewBullets(newBullets.filter((_, i) => i !== index))}
            >
              <X className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        ))}
        {addingBullet ? (
          <div className="space-y-2">
            <Textarea
              value={currentBulletText}
              onChange={(e) => setCurrentBulletText(e.target.value)}
              className="min-h-[60px] text-sm"
              placeholder="Enter bullet point text..."
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={!currentBulletText.trim()}
                onClick={() => {
                  setNewBullets([...newBullets, currentBulletText.trim()]);
                  setCurrentBulletText('');
                  setAddingBullet(false);
                }}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setCurrentBulletText('');
                  setAddingBullet(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => setAddingBullet(true)}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add Bullet
          </Button>
        )}
      </div>
    );
  }

  function renderAddForm() {
    switch (newEntryData.type) {
      case 'education': {
        const d = newEntryData as EducationData;
        const update = (fields: Partial<EducationData>) => setNewEntryData({ ...d, ...fields });
        return (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><label className="text-xs font-medium">Institution</label><Input value={d.institution} onChange={(e) => update({ institution: e.target.value })} placeholder="University name" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Degree</label><Input value={d.degree} onChange={(e) => update({ degree: e.target.value })} placeholder="B.S., M.S., etc." /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Field</label><Input value={d.field} onChange={(e) => update({ field: e.target.value })} placeholder="Computer Science" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">GPA</label><Input value={d.gpa || ''} onChange={(e) => update({ gpa: e.target.value })} placeholder="3.8/4.0" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Start Date</label><Input value={d.startDate} onChange={(e) => update({ startDate: e.target.value })} placeholder="Aug 2020" /></div>
            <div className="space-y-1"><label className="text-xs font-medium">End Date</label><Input value={d.endDate} onChange={(e) => update({ endDate: e.target.value })} placeholder="May 2024" /></div>
            <div className="col-span-2 space-y-1"><label className="text-xs font-medium">Location</label><Input value={d.location || ''} onChange={(e) => update({ location: e.target.value })} placeholder="City, State" /></div>
          </div>
        );
      }
      case 'skills': {
        const d = newEntryData as SkillsData;
        const update = (fields: Partial<SkillsData>) => setNewEntryData({ ...d, ...fields });
        return (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1"><label className="text-xs font-medium">Category</label><Input value={d.category} onChange={(e) => update({ category: e.target.value })} placeholder="Languages, Frameworks, etc." /></div>
            <div className="space-y-1"><label className="text-xs font-medium">Items</label><Input value={d.items} onChange={(e) => update({ items: e.target.value })} placeholder="Python, Java, C++" /></div>
          </div>
        );
      }
      case 'experience': {
        const d = newEntryData as ExperienceData;
        const update = (fields: Partial<ExperienceData>) => setNewEntryData({ ...d, ...fields });
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><label className="text-xs font-medium">Company</label><Input value={d.company} onChange={(e) => update({ company: e.target.value })} placeholder="Company name" /></div>
              <div className="space-y-1"><label className="text-xs font-medium">Title</label><Input value={d.title} onChange={(e) => update({ title: e.target.value })} placeholder="Software Engineer" /></div>
              <div className="space-y-1"><label className="text-xs font-medium">Start Date</label><Input value={d.startDate} onChange={(e) => update({ startDate: e.target.value })} placeholder="Jan 2023" /></div>
              <div className="space-y-1"><label className="text-xs font-medium">End Date</label><Input value={d.endDate} onChange={(e) => update({ endDate: e.target.value })} placeholder="Present" /></div>
            </div>
            {renderBulletInputs()}
          </div>
        );
      }
      case 'projects': {
        const d = newEntryData as ProjectData;
        const update = (fields: Partial<ProjectData>) => setNewEntryData({ ...d, ...fields });
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><label className="text-xs font-medium">Name</label><Input value={d.name} onChange={(e) => update({ name: e.target.value })} placeholder="Project name" /></div>
              <div className="space-y-1"><label className="text-xs font-medium">URL</label><Input value={d.url || ''} onChange={(e) => update({ url: e.target.value })} placeholder="https://..." /></div>
              <div className="space-y-1"><label className="text-xs font-medium">Start Date</label><Input value={d.startDate || ''} onChange={(e) => update({ startDate: e.target.value })} placeholder="Jan 2024" /></div>
              <div className="space-y-1"><label className="text-xs font-medium">End Date</label><Input value={d.endDate || ''} onChange={(e) => update({ endDate: e.target.value })} placeholder="Mar 2024" /></div>
            </div>
            {renderBulletInputs()}
          </div>
        );
      }
      case 'achievements': {
        const d = newEntryData as AchievementData;
        const update = (fields: Partial<AchievementData>) => setNewEntryData({ ...d, ...fields });
        return (
          <div className="space-y-1"><label className="text-xs font-medium">Description</label><Input value={d.description} onChange={(e) => update({ description: e.target.value })} placeholder="Achievement description" /></div>
        );
      }
      default:
        return null;
    }
  }

  const sortedEntries = [...section.entries].sort((a, b) => a.displayOrder - b.displayOrder);
  const entryIds = sortedEntries.map((e) => e.id);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = entryIds.indexOf(active.id as string);
    const newIndex = entryIds.indexOf(over.id as string);
    const newOrder = arrayMove(entryIds, oldIndex, newIndex);
    reorderEntries(section.id, newOrder);
  }

  return (
    <Card className={section.enabled ? '' : 'opacity-60'}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={section.enabled}
            onChange={handleToggle}
            disabled={readOnly}
            className="h-4 w-4 shrink-0 rounded border-border disabled:opacity-50"
          />
          <button onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground hover:text-foreground">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <CardTitle className="text-base">{section.title}</CardTitle>
          <span className="text-xs text-muted-foreground">
            ({section.entries.length} {section.entries.length === 1 ? 'entry' : 'entries'})
          </span>
        </div>
      </CardHeader>

      {!collapsed && (
        <CardContent className="pt-0">
          {!readOnly ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={entryIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {sortedEntries.map((entry) => (
                    <SortableEntryCard key={entry.id} entry={entry} sectionId={section.id} readOnly={readOnly} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="space-y-2">
              {sortedEntries.map((entry) => (
                <EntryCard key={entry.id} sectionId={section.id} entry={entry} readOnly={readOnly} />
              ))}
            </div>
          )}

          {!readOnly && (
            <>
              {showAddForm ? (
                <div className="mt-3 space-y-3 rounded-md border border-border bg-muted/30 p-3">
                  <p className="text-sm font-medium">Add New {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Entry</p>
                  {renderAddForm()}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddEntry}>Add Entry</Button>
                    <Button size="sm" variant="outline" onClick={handleCancelAdd}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowAddForm(true)}>
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add Entry
                </Button>
              )}
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}
