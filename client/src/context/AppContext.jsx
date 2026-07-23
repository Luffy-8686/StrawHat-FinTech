import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [creditData, setCreditData] = useState(null);   // { score, bucket, featureScores, improvements, ... }
  const [riskData, setRiskData] = useState(null);       // { riskBucket, percentage, profile }
  const [investmentData, setInvestmentData] = useState(null); // { allocation, growthData, summary }

  return (
    <AppContext.Provider value={{
      creditData, setCreditData,
      riskData, setRiskData,
      investmentData, setInvestmentData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
