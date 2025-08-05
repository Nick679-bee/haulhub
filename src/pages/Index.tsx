import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to homepage
  return <Navigate to="/" replace />;
};

export default Index;
