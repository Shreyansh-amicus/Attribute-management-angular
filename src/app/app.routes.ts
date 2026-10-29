import { Routes } from '@angular/router';
import { AddAttributePage } from './pages/add-attribute/add-attribute';
import { AttributeListPage } from './pages/attribute-list/attribute-list';
import { EditAttribute } from './pages/edit-attribute/edit-attribute';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';

export const routes: Routes = [
  {
    path: 'add-attribute',
    component: AddAttributePage,
    title: 'Add attribute',
  },
  {
    path: 'edit-attribute/:id',
    component: EditAttribute,
    canDeactivate: [unsavedChangesGuard],
    title: 'Edit attribute',
  },
  {
    path: '**',
    component: AttributeListPage,
    title: 'Attribute list',
  },
];
