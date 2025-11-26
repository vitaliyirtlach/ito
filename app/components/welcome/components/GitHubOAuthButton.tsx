import { useAuth } from '../../auth/useAuth'
import GitHubIcon from '../../icons/GitHubIcon'
import { OAuthButton } from './OAuthButton'

export const GitHubOAuthButton = () => {
  const { loginWithGitHub } = useAuth()
  return (
    <OAuthButton onClick={() => loginWithGitHub()}>
      <GitHubIcon className="size-5" />
      GitHub
    </OAuthButton>
  )
}
