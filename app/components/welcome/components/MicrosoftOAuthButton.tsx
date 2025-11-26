import { useAuth } from '../../auth/useAuth'
import MicrosoftIcon from '../../icons/MicrosoftIcon'
import { OAuthButton } from './OAuthButton'

export const MicrosoftOAuthButton = () => {
  const { loginWithMicrosoft } = useAuth()
  return (
    <OAuthButton onClick={() => loginWithMicrosoft()}>
      <MicrosoftIcon className="size-5" />
      Microsoft
    </OAuthButton>
  )
}
