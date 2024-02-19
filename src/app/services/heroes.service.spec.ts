import { TestBed } from '@angular/core/testing';

import { HeroesService } from './heroes.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Hero } from '../models/hero.model';

describe('HeroesService', () => {
  let service: HeroesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HeroesService]
    });

    service = TestBed.inject(HeroesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('debe recuperar todos los héroes', () => {
    const dummyHeroes: Hero[] = [
      { id: 1, name: 'Hero 1', gender: 'Male' },
      { id: 2, name: 'Hero 2', gender: 'Female' }
    ];
  
    service.getAllHeroes().subscribe(heroes => {
      expect(heroes.length).toBe(2);
      expect(heroes).toEqual(dummyHeroes);
    });
  
    const request = httpMock.expectOne(`${service.apiUrl}/heroes`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyHeroes);
  });

  it('debe recuperar un héroe por ID', () => {
    const dummyHero: Hero = { id: 1, name: 'Hero 1', gender: 'Male' };
  
    service.getHeroById(1).subscribe(hero => {
      expect(hero).toEqual(dummyHero);
    });
  
    const request = httpMock.expectOne(`${service.apiUrl}/heroes/1`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyHero);
  });

  it('debe eliminar un héroe', () => {
    const heroId = 1;
  
    service.deleteHero(heroId).subscribe(response => {
      expect(response).toEqual(null);
    });
  
    const request = httpMock.expectOne(`${service.apiUrl}/heroes/${heroId}`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });

  it('debe añadir un nuevo héroe', () => {
    const newHero: Hero = { id: 0, name: 'New Hero', gender: 'Hombre' };
  
    service.addHero(newHero).subscribe(hero => {
      expect(hero).toBe(newHero, 'debe devolver el héroe recién añadido');
    });
  
    const req = httpMock.expectOne(service.apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newHero);
  
    req.flush(newHero);
  });

  it('debe actualizar un héroe', () => {
    const updatedHero: Hero = { id: 1, name: 'Updated Hero', gender: 'Female' };
  
    service.updateHero(updatedHero).subscribe(hero => {
      expect(hero).toEqual(updatedHero, 'debe devolver el héroe actualizado');
    });
  
    const req = httpMock.expectOne(`${service.apiUrl}/${updatedHero.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedHero);
  
    req.flush(updatedHero);
  });

  it('debe buscar héroes que coincidan con el término de búsqueda', () => {
    const searchResults: Hero[] = [
      { id: 1, name: 'Batman', gender: 'Male' },
      { id: 2, name: 'Batgirl', gender: 'Female' }
    ];
  
    service.searchHeroes('bat').subscribe(heroes => {
      expect(heroes.length).toBe(2, 'debe devolver dos héroes que coincidan con "bat"');
      expect(heroes).toEqual(searchResults, 'debe devolver héroes que coincidan con el término de búsqueda');
    });
  
    const req = httpMock.expectOne(req => req.url.includes('/heroes') && req.params.has('name'));
    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('name')).toEqual('bat');
    
    req.flush(searchResults);
  });
  
  
});
