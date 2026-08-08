const fetchDashboardStats = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard-stats`);
  if (!response.ok) {
    const info = await response.json();
    return {
      errors: info.error,
    };
  }
  const data = await response.json();
  return { data };
};

export { fetchDashboardStats };
