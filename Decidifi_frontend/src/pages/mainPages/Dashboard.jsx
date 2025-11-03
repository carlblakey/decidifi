import { DashboardLayout } from "../../components";
import DashboardCard from "../../components/Dashboard/DasboardCard";
import Graphs from "../../components/Dashboard/Graphs";
import useContextHook from "../../hooks/useContextHook";

const Dashboard = () => {
  const { setIsAuthenticated } = useContextHook();

  const handlePressOnLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <DashboardLayout>
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
        <p className="mb-5">
          Welcome to your dashboard! Here you can manage your settings and view
          your data.
        </p>
        {/* Add more content here */}

        <DashboardCard />

        <Graphs />
      </main>
    </DashboardLayout>
  );
};

export default Dashboard;