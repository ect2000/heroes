// src/app/heroes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hero } from '../models/hero.model';


@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  private apiUrl = 'http://localhost:3000/heroes';

  public allHeroes: Hero[] = [];

  constructor(private http: HttpClient) { }

  setServiceHeroes(heroes: Hero[]) {
    this.allHeroes = heroes;
  }

  // Obtener todos los superhéroes
  getAllHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.apiUrl);
  }

  // Obtener un superhéroe por ID
  getHeroById(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.apiUrl}/${id}`);
  }

  // Buscar héroes por nombre
  searchHeroes(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.apiUrl}?name_like=${query}`);
  }

  // Añadir un nuevo superhéroe
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.apiUrl, hero);
  }

  // Actualizar un superhéroe
  updateHero(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(`${this.apiUrl}/${hero.id}`, hero);
  }

  // Eliminar un superhéroe
  deleteHero(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
