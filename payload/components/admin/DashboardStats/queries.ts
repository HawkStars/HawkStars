'use cache';
const fetchDashboardStats = async () => {
  const response = await fetch('/api/dashboard-stats');
  if (!response.ok) throw new Error('Failed to fetch stats');
  const data = await response.json();
  return data;
};

export { fetchDashboardStats };
