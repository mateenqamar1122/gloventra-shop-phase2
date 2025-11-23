import { useCurrencyContext } from './CurrencyContext';
import { convertPrice, formatPrice } from './currencyService';

export const useCurrency = () => {
  const { currency, exchangeRates, isLoading } = useCurrencyContext();

  const convertAndFormat = (amount: number, fromCurrency: string = 'USD'): string => {
    if (!exchangeRates || isLoading) {
      return formatPrice(amount, fromCurrency);
    }

    const converted = convertPrice(amount, fromCurrency, currency, exchangeRates);
    return formatPrice(converted, currency);
  };

  return {
    currency,
    convertAndFormat,
    isLoading,
  };
};
