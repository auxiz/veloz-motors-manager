
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-veloz-black">
      <div className="text-center px-4">
        <div className="flex justify-center mb-6">
          <Car className="h-24 w-24 text-veloz-yellow" />
        </div>
        <h1 className="text-6xl font-bold text-veloz-yellow mb-4">404</h1>
        <p className="text-2xl text-veloz-white mb-8">Oops! Página não encontrada</p>
        <p className="text-lg text-veloz-white/70 mb-8">
          A página que você está procurando pode ter sido removida, renomeada ou está temporariamente indisponível.
        </p>
        <Button 
          className="bg-veloz-yellow text-veloz-black hover:bg-opacity-90"
          onClick={() => window.location.href = '/dashboard'}
        >
          Voltar ao Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
