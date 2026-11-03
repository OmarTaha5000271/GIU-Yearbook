import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SavedService {
  // Shared for this app session; a browser reload starts with an empty list.
  private readonly _ids = signal<number[]>([]);
  readonly ids = this._ids.asReadonly();
  readonly count = computed(() => this._ids().length);

  isSaved(id: number): boolean {
    return this._ids().includes(id);
  }

  toggle(id: number): void {
    this._ids.update(ids =>
      ids.includes(id) ? ids.filter(savedId => savedId !== id) : [...ids, id],
    );
  }
}
