import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../shared/guards/unsaved-changes.guard';
import { AddAttributePage } from './components/add-attribute/add-attribute';
import { EditAttribute } from './components/edit-attribute/edit-attribute';
import { AttributeList } from './components/attribute-list/attribute-list';

export const ATTRIBUTE_ROUTES: Routes = [
  {
    path: '',
    component: AttributeList
  },
  {
    path: 'add-attribute',
    component: AddAttributePage
  },
  {
    path: 'edit-attribute/:id',
    component: EditAttribute,
    canDeactivate: [unsavedChangesGuard]
  }
];