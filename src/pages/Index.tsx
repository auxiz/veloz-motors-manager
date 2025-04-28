
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  // Redirect to auth page
  useEffect(() => {
    navigate('/auth');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-veloz-black">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Car className="h-16 w-16 text-veloz-yellow animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold mb-4 text-veloz-white">Carregando Veloz Motors</h1>
        <p className="text-xl text-veloz-gray">Aguarde um momento...</p>
      </div>
    </div>
  );
};

export default Index;
