/**
Número con ceros a la izquierda para códigos de plano (01, 02… / R-01).
*/
export function padNumber(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}
