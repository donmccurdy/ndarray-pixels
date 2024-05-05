import { NdArray } from 'ndarray';
import sharp, { FormatEnum } from 'sharp';
import { putPixelData } from './common';

export async function savePixelsInternal(
	pixels: NdArray<Uint8Array | Uint8ClampedArray>,
	mimeType: string,
	quality?: number
): Promise<Uint8Array> {
	const [width, height, channels] = pixels.shape as [number, number, 4];
	const data = putPixelData(pixels, new Uint8Array(width * height * channels));
	const format = mimeType.replace('image/', '') as keyof FormatEnum;

	const options = {
		// Applicable to most formats.
		// Where used, an integer between 1 and 100
		quality: quality == undefined ? undefined : Math.round(1 + quality * 99),
		// applicable to some formats, notably webp, avif
		lossless: quality === 1,
	};

	return sharp(data, { raw: { width, height, channels } }).toFormat(format, options).toBuffer();
}
