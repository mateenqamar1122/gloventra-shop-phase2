import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getStoredCurrency,
  storeCurrency,
  detectCurrencyFromIP,
  fetchExchangeRates,
  SUPPORTED_CURRENCIES,
  ExchangeRates,
} from './currencyService';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  exchangeRates: ExchangeRates | null;
  isLoading: boolean;
  refreshRates: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<string>('USD');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize currency on mount
  useEffect(() => {
    const initializeCurrency = async () => {
      setIsLoading(true);
      
      // Check stored preference first
      const stored = getStoredCurrency();
      if (stored) {
        setCurrencyState(stored);
      } else {
        // Auto-detect from IP, fallback to locale
        const detected = await detectCurrencyFromIP();
        setCurrencyState(detected);
        storeCurrency(detected);
      }
      
      setIsLoading(false);
    };

    initializeCurrency();
  }, []);

  // Fetch exchange rates when currency changes
  useEffect(() => {
    const loadRates = async () => {
      try {
        const rates = await fetchExchangeRates('USD');
        setExchangeRates(rates);
      } catch (error) {
        console.error('Failed to load exchange rates:', error);
      }
    };

    loadRates();
  }, [currency]);

  const setCurrency = (newCurrency: string) => {
    setCurrencyState(newCurrency);
    storeCurrency(newCurrency);
  };

  const refreshRates = async () => {
    try {
      const rates = await fetchExchangeRates('USD');
      setExchangeRates(rates);
    } catch (error) {
      console.error('Failed to refresh rates:', error);
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        exchangeRates,
        isLoading,
        refreshRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrencyContext = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrencyContext must be used within CurrencyProvider');
  }
  return context;
};
