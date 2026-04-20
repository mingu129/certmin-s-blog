import { redis } from './redis';

export interface SiteSettings {
  siteSubtitle: string;
  profileName: string;
  profileDescription: string;
  profilePhoto: string | null;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteSubtitle: '일상과 코드, 그리고 생각들을 기록합니다.',
  profileName: 'certmin',
  profileDescription: '코딩과 블로그를 좋아합니다.\n일상과 생각을 기록합니다.',
  profilePhoto: null,
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const raw = await redis.get('kv:settings');
    if (!raw) return DEFAULT_SETTINGS;
    const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return { ...DEFAULT_SETTINGS, ...data };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<SiteSettings>): Promise<void> {
  const current = await getSettings();
  await redis.set('kv:settings', JSON.stringify({ ...current, ...settings }));
}
