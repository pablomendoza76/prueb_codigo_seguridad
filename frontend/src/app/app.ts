import { Component } from '@angular/core';
import { BuscadorCursos } from './components/buscador-cursos/buscador-cursos';

@Component({
  selector: 'app-root',
  imports: [BuscadorCursos],
  template: `<app-buscador-cursos />`,
})
export class App {}
