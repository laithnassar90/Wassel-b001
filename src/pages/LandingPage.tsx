import { useNavigate } from 'react-router-dom';
import { LandingPage as LandingPageComponent } from '../components/LandingPage';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <LandingPageComponent
      onGetStarted={() => navigate('/auth/signup')}
      onLogin={() => navigate('/auth/login')}
    />
  );
}
