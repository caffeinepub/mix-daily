import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut } from 'lucide-react';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <button
      onClick={handleAuth}
      disabled={disabled}
      className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
    >
      {isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline">
            {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
          </span>
        </>
      )}
    </button>
  );
}
