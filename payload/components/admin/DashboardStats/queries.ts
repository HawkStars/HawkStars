const fetchDashboardStats = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard-stats`);
  if (!response.ok) return { errors: 'Failed to get stats' };
  const data = await response.json();
  return { data };
};

export { fetchDashboardStats };
