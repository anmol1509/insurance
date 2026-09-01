export function initialsFor(name: string): string {
  const first = name.split(' ')[0]
  if (first.length >= 2 && first === first.toUpperCase()) return first.slice(0, 2)
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2)
}
