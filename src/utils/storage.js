/**
 * State Persistence & Resilience Utility for GuardianRoute AI
 * 
 * Features:
 * - Schema versioning (v2) with automated backwards-compatible migration from v1
 * - Rigorous data sanitization (XSS mitigation, coordinate bounds checking, phone regex)
 * - Primary contact invariant enforcement (guarantees exactly 1 primary contact)
 * - Safe error boundaries with try-catch fallbacks on quota exhaustion or corrupted JSON
 */

import { INITIAL_HAZARDS, DEFAULT_CONTACTS } from '../data/mockData';

const STORAGE_KEYS = {
  HAZARDS_V2: 'guardianroute_hazards_v2',
  CONTACTS_V2: 'guardianroute_contacts_v2',
  THEME_V2: 'guardianroute_theme_v2',
  OFFLINE_MODE_V2: 'guardianroute_offline_mode_v2',
  // Legacy keys for migration
  HAZARDS_V1: 'guardianroute_hazards_v1',
  CONTACTS_V1: 'guardianroute_contacts_v1'
};

/**
 * Sanitizes generic user text input to prevent XSS injection
 */
export function sanitizeText(input, maxLength = 300) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Strip angle brackets
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates and sanitizes geographic coordinates
 */
export function sanitizeCoordinates(lat, lng) {
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  
  const validLat = !isNaN(parsedLat) && parsedLat >= -90 && parsedLat <= 90 ? parsedLat : 37.7749;
  const validLng = !isNaN(parsedLng) && parsedLng >= -180 && parsedLng <= 180 ? parsedLng : -122.4194;
  
  return { lat: validLat, lng: validLng };
}

/**
 * Sanitizes and formats phone numbers
 */
export function sanitizePhoneNumber(phone) {
  if (typeof phone !== 'string') return '+1 (555) 000-0000';
  const clean = phone.replace(/[^\d+()-\s]/g, '').trim();
  return clean.length >= 7 ? clean : '+1 (555) 000-0000';
}

/**
 * Sanitizes a community hazard report object
 */
export function sanitizeHazard(hazard) {
  if (!hazard || typeof hazard !== 'object') return null;
  
  const coords = sanitizeCoordinates(hazard.lat, hazard.lng);
  const allowedSeverities = ['Low', 'Medium', 'High', 'Critical'];
  const severity = allowedSeverities.includes(hazard.severity) ? hazard.severity : 'Medium';
  
  return {
    id: String(hazard.id || `haz-${Date.now()}`),
    category: sanitizeText(hazard.category || 'General Hazard', 60),
    severity,
    title: sanitizeText(hazard.title || 'Community Hazard Report', 120),
    description: sanitizeText(hazard.description || 'No description provided.', 500),
    location: sanitizeText(hazard.location || 'Reported Location', 140),
    lat: coords.lat,
    lng: coords.lng,
    timestamp: sanitizeText(hazard.timestamp || 'Recent', 40),
    upvotes: typeof hazard.upvotes === 'number' && hazard.upvotes >= 0 ? Math.floor(hazard.upvotes) : 1,
    verified: Boolean(hazard.verified),
    tags: Array.isArray(hazard.tags) ? hazard.tags.map(t => sanitizeText(t, 30)).slice(0, 8) : [],
    photoUrl: typeof hazard.photoUrl === 'string' && hazard.photoUrl.startsWith('data:image') ? hazard.photoUrl : null,
    resolved: Boolean(hazard.resolved)
  };
}

/**
 * Sanitizes an emergency contact object
 */
export function sanitizeContact(contact, isFirst = false) {
  if (!contact || typeof contact !== 'object') return null;
  
  return {
    id: String(contact.id || `c-${Date.now()}`),
    name: sanitizeText(contact.name || 'Emergency Contact', 60),
    phone: sanitizePhoneNumber(contact.phone),
    relationship: sanitizeText(contact.relationship || 'Family', 40),
    isPrimary: Boolean(contact.isPrimary ?? isFirst),
    autoNotify: Boolean(contact.autoNotify ?? true)
  };
}

/**
 * Enforces that exactly one contact in the array is marked as primary
 */
export function enforcePrimaryContactInvariant(contacts) {
  if (!Array.isArray(contacts) || contacts.length === 0) {
    return DEFAULT_CONTACTS;
  }
  
  let hasPrimary = false;
  const fixed = contacts.map((c) => {
    if (c.isPrimary && !hasPrimary) {
      hasPrimary = true;
      return { ...c, isPrimary: true };
    }
    return { ...c, isPrimary: false };
  });
  
  // If no primary contact exists, set the first one as primary
  if (!hasPrimary && fixed.length > 0) {
    fixed[0].isPrimary = true;
  }
  
  return fixed;
}

/**
 * Loads and sanitizes hazard alerts with automated version migration
 */
export function getSavedHazards() {
  try {
    // 1. Try Loading V2 Schema
    const rawV2 = localStorage.getItem(STORAGE_KEYS.HAZARDS_V2);
    if (rawV2) {
      const parsed = JSON.parse(rawV2);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(sanitizeHazard).filter(Boolean);
      }
    }
    
    // 2. Fallback Migration from V1 Schema
    const rawV1 = localStorage.getItem(STORAGE_KEYS.HAZARDS_V1);
    if (rawV1) {
      const parsedV1 = JSON.parse(rawV1);
      if (Array.isArray(parsedV1) && parsedV1.length > 0) {
        const sanitized = parsedV1.map(sanitizeHazard).filter(Boolean);
        saveHazards(sanitized);
        return sanitized;
      }
    }
    
    // 3. Fallback to Initial Default Seeds
    saveHazards(INITIAL_HAZARDS);
    return INITIAL_HAZARDS;
  } catch (err) {
    console.warn('Storage resilience: Hazard parsing failed, restoring safe defaults:', err);
    return INITIAL_HAZARDS;
  }
}

/**
 * Persists sanitized hazards array to storage
 */
export function saveHazards(hazards) {
  try {
    if (!Array.isArray(hazards)) return;
    const sanitized = hazards.map(sanitizeHazard).filter(Boolean);
    localStorage.setItem(STORAGE_KEYS.HAZARDS_V2, JSON.stringify(sanitized));
  } catch (err) {
    console.warn('Storage resilience: Failed to save hazards to localStorage (quota or disabled):', err);
  }
}

/**
 * Loads and sanitizes emergency contacts with primary invariant enforcement
 */
export function getSavedContacts() {
  try {
    // 1. Try V2 Schema
    const rawV2 = localStorage.getItem(STORAGE_KEYS.CONTACTS_V2);
    if (rawV2) {
      const parsed = JSON.parse(rawV2);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const sanitized = parsed.map((c, i) => sanitizeContact(c, i === 0)).filter(Boolean);
        return enforcePrimaryContactInvariant(sanitized);
      }
    }
    
    // 2. Migration from V1 Schema
    const rawV1 = localStorage.getItem(STORAGE_KEYS.CONTACTS_V1);
    if (rawV1) {
      const parsedV1 = JSON.parse(rawV1);
      if (Array.isArray(parsedV1) && parsedV1.length > 0) {
        const sanitized = parsedV1.map((c, i) => sanitizeContact(c, i === 0)).filter(Boolean);
        const invariant = enforcePrimaryContactInvariant(sanitized);
        saveContacts(invariant);
        return invariant;
      }
    }
    
    // 3. Fallback Defaults
    saveContacts(DEFAULT_CONTACTS);
    return DEFAULT_CONTACTS;
  } catch (err) {
    console.warn('Storage resilience: Contacts parsing failed, restoring safe defaults:', err);
    return DEFAULT_CONTACTS;
  }
}

/**
 * Persists sanitized contacts array to storage
 */
export function saveContacts(contacts) {
  try {
    if (!Array.isArray(contacts)) return;
    const sanitized = contacts.map((c, i) => sanitizeContact(c, i === 0)).filter(Boolean);
    const invariant = enforcePrimaryContactInvariant(sanitized);
    localStorage.setItem(STORAGE_KEYS.CONTACTS_V2, JSON.stringify(invariant));
  } catch (err) {
    console.warn('Storage resilience: Failed to save contacts to localStorage:', err);
  }
}

export function getSavedTheme() {
  try {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME_V2);
    return theme === 'radar' || theme === 'light' || theme === 'dark' ? theme : 'dark';
  } catch {
    return 'dark';
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME_V2, theme);
  } catch (err) {
    console.warn('Failed to save theme:', err);
  }
}

export function getSavedOfflineMode() {
  try {
    return localStorage.getItem(STORAGE_KEYS.OFFLINE_MODE_V2) === 'true';
  } catch {
    return false;
  }
}

export function saveOfflineMode(isOffline) {
  try {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_MODE_V2, String(isOffline));
  } catch (err) {
    console.warn('Failed to save offline mode:', err);
  }
}
