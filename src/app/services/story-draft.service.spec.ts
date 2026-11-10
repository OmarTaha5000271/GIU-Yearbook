import { TestBed } from '@angular/core/testing';
import { StoryDraftService } from './story-draft.service';
import { StoryDraft } from '../models/story-draft.model';

describe('StoryDraftService', () => {
  const values: StoryDraft = { quote: '', story: 'My first project', moment: '', next: '', consent: false };
  let service: StoryDraftService;

  beforeEach(() => {
    service = TestBed.inject(StoryDraftService);
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('restores incomplete drafts and keeps each student separate', () => {
    const savedAt = service.save(1, values);
    expect(savedAt).not.toBeNull();
    expect(service.load(1)).toEqual({ savedAt, values });
    expect(service.load(2)).toBeNull();
    service.save(2, { ...values, story: 'Another student' });
    service.clear(1);
    expect(service.load(1)).toBeNull();
    expect(service.load(2)?.values.story).toBe('Another student');
  });

  it('ignores corrupt JSON, invalid dates and malformed values', () => {
    for (const text of ['{', 'null', '{}', JSON.stringify({ savedAt: 'bad', values }),
      JSON.stringify({ savedAt: new Date().toISOString(), values: { ...values, quote: 5 } })]) {
      localStorage.setItem('giu:story-draft:1', text);
      expect(service.load(1)).toBeNull();
    }
  });

  it('reports storage failures without claiming that the draft was saved', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Full'); });
    expect(service.save(1, values)).toBeNull();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Blocked'); });
    expect(service.load(1)).toBeNull();
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => { throw new Error('Blocked'); });
    expect(service.clear(1)).toBe(false);
  });
});
