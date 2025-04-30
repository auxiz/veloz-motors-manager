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

// Get dynamic interest rate based on entry percentage
export const getDynamicInterestRate = (vehiclePrice: number, entryValue: number): number => {
  const entryPercentage = (entryValue / vehiclePrice) * 100;
  
  if (entryPercentage >= 40) {
    return 0.0110; // 1.10% for entry ≥ 40%
  } else if (entryPercentage >= 20) {
    return 0.0130; // 1.30% for entry between 20% and 39.99%
  } else {
    return 0.0149; // 1.49% for entry < 20%
  }
};

// Financing calculation
export const calculateFinancing = (
  vehiclePrice: number, 
  entryValue: number, 
  installments: number
) => {
  if (vehiclePrice <= 0 || installments <= 0) {
    return { 
      monthlyPayment: null, 
      totalPayment: null,
      financingAmount: null,
      interestRate: null 
    };
  }

  // Financing amount is vehicle price minus entry value
  const financingAmount = vehiclePrice - entryValue;
  
  // Get dynamic interest rate based on entry percentage
  const interestRate = getDynamicInterestRate(vehiclePrice, entryValue);
  
  // Calculate monthly payment using compound interest formula
  // PMT = P * r * (1 + r)^n / ((1 + r)^n - 1)
  // where P is principal (financing amount), r is interest rate, n is number of periods
  const monthlyPayment = financingAmount * interestRate * Math.pow(1 + interestRate, installments) / 
                      (Math.pow(1 + interestRate, installments) - 1);
  
  // Total payment is monthly payment times number of installments
  const totalPayment = monthlyPayment * installments;
  
  return { 
    monthlyPayment, 
    totalPayment, 
    financingAmount,
    interestRate 
  };
};
