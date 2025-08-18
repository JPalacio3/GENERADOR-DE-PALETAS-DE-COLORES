declare module 'colorthief' {
  class ColorThief {
    getColor(img: HTMLImageElement | null, quality?: number): [number, number, number];
    getPalette(img: HTMLImageElement | null, colorCount?: number, quality?: number): [number, number, number][];
  }
  export default ColorThief;
}