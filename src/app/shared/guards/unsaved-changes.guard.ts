import { CanDeactivateFn } from '@angular/router';
import { EditAttribute } from '../../features/attributes/components/edit-attribute/edit-attribute';

export const unsavedChangesGuard: CanDeactivateFn<
  EditAttribute
> = component => component.canDeactivate();