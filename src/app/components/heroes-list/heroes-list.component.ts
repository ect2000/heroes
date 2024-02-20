import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { Hero } from '../../models/hero.model';
import { HeroesService } from '../../services/heroes.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatTable, MatCell, MatHeaderCell, MatHeaderRow, MatRow, MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBar} from '@angular/material/progress-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { LoadingService } from '../../services/loading.service';
import { AsyncPipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Component({
  selector: 'app-heroes-list',
  standalone: true,
  imports: [RouterModule, MatButton, MatToolbarModule, MatTableModule, MatFormField, MatInput, MatLabel, MatTable, MatCell, MatHeaderCell, MatIcon, MatHeaderRow, MatRow, FormsModule, ReactiveFormsModule, MatDialogModule, AsyncPipe, MatProgressBar, MatPaginatorModule, MatPaginator],
  templateUrl: './heroes-list.component.html',
  styleUrl: './heroes-list.component.scss'
})
export class HeroesListComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['id', 'name', 'gender', 'actions'];
  heroes = new MatTableDataSource<Hero, MatPaginator>([]);
  searchControl = new FormControl();

  constructor(private heroesService: HeroesService, private router: Router, private dialog: MatDialog, public loadingService: LoadingService, private cdr: ChangeDetectorRef) { 
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(term => {
        this.applyFilter(term);
      });
  }

  ngAfterViewInit() {
    this.loadHeroes();
    this.loadingService.loading$.subscribe(loading => {
      if (!loading) {
        setTimeout(() => {
          this.heroes.paginator = this.paginator;
        }, 20); 
      }
    });
  }

  loadHeroes(): void {
    this.heroesService.getAllHeroes().subscribe(heroes => {
      this.heroes.data = heroes;
      this.heroes.paginator = this.paginator;
      this.cdr.detectChanges();
      console.log(this.heroes);
    });
  }

  deleteHero(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        id: id
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.heroesService.deleteHero(id).subscribe(() => this.loadHeroes());
      }
    });
  }

  editHero(id: number): void {
    this.heroesService.setServiceHeroes(this.heroes.data);
    this.router.navigate(['/edit-hero', id]);
  }
  
  navigateToAddHero(): void {
    this.heroesService.setServiceHeroes(this.heroes.data);
    this.router.navigate(['/add-hero']);
  }

  applyFilter(query: string): void {
    this.heroesService.searchHeroes(query).subscribe(heroes => this.heroes.data = heroes);
  }
}
