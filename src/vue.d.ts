declare module 'i18n-auto-extractor/vue' {
    function useVueAt(): {
        setCurrentLang: (lang: string, langMap: Record<string, string>) => void,
        langSet: {
            lang: string,
            langMap: Record<string, string>
        }
    }
}

