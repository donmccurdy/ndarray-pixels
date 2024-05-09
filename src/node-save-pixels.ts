import { NdArray } from 'ndarray';
import sharp, { FormatEnum } from 'sharp';
import { putPixelData } from './common';
import type { ImageEncodeOptions } from './common';

export async function savePixelsInternal(
	pixels: NdArray<Uint8Array | Uint8ClampedArray>,
	options: ImageEncodeOptions
): Promise<Uint8Array> {
	const [width, height, channels] = pixels.shape as [number, number, 4];
	const data = putPixelData(pixels, new Uint8Array(width * height * channels));

	const { type, quality } = options;
	const format = (type ?? 'image/png').replace('image/', '') as keyof FormatEnum;

	const sharpOptions = {
		// Applicable to most formats.
		// Where used, an integer between 1 and 100
		quality: typeof quality === 'number' ? Math.round(1 + quality * 99) : undefined,
		// applicable to some formats, notably webp, avif
		lossless: quality === 1,
		// if this flag is true or unset, sharp interprets the `quality` flag to mean
		// that we want lossy color quantization.
		palette: false,
	};

	return sharp(data, { raw: { width, height, channels } })
		.toFormat(format, sharpOptions)
		.toBuffer();
}
