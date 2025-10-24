import { useNavigate } from 'react-router-dom';
import { AuthPage as AuthPageComponent } from '../components/AuthPage';

export default function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const navigate = useNavigate();

  return (
    <AuthPageComponent
      initialTab={mode}
      onSuccess={() => navigate('/app/dashboard')}
      onBack={() => navigate('/')}
    />
  );
}
