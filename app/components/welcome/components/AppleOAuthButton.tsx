import { useAuth } from '../../auth/useAuth'
import AppleIcon from '../../icons/AppleIcon'
import { OAuthButton } from './OAuthButton'

export const AppleOAuthButton = () => {
  const { loginWithApple } = useAuth()
  return (
    <OAuthButton onClick={() => loginWithApple()}>
      <AppleIcon className="size-5" />
      Apple
    </OAuthButton>
  )
}
