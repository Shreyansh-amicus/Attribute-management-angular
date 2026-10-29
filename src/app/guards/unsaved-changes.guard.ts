import { CanDeactivateFn } from '@angular/router';
import { EditAttribute } from '../pages/edit-attribute/edit-attribute';

export const unsavedChangesGuard: CanDeactivateFn<
  EditAttribute
> = component => component.canDeactivate();