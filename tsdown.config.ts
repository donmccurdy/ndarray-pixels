import { type UserConfig, defineConfig } from 'tsdown';

const baseConfig: UserConfig = {
	format: ['esm', 'cjs'],
	treeshake: { moduleSideEffects: false },
};

export default defineConfig([
	{
		...baseConfig,
		entry: { 'ndarray-pixels-node': 'src/index.node.ts' },
		platform: 'node',
	},
	{
		...baseConfig,
		entry: { 'ndarray-pixels-browser': 'src/index.browser.ts' },
		platform: 'browser',
	},
]);
