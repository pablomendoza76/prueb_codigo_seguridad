import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CursosService } from '../../services/cursos.service';
import { Curso, ErrorBusqueda, ModoBusqueda } from '../../models/curso.model';

interface Mensaje {
  texto: string;
  tipo: 'normal' | 'malo' | 'bueno';
}

const PREFIJO_SQL = "SELECT id, nombre FROM cursos WHERE nombre = '";
const MEDIO_SQL = "' OR id = '";

@Component({
  selector: 'app-buscador-cursos',
  templateUrl: './buscador-cursos.html',
})
export class BuscadorCursos {
  private readonly cursosService = inject(CursosService);

  protected readonly ejemplos = ['Bases de Datos', "' OR '1'='1"];

  protected readonly modo = signal<ModoBusqueda>('vulnerable');
  protected readonly nombre = signal('');
  protected readonly cargando = signal(false);
  protected readonly cursos = signal<Curso[]>([]);
  protected readonly sqlEjecutado = signal('');
  protected readonly parametros = signal<string[]>([]);
  protected readonly mensaje = signal<Mensaje | null>(null);

  protected readonly urlNombre = computed(() => encodeURIComponent(this.nombre()));

  // Separa la consulta para resaltar la parte que escribió el usuario
  protected readonly partesSql = computed(() => {
    const sql = this.sqlEjecutado();
    if (this.modo() === 'vulnerable' && sql.startsWith(PREFIJO_SQL) && sql.endsWith("'")) {
      // Resto = texto + MEDIO_SQL + texto (el mismo texto del usuario aparece dos veces)
      const resto = sql.slice(PREFIJO_SQL.length, -1);
      const n = (resto.length - MEDIO_SQL.length) / 2;
      if (Number.isInteger(n) && n >= 0 && resto.slice(n, n + MEDIO_SQL.length) === MEDIO_SQL) {
        return {
          antes: PREFIJO_SQL,
          usuario: resto.slice(0, n),
          medio: MEDIO_SQL,
          usuario2: resto.slice(n + MEDIO_SQL.length),
          despues: "'",
        };
      }
    }
    return { antes: sql, usuario: '', medio: '', usuario2: '', despues: '' };
  });

  protected onInput(evento: Event): void {
    this.nombre.set((evento.target as HTMLInputElement).value);
  }

  protected cambiarModo(modo: ModoBusqueda): void {
    this.modo.set(modo);
    if (this.sqlEjecutado()) this.buscar();
  }

  protected usarEjemplo(texto: string): void {
    this.nombre.set(texto);
    this.buscar();
  }

  protected buscar(evento?: Event): void {
    evento?.preventDefault();
    const nombre = this.nombre();
    const modo = this.modo();
    this.cargando.set(true);

    this.cursosService.buscar(nombre, modo).subscribe({
      next: (r) => {
        this.cargando.set(false);
        this.cursos.set(r.cursos);
        this.sqlEjecutado.set(r.sql);
        this.parametros.set(r.parametros);
        this.mensaje.set(this.armarMensaje(nombre, modo, r.cursos.length, r.total));
      },
      error: (e: HttpErrorResponse) => {
        this.cargando.set(false);
        this.cursos.set([]);
        this.parametros.set([]);
        const cuerpo = e.error as ErrorBusqueda | null;
        if (e.status === 400 && cuerpo?.sql) {
          this.sqlEjecutado.set(cuerpo.sql);
          this.mensaje.set({
            texto: `La consulta falló: ${cuerpo.error}. La comilla del usuario rompió la sintaxis SQL.`,
            tipo: 'malo',
          });
        } else {
          this.sqlEjecutado.set('');
          this.mensaje.set({
            texto: 'No hay conexión con el backend. Revisa que esté corriendo en http://localhost:3000.',
            tipo: 'malo',
          });
        }
      },
    });
  }

  private armarMensaje(nombre: string, modo: ModoBusqueda, encontrados: number, total: number): Mensaje {
    if (modo === 'vulnerable' && nombre.includes("'") && encontrados === total) {
      return {
        texto: `Se devolvieron los ${total} cursos. La entrada cerró la comilla y agregó una condición siempre verdadera, así que el WHERE deja pasar todas las filas.`,
        tipo: 'malo',
      };
    }
    if (modo === 'seguro' && nombre.includes("'") && encontrados === 0) {
      return {
        texto: '0 cursos. El texto se buscó tal cual como nombre de curso; las comillas no cambiaron la consulta.',
        tipo: 'bueno',
      };
    }
    if (encontrados === 0) {
      return { texto: 'No hay cursos con ese nombre o id exacto. Prueba con uno de los ejemplos.', tipo: 'normal' };
    }
    return {
      texto: encontrados === 1 ? '1 curso encontrado.' : `${encontrados} cursos encontrados.`,
      tipo: 'normal',
    };
  }
}
