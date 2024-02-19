import { Routes } from '@angular/router';
import { HeroAddComponent } from './components/hero-add/hero-add.component';
import { HeroEditComponent } from './components/hero-edit/hero-edit.component';
import { HeroesListComponent } from './components/heroes-list/heroes-list.component';

export const routes: Routes = [
    { path: 'heroes', component: HeroesListComponent },
    { path: 'add-hero', component: HeroAddComponent },
    { path: 'edit-hero/:id', component: HeroEditComponent },
    { path: '', redirectTo: '/heroes', pathMatch: 'full' }
];
