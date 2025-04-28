
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateSaleContract = (sale: any) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('CONTRATO DE COMPRA E VENDA DE VEÍCULO', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text('VELOZ MOTORS LTDA.', 105, 30, { align: 'center' });
  doc.text('CNPJ: 12.345.678/0001-90', 105, 36, { align: 'center' });

  // Add sale information
  doc.setFontSize(14);
  doc.text('INFORMAÇÕES DA VENDA', 20, 50);
  
  doc.setFontSize(12);
  doc.text(`Contrato Nº: ${sale.id.substring(0, 8)}`, 20, 60);
  doc.text(`Data da Venda: ${format(new Date(sale.sale_date || new Date()), 'dd/MM/yyyy', { locale: ptBR })}`, 20, 66);

  // Add vehicle information
  doc.setFontSize(14);
  doc.text('INFORMAÇÕES DO VEÍCULO', 20, 80);
  
  doc.setFontSize(12);
  doc.text(`Marca: ${sale.vehicle?.brand || 'N/A'}`, 20, 90);
  doc.text(`Modelo: ${sale.vehicle?.model || 'N/A'}`, 20, 96);
  doc.text(`Versão: ${sale.vehicle?.version || 'N/A'}`, 20, 102);
  doc.text(`Ano: ${sale.vehicle?.year || 'N/A'}`, 20, 108);
  doc.text(`Cor: ${sale.vehicle?.color || 'N/A'}`, 20, 114);
  doc.text(`Placa: ${sale.vehicle?.plate || 'N/A'}`, 20, 120);
  doc.text(`Chassi: ${sale.vehicle?.chassis || 'N/A'}`, 20, 126);

  // Add customer information
  doc.setFontSize(14);
  doc.text('INFORMAÇÕES DO COMPRADOR', 20, 140);
  
  doc.setFontSize(12);
  doc.text(`Nome: ${sale.customer?.name || 'N/A'}`, 20, 150);
  doc.text(`CPF/CNPJ: ${sale.customer?.document || 'N/A'}`, 20, 156);
  doc.text(`Endereço: ${sale.customer?.address || 'N/A'}`, 20, 162);
  doc.text(`Telefone: ${sale.customer?.phone || 'N/A'}`, 20, 168);
  doc.text(`Email: ${sale.customer?.email || 'N/A'}`, 20, 174);

  // Add payment information
  doc.setFontSize(14);
  doc.text('INFORMAÇÕES DE PAGAMENTO', 20, 188);
  
  doc.setFontSize(12);
  doc.text(`Valor Total: R$ ${sale.final_price?.toFixed(2).replace('.', ',') || '0,00'}`, 20, 198);
  
  const paymentMethodMap: Record<string, string> = {
    'cash': 'À Vista',
    'financing': 'Financiamento',
    'consignment': 'Consignação',
    'exchange': 'Troca'
  };
  doc.text(`Forma de Pagamento: ${paymentMethodMap[sale.payment_method] || sale.payment_method}`, 20, 204);

  // Add terms and conditions
  doc.setFontSize(14);
  doc.text('TERMOS E CONDIÇÕES', 20, 220);
  
  doc.setFontSize(10);
  const terms = `
1. O vendedor declara que o veículo objeto deste contrato está livre de quaisquer ônus e encargos;
2. O comprador declara ter examinado o veículo e estar satisfeito com suas condições;
3. Após a assinatura deste contrato e pagamento integral, a posse do veículo será transferida ao comprador;
4. O comprador compromete-se a providenciar a transferência de propriedade junto ao DETRAN no prazo legal;
5. Este contrato é firmado em caráter irrevogável e irretratável.
  `.trim();
  
  const termLines = doc.splitTextToSize(terms, 170);
  doc.text(termLines, 20, 230);

  // Add signatures
  doc.setFontSize(12);
  doc.text('Local e Data: ______________________________', 20, 270);
  doc.text('Assinatura do Vendedor: ______________________________', 20, 280);
  doc.text('Assinatura do Comprador: ______________________________', 120, 280);

  // Save the PDF
  doc.save(`contrato-venda-${sale.id.substring(0, 8)}.pdf`);
};
