
import React from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { FinancingSimulator } from '@/components/public/FinancingSimulator';
import { useIsMobile } from '@/hooks/use-mobile';

const Financiamento = () => {
  const isMobile = useIsMobile();
  
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'} font-bold text-white mb-6 md:mb-8 text-center`}>
          Simule o Financiamento
        </h1>
        <FinancingSimulator />
      </div>
    </PublicLayout>
  );
};

export default Financiamento;
