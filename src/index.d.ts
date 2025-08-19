declare module 'i18n-auto-extractor' {
    function setCurrentLang(lang: string, langMap: Record<string, any>): void
    function $at(zhText: string, options?: Record<string, string>): string
}