import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';
  private cache: { [key: string]: any } = {};

  constructor(private http: HttpClient) {}

  //Obtener la lista
  getPokemonList(offset: number, limit: number): Observable<any> {
    const cacheKey = `${offset}-${limit}`;
    
    if (this.cache[cacheKey]) {
      return of(this.cache[cacheKey]);
    }

    return this.http.get<any>(`${this.baseUrl}?offset=${offset}&limit=${limit}`).pipe(
      tap(data => {
        this.cache[cacheKey] = data;
      }),
      catchError(this.handleError)
    );
  }

  // Obtener detalle de un Pokémon en especifico
  getPokemonDetail(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: any) {
    console.error('Ocurrió un error:', error);
    return throwError(() => new Error('Error al obtener los datos. Intenta más tarde.'));
  }
}