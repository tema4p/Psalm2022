import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  // {
  //   path: 'folder/:id',
  //   loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  // },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'page/:id',
    loadChildren: () => import('./pages/page-view/page-view.module').then( m => m.PageViewPageModule)
  },
  {
    path: 'page/:id/:psalm',
    loadChildren: () => import('./pages/page-view/page-view.module').then( m => m.PageViewPageModule)
  },
  {
    path: 'needs',
    loadChildren: () => import('./pages/needs/needs.module').then( m => m.NeedsPageModule)
  },
  {
    path: 'slovar',
    loadChildren: () => import('./pages/slovar/slovar.module').then( m => m.SlovarPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'sinod',
    loadChildren: () => import('./pages/sinod/sinod.module').then( m => m.SinodPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
