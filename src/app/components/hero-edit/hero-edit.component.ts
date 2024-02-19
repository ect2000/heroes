import { Component } from '@angular/core';
import { Hero } from '../../models/hero.model';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatOption } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { MatSelect } from '@angular/material/select';
import { AsyncPipe } from '@angular/common';
import { LoadingService } from '../../services/loading.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { UppercaseInputDirective } from '../../directives/uppercase-input.directive';

@Component({
  selector: 'app-hero-edit',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatFormField, MatInput, MatButton, MatOption, MatLabel, MatError, FormsModule, ReactiveFormsModule, MatSelect, AsyncPipe, MatProgressBar, UppercaseInputDirective],
  templateUrl: './hero-edit.component.html',
  styleUrl: './hero-edit.component.scss'
})
export class HeroEditComponent {
  editHeroForm: FormGroup;

  constructor(
    private heroesService: HeroesService,
    private route: ActivatedRoute,
    private router: Router,
    public loadingService: LoadingService
  ) {
    this.editHeroForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl('', Validators.required),
      gender: new FormControl('Hombre', Validators.required)
    });
  }

  ngOnInit() {
    const heroId = this.route.snapshot.params['id'];
    this.heroesService.getHeroById(heroId).subscribe((hero: Hero) => {
      this.editHeroForm.patchValue(hero);
    });
  }

  onSubmit() {
    if (this.editHeroForm.valid) {
      this.heroesService.updateHero(this.editHeroForm.value).subscribe(() => {
        this.router.navigate(['/heroes']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/heroes']);
  }
}
