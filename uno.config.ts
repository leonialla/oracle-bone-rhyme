import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
} from 'unocss'

export default defineConfig({
  shortcuts: {
    'border-base': 'border-[#88888825]',
    'border-lighter': 'border-[#8884]',
    'bg-base': 'bg-gray/10',
    'bg-active': 'bg-gray/15',
  },
  presets: [
    presetUno(),
    presetIcons(),
    presetAttributify(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
})
