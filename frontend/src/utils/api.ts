// frontend/frontend/src/utils/api.ts
const BASE_URL = 'http://localhost:8000/api';

export async function fetchCountryInsights(country: string) {
  const response = await fetch(`${BASE_URL}/analytics/country?country=${encodeURIComponent(country)}`);
  if (!response.ok) throw new Error('Failed to fetch salary metrics');
  return response.json();
}

export async function fetchPaginatedEmployees(page: number, limit: number = 10) {
  const response = await fetch(`${BASE_URL}/employees?page=${page}&limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch paginated roster');
  return response.json();
}

export async function createEmployee(payload: { full_name: string; job_title: string; country: string; salary: number }) {
  const response = await fetch(`${BASE_URL}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to create new employee entry');
  return response.json();
}

export async function deleteEmployee(id: number) {
  const response = await fetch(`${BASE_URL}/employees/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete employee profile');
  return response.json();
}