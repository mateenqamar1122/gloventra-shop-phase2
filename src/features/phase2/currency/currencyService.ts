import { api } from '@/lib/api';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2 },
  { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2 },
  { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 2 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimals: 0 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', decimals: 2 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimals: 2 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', decimals: 2 },
];

const STORAGE_KEY = 'gloventra_currency';
const RATES_STORAGE_KEY = 'gloventra_exchange_rates';
const RATES_TIMESTAMP_KEY = 'gloventra_rates_timestamp';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

export interface ExchangeRates {
  base: string;
  rates: { [key: string]: number };
}

// Get stored currency preference
export const getStoredCurrency = (): string | null => {
  return localStorage.getItem(STORAGE_KEY);
};

// Store currency preference
export const storeCurrency = (currencyCode: string): void => {
  localStorage.setItem(STORAGE_KEY, currencyCode);
};

// Detect currency from browser locale
export const detectCurrencyFromLocale = (): string => {
  const locale = navigator.language;
  
  const localeMap: { [key: string]: string } = {
    'en-US': 'USD',
    'en-GB': 'GBP',
    'en-AU': 'AUD',
    'en-CA': 'CAD',
    'ja': 'JPY',
    'ja-JP': 'JPY',
    'hi': 'INR',
    'hi-IN': 'INR',
  };

  // Check for exact match
  if (localeMap[locale]) {
    return localeMap[locale];
  }

  // Check for language prefix match
  const lang = locale.split('-')[0];
  const eurZone = ['de', 'fr', 'es', 'it', 'nl', 'pt', 'el', 'fi', 'at', 'be'];
  if (eurZone.includes(lang)) {
    return 'EUR';
  }

  return 'USD'; // Default fallback
};

// Detect currency from IP (using backend API)
export const detectCurrencyFromIP = async (): Promise<string> => {
  try {
    const response = await api.get('/currency/detect');
    return response.data.currency || detectCurrencyFromLocale();
  } catch (error) {
    console.error('Failed to detect currency from IP:', error);
    return detectCurrencyFromLocale();
  }
};

// Get cached exchange rates
const getCachedRates = (): ExchangeRates | null => {
  try {
    const rates = localStorage.getItem(RATES_STORAGE_KEY);
    const timestamp = localStorage.getItem(RATES_TIMESTAMP_KEY);
    
    if (!rates || !timestamp) return null;
    
    const age = Date.now() - parseInt(timestamp);
    if (age > CACHE_DURATION) return null;
    
    return JSON.parse(rates);
  } catch {
    return null;
  }
};

// Cache exchange rates
const cacheRates = (rates: ExchangeRates): void => {
  try {
    localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(rates));
    localStorage.setItem(RATES_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Failed to cache rates:', error);
  }
};

// Fetch exchange rates from backend
export const fetchExchangeRates = async (baseCurrency: string = 'USD'): Promise<ExchangeRates> => {
  // Check cache first
  const cached = getCachedRates();
  if (cached && cached.base === baseCurrency) {
    return cached;
  }

  try {
    const response = await api.get(`/currency/rates?base=${baseCurrency}`);
    const rates = response.data;
    cacheRates(rates);
    return rates;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    
    // Return cached data even if expired, or default rates
    if (cached) return cached;
    
    // Fallback to default rates (1:1 for all currencies)
    return {
      base: baseCurrency,
      rates: SUPPORTED_CURRENCIES.reduce((acc, curr) => {
        acc[curr.code] = 1;
        return acc;
      }, {} as { [key: string]: number }),
    };
  }
};

// Convert price from one currency to another
export const convertPrice = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to base currency first, then to target currency
  const baseAmount = fromCurrency === rates.base 
    ? amount 
    : amount / (rates.rates[fromCurrency] || 1);
    
  const convertedAmount = toCurrency === rates.base
    ? baseAmount
    : baseAmount * (rates.rates[toCurrency] || 1);
    
  return convertedAmount;
};

// Format price with currency symbol and proper rounding
export const formatPrice = (
  amount: number,
  currencyCode: string
): string => {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  if (!currency) return `$${amount.toFixed(2)}`;
  
  const rounded = currency.decimals === 0 
    ? Math.round(amount)
    : parseFloat(amount.toFixed(currency.decimals));
    
  const formatted = currency.decimals === 0
    ? rounded.toLocaleString()
    : rounded.toFixed(currency.decimals);
    
  return `${currency.symbol}${formatted}`;
};
