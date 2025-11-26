import { Button } from '@/app/components/ui/button'
import { useOnboardingStore } from '@/app/store/useOnboardingStore'
import { useSettingsStore } from '@/app/store/useSettingsStore'
import SlackIcon from '../../icons/SlackIcon'
import GmailIcon from '../../icons/GmailIcon'
import ChatGPTIcon from '../../icons/ChatGPTIcon'
import NotionIcon from '../../icons/NotionIcon'
import CursorIcon from '../../icons/CursorIcon'
import { useMemo, useState } from 'react'
import React from 'react'
import { ItoMode } from '@/app/generated/ito_pb'
import { getKeyDisplay } from '@/app/utils/keyboard'
import { usePlatform } from '@/app/hooks/usePlatform'
import { TryAppsIcon } from '../../icons/TryAppsIcon'
import { OnboardingStepCard } from '../components/OnboardingStepCard'
import { OnboardingScreenContainer } from '../components/OnboardingScreenContainer'
import { OnboardingStepper } from '../components/OnboardingStepper'
import { BackButton } from '../components/BackButton'
import { OnboardingStepHeader } from '../components/OnboardingStepHeader'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip'
import { ArrowUpIcon, ChevronDownIcon } from 'lucide-react'
import { TooltipArrow } from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { mediaAnimations, opacityAnimations } from '../constants/animations'

const SlackPreview = () => {
  return (
    <div className="h-full flex flex-col justify-end p-4">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-md bg-yellow-200 flex items-center justify-center text-lg font-bold">
          B
        </div>
        <div>
          <div className="font-medium">Jordan</div>
          <div className="text-sm">Hey Taylor, is Ito working for you?</div>
        </div>
      </div>
      <div className="flex mt-4 items-center gap-2 rounded-b-2xl">
        <input
          type="text"
          placeholder={`Hold down on the hotkey(s) and start speaking...`}
          className="w-full h-12 border border-neutral-500 rounded-md px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0"
        />
      </div>
    </div>
  )
}

const GmailPreview = () => {
  return (
    <div className="p-4 h-full">
      <div className="flex flex-col gap-2">
        <div className="text-sm text-muted-foreground">
          Subject: <span className="font-medium text-black">Quick update</span>
        </div>
        <div className="border-t border-neutral-200 my-2" />
        <textarea
          placeholder={`Try saying:\n\n"Hi Jordan, wonderful meeting with you today. Do you have any time Monday to follow up on the project? Thanks, Taylor"`}
          className="w-full resize-none bg-transparent border-none focus:outline-none focus:ring-0 text-sm placeholder:text-muted-foreground"
          rows={9}
        />
      </div>
    </div>
  )
}

const NotionPreview = () => {
  return (
    <div className="h-full p-4">
      <span className="text-2xl font-bold">New Note</span>
      <textarea
        placeholder={`Try saying: "Project tasks: Jordan will draft the proposal, Taylor will review and finalize by Friday."`}
        className="w-full mt-4 resize-none bg-transparent border-none focus:outline-none focus:ring-0 text-sm placeholder:text-muted-foreground"
        rows={9}
      />
    </div>
  )
}

const ChatGPTPreview = () => {
  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex mt-auto items-center bg-neutral-100 rounded-2xl">
        <input
          type="text"
          placeholder="Ask AI to generate a React component"
          className="w-full px-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-sm placeholder:text-muted-foreground"
        />
      </div>
    </div>
  )
}

const CursorPreview = () => {
  return (
    <div className="flex flex-col gap-7 p-4 h-full justify-between">
      <div>
        <textarea
          placeholder="Plan, search, build anything"
          className="w-full h-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-sm text-muted-foreground placeholder:text-muted-foreground"
          rows={6}
        />
      </div>
      <div className="flex items-end shrink-0 justify-between gap-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="bg-secondary px-2 py-0.5 rounded-md flex items-center gap-1">
            <span>∞</span> Agent{' '}
          </span>
          <span className="px-2 py-0.5 flex items-center gap-1 rounded-md">
            Auto <ChevronDownIcon className="size-3.5" />
          </span>
        </div>
        <div className="size-8 flex items-center cursor-pointer justify-center rounded-full bg-secondary text-muted-foreground">
          <ArrowUpIcon className="size-5" />
        </div>
      </div>
    </div>
  )
}

const apps = {
  slack: {
    title: 'Slack',
    icon: <SlackIcon />,
    preview: <SlackPreview />,
  },
  gmail: {
    title: 'Gmail',
    icon: <GmailIcon />,
    preview: <GmailPreview />,
  },
  cursor: {
    title: 'Cursor',
    icon: <CursorIcon />,
    preview: <CursorPreview />,
  },
  chatgpt: {
    title: 'ChatGPT',
    icon: <ChatGPTIcon />,
    preview: <ChatGPTPreview />,
  },
  notion: {
    title: 'Notion',
    icon: <NotionIcon />,
    preview: <NotionPreview />,
  },
}

type App = keyof typeof apps

export default function TryItOut() {
  const { decrementOnboardingStep, setOnboardingCompleted } =
    useOnboardingStore()
  const { getItoModeShortcuts } = useSettingsStore()
  const keyboardShortcut = getItoModeShortcuts(ItoMode.TRANSCRIBE)[0].keys
  const platform = usePlatform()
  const appKeys = useMemo(() => Object.keys(apps) as App[], [apps])
  const [selectedApp, setSelectedApp] = useState(appKeys[0])
  const [canContinue, setCanContinue] = useState(false)

  return (
    <OnboardingScreenContainer className="pt-12 px-4 pb-4">
      <OnboardingStepCard>
        <OnboardingStepHeader
          title="Try Ito"
          subtitle="Use Ito anywhere. In any app or text box."
          leftSide={<BackButton onClick={decrementOnboardingStep} />}
          rightSide={<OnboardingStepper title="Test" index={3} />}
        />

        <motion.div
          {...opacityAnimations}
          className="flex flex-col items-center h-full justify-between mt-6"
        >
          <div
            onClick={() => setCanContinue(true)}
            className="w-125 h-73 flex flex-col bg-card border border-border rounded-2xl"
          >
            <div className="capitalize shrink-0 bg-muted flex items-center justify-center text-center text-sm font-medium h-9 w-full rounded-t-2xl relative">
              <div className="gap-1.5 absolute top-0 bottom-0 left-3 flex items-center">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="size-3 bg-background rounded-full"
                  />
                ))}
              </div>
              {apps[selectedApp].title}
            </div>
            {apps[selectedApp].preview}
          </div>
        </motion.div>
        <div className="w-full flex items-end justify-between mt-auto">
          <div className="w-full">
            <Button
              className={cn(
                'h-10 rounded-full px-8 opacity-0 transition-all',
                canContinue && 'opacity-100',
              )}
              onClick={setOnboardingCompleted}
            >
              Continue
            </Button>
          </div>
          <motion.div
            {...opacityAnimations}
            className="flex gap-2 flex-col items-center"
          >
            <div className="flex flex-row h-22 relative items-center gap-2 p-6 rounded-4xl bg-muted">
              <div className="absolute -top-5.5 flex items-center justify-center left-0 right-0">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="w-14 h-2.5 rounded-full bg-black/60" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-50 rounded-xl text-base text-center font-semibold text-background">
                    <div>
                      Hold{' '}
                      {keyboardShortcut.map((key, idx) => (
                        <React.Fragment key={`keyboard-shortcut-${idx}`}>
                          <span className="inline-flex items-center px-2 py-0.5 bg-white/10 rounded text-xs font-mono mx-1 first:ml-0 last:mr-0 font-bold">
                            {getKeyDisplay(key, platform, {
                              showDirectionalText: false,
                              format: 'label',
                            })}
                          </span>
                          {idx < keyboardShortcut.length - 1 && (
                            <span className="text-muted-foreground"> + </span>
                          )}
                        </React.Fragment>
                      ))}{' '}
                    </div>
                    <p>and start speaking</p>
                    <TooltipArrow className="bg-foreground fill-foreground z-50 size-3 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
                  </TooltipContent>
                </Tooltip>
              </div>
              {appKeys.map(key => (
                <div
                  key={key}
                  className="relative bg-white p-3 cursor-pointer flex items-center justify-center size-14 rounded-xl"
                  onClick={() => setSelectedApp(key)}
                >
                  {apps[key].icon}
                  {selectedApp === key && (
                    <span className="absolute left-1/2 -translate-x-1/2 size-1.5 -bottom-2.5 rounded-full bg-foreground shadow" />
                  )}
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Or select any of the apps above
            </div>
          </motion.div>
          <div className="w-full justify-end flex">
            <Button
              onClick={setOnboardingCompleted}
              className="h-10 rounded-full px-8"
              variant="ghost"
            >
              Skip
            </Button>
          </div>
        </div>
      </OnboardingStepCard>
      <motion.div
        initial={{ x: '20%', opacity: 0 }}
        animate={{ x: 0, opacity: 100, transitionDuration: 1 }}
        exit={{ x: '0%', opacity: 0, transitionDuration: 0.5 }}
        transition={{ duration: 0.5, damping: 20, stiffness: 80 }}
        className="flex z-50 justify-center absolute items-center bottom-0 top-0 right-0"
      >
        <TryAppsIcon />
      </motion.div>
    </OnboardingScreenContainer>
  )
}
