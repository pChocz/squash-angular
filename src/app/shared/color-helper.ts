export abstract class ColorHelper {

    /**
     *   0 – red
     *  60 – yellow
     * 120 – green
     * 180 – turquoise
     * 240 – blue
     * 300 – pink
     * 360 – red
     *
     * http://www.ncl.ucar.edu/Applications/Images/colormap_6_3_lg.png
     */
    static hslColorPercent(fraction: number, start: number, end: number, saturationPercent: number): string {
        let b: number = (end - start) * fraction;
        let c: number = b + start;
        let alpha: number = 0.3;
        return 'hsla(' + c + ','+saturationPercent+'%, 50%,' + alpha + ')';
    }
}
