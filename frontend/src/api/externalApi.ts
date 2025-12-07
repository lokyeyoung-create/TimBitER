// Simple external API service using OpenFDA Drug Label API
// Note: No API key required but there are rate limits.

export const searchDrugs = async (query: string, limit = 10) => {
  const q = encodeURIComponent(query);
  const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:%22${q}%22+OR+openfda.generic_name:%22${q}%22&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) {
    // OpenFDA returns 404 when no results
    return { results: [] };
  }
  const data = await res.json();
  return { results: data.results || [] };
};

export const getDrugDetails = async (id: string) => {
  const q = encodeURIComponent(id);
  const url = `https://api.fda.gov/drug/label.json?search=_id:%22${q}%22&limit=1`;
  const res = await fetch(url);
  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  const item = (data.results && data.results[0]) || null;
  return item;
};
