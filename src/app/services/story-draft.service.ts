import { Injectable } from '@angular/core';
import { StoredStoryDraft, StoryDraft } from '../models/story-draft.model';

@Injectable({ providedIn: 'root' })
export class StoryDraftService {
  private key(studentId: number): string {
    return `giu:story-draft:${studentId}`;
  }

  load(studentId: number): StoredStoryDraft | null {
    try {
      const text = localStorage.getItem(this.key(studentId));
      if (!text) return null;
      const draft = JSON.parse(text);
      const values = draft?.values;
      // Valid JSON can still have the wrong shape after a manual edit.
      if (!values || typeof draft.savedAt !== 'string' || !Number.isFinite(Date.parse(draft.savedAt)) ||
          typeof values.quote !== 'string' || typeof values.story !== 'string' ||
          typeof values.moment !== 'string' || typeof values.next !== 'string' ||
          typeof values.consent !== 'boolean') return null;
      return draft as StoredStoryDraft;
    } catch {
      return null;
    }
  }

  save(studentId: number, values: StoryDraft): string | null {
    const draft: StoredStoryDraft = { savedAt: new Date().toISOString(), values };
    try {
      localStorage.setItem(this.key(studentId), JSON.stringify(draft));
      return draft.savedAt;
    } catch {
      return null;
    }
  }

  clear(studentId: number): boolean {
    try {
      localStorage.removeItem(this.key(studentId));
      return true;
    } catch {
      return false;
    }
  }
}
