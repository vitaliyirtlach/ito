import { ItoMode } from '@/app/generated/ito_pb'
import { usePlatform } from '@/app/hooks/usePlatform'
import { useOnboardingStore } from '@/app/store/useOnboardingStore'
import { useSettingsStore } from '@/app/store/useSettingsStore'
import { getItoModeShortcutDefaults } from '@/lib/constants/keyboard-defaults'
import KeyboardShortcutEditor from './KeyboardShortcutEditor'
import { Fragment } from 'react'
import { getKeyDisplay } from '@/app/utils/keyboard'
import { KeyName } from '@/lib/types/keyboard'
import { RefineAndRewriteIcon } from '../../icons/RefineAndRewriteIcon'
import { SummarizeOrExplainIcon } from '../../icons/SummarizeOrExplainIcon'
import { GlobeIcon } from '../../icons/GlobeIcon'
import { LightbulbIcon } from 'lucide-react'

const features = [
  {
    title: 'Rewrite & refine text',
    icon: <RefineAndRewriteIcon />,
  },
  {
    title: 'Summarize or explain',
    icon: <SummarizeOrExplainIcon />,
  },
  {
    title: 'Translate & spark ideas',
    icon: <GlobeIcon />,
  },
]

interface IntelligentModeShortcutEditorProps {
  isEnabled?: boolean
}

export const IntelligentModeShortcutEditor = ({
  isEnabled,
}: IntelligentModeShortcutEditorProps) => {
  const { incrementOnboardingStep } = useOnboardingStore()
  const { getItoModeShortcuts, updateKeyboardShortcut } = useSettingsStore()
  const keyboardShortcut = getItoModeShortcuts(ItoMode.EDIT)[0]
  const platform = usePlatform()
  const defaultKeys = getItoModeShortcutDefaults(platform)[ItoMode.EDIT]

  return (
    <KeyboardShortcutEditor
      shortcut={keyboardShortcut}
      onShortcutChange={updateKeyboardShortcut}
      onConfirm={incrementOnboardingStep}
      title="Intelligent Mode shortcut"
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
          <span>for Intelligent Mode.</span>
        </div>
      }
    >
      <div className="h-full flex-col flex">
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
        <div className="mt-auto flex gap-3 h-14 border bg-card items-center border-border py-3 px-4 rounded-xl">
          <LightbulbIcon className="size-4" />
          <p className="text-xs text-muted-foreground">
            Say “Hey Ito” while using the dictation hotkey to switch to
            Intelligent Mode.
          </p>
        </div>
      </div>
    </KeyboardShortcutEditor>
  )
}
