import {
  type SapatamuEditorState,
  buildDefaultEditorState,
  normalizeEditorState,
} from './sapatamu-editor.helper';

type JsonRecord = Record<string, any>;

export type SapatamuProfile = {
  id: string;
  label: string;
  fullName: string;
  nickName: string;
  description: string;
};

export type SapatamuEvent = {
  id: string;
  name: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  timeZone: 'WIB' | 'WITA' | 'WIT';
  address: string;
  mapLocation: string;
  enabled: boolean;
};

type SapatamuContentBase = {
  selectedTheme: string;
  profiles: SapatamuProfile[];
  events: SapatamuEvent[];
  sendSettings: {
    prefaceTemplate: string;
  };
  albumSettings: {
    basePhotoQuota: number;
  };
  meta: {
    titleTemplate: string;
    description: string;
    imageUrl: string | null;
  };
  musicSettings: {
    mode: 'none' | 'library' | 'youtube';
    value: string;
  };
  extraLinks: {
    youtube: string;
  };
  settings: {
    commerce: {
      requiredTierCategory: 'basic' | 'premium' | 'vintage';
      selectedPackageCode: string | null;
      activationState: 'inactive' | 'active';
    };
    giftAccounts: Array<{
      bankName: string;
      accountNumber: string;
      accountHolder: string;
    }>;
    giftAddress: string;
    lastEditedAtDisplay: string | null;
    activatedAtDisplay: string | null;
  };
  historyDisplayHints: JsonRecord;
  weddingData: JsonRecord;
};

export type SapatamuEditorDocumentV3 = SapatamuContentBase & {
  schemaVersion: 3;
  editor: SapatamuEditorState;
};

export type DraftWizardState = {
  step: number;
  invitationName: string;
  slugCandidate: string;
  themeId: string;
  selectedPackageId: string | null;
  profiles: SapatamuProfile[];
  events: SapatamuEvent[];
};

export const DEFAULT_PREFACE_TEMPLATE = `Assalamu'alaikum Warahmatullahi Wabarakaatuh

Kepada Yth.
Bapak/Ibu/Saudara/i *{{guest-name}}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

*{{full-name-1}} & {{full-name-2}}*

📅 *{{event-name-1}}*
{{event-date-1}} • {{time-start-1}} {{event-timezone-1}}
📍 {{event-location-1}}

📅 *{{event-name-2}}*
{{event-date-2}} • {{time-start-2}} - {{time-end-2}} {{event-timezone-2}}
📍 {{event-location-2}}

Buka undangan di:
{{link}}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.

Wassalamu'alaikum Warahmatullahi Wabarakaatuh
*{{nick-name-1}} & {{nick-name-2}}*`;

function cleanString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function slugify(source: string): string {
  const base = source
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return base || 'undangan';
}

function ensureDate(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function ensureTimeZone(value: unknown): 'WIB' | 'WITA' | 'WIT' {
  return value === 'WITA' || value === 'WIT' ? value : 'WIB';
}

export function buildDefaultProfiles(): SapatamuProfile[] {
  return [
    {
      id: 'profile-1',
      label: 'Profile 1',
      fullName: '',
      nickName: '',
      description: '',
    },
    {
      id: 'profile-2',
      label: 'Profile 2',
      fullName: '',
      nickName: '',
      description: '',
    },
  ];
}

export function buildDefaultEvents(): SapatamuEvent[] {
  return [
    {
      id: 'event-1',
      name: 'Akad',
      date: '',
      timeStart: '',
      timeEnd: '',
      timeZone: 'WIB',
      address: '',
      mapLocation: '',
      enabled: true,
    },
    {
      id: 'event-2',
      name: 'Resepsi',
      date: '',
      timeStart: '',
      timeEnd: '',
      timeZone: 'WIB',
      address: '',
      mapLocation: '',
      enabled: true,
    },
  ];
}

export function buildDefaultDraftWizard(seed?: Partial<DraftWizardState>): DraftWizardState {
  return {
    step: typeof seed?.step === 'number' ? seed.step : 0,
    invitationName: cleanString(seed?.invitationName),
    slugCandidate: cleanString(seed?.slugCandidate),
    themeId: cleanString(seed?.themeId) || 'malay-ethnic-red-ruby',
    selectedPackageId: typeof seed?.selectedPackageId === 'string' ? seed.selectedPackageId : null,
    profiles: normalizeProfiles(seed?.profiles),
    events: normalizeEvents(seed?.events),
  };
}

export function normalizeProfiles(raw: unknown): SapatamuProfile[] {
  const fallback = buildDefaultProfiles();
  if (!Array.isArray(raw)) return fallback;

  return fallback.map((item, index) => {
    const source = raw[index] && typeof raw[index] === 'object' ? (raw[index] as JsonRecord) : {};
    return {
      id: item.id,
      label: item.label,
      fullName: cleanString(source.fullName),
      nickName: cleanString(source.nickName),
      description: cleanString(source.description),
    };
  });
}

export function normalizeEvents(raw: unknown): SapatamuEvent[] {
  const fallback = buildDefaultEvents();
  if (!Array.isArray(raw)) return fallback;

  const normalized = raw
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => {
      const source = item as JsonRecord;
      const fallbackEvent = fallback[index] ?? {
        id: `event-${index + 1}`,
        name: '',
        date: '',
        timeStart: '',
        timeEnd: '',
        timeZone: 'WIB' as const,
        address: '',
        mapLocation: '',
        enabled: true,
      };

      return {
        id: cleanString(source.id) || fallbackEvent.id,
        name: cleanString(source.name) || fallbackEvent.name,
        date: ensureDate(source.date),
        timeStart: cleanString(source.timeStart),
        timeEnd: cleanString(source.timeEnd),
        timeZone: ensureTimeZone(source.timeZone),
        address: cleanString(source.address),
        mapLocation: cleanString(source.mapLocation),
        enabled: typeof source.enabled === 'boolean' ? source.enabled : true,
      };
    });

  return normalized.length > 0 ? normalized : fallback;
}

function buildMetaTitle(profiles: SapatamuProfile[]): string {
  return 'The Wedding of {{nick-name-1}} & {{nick-name-2}}';
}

function buildMetaDescription(events: SapatamuEvent[]): string {
  const primaryEvent = events.find((item) => item.enabled) ?? events[0];
  const eventLabel = cleanString(primaryEvent?.name) || 'Acara Pernikahan';
  const dateLabel = cleanString(primaryEvent?.date) || 'Tanggal segera diumumkan';
  return `${eventLabel} akan diselenggarakan pada ${dateLabel}.`;
}

function buildLegacyWeddingData(
  profiles: SapatamuProfile[],
  events: SapatamuEvent[],
  musicValue: string,
  giftAccounts: Array<{ bankName: string; accountNumber: string; accountHolder: string }>,
  giftAddress: string,
): JsonRecord {
  const primaryEvent = events[0] ?? buildDefaultEvents()[0];
  const secondaryEvent = events[1] ?? buildDefaultEvents()[1];

  return {
    brideName: cleanString(profiles[1]?.fullName),
    groomName: cleanString(profiles[0]?.fullName),
    brideParents: '',
    groomParents: '',
    akadTime: primaryEvent.date ? new Date(`${primaryEvent.date}T${primaryEvent.timeStart || '00:00'}:00`).toISOString() : '',
    akadLocation: primaryEvent.address,
    akadMapUrl: primaryEvent.mapLocation,
    resepsiTime: secondaryEvent.date ? new Date(`${secondaryEvent.date}T${secondaryEvent.timeStart || '00:00'}:00`).toISOString() : '',
    resepsiLocation: secondaryEvent.address,
    resepsiMapUrl: secondaryEvent.mapLocation,
    bgmUrl: musicValue,
    bankAccountInfo: giftAccounts,
    giftAddress,
    loveStory: cleanString(profiles[0]?.description) || cleanString(profiles[1]?.description),
  };
}

export function buildContentFromDraft(params: {
  themeId: string;
  profiles: SapatamuProfile[];
  events: SapatamuEvent[];
  basePhotoQuota: number;
  requiredTierCategory?: 'basic' | 'premium' | 'vintage';
  existing?: Partial<SapatamuEditorDocumentV3> | null;
}): SapatamuEditorDocumentV3 {
  const profiles = normalizeProfiles(params.profiles);
  const events = normalizeEvents(params.events);
  const existing = params.existing ?? {};
  const musicSettings = existing.musicSettings ?? { mode: 'none', value: '' };
  const giftAccounts = Array.isArray(existing.settings?.giftAccounts)
    ? existing.settings.giftAccounts
        .filter((item) => Boolean(item && typeof item === 'object'))
        .map((item) => ({
          bankName: cleanString((item as JsonRecord).bankName),
          accountNumber: cleanString((item as JsonRecord).accountNumber),
          accountHolder: cleanString((item as JsonRecord).accountHolder),
        }))
        .filter((item) => item.bankName || item.accountNumber || item.accountHolder)
        .slice(0, 2)
    : [];
  const giftAddress = cleanString(existing.settings?.giftAddress);

  return {
    schemaVersion: 3,
    selectedTheme: cleanString(params.themeId) || 'malay-ethnic-red-ruby',
    profiles,
    events,
    sendSettings: {
      prefaceTemplate: cleanString(existing.sendSettings?.prefaceTemplate) || DEFAULT_PREFACE_TEMPLATE,
    },
    albumSettings: {
      basePhotoQuota:
        typeof existing.albumSettings?.basePhotoQuota === 'number'
          ? existing.albumSettings.basePhotoQuota
          : params.basePhotoQuota,
    },
    meta: {
      titleTemplate:
        cleanString(existing.meta?.titleTemplate) ||
        cleanString((existing.meta as JsonRecord | undefined)?.title) ||
        buildMetaTitle(profiles),
      description: cleanString(existing.meta?.description) || buildMetaDescription(events),
      imageUrl:
        typeof existing.meta?.imageUrl === 'string' && cleanString(existing.meta?.imageUrl)
          ? cleanString(existing.meta?.imageUrl)
          : null,
    },
    musicSettings: {
      mode:
        existing.musicSettings?.mode === 'library' || existing.musicSettings?.mode === 'youtube'
          ? existing.musicSettings.mode
          : 'none',
      value: cleanString(musicSettings.value),
    },
    extraLinks: {
      youtube: cleanString(existing.extraLinks?.youtube),
    },
    settings: {
      commerce: {
        requiredTierCategory:
          existing.settings?.commerce?.requiredTierCategory === 'premium' ||
          existing.settings?.commerce?.requiredTierCategory === 'vintage'
            ? existing.settings.commerce.requiredTierCategory
            : params.requiredTierCategory ?? 'basic',
        selectedPackageCode:
          typeof existing.settings?.commerce?.selectedPackageCode === 'string'
            ? existing.settings.commerce.selectedPackageCode
            : null,
        activationState:
          existing.settings?.commerce?.activationState === 'active' ? 'active' : 'inactive',
      },
      giftAccounts,
      giftAddress,
      lastEditedAtDisplay:
        typeof existing.settings?.lastEditedAtDisplay === 'string'
          ? existing.settings.lastEditedAtDisplay
          : null,
      activatedAtDisplay:
        typeof existing.settings?.activatedAtDisplay === 'string'
          ? existing.settings.activatedAtDisplay
          : null,
    },
    historyDisplayHints:
      existing.historyDisplayHints && typeof existing.historyDisplayHints === 'object'
        ? existing.historyDisplayHints
        : {},
    weddingData: {
      ...buildLegacyWeddingData(
        profiles,
        events,
        cleanString(musicSettings.value),
        giftAccounts,
        giftAddress,
      ),
      ...(existing.weddingData && typeof existing.weddingData === 'object' ? existing.weddingData : {}),
    },
    editor: normalizeEditorState({
      themeId: cleanString(params.themeId) || 'malay-ethnic-red-ruby',
      requiredTierCategory:
        existing.settings?.commerce?.requiredTierCategory === 'premium' ||
        existing.settings?.commerce?.requiredTierCategory === 'vintage'
          ? existing.settings.commerce.requiredTierCategory
          : params.requiredTierCategory ?? 'basic',
      profiles,
      events,
      raw: existing.editor ?? null,
    }),
  };
}

export function buildContentForThemeSwitch(params: {
  themeId: string;
  existing: SapatamuEditorDocumentV3;
  requiredTierCategory?: 'basic' | 'premium' | 'vintage';
}): SapatamuEditorDocumentV3 {
  const targetThemeId = cleanString(params.themeId) || params.existing.selectedTheme || 'malay-ethnic-red-ruby';
  const requiredTierCategory =
    params.requiredTierCategory ??
    params.existing.settings?.commerce?.requiredTierCategory ??
    'basic';
  const existingWithoutEditor: Partial<SapatamuEditorDocumentV3> = {
    ...params.existing,
    selectedTheme: targetThemeId,
    editor: undefined,
    settings: {
      ...params.existing.settings,
      commerce: {
        ...params.existing.settings.commerce,
        requiredTierCategory,
      },
    },
  };

  return buildContentFromDraft({
    themeId: targetThemeId,
    profiles: params.existing.profiles,
    events: params.existing.events,
    basePhotoQuota: params.existing.albumSettings.basePhotoQuota,
    requiredTierCategory,
    existing: existingWithoutEditor,
  });
}

export function migrateContentJson(raw: unknown): SapatamuEditorDocumentV3 {
  const source = raw && typeof raw === 'object' ? (raw as JsonRecord) : {};

  if (source.schemaVersion === 3) {
    return buildContentFromDraft({
      themeId: cleanString(source.selectedTheme) || 'malay-ethnic-red-ruby',
      profiles: normalizeProfiles(source.profiles),
      events: normalizeEvents(source.events),
      basePhotoQuota:
        typeof source.albumSettings?.basePhotoQuota === 'number' ? source.albumSettings.basePhotoQuota : 15,
      requiredTierCategory:
        source.settings?.commerce?.requiredTierCategory === 'premium' ||
        source.settings?.commerce?.requiredTierCategory === 'vintage'
          ? source.settings.commerce.requiredTierCategory
          : 'basic',
      existing: source as Partial<SapatamuEditorDocumentV3>,
    });
  }

  if (source.schemaVersion === 2) {
    return buildContentFromDraft({
      themeId: cleanString(source.selectedTheme) || 'malay-ethnic-red-ruby',
      profiles: normalizeProfiles(source.profiles),
      events: normalizeEvents(source.events),
      basePhotoQuota:
        typeof source.albumSettings?.basePhotoQuota === 'number'
          ? source.albumSettings.basePhotoQuota
          : 15,
      requiredTierCategory:
        source.settings?.commerce?.requiredTierCategory === 'premium' ||
        source.settings?.commerce?.requiredTierCategory === 'vintage'
          ? source.settings.commerce.requiredTierCategory
          : 'basic',
      existing: {
        ...(source as Partial<SapatamuEditorDocumentV3>),
        editor: buildDefaultEditorState({
          themeId: cleanString(source.selectedTheme) || 'malay-ethnic-red-ruby',
          requiredTierCategory:
            source.settings?.commerce?.requiredTierCategory === 'premium' ||
            source.settings?.commerce?.requiredTierCategory === 'vintage'
              ? source.settings.commerce.requiredTierCategory
              : 'basic',
          profiles: normalizeProfiles(source.profiles),
          events: normalizeEvents(source.events),
        }),
      },
    });
  }

  const weddingData = source.weddingData && typeof source.weddingData === 'object' ? source.weddingData : {};
  const profiles = normalizeProfiles([
    {
      fullName: cleanString(weddingData.groomName),
      nickName: cleanString(weddingData.groomName).split(' ')[0] ?? '',
      description: cleanString(weddingData.groomParents),
    },
    {
      fullName: cleanString(weddingData.brideName),
      nickName: cleanString(weddingData.brideName).split(' ')[0] ?? '',
      description: cleanString(weddingData.brideParents),
    },
  ]);

  const events = normalizeEvents([
    {
      id: 'event-1',
      name: 'Akad',
      date: cleanString(weddingData.akadTime).slice(0, 10),
      timeStart: cleanString(weddingData.akadTime).slice(11, 16),
      timeEnd: '',
      timeZone: 'WIB',
      address: cleanString(weddingData.akadLocation),
      mapLocation: cleanString(weddingData.akadMapUrl),
      enabled: true,
    },
    {
      id: 'event-2',
      name: 'Resepsi',
      date: cleanString(weddingData.resepsiTime).slice(0, 10),
      timeStart: cleanString(weddingData.resepsiTime).slice(11, 16),
      timeEnd: '',
      timeZone: 'WIB',
      address: cleanString(weddingData.resepsiLocation),
      mapLocation: cleanString(weddingData.resepsiMapUrl),
      enabled: Boolean(cleanString(weddingData.resepsiTime) || cleanString(weddingData.resepsiLocation)),
    },
  ]);

  return buildContentFromDraft({
    themeId: cleanString(source.selectedTheme) || 'malay-ethnic-red-ruby',
    profiles,
    events,
    basePhotoQuota: 15,
    requiredTierCategory: 'basic',
    existing: {
      musicSettings: {
        mode: cleanString(weddingData.bgmUrl) ? 'youtube' : 'none',
        value: cleanString(weddingData.bgmUrl),
      },
    },
  });
}

export function buildInvitationTitleFromContent(content: SapatamuEditorDocumentV3): string {
  const explicitTitle = cleanString(content.weddingData?.invitationName);
  if (explicitTitle) return explicitTitle;

  const left =
    cleanString(content.profiles[0]?.nickName) || cleanString(content.profiles[0]?.fullName) || 'Mempelai 1';
  const right =
    cleanString(content.profiles[1]?.nickName) || cleanString(content.profiles[1]?.fullName) || 'Mempelai 2';
  return `The Wedding of ${left} & ${right}`;
}

export function buildSlugCandidateFromProfiles(profiles: SapatamuProfile[]): string {
  const left = cleanString(profiles[0]?.nickName) || cleanString(profiles[0]?.fullName);
  const right = cleanString(profiles[1]?.nickName) || cleanString(profiles[1]?.fullName);
  return slugify(`${left}-${right}`);
}

export function buildDraftWizardSummary(raw: unknown, seed?: Partial<DraftWizardState>): DraftWizardState {
  const source = raw && typeof raw === 'object' ? (raw as JsonRecord) : {};
  return buildDefaultDraftWizard({
    step: typeof source.step === 'number' ? source.step : seed?.step,
    invitationName: cleanString(source.invitationName) || cleanString(seed?.invitationName),
    slugCandidate: cleanString(source.slugCandidate) || cleanString(seed?.slugCandidate),
    themeId: cleanString(source.themeId) || cleanString(seed?.themeId),
    selectedPackageId:
      typeof source.selectedPackageId === 'string'
        ? source.selectedPackageId
        : typeof seed?.selectedPackageId === 'string'
          ? seed.selectedPackageId
          : null,
    profiles: normalizeProfiles(source.profiles ?? seed?.profiles),
    events: normalizeEvents(source.events ?? seed?.events),
  });
}

export function mergeContentPatch(
  current: SapatamuEditorDocumentV3,
  patch: Partial<SapatamuEditorDocumentV3>,
): SapatamuEditorDocumentV3 {
  return buildContentFromDraft({
    themeId: cleanString(patch.selectedTheme) || current.selectedTheme,
    profiles: patch.profiles ?? current.profiles,
    events: patch.events ?? current.events,
    basePhotoQuota:
      typeof patch.albumSettings?.basePhotoQuota === 'number'
        ? patch.albumSettings.basePhotoQuota
        : current.albumSettings.basePhotoQuota,
    existing: {
      ...current,
      ...patch,
      sendSettings: {
        ...current.sendSettings,
        ...patch.sendSettings,
      },
      albumSettings: {
        ...current.albumSettings,
        ...patch.albumSettings,
      },
      meta: {
        ...current.meta,
        ...patch.meta,
      },
      musicSettings: {
        ...current.musicSettings,
        ...patch.musicSettings,
      },
      extraLinks: {
        ...current.extraLinks,
        ...patch.extraLinks,
      },
      settings: {
        ...current.settings,
        ...patch.settings,
      },
      historyDisplayHints: {
        ...current.historyDisplayHints,
        ...(patch.historyDisplayHints ?? {}),
      },
      editor: patch.editor ?? current.editor,
    },
  });
}
