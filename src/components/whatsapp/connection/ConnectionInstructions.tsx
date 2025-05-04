
import React from 'react';

export const ConnectionInstructions: React.FC = () => {
  return (
    <div className="text-white space-y-4">
      <h2 className="text-xl font-semibold">Como Conectar o WhatsApp</h2>
      
      <div className="space-y-2">
        <p>1. Clique no botão "Conectar WhatsApp" acima.</p>
        <p>2. Aguarde o QR code aparecer.</p>
        <p>3. Abra o WhatsApp no seu celular e escaneie o QR code:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Android: Configurações &gt; Aparelhos conectados &gt; Conectar um aparelho</li>
          <li>iPhone: Configurações &gt; Aparelhos conectados &gt; Conectar um aparelho</li>
        </ul>
        <p>4. Uma vez conectado, você começará a receber mensagens do WhatsApp no CRM.</p>
        <p>5. A conexão do WhatsApp permanecerá ativa enquanto o servidor estiver em execução.</p>
      </div>
      
      <div className="bg-amber-900 border border-amber-800 p-4 rounded-md">
        <h3 className="font-semibold text-amber-300">Notas Importantes:</h3>
        <ul className="list-disc pl-6 mt-2 space-y-1 text-white">
          <li>Esta é uma integração não oficial do WhatsApp usando automação de navegador.</li>
          <li>O WhatsApp não oferece suporte oficial a este tipo de integração.</li>
          <li>A conexão pode precisar ser atualizada ocasionalmente.</li>
          <li>Para uso em produção, considere a API oficial do WhatsApp Business.</li>
        </ul>
      </div>
    </div>
  );
};
