export interface Curso {
  id: number;
  nombre: string;
}

export type ModoBusqueda = 'vulnerable' | 'seguro';

export interface RespuestaBusqueda {
  modo: ModoBusqueda;
  sql: string;
  parametros: string[];
  cursos: Curso[];
  total: number;
}

export interface ErrorBusqueda {
  modo: ModoBusqueda;
  sql: string;
  error: string;
  total: number;
}
