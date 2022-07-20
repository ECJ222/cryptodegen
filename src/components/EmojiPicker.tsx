import { useEffect, useRef } from 'react'
import data from '@emoji-mart/data'
import { Picker, PickerProps } from 'emoji-mart'

const EmojiPicker = (props: any) => {
  const ref = useRef() as any
  let renders = useRef(0)

  useEffect(() => {
    renders.current += 1

    if (renders.current < 2) {
      let style = document.createElement('style')
      const customElement = async () => {
        const element = await ref.current.getElementsByTagName('em-emoji-picker')
        return element[0]
      }

      customElement().then((element) => {
        if (element.shadowRoot) {
          const section = element.shadowRoot.firstChild as any
          section.style.width = '100%'
          section.style.height = '100%'

          section.childNodes[1].firstChild.style.width = '100%'
        }
      })
      // ref.current.shadowRoot!.appendChild(style)
      new Picker({ ...props, data, ref })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Picker])

  console.log('render')

  return <div ref={ref} className="absolute top-[-380%] w-9/12 animate-slide-up" />
}

export default EmojiPicker
