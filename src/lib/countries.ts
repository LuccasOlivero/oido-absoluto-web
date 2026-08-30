import { Country } from '@/types';

export const COUNTRIES: Country[] = [
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'ES', name: 'España', flag: '🇪🇸' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'PA', name: 'Panamá', flag: '🇵🇦' },
  { code: 'DO', name: 'República Dominicana', flag: '🇩🇴' },
  { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺' },
  { code: 'GB', name: 'Reino Unido', flag: '🇬🇧' },
  { code: 'FR', name: 'Francia', flag: '🇫🇷' },
  { code: 'IT', name: 'Italia', flag: '🇮🇹' },
  { code: 'DE', name: 'Alemania', flag: '🇩🇪' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦' },
  { code: 'JP', name: 'Japón', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'KR', name: 'Corea del Sur', flag: '🇰🇷' },
  { code: 'NL', name: 'Países Bajos', flag: '🇳🇱' },
  { code: 'SE', name: 'Suecia', flag: '🇸🇪' },
  { code: 'CH', name: 'Suiza', flag: '🇨🇭' },
  { code: 'IE', name: 'Irlanda', flag: '🇮🇪' },
  { code: 'NO', name: 'Noruega', flag: '🇳🇴' },
  { code: 'NZ', name: 'Nueva Zelanda', flag: '🇳🇿' },
  { code: 'WW', name: 'Internacional / Otro', flag: '🌐' }
];

export function getCountryByCode(code: string): Country {
  const normalized = (code || '').toUpperCase().trim();
  const found = COUNTRIES.find((c) => c.code === normalized);
  return (
    found || {
      code: normalized || 'WW',
      name: normalized || 'Mundial',
      flag: '🌐'
    }
  );
}

export function getCountryFlag(code: string): string {
  return getCountryByCode(code).flag;
}
