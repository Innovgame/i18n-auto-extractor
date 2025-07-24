// import {useReactAt} from 'i18n-auto-extractor/react'
import { useEffect } from 'react'
import {useReactAt} from '../../../src/react'
import enJSON from '../../locales/en.json'
import './App.css'
import HelloWorld from './HelloWorld'
function App() {

  const {setCurrentLang,$at,langSet}= useReactAt()

  useEffect(()=>{
    setTimeout(() => {
      setCurrentLang('en',enJSON)
    }, 3000);
  },[setCurrentLang])

  return (
    <>
      {langSet?.lang}
      {$at('你好')}
      <HelloWorld />
    </>
  )
}

export default App
