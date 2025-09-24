declare module 'i18n-auto-extractor/vue2' {
    export const i18nAtPlugin: {
        install(Vue: any, options?: { langSet?: { lang: string, langMap: Record<string, string> } }): void
    }
}

