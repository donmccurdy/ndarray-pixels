import { NdArray } from 'ndarray';
import sharp, { AvailableFormatInfo } from 'sharp';

export async function savePixelsInternal(
	pixels: NdArray<Uint8Array>,
	mimeType: string
): Promise<Uint8Array> {
	const [width, height, channels] = pixels.shape as [number, number, 4];
	const format = mimeType.replace('image/', '') as unknown as AvailableFormatInfo;
	return sharp(pixels.data, { raw: { width, height, channels } }).toFormat(format).toBuffer();
}
