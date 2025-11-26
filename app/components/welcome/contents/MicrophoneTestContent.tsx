import { Button } from '@/app/components/ui/button'
import { useEffect, useMemo, useState } from 'react'
import { useOnboardingStore } from '@/app/store/useOnboardingStore'
import { useSettingsStore } from '@/app/store/useSettingsStore'
import { HelpCenterButton } from '../components/HelpCenterButton'
import { OnboardingStepHeader } from '../components/OnboardingStepHeader'
import { cn } from '@/lib/utils'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MicIcon,
} from 'lucide-react'
import {
  getAvailableMicrophones,
  microphoneToRender,
  Microphone,
} from '@/app/media/microphone'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'
import { OnboardingScreenContainer } from '../components/OnboardingScreenContainer'
import { OnboardingStepCard } from '../components/OnboardingStepCard'
import { MicrophoneTestIcon } from '../../icons/MicrophoneTestIcon'
import { BackButton } from '../components/BackButton'
import { OnboardingStepper } from '../components/OnboardingStepper'
import { mediaAnimations, opacityAnimations } from '../constants/animations'
import { motion } from 'framer-motion'

interface MicrophoneSelectorProps {
  selectedDeviceId?: string
  selectedMicrophoneName?: string
  onSelectionChange: (deviceId: string, name: string) => void
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
}

export function MicrophoneSelector({
  selectedDeviceId,
  selectedMicrophoneName,
  onSelectionChange,
  isOpen,
  setOpen,
}: MicrophoneSelectorProps) {
  const [availableMicrophones, setAvailableMicrophones] = useState<
    Microphone[]
  >([])

  useEffect(() => {
    const loadMicrophones = async () => {
      try {
        const mics = await getAvailableMicrophones()
        setAvailableMicrophones(mics)
      } catch (error) {
        console.error('Failed to load microphones:', error)
      }
    }
    // Only load microphones when the dialog is opened
    loadMicrophones()
  }, [])

  // Use saved microphone name if available, otherwise fallback to looking it up
  const selectedMicrophoneDisplay =
    selectedMicrophoneName ||
    (() => {
      const foundMicrophone = availableMicrophones.find(
        mic => mic.deviceId === selectedDeviceId,
      )
      return foundMicrophone
        ? microphoneToRender(foundMicrophone).title
        : 'Auto-detect'
    })()

  const RightIcon = isOpen ? ChevronUpIcon : ChevronDownIcon

  return (
    <DropdownMenu open={isOpen} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="outline-none">
        <Button
          variant="outline"
          className="!bg-background font-normal w-full justify-between"
          type="button"
          onClick={() => setOpen(true)}
        >
          <div className="flex items-center gap-2">
            <MicIcon className="text-muted-foreground" />
            {selectedMicrophoneDisplay || 'Select Microphone'}
          </div>
          <RightIcon className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-border w-[var(--radix-dropdown-menu-trigger-width)]">
        {availableMicrophones.map(mic => {
          const { title, description } = microphoneToRender(mic)
          const isSelected = selectedDeviceId === mic.deviceId

          return (
            <DropdownMenuItem
              key={mic.deviceId}
              onClick={() => onSelectionChange(mic.deviceId, mic.label)}
            >
              <div className="flex w-full justify-between items-center">
                <p className="truncate">{title}</p>
                {isSelected && <CheckIcon />}
              </div>
              {description && (
                <p className="text-muted-foreground text-wrap mt-2 max-w-full">
                  {description}
                </p>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MicrophoneBars({ volume }: { volume: number }) {
  const minHeight = 0.2
  const levels = useMemo(
    () =>
      Array.from({ length: 17 }).map((_, i) => {
        const threshold = (i / 17) * 0.5
        const normalizedVolume = Math.min(volume * 8, 1)
        return normalizedVolume > threshold ? 1 : minHeight
      }),
    [volume],
  )

  return (
    <div className="flex gap-2 items-center justify-center h-40.5">
      {levels.map((level, i) => {
        const isActive = level > minHeight
        return (
          <div
            key={i}
            className={cn(
              `w-3 min-h-3 rounded-full transition-all`,
              isActive ? 'bg-primary' : 'bg-muted',
            )}
            style={{
              height: isActive
                ? `${Math.floor(Math.random() * 100)}px`
                : undefined,
            }}
          />
        )
      })}
    </div>
  )
}

export default function MicrophoneTestContent() {
  const { incrementOnboardingStep, decrementOnboardingStep } =
    useOnboardingStore()
  const { microphoneDeviceId, microphoneName, setMicrophoneDeviceId } =
    useSettingsStore()
  const [isOpen, setOpen] = useState(false)
  const [volume, setVolume] = useState(0)
  const [smoothedVolume, setSmoothedVolume] = useState(0)

  // This effect listens for volume updates from the main process
  useEffect(() => {
    const unsubscribe = window.api.on('volume-update', (newVolume: number) => {
      setVolume(newVolume)
    })

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe()
    }
  }, []) // Runs only once on mount

  // This effect manages the "test" recording lifecycle.
  // It starts recording when a device is selected and stops when the component unmounts.
  useEffect(() => {
    if (microphoneDeviceId) {
      console.log(`Starting test recording on device: ${microphoneDeviceId}`)
      window.api.send('start-native-recording-test')
    }

    // Cleanup function: stop recording when the component unmounts or device changes
    return () => {
      console.log('Stopping test recording.')
      // Use the test-specific stop handler that only stops audio recording
      window.api.send('stop-native-recording-test')
    }
  }, [microphoneDeviceId]) // Re-runs whenever the selected microphone changes

  // Smooth the volume updates to reduce flicker
  useEffect(() => {
    const smoothing = 0.4 // Lower = smoother, higher = more responsive
    setSmoothedVolume(prev => prev * (1 - smoothing) + volume * smoothing)
  }, [volume])

  // Handles changing the microphone
  const handleMicrophoneChange = async (deviceId: string, name: string) => {
    // The useEffect hook above will automatically handle stopping the old
    // stream and starting the new one when the deviceId changes.
    setMicrophoneDeviceId(deviceId, name)
  }

  return (
    <OnboardingScreenContainer className="pt-12 px-4 pb-4">
      <OnboardingStepCard>
        <OnboardingStepHeader
          title="Microphone Test"
          subtitle="Speak — See Bars Move"
          leftSide={<BackButton onClick={decrementOnboardingStep} />}
          rightSide={<OnboardingStepper title="Permissions" index={1} />}
        />
        <motion.div
          {...opacityAnimations}
          className="flex mt-6 flex-col gap-4 border border-input p-6 w-140 rounded-2xl transition-colors"
        >
          <h3 className="text-lg font-medium">
            Do the bars move when you speak?
          </h3>
          <MicrophoneSelector
            isOpen={isOpen}
            setOpen={setOpen}
            selectedDeviceId={microphoneDeviceId}
            selectedMicrophoneName={microphoneName}
            onSelectionChange={handleMicrophoneChange}
          />
          <MicrophoneBars volume={smoothedVolume} />
          <div className="w-full h-px bg-border" />
          <div className="flex items-center justify-center gap-2">
            <div className="flex text-background items-center justify-center bg-primary rounded-full size-5">
              <CheckIcon className="size-3 stroke-3" />
            </div>
            Microphone detected
          </div>
        </motion.div>
        <div className="flex h-10 mt-auto justify-between items-start">
          <motion.div
            {...opacityAnimations}
            className="flex items-center gap-2"
          >
            <Button
              className="h-10 rounded-full w-38"
              onClick={incrementOnboardingStep}
            >
              Yes, continue
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(true)}
              className="h-10 rounded-full w-54 !bg-background"
            >
              No, change microphone
            </Button>
          </motion.div>
          <HelpCenterButton />
        </div>
      </OnboardingStepCard>
      <motion.div
        {...mediaAnimations}
        className="flex z-50 justify-center absolute items-center bottom-0 top-0 right-0"
      >
        <MicrophoneTestIcon />
      </motion.div>
    </OnboardingScreenContainer>
  )
}
