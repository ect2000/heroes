import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../models/hero.model';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { LoadingService } from '../../services/loading.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AsyncPipe } from '@angular/common';
import { UppercaseInputDirective } from '../../directives/uppercase-input.directive';
import { Subject, take, takeUntil } from 'rxjs';
@Component({
  selector: 'app-hero-add',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatFormField, MatInput, MatLabel, MatError, FormsModule, ReactiveFormsModule, MatButton, MatOption, MatSelect, MatProgressBar, AsyncPipe, UppercaseInputDirective],
  templateUrl: './hero-add.component.html',
  styleUrl: './hero-add.component.scss'
})
export class HeroAddComponent {
  addHeroForm = new FormGroup({
    id: new FormControl(undefined, {
      validators: [Validators.required, this.uniqueHeroIdValidator()],
      updateOn: 'change'
    }),
    name: new FormControl('', Validators.required),
    gender: new FormControl('Hombre', Validators.required)
  });

  duplicateIdError = false;

  heroes: Hero[] = [];

  private destroy$ = new Subject<void>();

  constructor(private heroesService: HeroesService, private router: Router, public loadingService: LoadingService) {}

  ngOnInit() {
    if (this.heroesService.allHeroes.length > 0) {
      this.heroes = this.heroesService.allHeroes
    } else {
      this.heroesService.getAllHeroes().pipe(takeUntil(this.destroy$)).subscribe(heroes => this.heroes = heroes);
    }
  }

  uniqueHeroIdValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const heroes = this.heroesService.allHeroes;
      const idExists = heroes.some(hero => hero.id === control.value);
      return idExists ? { 'uniqueHeroId': { value: control.value } } : null;
    };
  }

  onSubmit() {
    if (this.addHeroForm.valid) {
      const heroToAdd: Hero = {
        id: this.addHeroForm.value.id ?? 0, 
        name: this.addHeroForm.value.name ?? '',
        gender: this.addHeroForm.value.gender ?? 'Hombre'
      };
      if (this.heroesService.allHeroes.some(hero => hero.id === heroToAdd.id)) {
        this.duplicateIdError = true;
        return;
      } else {
        this.heroesService.addHero(heroToAdd).pipe(takeUntil(this.destroy$)).subscribe(() => {
          this.router.navigate(['/heroes']);
        });
      }
    }
  }

  cancel() {
    this.router.navigate(['/heroes']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
