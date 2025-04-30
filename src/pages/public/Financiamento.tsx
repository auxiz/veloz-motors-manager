
import React, { useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { FinancingSimulator } from '@/components/public/FinancingSimulator';

const Financiamento = () => {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">Simule o Financiamento</h1>
        <FinancingSimulator />
      </div>
    </PublicLayout>
  );
};

export default Financiamento;
