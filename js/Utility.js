export const nigeriaBanks =  [
    "Access Bank",
    "Citibank Nigeria",
    "Ecobank Nigeria",
    "Eyowo",
    "FairMoney Microfinance Bank",
    "Fidelity Bank",
    "First Bank of Nigeria",
    "First City Monument Bank (FCMB)",
    "Globus Bank",
    "GoMoney",
    "Guaranty Trust Bank (GTBank)",
    "Heritage Bank",
    "Kuda Bank",
    "Keystone Bank",
    "Lotus Bank",
    "Moniepoint MFB",
    "Opay (Paycom Microfinance Bank)",
    "Optimus Bank",
    "PalmPay (PalmPay MFB)",
    "Parallex Bank",
    "Polaris Bank",
    "PremiumTrust Bank",
    "Providus Bank",
    "Rubies Bank",
    "Stanbic IBTC Bank",
    "Standard Chartered Bank Nigeria",
    "Sterling Bank",
    "SunTrust Bank",
    "Titan Trust Bank",
    "Union Bank of Nigeria",
    "United Bank for Africa (UBA)",
    "Unity Bank",
    "VFD Microfinance Bank",
    "Wema Bank",
    "Zenith Bank"
];

export function parseFullName(fullName) {
  let parts = fullName.trim().split(/\s+/);

  return {
    firstName: parts[0] || "",
    lastName: parts[1] || ""   // empty if not provided
  };
}

export function createWallets(accountNumber) {
  const currencies = ["NGN", "USD", "EUR", "GBP"];

  let wallets = {};

  currencies.forEach(currency => {
    wallets[currency] = {
      walletNumber: `${currency}-${accountNumber}`,
      currency,
      balance: 0.00,
      transactions: []
    };
  });

  return wallets;
}