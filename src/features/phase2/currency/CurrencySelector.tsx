import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCurrencyContext } from './CurrencyContext';
import { SUPPORTED_CURRENCIES } from './currencyService';
import { Button } from '@/components/ui/button';
import {useState, useEffect} from "react";
import { US, GB, CA, AU, JP, IN, CN, BR, MX, AE, SG } from '@/components/flags/FlagComponents';

// Custom scrollbar styles
const scrollbarStyles = `
  .minimal-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .minimal-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .minimal-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(156, 163, 175, 0.4);
    border-radius: 2px;
  }
  .minimal-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 0.6);
  }
`;

const CurrencySelector = () => {
  const { currency, setCurrency, updateExchangeRates, isLoading } = useCurrencyContext();

    const [selectedCountry, setSelectedCountry] = useState('US');
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);

    const [countryTimeout, setCountryTimeout] = useState<NodeJS.Timeout | null>(null);

    // Inject styles for minimal scrollbar
    if (typeof document !== 'undefined' && !document.getElementById('minimal-scrollbar-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'minimal-scrollbar-styles';
        styleElement.textContent = scrollbarStyles;
        document.head.appendChild(styleElement);
    }


    const handleCountryDropdownEnter = () => {
        if (countryTimeout) {
            clearTimeout(countryTimeout);
            setCountryTimeout(null);
        }
        setShowCountryDropdown(true);
    };

    const handleCountryDropdownLeave = () => {
        const timeout = setTimeout(() => {
            setShowCountryDropdown(false);
        }, 150); // 150ms delay before closing
        setCountryTimeout(timeout);
    };



    const countries = [
        { code: 'US', name: 'United States', flag: US, currency: 'USD' },
        { code: 'GB', name: 'United Kingdom', flag: GB, currency: 'GBP' },
        { code: 'CA', name: 'Canada', flag: CA, currency: 'CAD' },
        { code: 'AU', name: 'Australia', flag: AU, currency: 'AUD' },
        { code: 'JP', name: 'Japan', flag: JP, currency: 'JPY' },
        { code: 'IN', name: 'India', flag: IN, currency: 'INR' },
        { code: 'CN', name: 'China', flag: CN, currency: 'CNY' },
        { code: 'BR', name: 'Brazil', flag: BR, currency: 'BRL' },
        { code: 'MX', name: 'Mexico', flag: MX, currency: 'MXN' },
        { code: 'AE', name: 'UAE', flag: AE, currency: 'AED' },
        { code: 'SG', name: 'Singapore', flag: SG, currency: 'SGD' }
    ];

    const handleCurrencyChange = async (newCurrency: string) => {
        try {
            await updateExchangeRates();
            setCurrency(newCurrency);
        } catch (error) {
            console.error('Failed to update currency:', error);
        }
    };

    const handleCountrySelect = async (countryCode: string) => {
        const selectedCountryData = countries.find(country => country.code === countryCode);
        if (selectedCountryData) {
            setSelectedCountry(countryCode);
            await handleCurrencyChange(selectedCountryData.currency);
            setShowCountryDropdown(false);
        }
    };

    // Sync selected country with current currency
    useEffect(() => {
        const countryForCurrency = countries.find(country => country.currency === currency);
        if (countryForCurrency) {
            setSelectedCountry(countryForCurrency.code);
        }
    }, [currency]);

  return (
    <div className="flex items-center gap-2">
      {/*<Globe className="w-4 h-4 text-muted-foreground" />*/}
        {/* Country Selector */}
        <div
            className="relative group hidden md:block"
            onMouseEnter={handleCountryDropdownEnter}
            onMouseLeave={handleCountryDropdownLeave}
        >
            <Button variant="ghost" size="icon" className="relative" disabled={isLoading}>
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                ) : (
                    (() => {
                        const selectedCountryData = countries.find(country => country.code === selectedCountry);
                        if (selectedCountryData) {
                            const FlagComponent = selectedCountryData.flag;
                            return <FlagComponent />;
                        }
                        return <Globe className="w-5 h-5" />;
                    })()
                )}
            </Button>

            {/* Invisible bridge area to prevent dropdown from closing */}
            {showCountryDropdown && (
                <div className="absolute top-full right-0 w-64 h-2 bg-transparent z-40"></div>
            )}

            {/* Country Dropdown */}
            {showCountryDropdown && (
                <div
                    className="absolute top-full right-0 mt-2 w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-xl shadow-2xl z-50 overflow-hidden transform opacity-100 scale-100 transition-all duration-300 ease-out animate-in fade-in slide-in-from-top-2"
                    onMouseEnter={handleCountryDropdownEnter}
                    onMouseLeave={handleCountryDropdownLeave}
                >
                    <div className="p-3 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm">
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 px-3 py-2 border-b border-gray-200 dark:border-gray-600 mb-2">
                            🌍 Select Country
                        </div>
                        <div
                            className="max-h-48 overflow-y-auto pr-2 minimal-scrollbar"
                            style={{
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgba(156, 163, 175, 0.4) transparent'
                            }}
                        >
                            {countries.map((country, index) => {
                                const FlagComponent = country.flag;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleCountrySelect(country.code)}
                                        disabled={isLoading}
                                        className={`flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 rounded-lg transition-all duration-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                                            selectedCountry === country.code ? 'bg-blue-50/70 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' : 'border border-transparent'
                                        }`}
                                    >
                                        <FlagComponent />
                                        <div className="flex-1 text-left">
                                            <div className="font-medium text-xs">{country.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{country.currency}</div>
                                        </div>
                                        {selectedCountry === country.code && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
      <Select value={currency} onValueChange={handleCurrencyChange} disabled={isLoading}>
        <SelectTrigger className="w-[100px] h-9 rounded-full border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SUPPORTED_CURRENCIES.map((curr) => (
            <SelectItem key={curr.code} value={curr.code}>
              {curr.symbol} {curr.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;
