import { Routes } from '@angular/router';
import { AddAttributePage } from './pages/add-attribute/add-attribute';
import { AttributeListPage } from './pages/attribute-list/attribute-list';

export const routes: Routes = [
    {
        path : 'add-attribute',
        component : AddAttributePage,
        title : 'Add attribute'
    },
    {
        path : '**',
        component : AttributeListPage,
        title : 'Attribute list'
    }
];
