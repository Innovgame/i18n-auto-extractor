import {useReactAt} from 'i18n-auto-extractor/react'
import enJSON from '../../locales/en.json'
import './App.css'

function App() {

  const {setCurrentLang,$at}= useReactAt()

   setTimeout(() => {
      setCurrentLang('en',enJSON)
  }, 3000);

  return (
    <>
      {$at('你好')}
    </>
  )
}

export default App
