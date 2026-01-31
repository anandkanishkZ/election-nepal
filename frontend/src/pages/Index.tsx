import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProvinceChart } from "@/components/dashboard/ProvinceChart";
import { GenderPieChart } from "@/components/dashboard/GenderPieChart";
import { AgeDistributionChart } from "@/components/dashboard/AgeDistributionChart";
import { PartySeatsChart } from "@/components/dashboard/PartySeatsChart";
import { NepalMap } from "@/components/map/NepalMap";
import api from "@/services/api";
import { VoterStatistics } from "@/types";
import { Users, TrendingUp, UserCheck, Calendar, MapPin, Vote, Building, Landmark } from "lucide-react";

const Index = () => {
  const [stats, setStats] = useState<VoterStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.voters.getStatistics();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Calculate derived stats
  const maleVoters = stats?.byGender.find(g => g.gender === "पुरुष")?.count || 0;
  const femaleVoters = stats?.byGender.find(g => g.gender === "महिला")?.count || 0;
  const genderRatio = femaleVoters > 0 ? (maleVoters / femaleVoters).toFixed(2) : "N/A";
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🗳️</span>
          <h1 className="text-3xl lg:text-4xl font-bold">
            Nepal Election Data
            <span className="gradient-text block lg:inline lg:ml-2">Analysis & GIS</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Comprehensive voter analytics, interactive maps, and election results for 
          Nepal's Federal & Local Elections 2079 BS.
        </p>
      </motion.div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Voters"
          value={loading ? "Loading..." : stats?.total || 0}
          icon={Users}
          trend={{ value: 16.6, label: "vs 2074 election" }}
          delay={0}
        />
        <StatCard
          title="Male Voters"
          value={loading ? "Loading..." : maleVoters}
          subtitle={`${stats?.byGender.find(g => g.gender === "पुरुष") ? ((maleVoters / (stats?.total || 1)) * 100).toFixed(1) : 0}% of total`}
          icon={UserCheck}
          delay={0.1}
        />
        <StatCard
          title="Female Voters"
          value={loading ? "Loading..." : femaleVoters}
          subtitle={`${stats?.byGender.find(g => g.gender === "महिला") ? ((femaleVoters / (stats?.total || 1)) * 100).toFixed(1) : 0}% of total`}
          icon={UserCheck}
          delay={0.2}
        />
        <StatCard
          title="Gender Ratio"
          value={`${genderRatio}:1`}
          subtitle="Male to Female"
          icon={TrendingUp}
          delay={0.3}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Districts"
          value={loading ? "..." : stats?.byDistrict.length || 77}
          subtitle="Administrative units"
          icon={MapPin}
          delay={0.1}
        />
        <StatCard
          title="Municipalities"
          value={loading ? "..." : stats?.byMunicipality.length || 753}
          subtitle="Local government units"
          icon={Building}
          delay={0.15}
        />
        <StatCard
          title="Age Groups"
          value={loading ? "..." : stats?.byAgeGroup.length || 6}
          subtitle="Demographic segments"
          icon={Calendar}
          delay={0.2}
        />
        <StatCard
          title="Provinces"
          value={7}
          subtitle="Federal provinces"
          icon={Landmark}
          delay={0.25}
        />
      </div>

      {/* Map Section */}
      <div className="mb-8">
        <NepalMap />
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <ProvinceChart data={stats?.byDistrict} loading={loading} />
        <GenderPieChart data={stats?.byGender} loading={loading} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <AgeDistributionChart data={stats?.byAgeGroup} loading={loading} />
        <PartySeatsChart />
      </div>
    </MainLayout>
  );
};

export default Index;
