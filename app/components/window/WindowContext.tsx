import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Titlebar, TitlebarProps } from './Titlebar'
import { TitlebarContextProvider } from './TitlebarContext'

const WindowContext = createContext<WindowContextProps | undefined>(undefined)

const defaultTitlebar: TitlebarProps = {
  title: 'Ito',
  icon: 'appIcon.png',
  titleCentered: false,
  showTitlebar: true,
}

export const WindowContextProvider = ({
  children,
  titlebar: propTitlebar,
}: WindowContextProviderProps) => {
  const [initProps, setInitProps] = useState<WindowInitProps | undefined>()
  const [titlebar, setTitlebar] = useState<TitlebarProps>({
    ...defaultTitlebar,
    ...propTitlebar,
  })
  // Merge default titlebar props with user defined props

  useEffect(() => {
    // Load window init props
    window.api
      .invoke('init-window')
      .then((value: WindowInitProps) => setInitProps(value))

    // Add class to parent element
    const parent = document.querySelector('.window-content')?.parentElement
    if (parent) {
      parent.classList.add('window-frame')
    }
  }, [])

  return (
    <WindowContext.Provider
      value={{ titlebar, window: initProps!, setTitlebar }}
    >
      <TitlebarContextProvider>
        <Titlebar />
      </TitlebarContextProvider>
      <WindowContent>{children}</WindowContent>
    </WindowContext.Provider>
  )
}

const WindowContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="window-content">{children}</div>
}

export const useWindowContext = () => {
  const context = useContext(WindowContext)
  if (context === undefined) {
    throw new Error(
      'useWindowContext must be used within a WindowContextProvider',
    )
  }
  return context
}

interface WindowContextProps {
  titlebar: TitlebarProps
  setTitlebar: Dispatch<SetStateAction<TitlebarProps>>
  readonly window: WindowInitProps
}

interface WindowInitProps {
  width: number
  height: number
  maximizable: boolean
  minimizable: boolean
  platform: string
}

interface WindowContextProviderProps {
  children: React.ReactNode
  titlebar?: TitlebarProps
}
