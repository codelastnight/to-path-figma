export const defaultOptions = {
  verticalAlign: 0.5,
  horizontalAlign: 0.5,
  spacing: 20,
  count: 5,
  autoWidth: true,
  totalLength: 0,
  isLoop: false,
  objWidth: 0,
  offset: 0,
  rotCheck: true,
  precision: 420,
  reverse: false,
};
export type optionsType = typeof defaultOptions;
export interface Point {
  x: number;
  y: number;
}
