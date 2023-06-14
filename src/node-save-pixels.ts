import { NdArray } from 'ndarray';
import sharp, { AvailableFormatInfo } from 'sharp';
import { putPixelData } from './common';

export async function savePixelsInternal(
	pixels: NdArray<Uint8Array | Uint8ClampedArray>,
	mimeType: string
): Promise<Uint8Array> {
	const [width, height, channels] = pixels.shape as [number, number, 4];
	const data = putPixelData(pixels, new Uint8Array(width * height * channels));
	const format = mimeType.replace('image/', '') as unknown as AvailableFormatInfo;
	return sharp(data, { raw: { width, height, channels } }).toFormat(format).toBuffer();
}
