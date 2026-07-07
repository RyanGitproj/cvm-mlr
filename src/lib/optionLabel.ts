/**
 * Scinde un libellé d'option en titre + phrase d'appui pour le rendu en
 * carte du wizard (« un titre fort, une phrase » — gabarit maquette boss
 * 2026-07-07), sans réécrire les contenus sources.
 *
 * Les libellés portent déjà leur structure : « Nord : Diego, reliefs
 * puissants… » ou « Autre projet — je précise ». On coupe au premier
 * séparateur typographique (« — » ou « : » entourés d'espaces) ; sans
 * séparateur, le libellé reste un titre seul.
 */
export function splitOptionLabel(label: string): {
  title: string;
  description?: string;
} {
  const separators = [" — ", " : "];
  const positions = separators
    .map((sep) => ({ sep, index: label.indexOf(sep) }))
    .filter(({ index }) => index > 0)
    .sort((a, b) => a.index - b.index);

  const first = positions[0];
  if (first === undefined) return { title: label };

  const description = label.slice(first.index + first.sep.length).trim();
  if (description === "") return { title: label };

  return { title: label.slice(0, first.index).trim(), description };
}
