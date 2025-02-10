// 2024-06-27T00:00:00.000Z -> yyyy-mm-dd
export function formatDate(date: string): string {
  return new Date(date).toISOString().split('T')[0];
}

export function formatDateToFrench(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR');
}