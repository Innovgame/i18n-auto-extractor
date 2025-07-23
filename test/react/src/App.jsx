import {useReactAt} from '../../../src/react'
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
