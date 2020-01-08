export interface PrimaryColorInterface {
    /**
     * @description Sets the maximum width for ratio-resize for performance gains.
     * @default 600
     */
    maxWidth: number;
    /**
     * @description Sets the maximum height for ratio-resize for performance gains.
     * @default 600
     */
    maxHeight: number;
    /**
     * @description Clamp colors to the nearest value to avoid too many similar colors
     * @default 16
     */
    clamp: number;
    /**
     * @description Limit how many popular colors we want to return.
     * @default 10
     */
    colorChoices: number;
    /**
     * @description If the RGB value is below this threshold.
     * @default 64
     */
    rgbFloor: number;
    /**
     * @description If the RGB value is above this ceiling.
     * @default 232
     */
    rgbCeil: number;
}
export default function PrimaryColor(file: File, options?: PrimaryColorInterface): Promise<string[]>;
