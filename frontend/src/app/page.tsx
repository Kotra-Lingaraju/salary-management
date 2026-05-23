// frontend/frontend/src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { fetchCountryInsights, fetchPaginatedEmployees, createEmployee, deleteEmployee } from '../utils/api';

export default function HRDashboard() {
  // Analytical State
  const [country, setCountry] = useState('India');
  const [metrics, setMetrics] = useState({ min_salary: 0, max_salary: 0, avg_salary: 0 });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  // Roster Pagination State
  const [employees, setEmployees] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [rosterLoading, setRosterLoading] = useState(true);

  // Modal Addition Form Form State
  const [form, setForm] = useState({ full_name: '', job_title: 'Software Engineer', country: 'India', salary: 60000 });
  const [submitting, setSubmitting] = useState(false);

  // Trigger metrics reload when focused region dropdown updates
  useEffect(() => {
    setAnalyticsLoading(true);
    fetchCountryInsights(country)
      .then((data) => { setMetrics(data); setAnalyticsLoading(false); })
      .catch((err) => { console.error(err); setAnalyticsLoading(false); });
  }, [country]);

  // Trigger grid reload when active pagination page numbers update
  const loadRoster = () => {
    setRosterLoading(true);
    fetchPaginatedEmployees(page, 8)
      .then((res) => {
        setEmployees(res.data);
        setTotal(res.total);
        setRosterLoading(false);
      })
      .catch((err) => { console.error(err); setRosterLoading(false); });
  };

  useEffect(() => {
    loadRoster();
  }, [page]);

  // Form handle handler engine execution
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || form.salary <= 0) return;
    setSubmitting(true);
    try {
      await createEmployee(form);
      setForm({ full_name: '', job_title: 'Software Engineer', country: 'India', salary: 60000 });
      setPage(1); // Reset back to page 1 to see our freshly added item instantly
      loadRoster();
      // Force refresh current aggregate metrics cards in view
      const updatedMetrics = await fetchCountryInsights(country);
      setMetrics(updatedMetrics);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this employee's profile permanently?")) return;
    try {
      await deleteEmployee(id);
      loadRoster();
      const updatedMetrics = await fetchCountryInsights(country);
      setMetrics(updatedMetrics);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Block Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Organization Salary Management</h1>
            <p className="text-gray-500 text-sm">Real-time metrics engine managing {total.toLocaleString()} internal records</p>
          </div>
          
          <div className="flex items-center gap-3">
            <label htmlFor="country-select" className="text-sm font-medium text-gray-600">Region Focus:</label>
            <select
              id="country-select"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Germany">Germany</option>
              <option value="Canada">Canada</option>
            </select>
          </div>
        </div>

        {/* Metrics Grid Cards Dashboard Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Average Salary</h3>
            <div className="mt-2 text-3xl font-bold text-gray-900">
              {analyticsLoading ? '...' : `$${metrics.avg_salary.toLocaleString()}`}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Maximum Salary</h3>
            <div className="mt-2 text-3xl font-bold text-emerald-600">
              {analyticsLoading ? '...' : `$${metrics.max_salary.toLocaleString()}`}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Minimum Salary</h3>
            <div className="mt-2 text-3xl font-bold text-amber-600">
              {analyticsLoading ? '...' : `$${metrics.min_salary.toLocaleString()}`}
            </div>
          </div>
        </div>

        {/* Workspace Operations Split Grid Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Employee Form Input Module Panel Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h2 className="text-lg font-semibold mb-4">Onboard Team Member</h2>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aditi Sharma"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">Designation Role</label>
                <select
                  value={form.job_title}
                  onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Senior Software Engineer">Senior Software Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Product Manager">Product Manager</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">Geography Region</label>
                <select
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase">Annual Base Salary ($)</label>
                <input
                  type="number"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: parseInt(e.target.value) || 0 })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50"
              >
                {submitting ? 'Processing Commit...' : 'Commit to Production Registry'}
              </button>
            </form>
          </div>

          {/* Active Employee Table Ledger Panel Dashboard Layout View Grid */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-lg font-semibold text-gray-900">Live Employee Ledger</h2>
                <span className="text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">Server-Side Active</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 font-medium text-xs border-b border-gray-100 uppercase tracking-wider">
                      <th className="p-4">Name</th>
                      <th className="p-4">Designation</th>
                      <th className="p-4">Region Focus</th>
                      <th className="p-4">Compensation</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rosterLoading ? (
                      <tr><td colSpan={5} className="p-8 text-center text-gray-400">Syncing database registries...</td></tr>
                    ) : employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-4 font-medium text-gray-900">{emp.full_name}</td>
                        <td className="p-4 text-gray-500">{emp.job_title}</td>
                        <td className="p-4 text-gray-600">{emp.country}</td>
                        <td className="p-4 font-semibold text-gray-900">${emp.salary.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(emp.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 rounded hover:bg-red-50 transition-colors"
                          >
                            Purge Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls Footer Module Pane Block */}
            <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50/50">
              <span className="text-xs text-gray-500">
                Viewing items <strong>{((page - 1) * 8) + 1}</strong> to <strong>{Math.min(page * 8, total)}</strong> of <strong>{total.toLocaleString()}</strong> profiles
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1 || rosterLoading}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium bg-white hover:bg-gray-50 disabled:opacity-40"
                >
                  Previous Chunk
                </button>
                <span className="text-xs text-gray-600 font-semibold px-2">Page {page}</span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * 8 >= total || rosterLoading}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium bg-white hover:bg-gray-50 disabled:opacity-40"
                >
                  Next Chunk
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}