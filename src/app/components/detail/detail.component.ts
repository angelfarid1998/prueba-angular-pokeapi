import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data';
import { TitleCasePipe, NgIf, Location } from '@angular/common';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgIf, TitleCasePipe],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {
  pokemon: any;
  isLoading = true;

  constructor(private route: ActivatedRoute, private dataService: DataService, private location: Location) {}
  

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.dataService.getPokemonDetail(id).subscribe({
        next: (data) => {
          this.pokemon = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar detalle:', err);
          this.isLoading = false;
        }
      });
    }
  }

  get pokemonTypes(): string {
    return this.pokemon?.types?.map((t: { type: { name: string } }) => t.type.name).join(', ') || '';
  }

  get abilityNames(): string {
    return (this.pokemon?.abilities || [])
      .map((a: { ability: { name: string } }) => a.ability.name)
      .join(', ');
  }
}
