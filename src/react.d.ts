declare module 'i18n-auto-extractor/react' {
  function useReactAt(): {
    setCurrentLang: (lang: string, langMap: Record<string, string>) => void,
    $at: (zhText: string, options?: Record<string, string>) => string,
    langSet: {
      lang: string,
      langMap: Record<string, string>
    }
  }
}
