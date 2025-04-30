
// Format CPF input
export const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 11) {
    let formatted = digits;
    if (digits.length > 3) {
      formatted = `${digits.substring(0, 3)}.${digits.substring(3)}`;
    }
    if (digits.length > 6) {
      formatted = `${formatted.substring(0, 7)}.${formatted.substring(7)}`;
    }
    if (digits.length > 9) {
      formatted = `${formatted.substring(0, 11)}-${formatted.substring(11)}`;
    }
    return formatted;
  }
  return value;
};

// Format WhatsApp input
export const formatWhatsApp = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 11) {
    let formatted = digits;
    if (digits.length > 0) {
      formatted = `(${digits.substring(0, 2)})${digits.substring(2)}`;
    }
    if (digits.length > 2) {
      formatted = `${formatted.substring(0, 4)} ${formatted.substring(4)}`;
    }
    if (digits.length > 7) {
      formatted = `${formatted.substring(0, 10)}-${formatted.substring(10)}`;
    }
    return formatted;
  }
  return value;
};

// Financing calculation
export const calculateFinancing = (
  vehiclePrice: number, 
  entryValue: number, 
  installments: number
) => {
  if (vehiclePrice <= 0 || installments <= 0) {
    return { monthlyPayment: null, totalPayment: null };
  }

  // Financing amount is vehicle price minus entry value
  const financingAmount = vehiclePrice - entryValue;
  
  // Monthly interest rate (1.49%)
  const monthlyInterest = 0.0149;
  
  // Calculate monthly payment using compound interest formula
  // PMT = P * r * (1 + r)^n / ((1 + r)^n - 1)
  // where P is principal (financing amount), r is interest rate, n is number of periods
  const monthlyPayment = financingAmount * monthlyInterest * Math.pow(1 + monthlyInterest, installments) / 
                      (Math.pow(1 + monthlyInterest, installments) - 1);
  
  // Total payment is monthly payment times number of installments
  const totalPayment = monthlyPayment * installments;
  
  return { monthlyPayment, totalPayment };
};
