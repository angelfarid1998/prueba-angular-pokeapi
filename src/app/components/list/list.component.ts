import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  pokemons: any[] = [];

  constructor(private dataService: DataService) {}

  isLoading: boolean = false;
  hasError: boolean = false;
  hasBaseList: boolean = false;
  searchTerm: string = '';
  filteredPokemons: any[] = [];
  currentPage = 1;
  pageSize = 12;
  totalPokemons = 0;

  ngOnInit(): void {
    this.fetchPokemons();
  }

fetchPokemons(): void {
  this.isLoading = true;
  const offset = (this.currentPage - 1) * this.pageSize;

  this.dataService.getPokemonList(offset, this.pageSize).subscribe({
    next: (data) => {
      this.totalPokemons = data.count;
      this.pokemons = data.results.sort((a: any, b: any) => a.name.localeCompare(b.name));
      this.filteredPokemons = [...this.pokemons];
      this.hasBaseList = this.pokemons.length > 0;
      this.isLoading = false;
      this.hasError = false;
    },
    error: (error) => {
      this.hasError = true;
      console.error('Error al obtener los Pokémon', error);
      this.filteredPokemons = [];
      this.isLoading = false;
    }
  });
}

changePage(step: number): void {
  this.currentPage += step;
  this.searchTerm = '';
  this.fetchPokemons();
}

// Método para obtener el ID real del Pokémon desde su URL
  getPokemonId(url: string): number {
    const parts = url.split('/');
    return +parts[parts.length - 2];
  }

onSearch(): void {
  const term = this.searchTerm.toLowerCase();
  this.filteredPokemons = this.pokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(term)
  );
}
}