export function fuzzySearch() {
  // art_crop
}

export async function artImage() {
  const res = await fetch('https://api.scryfall.com/cards/art_crop')
  const jj = await res.json()
  return jj
}
