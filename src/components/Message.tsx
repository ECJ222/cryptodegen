import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import moment from 'moment'
import mime from 'mime'
import Loader from './Loader'
import ListenForOutsideClick from './ListenForOutsideClick'
import Logo from '../../public/logo.svg'
import ChevronLeft from '../../public/ChevronLeft.svg'
import Send from '../../public/send.svg'
import Clock from '../../public/clock.svg'
import Emoji from '../../public/emoji.svg'
import Airplane from '../../public/airplane.svg'
import Paperclip from '../../public/paperclip.svg'
import { Robin } from 'robin.io-js'

type ObjectType = Record<string, any>

interface PropTypes { isLoggedIn: boolean, robin: Robin | null, channel: string, userData: ObjectType }

const Message: React.FC<PropTypes> = ({ isLoggedIn, robin, channel, userData }) => {
  const elementToListenRef: any = useRef(null);
  const conversationBody: any = useRef(null);
  const [isMessagerOpen, setIsMessagerOpen] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(true)
  const message: any = useRef(null)
  const [listening, setListening] = useState(false)
  const [isMessagesLoading, setIsMessagesLoading] = useState(false)
  const acceptedFiles: string = 'application/*, text/*, image/*, video/*'
  const imageRegex:any = /^image/ 
  const videoRegex: any = /^video/
  const documentRegex: any = /^application\/(csv|pdf|msword|(vnd\.(ms-|openxmlformats-).*))$|^text\/plain$/i

  /* Robin */
  const [connection, setConnection] = useState(null as any)
  const [conversation, setConversation] = useState({} as ObjectType)
  const [conversationMessages, setConversationMessages] = useState([] as Array<ObjectType>)
  const receiverToken = 'SxPzdCcGZeyNUGPUZRNIiFXH'
  const receiverName = 'CryptoDegen Support'

  const EmojiPicker = dynamic(
    () => import('./EmojiPicker'),
    { ssr: false }
  )

  useEffect(() => {
    if (isLoggedIn) {

      if (connection) {
        connection.onopen = () => {
          robin?.subscribe(channel, connection as WebSocket)
        }

        connection.onmessage = (event: any) => {
          const message = JSON.parse(event.data)

          if (!message.is_event) {
            if (message.conversation_id === conversation._id) {
              setConversationMessages((messages) => [...messages, message])
              scrollToBottom()
            }
          } else {
            handleRobinEvents(message)
          }
        }

        connection.onclosed = () => {
          connect()
        }
      } else {
        connect()
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, connection, conversation])

  useEffect(() => {
    if (isMessagerOpen) {
      createConversation()
    } else {
      setConversationMessages([])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMessagerOpen])

  useEffect(() => {
    if (Object.keys(conversation).length > 0) getMessages()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation])

  useEffect(() => {
    if (conversationMessages.length > 0) scrollToBottom()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationMessages])

  const handleRobinEvents: (message: ObjectType) => void = (message: ObjectType) => {
    switch (message.name) {
      case 'user.connect':
        // Event dispatched when WebSocket connection is established.
        break
      case 'user.disconnect':
        // Event dispatched when the WebSocket connection has been disconnected.
        break
      case 'new.conversation':
        // Event dispatched when a new conversation is created.
        break
      case 'message.forward':
        // Event dispatched when a message is forwarded.
        break
      case 'message.reaction':
        // Event dispatch when message reaction has been added.
        break
      case 'message.remove.reaction':
        // Event dispatched when a message reaction has been removed.
        break
      case 'remove.group.participant':
        // Event dispatched when a group participant has been removed.
        break
      case 'read.reciept':
        // Event dispatched when a message has been read.
        break
      case 'group.icon.update':
        // Event dispatched when a group icon has been updated.
        break
      default:
        break
    }
  }

  const connect: () => void = () => {
    const connectionInstance = robin?.connect(userData?.user_token)
    setConnection(connectionInstance)

    const WebSocket: WebSocket | undefined = connection

    window.onbeforeunload = function () {
      WebSocket?.close()
    }
  }

  const toggleSendMessage: () => void = () => {
    setIsMessagerOpen(!isMessagerOpen)
  }

  const selectEmoji: (data: any) => void = (data: any) => {
    message.current.value += `${data.native}`
  }

  const toggleEmojiPicker: () => void = () => setPickerOpen(!pickerOpen)

  const createConversation: () => Promise<void> = async () => {
    setIsMessagesLoading(true)

    const response = await robin?.createConversation({
      sender_name: userData.username,
      sender_token: userData.user_token,
      receiver_token: receiverToken,
      receiver_name: receiverName
    })

    if (response && !response.error) {
      setConversation({ ...conversation, ...response.data })
    }
  }

  const getMessages: () => Promise<void> = async () => {
    setIsMessagesLoading(true)

    const response = await robin?.getConversationMessages(conversation._id, userData.user_token)

    if (response && !response.error) {
      setIsMessagesLoading(false)
      if (response.data) setConversationMessages((messages) => [...messages, ...response.data])
    }
  }

  const sendMessage: () => Promise<void> = async () => {
    const messageObject: ObjectType = {
      msg: message.current.value,
      sender_token: userData.user_token,
      receiver_token: receiverToken,
      timestamp: new Date()
    }

    console.log(conversation)

    await robin?.sendMessageToConversation(
      {
        ...messageObject
      },
      connection,
      channel,
      conversation._id,
      userData.user_token,
      userData.username
    )

    message.current.value = ''
  }

  const sendMessageAttachment: (file: File) => void = async (file: File) => {
    await robin?.sendMessageAttachment(userData.user_token, conversation._id, file, userData.username, '')

    message.current.value = ''
  }

  const onKeyUp: (event: any) => void = (event: any) => {
    if (event.key === 'Enter') {
      sendMessage()
    }
  }

  const scrollToBottom: () => void = () => {
    window.setTimeout(() => {
      if (conversationBody.current) {
        conversationBody.current.scrollTop = conversationBody.current.scrollHeight
      }
    }, 100)
  }

  const resetFileTarget = (event: any) => {
    event.target.value = ''
  }

  const handleFileChange = async (event: any) => {
    const files = event.target.files

    for (const file of files) {
      await sendMessageAttachment(file)
    }
  }

  const formatTimeStamp = (value: string): string => {
    return moment(value).format('h:mma').toUpperCase()
  }

  const checkAttachmentType = (attachmentUrl: string): string  => {
    const strArr = attachmentUrl.split('.')

    return `${mime.getType(strArr[strArr.length - 1])}`
  }



  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(ListenForOutsideClick(
    listening,
    setListening,
    elementToListenRef,
    () => setPickerOpen(false)
  ))

  return (
    <>
      <div className="shadow-md absolute bottom-[5%] right-6 animate-pop-up rounded w-[350px] h-[450px] bg-white">
        <div className={`transition-all shadow-lg bg-primary w-full flex flex-col px-8 pt-4 ${!isMessagerOpen ? 'pb-20' : 'pb-4'}`}>
          {!isMessagerOpen ?
            <>
              <Logo className="w-[150px] h-[46px]" />
              <h3 className="text-2xl ml-2 mt-2 mb-1">Hi there 👋</h3>
              <span className="block text-left ml-2 text-sm font-light">You&apos;re here because you deserve a good life and you know it. Ask me anything, or share some feedback.</span>
            </>
            :
            <div className="select-none	relative flex items-center">
              <button className="absolute left-0 translate-y-[-49%] top-[49%] hover:bg-light-dark w-8 h-8 rounded" onClick={toggleSendMessage}>
                <ChevronLeft className="w-2	h-4 relative left-[30.5%] top-[4%]" />
              </button>
              <div className="ml-10 flex">
                <div className="flex items-center justify-center rounded-full w-10 h-10 bg-dark-primary">
                  CD
                </div>
                <div className="ml-2 flex justify-center flex-col">
                  <span className="mb-1 text-xs text-black">Our usual reply time</span>
                  <span className="text-black flex items-center text-xs font-semibold">
                    <Clock className="w-4 h-4 mr-1" />
                    A few minutes
                  </span>
                </div>
              </div>
            </div>
          }
        </div>

        {!isMessagerOpen ?
          <div className="select-none	 absolute bg-white top-[42%] left-[50%] translate-x-[-50%] w-9/12 rounded p-4 border">
            <h3 className="text-black font-medium text-sm">Start a conversation</h3>
            <div className="my-4 flex">
              <div className="flex items-center justify-center rounded-full w-14 h-14 bg-primary">
                CD
              </div>
              <div className="ml-2 flex justify-center flex-col">
                <span className="mb-1 text-xs text-gray-500">Our usual reply time</span>
                <span className="text-black flex items-center text-xs font-semibold">
                  <Clock className="w-4 h-4 mr-1" />
                  A few minutes</span>
              </div>
            </div>
            <button className="select-none flex items-center bg-tertiary px-4 py-2 rounded-full text-sm" onClick={toggleSendMessage}>
              <Send className="w-5 h-5 rotate-[90deg] mr-2" />
              Send us a message
            </button>
          </div>
          :
          <></>
        }

        {!isMessagerOpen ?
          <></>
          :
          <div className="absolute bottom-14 py-2 w-full h-80 max-h-80 flex flex-col text-white text-sm px-2  overflow-y-auto" ref={conversationBody}>
            {isMessagesLoading ?
              <Loader />
              :
              <>
                {
                  conversationMessages.map((message, index) => (
                    <div className={`max-w-[300px] max-h-[300px] ${message.sender_token !== userData.user_token ? 'mr-auto' : 'ml-auto'} justify-end mb-2 bg-primary break-words ${message.sender_token !== userData.user_token ? 'rounded-bubble-left' : 'rounded-bubble-right'} px-2 py-2`} key={index}>
                      {message.content.is_attachment && videoRegex.test(checkAttachmentType(message.content.attachment)) ?
                        <video controls className="w-full h-full">
                          <source src={message.content.attachment} />
                          Your browser does not support the video tag.
                        </video>
                        : <></>}
                      {message.content.is_attachment && imageRegex.test(checkAttachmentType(message.content.attachment)) ?
                        <img src={message.content.attachment} className="w-[150px] block max-h-[250px] rounded" alt="img-message" />
                        : <></>}
                      {message.content.is_attachment && documentRegex.test(checkAttachmentType(message.content.attachment)) ?
                        <span className={`text-sm ${message.sender_token !== userData.user_token ? 'text-right' : 'text-left'}`}>
                          <i>Document</i>
                        </span> :
                        <></>}
                      {!message.content.attachment ?
                        <span className={`text-sm ${message.sender_token !== userData.user_token ? 'text-right' : 'text-left'}`}>
                          {message.content.msg}
                        </span>
                        : <></>}
                      <span className={`text-[8px] block ml-2 float-right`}>
                        {formatTimeStamp(message.content.timestamp)}
                      </span>
                    </div>
                  ))
                }
              </>
            }
          </div>}

        {!isMessagerOpen ?
          <></>
          :
          <div ref={elementToListenRef} className="select-none	absolute bottom-0 shadow-sm bg-white border border-gray-100 w-full flex items-center py-4 pl-2 pr-4">
            <input className="outline-0 caret-black pl-2 text-black" type="text" placeholder="Send a message.." ref={message} onKeyUp={onKeyUp} />
            <button className="ml-auto" onClick={toggleEmojiPicker}>
              <Emoji className="w-4 h-4" />
            </button>
            <label htmlFor="file" className="ml-4 relative cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept={acceptedFiles}
                multiple
                onChange={handleFileChange}
                onClick={resetFileTarget}
                id="file"
              />
              <Paperclip className="w-4 h-4" />
            </label>
            <button className="ml-4" onClick={sendMessage}>
              <Airplane className="w-4 h-4" />
            </button>

            {pickerOpen ? <EmojiPicker onSkinChange={() => ''} onEmojiSelect={selectEmoji} theme="light" previewPosition="none" navPosition="none" skinTonePosition="none" perLine={7} /> : <></>}
          </div>}
      </div>
    </>
  )
}

export default Message