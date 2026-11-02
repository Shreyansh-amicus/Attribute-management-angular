import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';
import { AddAttributePage } from './components/add-attribute/add-attribute';
import { EditAttribute } from './components/edit-attribute/edit-attribute';
import { AttributeList } from './components/attribute-list/attribute-list';
import { authGuard } from '../../core/guards/auth.guard';
import { attributeResolver } from '../../core/resolvers/attribute-resolver';

export const ATTRIBUTE_ROUTES: Routes = [
   {
    path: '',
    component: AttributeList,
    pathMatch: 'full',
    title: 'Attribute List'
  },
  {
    path: 'add',
    component: AddAttributePage,
    title: 'Add Attribute',
    canActivate: [authGuard]
  },
  {
    path: ':id/edit',
    component: EditAttribute,
    canDeactivate: [unsavedChangesGuard],
    title: 'Edit Attribute',
    canActivate : [authGuard],
    resolve:{
      attribute : attributeResolver
    },
  }
];