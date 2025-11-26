import { OAuthButton } from './OAuthButton'
import GoogleIcon from '../../icons/GoogleIcon'
import { useAuth } from '../../auth/useAuth'

export const GoogleOAuthButton = () => {
  const { loginWithGoogle } = useAuth()

  return (
    <OAuthButton onClick={() => loginWithGoogle()}>
      <GoogleIcon className="size-5" />
      Google
    </OAuthButton>
  )
}
