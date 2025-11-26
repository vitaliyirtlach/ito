import {
  useEffect,
  useCallback,
  useRef,
  useState,
  useMemo,
  ReactNode,
} from 'react'
import { Button } from '@/app/components/ui/button'
import KeyboardKey from '@/app/components/ui/keyboard-key'
import { KeyState, isReservedCombination } from '@/app/utils/keyboard'
import { keyNameMap } from '@/lib/types/keyboard'
import { useAudioStore } from '@/app/store/useAudioStore'
import { KeyName } from '@/lib/types/keyboard'
import { usePlatform } from '@/app/hooks/usePlatform'
import { useShortcutEditingStore } from '@/app/store/useShortcutEditingStore'
import { KeyboardShortcutConfig } from '../../ui/multi-shortcut-editor'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface KeyboardShortcutEditorProps {
  shortcut: KeyboardShortcutConfig
  onShortcutChange: (shortcutId: string, keys: KeyName[]) => void
  onConfirm?: () => void
  footer?: ReactNode
  isEnabled?: boolean
  title: string
  children?: ReactNode
}

const MAX_KEYS_PER_SHORTCUT = 5

export default function KeyboardShortcutEditor({
  shortcut,
  onShortcutChange,
  onConfirm,
  footer,
  isEnabled = true,
  title,
  children,
}: KeyboardShortcutEditorProps) {
  const shortcutKeys = shortcut.keys
  const platform = usePlatform()
  const editorKey = useMemo(
    () => `keyboard-shortcut-editor:${shortcut.id}`,
    [shortcut.id],
  )
  const { start, stop, activeEditor } = useShortcutEditingStore()

  const cleanupRef = useRef<(() => void) | null>(null)
  const keyStateRef = useRef<KeyState>(new KeyState(shortcutKeys))
  const [pressedKeys, setPressedKeys] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [newShortcut, setNewShortcut] = useState<KeyName[]>([])
  const [validationError, setValidationError] = useState<string>('')
  const [temporaryError, setTemporaryError] = useState<string>('')
  const { setIsShortcutEnabled } = useAudioStore()
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleKeyEvent = useCallback(
    (event: any) => {
      // Update the key state
      keyStateRef.current.update(event)

      // Get the current pressed keys and update state
      const currentPressedKeys = keyStateRef.current.getPressedKeys()
      setPressedKeys(currentPressedKeys)

      if (isEditing) {
        // In edit mode, handle adding/removing keys
        if (event.type === 'keydown') {
          const normalizedKey = keyNameMap[event.key] || event.key.toLowerCase()
          if (normalizedKey === 'fn_fast') {
            return
          }

          let updatedShortcut: KeyName[]
          if (!newShortcut.includes(normalizedKey)) {
            // Check if we're at the limit before adding
            if (newShortcut.length >= MAX_KEYS_PER_SHORTCUT) {
              // Clear any existing timeout
              if (errorTimeoutRef.current) {
                clearTimeout(errorTimeoutRef.current)
              }

              // Show temporary error
              setTemporaryError(`Maximum ${MAX_KEYS_PER_SHORTCUT} keys allowed`)

              // Clear temporary error after 2 seconds
              errorTimeoutRef.current = setTimeout(() => {
                setTemporaryError('')
                errorTimeoutRef.current = null
              }, 2000)

              return
            }
            updatedShortcut = [...newShortcut, normalizedKey]
          } else {
            updatedShortcut = newShortcut.filter(key => key !== normalizedKey)
          }

          // Check for reserved combinations
          const reservedCheck = isReservedCombination(updatedShortcut, platform)
          if (reservedCheck.isReserved) {
            setValidationError(
              reservedCheck.reason || 'This key combination is reserved',
            )
          } else {
            setValidationError('')
          }

          setNewShortcut(updatedShortcut)
        }
      }
    },
    [isEditing, newShortcut, platform],
  )

  useEffect(() => {
    // Update key state when shortcut changes
    keyStateRef.current.updateShortcut(shortcutKeys)
  }, [shortcut, shortcutKeys])

  useEffect(() => {
    // Capture the current keyState ref value for cleanup
    const currentKeyState = keyStateRef.current

    // Listen for key events and store cleanup function
    try {
      const cleanup = window.api.onKeyEvent(handleKeyEvent)
      cleanupRef.current = cleanup
    } catch (error) {
      console.error('Failed to set up key event handler:', error)
    }

    // Clean up when component unmounts or editing changes
    return () => {
      if (cleanupRef.current) {
        try {
          cleanupRef.current()
        } catch (error) {
          console.error('Error during cleanup:', error)
        }
      }
      // Clear the key state when unmounting using captured ref value
      if (currentKeyState) {
        currentKeyState.clear()
      }
    }
  }, [handleKeyEvent, isEditing])

  useEffect(() => {
    return () => {
      if (isEditing) {
        window.api.send(
          'electron-store-set',
          'settings.isShortcutGloballyEnabled',
          true,
        )
        stop(editorKey)
      }
      // Clean up any pending error timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [isEditing, stop, editorKey])

  const handleStartEditing = () => {
    if (!start(editorKey)) {
      return
    }
    // Disable the shortcut in the main process via IPC
    window.api.send(
      'electron-store-set',
      'settings.isShortcutGloballyEnabled',
      false,
    )
    setIsShortcutEnabled(false)
    setIsEditing(true)
    setNewShortcut([])
    setValidationError('')
    setTemporaryError('')
  }

  const handleCancel = () => {
    window.api.send(
      'electron-store-set',
      'settings.isShortcutGloballyEnabled',
      true,
    )
    setIsShortcutEnabled(true)
    setIsEditing(false)
    setNewShortcut([])
    setTemporaryError('')
    stop(editorKey)
  }

  const handleSave = () => {
    if (newShortcut.length === 0) {
      // Don't save empty shortcuts
      return
    }
    keyStateRef.current.updateShortcut(newShortcut)
    onShortcutChange(shortcut.id, newShortcut)
    setIsEditing(false)
    setIsShortcutEnabled(true)
    window.api.send(
      'electron-store-set',
      'settings.isShortcutGloballyEnabled',
      true,
    )
    stop(editorKey)
  }

  const error = validationError || temporaryError

  function isDisplayKeyPressed(displayKey: string, pressed: string[]): boolean {
    return pressed.includes(displayKey.toLowerCase())
  }

  if (isEditing) {
    return (
      <div className="relative p-0.75 bg-[linear-gradient(102.08deg,_#00E5FF_-101.44%,_#9D00FF_3.79%,_#FF06B7_72.6%)] max-w-125 h-86 rounded-2xl gap-4">
        <div className="flex bg-card size-full gap-4 flex-col p-6 rounded-[13px]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <p className="text-lg text-foreground font-medium">
                Press keys to add them
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="h-8 px-3 py-2 text-xs !bg-background rounded-full"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                className="h-8 px-3 py-2 text-xs rounded-full"
                onClick={handleSave}
                disabled={newShortcut.length === 0 || !!validationError}
              >
                Save
              </Button>
            </div>
          </div>
          <div className="size-full flex flex-col gap-3 justify-center items-center">
            <div className="flex items-center gap-2">
              {newShortcut.map((keyboardKey, index) => (
                <KeyboardKey
                  key={index}
                  keyboardKey={keyboardKey}
                  className="border-2 size-16 rounded-lg shadow-none border-foreground"
                />
              ))}
              {newShortcut.length === 0 && (
                <div className="size-16 rounded-lg border-foreground border-2 border-dashed" />
              )}
            </div>
            {newShortcut.length !== 0 && (
              <div>
                <Button
                  onClick={() => setNewShortcut([])}
                  variant="ghost"
                  className="rounded-full px-3 h-8"
                >
                  Clear
                </Button>
              </div>
            )}
            {error && (
              <div className="text-red-500 text-sm text-center mb-2">
                {error}
              </div>
            )}
          </div>
          {footer}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex max-w-125 w-full gap-4 flex-col p-6 border-input border rounded-2xl',
        isEnabled ? 'h-86' : 'h-24 opacity-30',
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {shortcutKeys.map((keyboardKey, index) => (
              <KeyboardKey
                key={index}
                keyboardKey={keyboardKey}
                className={cn(
                  isDisplayKeyPressed(String(keyboardKey), pressedKeys) &&
                    'bg-secondary',
                  'flex size-12 border-foreground border-2 shadow-none text-foreground rounded-lg items-center justify-center',
                )}
              />
            ))}
          </div>
          <p className="text-lg text-foreground font-medium">{title}</p>
        </div>
        <Button
          className="rounded-full cursor-pointer px-3 !bg-background"
          variant="outline"
          onClick={handleStartEditing}
          disabled={
            !isEnabled || (activeEditor !== null && activeEditor !== editorKey)
          }
        >
          Change
        </Button>
      </div>
      {isEnabled && children}
      <div className={cn('mt-auto hidden', isEnabled && 'block')}>
        <Button
          className="px-8 rounded-full h-10"
          onClick={onConfirm}
          disabled={activeEditor !== null && activeEditor !== editorKey}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
