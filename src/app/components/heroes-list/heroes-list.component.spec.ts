import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesListComponent } from './heroes-list.component';
import { HeroesService } from '../../services/heroes.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('HeroesListComponent', () => {
  let component: HeroesListComponent;
  let fixture: ComponentFixture<HeroesListComponent>;
  let mockHeroesService: any;
  let mockRouter: any;
  let mockDialog: any;

  beforeEach(async () => {
    mockHeroesService = jasmine.createSpyObj(['getAllHeroes', 'deleteHero', 'searchHeroes', 'setServiceHeroes']);
    mockRouter = jasmine.createSpyObj(['navigate']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    mockDialog.open.and.returnValue({
      afterClosed: () => of(true)
    });

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatDialogModule,
        MatPaginatorModule,
        MatTableModule
      ],
      declarations: [ HeroesListComponent ],
      providers: [
        { provide: HeroesService, useValue: mockHeroesService },
        { provide: Router, useValue: mockRouter },
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar los héroes', () => {
    mockHeroesService.getAllHeroes.and.returnValue(of([{ id: 1, name: 'SpiderDude', gender: 'Male' }]));
    fixture.detectChanges();
    expect(component.heroes.data.length).toBe(1);
  });

  it('debe navegar a añadir un heroe tras pulsar el botón', () => {
    fixture.detectChanges();
    component.navigateToAddHero();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/add-hero']);
  });

  it('debe filtrar los héroes con la query dada', () => {
    mockHeroesService.searchHeroes.and.returnValue(of([{ id: 2, name: 'Batgirl', gender: 'Female' }]));
    component.applyFilter('Batgirl');
    expect(component.heroes.data.length).toBe(1);
  });

  it('should delete hero when confirmation dialog is confirmed', () => {
    mockHeroesService.deleteHero.and.returnValue(of({}));
    component.heroes.data = [{ id: 1, name: 'SpiderDude', gender: 'Male' }];
    
    component.deleteHero(1);
    
    expect(mockHeroesService.deleteHero).toHaveBeenCalledWith(1);
  });
  
});
