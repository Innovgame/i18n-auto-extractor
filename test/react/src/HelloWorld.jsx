// import {useReactAt} from 'i18n-auto-extractor/react'
import {useReactAt} from '../../../src/react'

function HelloWorld() {
  const {$at,langSet}= useReactAt()
  return (
    <div>
        {langSet?.lang}
      {$at('今天天气怎么样')}
    </div>
  )
}

export default HelloWorld
