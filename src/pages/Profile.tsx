import { useParams } from 'react-router-dom';
import { Profile as ProfileComponent } from '../components/Profile';

export default function Profile() {
  const { userId } = useParams();
  
  // You can use userId to fetch and display specific user profile
  return <ProfileComponent userId={userId} />;
}
