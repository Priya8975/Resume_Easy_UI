import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

import type {
  ResumeData,
  ResumeSection,
  ResumeEntry,
  BulletPoint,
  ContactInfo,
  EntryData,
  TailoredResumeConfig,
  AppSettings,
  AppState,
} from '@/types/resume';

import { sampleResume } from '@/assets/sample-resume';

interface ResumeStore extends AppState {
  // Section actions
  toggleSection: (sectionId: string) => void;
  addSection: (section: ResumeSection) => void;
  removeSection: (sectionId: string) => void;
  updateSectionTitle: (sectionId: string, title: string) => void;
  reorderSections: (sectionIds: string[]) => void;

  // Entry actions
  reorderEntries: (sectionId: string, entryIds: string[]) => void;
  toggleEntry: (sectionId: string, entryId: string) => void;
  addEntry: (sectionId: string, entry: ResumeEntry) => void;
  removeEntry: (sectionId: string, entryId: string) => void;
  updateEntryData: (sectionId: string, entryId: string, data: EntryData) => void;

  // Bullet actions
  toggleBullet: (sectionId: string, entryId: string, bulletId: string) => void;
  addBullet: (sectionId: string, entryId: string, bullet: BulletPoint) => void;
  removeBullet: (sectionId: string, entryId: string, bulletId: string) => void;
  updateBulletText: (sectionId: string, entryId: string, bulletId: string, text: string) => void;

  // Contact actions
  updateContactInfo: (contact: Partial<ContactInfo>) => void;

  // Tailored config actions
  createTailoredConfig: (name: string, jobDescription?: string) => string;
  deleteTailoredConfig: (configId: string) => void;
  setActiveTailoredConfig: (configId: string | null) => void;
  updateTailoredOverride: (configId: string, itemId: string, enabled: boolean) => void;
  applyOverrides: (configId: string, overrides: Record<string, boolean>) => void;

  // Settings
  updateSettings: (settings: Partial<AppSettings>) => void;

  // Import/Export
  importState: (data: { masterResume: ResumeData; tailoredConfigs: TailoredResumeConfig[] }) => void;

  // Computed helper
  getEffectiveResume: () => ResumeData;
}

/**
 * Collect all item IDs (sections, entries, bullet points) from a resume
 * and return a Record mapping each ID to its current enabled state.
 */
function collectEnabledStates(resume: ResumeData): Record<string, boolean> {
  const overrides: Record<string, boolean> = {};
  for (const section of resume.sections) {
    overrides[section.id] = section.enabled;
    for (const entry of section.entries) {
      overrides[entry.id] = entry.enabled;
      for (const bullet of entry.bulletPoints) {
        overrides[bullet.id] = bullet.enabled;
      }
    }
  }
  return overrides;
}

/**
 * Deep-clone a ResumeData and apply enabled overrides and section ordering
 * from a TailoredResumeConfig.
 */
function applyConfigToResume(
  resume: ResumeData,
  config: TailoredResumeConfig,
): ResumeData {
  const cloned: ResumeData = JSON.parse(JSON.stringify(resume));

  // Apply enabled overrides, text overrides, and entry data overrides
  for (const section of cloned.sections) {
    if (config.enabledOverrides[section.id] !== undefined) {
      section.enabled = config.enabledOverrides[section.id];
    }

    // Filter out deleted entries
    section.entries = section.entries.filter(
      (e) => !(config.deletedEntryIds ?? []).includes(e.id),
    );

    // Append additional entries BEFORE processing so overrides apply to them too
    const extraEntries = config.additionalEntries?.[section.id];
    if (extraEntries) {
      section.entries.push(...JSON.parse(JSON.stringify(extraEntries)));
    }

    for (const entry of section.entries) {
      if (config.enabledOverrides[entry.id] !== undefined) {
        entry.enabled = config.enabledOverrides[entry.id];
      }

      // Apply entry data overrides
      if (config.entryDataOverrides?.[entry.id]) {
        entry.data = config.entryDataOverrides[entry.id];
      }

      // Filter out deleted bullets
      entry.bulletPoints = entry.bulletPoints.filter(
        (b) => !(config.deletedBulletIds ?? []).includes(b.id),
      );

      for (const bullet of entry.bulletPoints) {
        if (config.enabledOverrides[bullet.id] !== undefined) {
          bullet.enabled = config.enabledOverrides[bullet.id];
        }
        if (config.textOverrides?.[bullet.id] !== undefined) {
          bullet.text = config.textOverrides[bullet.id];
        }
      }

      // Append additional bullets for this entry
      const extraBullets = config.additionalBullets?.[entry.id];
      if (extraBullets) {
        entry.bulletPoints.push(...JSON.parse(JSON.stringify(extraBullets)));
      }
    }
  }

  // Apply section ordering
  if (config.sectionOrder.length > 0) {
    const sectionMap = new Map(cloned.sections.map((s) => [s.id, s]));
    const ordered: ResumeSection[] = [];

    for (const id of config.sectionOrder) {
      const section = sectionMap.get(id);
      if (section) {
        ordered.push(section);
        sectionMap.delete(id);
      }
    }

    // Append any sections not in the order list at the end
    for (const section of sectionMap.values()) {
      ordered.push(section);
    }

    cloned.sections = ordered;
  }

  // Apply entry ordering within each section
  if (config.entryOrder) {
    for (const section of cloned.sections) {
      const entryIds = config.entryOrder[section.id];
      if (entryIds && entryIds.length > 0) {
        const entryMap = new Map(section.entries.map((e) => [e.id, e]));
        const orderedEntries: typeof section.entries = [];

        for (const id of entryIds) {
          const entry = entryMap.get(id);
          if (entry) {
            orderedEntries.push(entry);
            entryMap.delete(id);
          }
        }

        // Append any entries not in the order list at the end
        for (const entry of entryMap.values()) {
          orderedEntries.push(entry);
        }

        section.entries = orderedEntries.map((e, i) => ({ ...e, displayOrder: i }));
      }
    }
  }

  return cloned;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      // Initial state — master resume is ALWAYS loaded from code (sampleResume).
      // It is read-only in the UI. Only tailored configs can be edited via the UI.
      masterResume: sampleResume,
      tailoredConfigs: [],
      activeTailoredConfigId: null,
      settings: {
        openaiApiKey: '',
        openaiModel: 'gpt-4o-mini',
        theme: 'light',
      },

      // --- Section actions (only work on tailored configs) ---

      toggleSection: (sectionId) => {
        const { activeTailoredConfigId } = get();
        if (!activeTailoredConfigId) return; // Master is read-only

        set((state) => ({
          tailoredConfigs: state.tailoredConfigs.map((config) => {
            if (config.id !== activeTailoredConfigId) return config;
            const currentValue =
              config.enabledOverrides[sectionId] ??
              state.masterResume.sections.find((s) => s.id === sectionId)?.enabled ??
              true;
            return {
              ...config,
              enabledOverrides: {
                ...config.enabledOverrides,
                [sectionId]: !currentValue,
              },
            };
          }),
        }));
      },

      addSection: () => {
        // Master is read-only — no-op
      },

      removeSection: () => {
        // Master is read-only — no-op
      },

      updateSectionTitle: () => {
        // Master is read-only — no-op
      },

      reorderSections: (sectionIds) => {
        const { activeTailoredConfigId } = get();
        if (!activeTailoredConfigId) return; // Master is read-only

        set((state) => ({
          tailoredConfigs: state.tailoredConfigs.map((config) =>
            config.id === activeTailoredConfigId
              ? { ...config, sectionOrder: sectionIds }
              : config,
          ),
        }));
      },

      // --- Entry actions (only work on tailored configs) ---

      reorderEntries: (sectionId, entryIds) => {
        const { activeTailoredConfigId } = get();
        if (!activeTailoredConfigId) return; // Master is read-only

        set((state) => ({
          tailoredConfigs: state.tailoredConfigs.map((config) =>
            config.id === activeTailoredConfigId
              ? { ...config, entryOrder: { ...config.entryOrder, [sectionId]: entryIds } }
              : config,
          ),
        }));
      },

      toggleEntry: (sectionId, entryId) => {
        const { activeTailoredConfigId } = get();
        if (!activeTailoredConfigId) return; // Master is read-only

        set((state) => ({
          tailoredConfigs: state.tailoredConfigs.map((config) => {
            if (config.id !== activeTailoredConfigId) return config;
            const section = state.masterResume.sections.find(
              (s) => s.id === sectionId,
            );
            const entry = section?.entries.find((e) => e.id === entryId);
            const currentValue =
              config.enabledOverrides[entryId] ?? entry?.enabled ?? true;
            return {
              ...config,
              enabledOverrides: {
                ...config.enabledOverrides,
                [entryId]: !currentValue,
              },
            };
          }),
        }));
      },

      addEntry: (sectionId, entry) => {
        const { activeTailoredConfigId } = get();
        if (!activeTailoredConfigId) return;

        set((state) => ({
          tailoredConfigs: state.tailoredConfigs.map((config) => {
            if (config.id !== activeTailoredConfigId) return config;
            const existing = config.additionalEntries[sectionId] ?? [];
            return {
              ...config,
              additionalEntries: {
                ...config.additionalEntries,
                [sectionId]: [...existing, entry],
              },
              enabledOverrides: {
                ...config.enabledOverrides,
                [entry.id]: true,
              },
            };
          }),
        }));
      },

      removeEntry: (sectionId, entryId) => {
        const { activeTailoredConfigId } = get();
        if (!activeTailoredConfigId) return;

        set((state) => ({
          tailoredConfigs: state.tailoredConfigs.map((config) => {
            if (config.id !== activeTailoredConfigId) return config;

            // Check if this is an additional entry (added in this config)
            const additionalInSection = config.additionalEntries[sectionId] ?? [];
            const isAdditional = additionalInSection.some((e) => e.id === entryId);

            if (isAdditional) {
              return {
                ...config,
                additionalEntries: {
                  ...config.additionalEntries,
                  [sectionId]: additionalInSection.filter((e) => e.id !== entryId),
                },
              };
            }

            // It's a master entry — mark as deleted
            return {
              ...config,
              deletedEntryIds: [...(config.deletedEntryIds ?? []), entryId],
            };
          }),
        }));
      },

      updateEntryData: (sectionId, entryId, data) => {
        const { activeTailoredConfigId } = get();
        if (!activeTailoredConfigId) return;

        set((state) => ({
          tailoredConfigs: state.tailoredConfigs.map((config) => {
            if (config.id !== activeTailoredConfigId) return config;

            // Check if this is an additional entry
            const additionalInSection = config.additionalEntries[sectionId] ?? [];
            const isAdditional = additionalInSection.some((e) => e.id === entryId);

            if (isAdditional) {
              return {
                ...config,
                additionalEntries: {
                  ...config.additionalEntries,
                  [sectionId]: additionalInSection.map((e) =>
                    e.id === entryId ? { ...e, data } : e,
                  ),
                },
              };
            }

            // It's a master entry — store in entryDataOverrides
            return {
              ...config,
              entryDataOverrides: {
                ...(config.entryDataOverrides ?? {}),
                [entryId]: data,
              },
            };
          }),
        }));
      },

      // --- Bullet actions (only work on tailored configs) ---

      toggleBullet: (_sectionId, _entryId, bulletId) => {
        const { activeTailoredConfigId } = get();
        if (!activeTailoredConfigId) return; // Master is read-only

        set((state) => ({
          tailoredConfigs: state.tailoredConfigs.map((config) => {
            if (config.id !== activeTailoredConfigId) return config;
            const currentValue = config.enabledOverrides[bulletId] ?? true;
            return {
              ...config,
              enabledOverrides: {
                ...config.enabledOverrides,
                [bulletId]: !currentValue,
              },
            };
          }),
        }));
      },

      addBullet: (_sectionId, entryId, bullet) => {
        const { activeTailoredConfigId } = get();
        if (!activeTailoredConfigId) return;

        set((state) => ({
          tailoredConfigs: state.tailoredConfigs.map((config) => {
            if (config.id !== activeTailoredConfigId) return config;
            const existing = config.additionalBullets?.[entryId] ?? [];
            return {
              ...config,
              additionalBullets: {
                ...(config.additionalBullets ?? {}),
                [entryId]: [...existing, bullet],
              },
              enabledOverrides: {
                ...config.enabledOverrides,
                [bullet.id]: true,
              },
            };
          }),
        }));
      },

      removeBullet: (_sectionId, entryId, bulletId) => {
        const { activeTailoredConfigId } = get();
        if (!activeTailoredConfigId) return;

        set((state) => ({
          tailoredConfigs: state.tailoredConfigs.map((config) => {
            if (config.id !== activeTailoredConfigId) return config;

            // Check if this is an additional bullet
            const additionalForEntry = config.additionalBullets?.[entryId] ?? [];
            const isAdditional = additionalForEntry.some((b) => b.id === bulletId);

            if (isAdditional) {
              return {
                ...config,
                additionalBullets: {
                  ...(config.additionalBullets ?? {}),
                  [entryId]: additionalForEntry.filter((b) => b.id !== bulletId),
                },
              };
            }

            // It's a master bullet — mark as deleted
            return {
              ...config,
              deletedBulletIds: [...(config.deletedBulletIds ?? []), bulletId],
            };
          }),
        }));
      },

      updateBulletText: (_sectionId, entryId, bulletId, text) => {
        const { activeTailoredConfigId } = get();
        if (!activeTailoredConfigId) return; // Master is read-only

        set((state) => ({
          tailoredConfigs: state.tailoredConfigs.map((config) => {
            if (config.id !== activeTailoredConfigId) return config;

            // Check if this is an additional bullet
            const additionalForEntry = config.additionalBullets?.[entryId] ?? [];
            const isAdditional = additionalForEntry.some((b) => b.id === bulletId);

            if (isAdditional) {
              return {
                ...config,
                additionalBullets: {
                  ...(config.additionalBullets ?? {}),
                  [entryId]: additionalForEntry.map((b) =>
                    b.id === bulletId ? { ...b, text } : b,
                  ),
                },
              };
            }

            // It's a master bullet — store in textOverrides
            return {
              ...config,
              textOverrides: {
                ...(config.textOverrides || {}),
                [bulletId]: text,
              },
            };
          }),
        }));
      },

      // --- Contact actions ---

      updateContactInfo: () => {
        // Master is read-only — no-op
      },

      // --- Tailored config actions ---

      createTailoredConfig: (name, jobDescription) => {
        const id = uuidv4();
        const { masterResume } = get();

        const config: TailoredResumeConfig = {
          id,
          name,
          createdAt: new Date().toISOString(),
          jobDescription,
          enabledOverrides: collectEnabledStates(masterResume),
          textOverrides: {},
          sectionOrder: masterResume.sections.map((s) => s.id),
          entryOrder: {},
          additionalEntries: {},
          entryDataOverrides: {},
          deletedEntryIds: [],
          additionalBullets: {},
          deletedBulletIds: [],
        };

        set((state) => ({
          tailoredConfigs: [...state.tailoredConfigs, config],
        }));

        return id;
      },

      deleteTailoredConfig: (configId) => {
        set((state) => ({
          tailoredConfigs: state.tailoredConfigs.filter((c) => c.id !== configId),
          activeTailoredConfigId:
            state.activeTailoredConfigId === configId
              ? null
              : state.activeTailoredConfigId,
        }));
      },

      setActiveTailoredConfig: (configId) => {
        set({ activeTailoredConfigId: configId });
      },

      updateTailoredOverride: (configId, itemId, enabled) => {
        set((state) => ({
          tailoredConfigs: state.tailoredConfigs.map((config) =>
            config.id === configId
              ? {
                  ...config,
                  enabledOverrides: {
                    ...config.enabledOverrides,
                    [itemId]: enabled,
                  },
                }
              : config,
          ),
        }));
      },

      applyOverrides: (configId, overrides) => {
        set((state) => ({
          tailoredConfigs: state.tailoredConfigs.map((config) =>
            config.id === configId
              ? {
                  ...config,
                  enabledOverrides: {
                    ...config.enabledOverrides,
                    ...overrides,
                  },
                }
              : config,
          ),
        }));
      },

      // --- Settings ---

      updateSettings: (settings) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...settings,
          },
        }));
      },

      // --- Import/Export ---

      importState: (data) => {
        set({
          masterResume: data.masterResume,
          tailoredConfigs: data.tailoredConfigs,
          activeTailoredConfigId: null,
        });
      },

      // --- Computed helper ---

      getEffectiveResume: () => {
        const { masterResume, activeTailoredConfigId, tailoredConfigs } = get();

        if (!activeTailoredConfigId) {
          return masterResume;
        }

        const activeConfig = tailoredConfigs.find(
          (c) => c.id === activeTailoredConfigId,
        );

        if (!activeConfig) {
          return masterResume;
        }

        return applyConfigToResume(masterResume, activeConfig);
      },
    }),
    {
      name: 'resume-easy-storage',
      version: 1,
      // Always reset master resume from code on hydration.
      // Only tailoredConfigs and settings are persisted from localStorage.
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<ResumeStore> | undefined;
        return {
          ...current,
          ...persistedState,
          // Master resume is ALWAYS from code, never from localStorage
          masterResume: sampleResume,
        };
      },
    },
  ),
);
