import pad from 'pad-left';

export interface CommonColorInterface
{
    /**
     * @description Sets the maximum width for ratio-resize for performance gains.
     * @default 600
     */
    maxWidth: number,

    /**
     * @description Sets the maximum height for ratio-resize for performance gains.
     * @default 600
     */
    maxHeight: number,

    /**
     * @description Clamp colors to the nearest value to avoid too many similar colors 
     * @default 16
     */
    clamp: number

    /**
     * @description Limit how many common colors we want to return.
     * @default 10
     */
    colorChoices: number

    /**
     * @description If the RGB value is below this threshold.
     * @default 64
     */
    rgbFloor: number

    /**
     * @description If the RGB value is above this ceiling.
     * @default 232
     */
    rgbCeil: number
}

const defaultOptions : CommonColorInterface = {
    maxWidth: 600,
    maxHeight: 600,
    clamp: 16,
    colorChoices: 10,
    rgbFloor: 64,
    rgbCeil: 232
}

function ReadFileAsBuffer(file: File) : Promise<string>
{
    return new Promise(
        (resolve, reject) => {
            const reader = new FileReader();

            reader.onerror = reject;
            reader.onabort = reject;
            reader.onload = (ev: ProgressEvent<FileReader>) => {
                resolve(ev.target.result as string)
            };
        
            reader.readAsDataURL(
                file
            );    
                    
        }
    )
}


function componentToHex(c: number) {
    var hex = (c-0).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function CalculateImageDimensions(img: HTMLImageElement, maxWidth: number, maxHeight: number) : [number, number]
{
    let width = img.width;
    let height = img.height;

    if ((width < maxWidth) && (height < maxHeight))
    {
        maxWidth = width;
        maxHeight = height;
    }

    let ratioW = width / maxWidth;
    let ratioH = height / maxHeight;

    const ratio = Math.max(ratioW, ratioH);

    width = Math.round(width / ratio);
    height = Math.round(height / ratio);

    return [width, height];
}

export default function CommonColor(file: File, options = defaultOptions) : Promise<string[]> {
    return new Promise( async (resolve, reject) => {

        const img = document.createElement("img");

        img.onload = () => {
            const [width, height] = CalculateImageDimensions(img, options.maxWidth, options.maxHeight);

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext("2d");
            context.drawImage(img, 0,0,width, height);

            const imageData = context.getImageData(0, 0, width, height).data;

            let length = imageData.length;

            const CLAMP = options.clamp;
            let rgbComponent : { [key: number]: number } = {}

            for(let i = 0; i < length; i += 4)
            {
                let r = Math.ceil(imageData[i] / CLAMP) * CLAMP,
                    g = Math.ceil(imageData[i+1] / CLAMP) * CLAMP,
                    b = Math.ceil(imageData[i+2] / CLAMP) * CLAMP

                //we don't know what wild future we live in. 
                //There's always "The Colour out of space."
                if(r > 255) r = 255;
                if(g > 255) g = 255;
                if(b > 255) b = 255;

                if(r < options.rgbFloor && g < options.rgbFloor && b < options.rgbFloor) continue; //don't grab too dark.
                if(r > options.rgbCeil && g > options.rgbCeil && b > options.rgbCeil) continue; //don't grab too bright.

                let hexShift = (r << 16) | (g << 8) | (b);

                if(!rgbComponent[hexShift]) rgbComponent[hexShift] = 0;
                rgbComponent[hexShift]++
                
            }

            let commonList = new Array(options.colorChoices);
            commonList.fill(0, 0, options.colorChoices);
            let max = 0;
            //can definitely sort this better.
            //will re-write later.
            for(let x in rgbComponent)
            {
                for(let y in commonList)
                {
                    if(!rgbComponent[commonList[y]])
                    {
                        commonList[y] = x;
                        break;
                    }
                    
                    max = Math.max(rgbComponent[commonList[y]], rgbComponent[x]);
                    if(max == rgbComponent[x])
                    {
                        commonList[y] = x;
                        break;
                    }
                }
            }

            const list = commonList.map(
                (el) => {
                    return rgbToHex(
                        (el & 0xff0000) >> 16,
                        (el & 0x00ff00) >> 8,
                        (el & 0x0000ff)
                    );
                }
            ).filter(
                (el) => el != "#000000"
            );

            resolve(list);
        };

        try
        {
            img.src = await ReadFileAsBuffer(file)
        }
        catch(ex)
        {
            reject(ex);
        }

    });
}