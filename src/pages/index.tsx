import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import Message from '../components/Message'
import { Robin } from 'robin.io-js'
import Logo from '../../public/logo.svg'
import Chat from '../../public/chat.svg'
import Down from '../../public/down.svg'

type ObjectType = Record<string, any>

const Home: NextPage = () => {
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  /* Robin */
  const apiKey = 'NT-XmIzEmWUlsrQYypZOFRlogDFvQUsaEuxMfZf'
  const channel = 'private_chat'
  const [userData, setUserData] = useState({} as ObjectType)
  const [robin, setRobin] = useState(null as Robin | null)

  const initiateRobin: () => void = () => {
    const robinInstance = new Robin(apiKey, true)
    setRobin(robinInstance)
  }

  const createUserToken: (data: ObjectType) => Promise<string> = async (data: ObjectType) => {
    const response: ObjectType = await robin?.createUserToken({
      meta_data: {
        ...data
      },
    });

    // return response.data.user_token
    return 'SHkPHNIYqwQIvyaYFaovLlHa'
  }

  useEffect(() => {
    initiateRobin()
  }, [])

  const mockUserLogin: () => Promise<void> = async () => {
    const userPromise: Promise<ObjectType> = new Promise((resolve, _reject): ObjectType => {
      return setTimeout(async () => {
        const data: ObjectType = {
          first_name: 'Enoch',
          last_name: 'Chejieh',
          username: 'Enoch Chejieh',
          email: 'enoch11@gmail.com'
        } as ObjectType

        data.user_token = await createUserToken(data)

        resolve({ data })
      }, 100)
    })

    const response: ObjectType = await userPromise

    setUserData({ ...userData, ...response.data })

    setIsLoggedIn(true)
  }

  const mockUserLogout = () => {
    setIsLoggedIn(false)
  }

  const mockUserSignup: () => Promise<void> = async () => {
    const userPromise: Promise<ObjectType> = new Promise((resolve, _reject): ObjectType => {
      return setTimeout(async () => {
        const data = {
          first_name: 'Enoch',
          last_name: 'Chejieh',
          username: 'Enoch Chejieh',
          email: 'enoch11@gmail.com'
        } as ObjectType

        data.user_token = await createUserToken(data)

        resolve({ data })
      }, 100)
    })

    const response : ObjectType = await userPromise

    setUserData({ ...userData, ...response.data })

    setIsLoggedIn(true)
  }

  const toggleOpen: () => void = () => setOpen(!open)

  return (
    <div>
      <Head>
        <title>Crypto Degenerates</title>
        <meta name="description" content="Crypto generated content" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <nav className="bg-primary border-gray-200 px-2 sm:px-4 py-2 shadow-xl">
          <div className="container flex flex-wrap justify-between items-center mx-auto">
            <Link href="/" className="flex items-center">
              <a>
                <Logo className="w-[200px] h-[56px]" />
              </a>
            </Link>
            <div className="w-full block w-auto">
              <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
                <li>
                  <Link
                    href="/href"
                    className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/href"
                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/href"
                    className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Services
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex">
              {!isLoggedIn ?
                <>
                  <button className="uppercase py-3 w-24	text-xs font-semibold m-1.5 border rounded border-2 border-tertiary" onClick={mockUserSignup}>Sign up</button>
                  <button className="uppercase bg-tertiary w-20 py-3 text-xs font-semibold m-1.5 rounded" onClick={mockUserLogin}>Login</button>
                </>
                :
                <div className="flex items-center">
                  <span className="text-sm mr-2">Hello {userData?.username}!</span>
                  <button className="uppercase bg-red-500 w-20 py-3 text-xs font-semibold m-1.5 rounded" onClick={mockUserLogout}>Logout</button>
                </div>
              }
            </div>
          </div>
        </nav>

        <div className="relative flex pt-8 px-2 sm:px-4">
          <div className="mt-14 ml-24 max-w-[550px]">
            <h1 className="text-5xl font-semibold leading-[72px] max-w-[340px]">Simple. Faster. Secure</h1>
            <p className="block mt-5 mb-4 text-[20.8px] font-light max-w-[475px] leading-9">
              Distributing finance for everyone
            </p>
            <p className="block text-base font-light max-w-[500px] leading-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <div className="flex pt-5">
              <button className="uppercase bg-tertiary m-[15px] ml-0 min-w-[190px] py-[15px] px-[35px] text-xs font-bold rounded">White paper</button>
              <button className="uppercase py-[15px] px-[35px] min-w-[190px] m-[15px]	text-xs font-bold border rounded border-2 border-white">One pager</button>
            </div>
          </div>
          <div className="relative mt-24 ml-24 max-w-[580px]">
            <img src="https://uploads-ssl.webflow.com/625969522775f5e27255dead/625abb2e2cbacbfb3270ffea_IMAE.png" alt="demo-placeholder" />
            <img className="absolute translate-x-[-49%] left-[49%] top-[3%] w-[390px] h-[260px] select-none" src="https://uploads-ssl.webflow.com/625969522775f5e27255dead/625b4cc50c63fa6bb6defc67_cry2.jpg" alt="demo" />
          </div>

          {open ?
            <Message isLoggedIn={isLoggedIn} robin={robin} channel={channel} userData={userData} />
            : <></>}

          {isLoggedIn ?
            <div className="absolute bottom-[-10%] right-6">
              <div className="shadow-md	w-16 h-16 bg-tertiary rounded-full flex items-center justify-center cursor-pointer" onClick={toggleOpen}>
                {!open ? <Chat className="w-8 h-8 animate-fade-in" /> : <Down className="w-8 h-8 rotate-[-90deg] animate-reverse-angle" />}
              </div>
            </div>
            : <></>}
        </div>
      </main>
    </div>
  )
}

export default Home
