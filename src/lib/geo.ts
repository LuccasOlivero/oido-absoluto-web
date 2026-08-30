export async function detectCountryCode(): Promise<string> {
  try {
    const res = await fetch('http://ip-api.com/json/?fields=countryCode', { cache: 'no-store' });
    const data = await res.json();
    return data.countryCode ?? 'AR';
  } catch {
    return 'AR'; // fallback
  }
}
