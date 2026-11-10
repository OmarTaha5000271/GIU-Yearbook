import { CanDeactivateFn } from '@angular/router';

export interface UnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<UnsavedChanges> = (page) =>
  !page.hasUnsavedChanges() || window.confirm('Leave without saving your latest changes?');
