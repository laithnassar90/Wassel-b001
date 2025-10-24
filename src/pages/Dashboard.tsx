import { useNavigate } from 'react-router-dom';
import { Dashboard as DashboardComponent } from '../components/Dashboard';
import { routes } from '../router/routes';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    const routeMap: Record<string, string> = {
      'find-ride': routes.app.findRide,
      'offer-ride': routes.app.offerRide,
      'my-trips': routes.app.trips,
      'messages': routes.app.messages,
      'payments': routes.app.payments,
      'settings': routes.app.settings,
      'profile': routes.app.profile(),
    };

    const route = routeMap[page];
    if (route) {
      navigate(route);
    }
  };

  return <DashboardComponent onNavigate={handleNavigate} />;
}