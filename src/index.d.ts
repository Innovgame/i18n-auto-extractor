declare module 'i18n-auto-extractor' {
    function setCurrentLang(lang: string, langMap: Record<string, any>): void
    function getCurrentLang(): { langMap: Record<string, any>, lang: string } | undefined
    function $at(zhText: string, options?: Record<string, string>): string
}