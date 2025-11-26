import { ItoMode } from '@/app/generated/ito_pb'
import { usePlatform } from '@/app/hooks/usePlatform'
import { useOnboardingStore } from '@/app/store/useOnboardingStore'
import { useSettingsStore } from '@/app/store/useSettingsStore'
import { getItoModeShortcutDefaults } from '@/lib/constants/keyboard-defaults'
import KeyboardShortcutEditor from './KeyboardShortcutEditor'
import { Fragment } from 'react'
import { getKeyDisplay } from '@/app/utils/keyboard'
import { KeyName } from '@/lib/types/keyboard'
import { BulbLightIcon } from '../../icons/BulbLightIcon'
import { MessageMicrophoneIcon } from '../../icons/MessageMicrophoneIcon'
import { MicRecIcon } from '../../icons/MicRecIcon'

const features = [
  {
    title: 'Speak to text instantly',
    icon: <MicRecIcon />,
  },
  {
    title: 'Quick notes on the fly',
    icon: <MessageMicrophoneIcon />,
  },
  {
    title: 'Capture raw ideas',
    icon: <BulbLightIcon />,
  },
]

interface DictateModeShortcutEditorProps {
  isEnabled?: boolean
}

export const DictateModeShortcutEditor = ({
  isEnabled,
}: DictateModeShortcutEditorProps) => {
  const { incrementOnboardingStep } = useOnboardingStore()
  const { getItoModeShortcuts, updateKeyboardShortcut } = useSettingsStore()
  const keyboardShortcut = getItoModeShortcuts(ItoMode.TRANSCRIBE)[0]
  const platform = usePlatform()
  const defaultKeys = getItoModeShortcutDefaults(platform)[ItoMode.TRANSCRIBE]

  return (
    <KeyboardShortcutEditor
      shortcut={keyboardShortcut}
      onShortcutChange={updateKeyboardShortcut}
      onConfirm={incrementOnboardingStep}
      title="Dictate Mode shortcut"
      isEnabled={isEnabled}
      footer={
        <div className="h-10 mt-auto pt-4 justify-center flex text-foreground font-medium border-t border-border leading-5">
          <span>Ito recommends</span>
          {defaultKeys.map((key, index) => (
            <Fragment key={index}>
              <span className="inline-flex items-center px-1 pt-0.5 bg-accent text-sm text-muted-foreground justify-center mx-1 rounded-lg pb-1">
                {getKeyDisplay(key as KeyName, platform, {
                  showDirectionalText: false,
                  format: 'label',
                })}
              </span>
              <span>{index < defaultKeys.length - 1 && ' + '}</span>
            </Fragment>
          ))}
          <span>for Dictate Mode.</span>
        </div>
      }
    >
      <div className="flex flex-col gap-1">
        {features.map(feature => (
          <div
            className="flex text-sm text-foreground items-center gap-2"
            key={feature.title}
          >
            {feature.icon}
            {feature.title}
          </div>
        ))}
      </div>
    </KeyboardShortcutEditor>
  )
}
