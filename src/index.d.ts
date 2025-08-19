declare module 'i18n-auto-extractor' {
    declare function setCurrentLang(lang: string, langMap: Record<string, any>): void
    declare function $at(zhText: string, options?: Record<string, string>): string
}