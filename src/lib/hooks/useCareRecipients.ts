import { useEffect, useState } from 'react';
import type { Guardian, User } from '../types';
import {
  getCareRecipientsForGuardian,
  listenToCareRecipients,
  getUserProfile
} from '../firebase';

const COLOR_CLASSES = ['bg-sky-400', 'bg-blue-500', 'bg-amber-400', 'bg-emerald-400', 'bg-purple-500', 'bg-rose-400'];

const stringToColor = (value: string | undefined) => {
  if (!value) {
    return COLOR_CLASSES[0];
  }
  const hash = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return COLOR_CLASSES[Math.abs(hash) % COLOR_CLASSES.length];
};

const getInitials = (value: string | undefined) => {
  if (!value) {
    return '??';
  }

  const base = value.includes('@') ? value.split('@')[0] : value;
  const cleaned = base.trim();

  if (!cleaned) {
    return '??';
  }

  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    const normalized = parts[0].replace(/[^A-Za-z가-힣]/g, '');
    if (normalized.length >= 2) {
      return (normalized[0] + normalized[normalized.length - 1]).toUpperCase();
    }
    return normalized.toUpperCase().slice(0, 2).padEnd(2, normalized.toUpperCase());
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

interface CareRecipientRecord {
  id: string;
  name: string;
  relation: string;
  color: string;
  initials: string;
  status: Guardian['status'];
  profile: User | null;
  guardian: Guardian;
}

const buildViewModel = (guardian: Guardian, profile: User | null): CareRecipientRecord => {
  const baseName =
    profile?.displayName ||
    profile?.email ||
    guardian.guardianName ||
    guardian.guardianEmail ||
    guardian.userId;

  const relation = guardian.relationship || 'Care Recipient';

  return {
    id: guardian.userId,
    name: baseName,
    relation,
    color: stringToColor(baseName),
    initials: getInitials(baseName),
    status: guardian.status,
    profile,
    guardian
  };
};

const resolveProfiles = async (guardians: Guardian[]) => {
  const activeGuardians = guardians.filter(guardian => guardian.status !== 'inactive');

  if (activeGuardians.length === 0) {
    return [] as CareRecipientRecord[];
  }

  const profileMap = new Map<string, User | null>();

  await Promise.all(
    activeGuardians.map(async guardian => {
      if (profileMap.has(guardian.userId)) {
        return;
      }
      try {
        const profile = await getUserProfile(guardian.userId);
        profileMap.set(guardian.userId, profile);
      } catch (error) {
        profileMap.set(guardian.userId, null);
      }
    })
  );

  return activeGuardians.map(guardian => buildViewModel(guardian, profileMap.get(guardian.userId) ?? null));
};

export const useCareRecipients = (guardianId: string | undefined, realtime: boolean = false) => {
  const [careRecipients, setCareRecipients] = useState<CareRecipientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!guardianId) {
      setCareRecipients([]);
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const guardians = await getCareRecipientsForGuardian(guardianId);
        if (cancelled) return;
        const enriched = await resolveProfiles(guardians);
        if (cancelled) return;
        setCareRecipients(enriched);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load care recipients');
          setCareRecipients([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (realtime) {
      setLoading(true);
      unsubscribe = listenToCareRecipients(guardianId, guardians => {
        resolveProfiles(guardians)
          .then(enriched => {
            if (!cancelled) {
              setCareRecipients(enriched);
              setError(null);
              setLoading(false);
            }
          })
          .catch(err => {
            if (!cancelled) {
              setError(err instanceof Error ? err.message : 'Failed to load care recipients');
              setCareRecipients([]);
              setLoading(false);
            }
          });
      });
    } else {
      load();
    }

    return () => {
      cancelled = true;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [guardianId, realtime]);

  return {
    recipients: careRecipients,
    loading,
    error
  };
};
