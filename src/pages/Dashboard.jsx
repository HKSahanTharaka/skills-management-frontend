export const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Personnel</h3>
          <p className="text-3xl font-bold text-primary-600">0</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Active Projects</h3>
          <p className="text-3xl font-bold text-success-600">0</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Skills</h3>
          <p className="text-3xl font-bold text-warning-600">0</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Allocations</h3>
          <p className="text-3xl font-bold text-secondary-600">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

