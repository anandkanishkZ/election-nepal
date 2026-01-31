import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnalyticsLoadingSkeleton } from "@/components/analytics/AnalyticsLoadingSkeleton";
import api from "@/services/api";
import {
  BarChart3,
  Search,
  TrendingUp,
  Lightbulb,
  Map,
  Clock,
  FileText,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  Users,
  Activity,
  Target,
  Brain,
  Sparkles
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

// Color schemes
const COLORS = {
  primary: ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b'],
  severity: {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981'
  }
};

const AnalyticsDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  
  // State for each analytics type
  const [descriptiveData, setDescriptiveData] = useState<any>(null);
  const [diagnosticData, setDiagnosticData] = useState<any>(null);
  const [predictiveData, setPredictiveData] = useState<any>(null);
  const [prescriptiveData, setPrescriptiveData] = useState<any>(null);
  const [geographicData, setGeographicData] = useState<any>(null);
  const [temporalData, setTemporalData] = useState<any>(null);

  // Fetch data based on active tab
  useEffect(() => {
    fetchAnalyticsData(activeTab);
  }, [activeTab]);

  const fetchAnalyticsData = async (tab: string) => {
    setLoading(true);
    try {
      switch (tab) {
        case "overview":
          if (!descriptiveData) {
            const response = await api.analytics.getDescriptive();
            setDescriptiveData(response.data);
            setLastUpdate(new Date().toLocaleString());
          }
          break;
        case "diagnostic":
          if (!diagnosticData) {
            const response = await api.analytics.getDiagnostic();
            setDiagnosticData(response.data);
            setLastUpdate(new Date().toLocaleString());
          }
          break;
        case "predictive":
          if (!predictiveData) {
            const response = await api.analytics.getPredictive();
            setPredictiveData(response.data);
            setLastUpdate(new Date().toLocaleString());
          }
          break;
        case "prescriptive":
          if (!prescriptiveData) {
            const response = await api.analytics.getPrescriptive();
            setPrescriptiveData(response.data);
            setLastUpdate(new Date().toLocaleString());
          }
          break;
        case "geographic":
          if (!geographicData) {
            const response = await api.analytics.getGeographic();
            setGeographicData(response.data);
            setLastUpdate(new Date().toLocaleString());
          }
          break;
        case "temporal":
          if (!temporalData) {
            const response = await api.analytics.getTemporal();
            setTemporalData(response.data);
            setLastUpdate(new Date().toLocaleString());
          }
          break;
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    // Clear current tab data and refetch
    switch (activeTab) {
      case "overview":
        setDescriptiveData(null);
        break;
      case "diagnostic":
        setDiagnosticData(null);
        break;
      case "predictive":
        setPredictiveData(null);
        break;
      case "prescriptive":
        setPrescriptiveData(null);
        break;
      case "geographic":
        setGeographicData(null);
        break;
      case "temporal":
        setTemporalData(null);
        break;
    }
    fetchAnalyticsData(activeTab);
  };

  return (
    <MainLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="text-4xl">📊</div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">
                Nepal Election Analytics
                <span className="gradient-text block lg:inline lg:ml-2">Advanced Data Analysis</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive voter analytics • 18M+ records analyzed
              </p>
            </div>
          </div>
          <Button onClick={refreshData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
        {lastUpdate && (
          <Badge variant="secondary" className="mt-2">
            <Activity className="w-3 h-3 mr-1" />
            Last updated: {lastUpdate}
          </Badge>
        )}
      </motion.div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 h-auto gap-2 bg-card p-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden lg:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="diagnostic" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span className="hidden lg:inline">Diagnostic</span>
          </TabsTrigger>
          <TabsTrigger value="predictive" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden lg:inline">Predictive</span>
          </TabsTrigger>
          <TabsTrigger value="prescriptive" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <span className="hidden lg:inline">Prescriptive</span>
          </TabsTrigger>
          <TabsTrigger value="geographic" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            <span className="hidden lg:inline">Geographic</span>
          </TabsTrigger>
          <TabsTrigger value="temporal" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="hidden lg:inline">Temporal</span>
          </TabsTrigger>
          <TabsTrigger value="model" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden lg:inline">Model</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab - Descriptive Analytics */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <OverviewTab data={descriptiveData} loading={loading} />
        </TabsContent>

        {/* Diagnostic Tab */}
        <TabsContent value="diagnostic" className="space-y-6 mt-6">
          <DiagnosticTab data={diagnosticData} loading={loading} />
        </TabsContent>

        {/* Predictive Tab */}
        <TabsContent value="predictive" className="space-y-6 mt-6">
          <PredictiveTab data={predictiveData} loading={loading} />
        </TabsContent>

        {/* Prescriptive Tab */}
        <TabsContent value="prescriptive" className="space-y-6 mt-6">
          <PrescriptiveTab data={prescriptiveData} loading={loading} />
        </TabsContent>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-6 mt-6">
          <GeographicTab data={geographicData} loading={loading} />
        </TabsContent>

        {/* Temporal Tab */}
        <TabsContent value="temporal" className="space-y-6 mt-6">
          <TemporalTab data={temporalData} loading={loading} />
        </TabsContent>

        {/* Model Description Tab */}
        <TabsContent value="model" className="space-y-6 mt-6">
          <ModelDescriptionTab />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

// ============================================
// OVERVIEW TAB - Descriptive Analytics
// ============================================
const OverviewTab = ({ data, loading }: { data: any; loading: boolean }) => {
  if (loading || !data) {
    return <AnalyticsLoadingSkeleton />;
  }

  const { overall, geographic, topProvinces, ageDistribution } = data;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Descriptive Analytics Overview
          </CardTitle>
          <CardDescription>What happened? • Statistical summary of voter demographics</CardDescription>
        </CardHeader>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Voters"
          value={parseInt(overall.total_voters).toLocaleString()}
          subtitle="Registered voters"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Average Age"
          value={`${overall.average_age} years`}
          subtitle={`Range: ${overall.min_age}-${overall.max_age}`}
          icon={Activity}
          color="purple"
        />
        <MetricCard
          title="Male Voters"
          value={((parseInt(overall.male_voters) / parseInt(overall.total_voters)) * 100).toFixed(1) + '%'}
          subtitle={parseInt(overall.male_voters).toLocaleString()}
          icon={Users}
          color="cyan"
        />
        <MetricCard
          title="Female Voters"
          value={((parseInt(overall.female_voters) / parseInt(overall.total_voters)) * 100).toFixed(1) + '%'}
          subtitle={parseInt(overall.female_voters).toLocaleString()}
          icon={Users}
          color="pink"
        />
      </div>

      {/* Geographic Distribution */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <GeographicCard title="Provinces" count={geographic.total_provinces} />
        <GeographicCard title="Districts" count={geographic.total_districts} />
        <GeographicCard title="Municipalities" count={geographic.total_municipalities} />
        <GeographicCard title="Wards" count={geographic.total_wards} />
        <GeographicCard title="Voting Booths" count={geographic.total_voting_booths} />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Provinces */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Provinces by Voter Count</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProvinces}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="province" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="voter_count" fill="#3b82f6" name="Voters" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age_group" />
                <YAxis domain={[0, 'dataMax']} tickFormatter={(value) => (value / 1000000).toFixed(1) + 'M'} />
                <Tooltip formatter={(value: number) => value.toLocaleString()} />
                <Legend />
                <Bar dataKey="male" fill="#3b82f6" name="Male" stackId="a" />
                <Bar dataKey="female" fill="#ec4899" name="Female" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// ============================================
// DIAGNOSTIC TAB
// ============================================
const DiagnosticTab = ({ data, loading }: { data: any; loading: boolean }) => {
  if (loading || !data) {
    return <AnalyticsLoadingSkeleton />;
  }

  const { genderAnomalies, ageOutliers, densityAnalysis, ageGenderCorrelation, insights } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Diagnostic Analytics
          </CardTitle>
          <CardDescription>Why it happened? • Root cause analysis and pattern discovery</CardDescription>
        </CardHeader>
      </Card>

      {/* Insights Section */}
      {insights && insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight: any, index: number) => (
                <InsightCard key={index} insight={insight} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gender Imbalances */}
      <Card>
        <CardHeader>
          <CardTitle>Gender Ratio Anomalies</CardTitle>
          <CardDescription>Districts with significant gender imbalances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {genderAnomalies.slice(0, 10).map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{item.district}</div>
                  <div className="text-sm text-muted-foreground">{item.province}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{item.gender_ratio}:1</div>
                  <div className="text-sm text-muted-foreground">M:F Ratio</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Age Distribution Outliers */}
      <Card>
        <CardHeader>
          <CardTitle>Age Distribution Variance</CardTitle>
          <CardDescription>Districts with highest age diversity</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageOutliers.slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="district" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="age_stddev" fill="#8b5cf6" name="Age Std Dev" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Voter Density Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Voter Density by Province</CardTitle>
          <CardDescription>Voters per municipality - identifying underrepresented areas</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={densityAnalysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="province" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="voters_per_municipality" fill="#06b6d4" name="Voters/Municipality" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Age-Gender Correlation */}
      <Card>
        <CardHeader>
          <CardTitle>Age-Gender Correlation</CardTitle>
          <CardDescription>Gender distribution across age categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageGenderCorrelation}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age_category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="male" fill="#3b82f6" name="Male" />
              <Bar dataKey="female" fill="#ec4899" name="Female" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// PREDICTIVE TAB
// ============================================
const PredictiveTab = ({ data, loading }: { data: any; loading: boolean }) => {
  if (loading || !data) {
    return <AnalyticsLoadingSkeleton />;
  }

  const { demographicShift, provinceGrowthForecast, genderRatioForecast, confidence } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Predictive Analytics
          </CardTitle>
          <CardDescription>What will happen? • 5-year demographic forecasts and trend projections</CardDescription>
        </CardHeader>
      </Card>

      {/* Confidence Level */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Info className="w-5 h-5 text-blue-500" />
            <div>
              <div className="font-medium">Confidence Level: {confidence.level.toUpperCase()}</div>
              <div className="text-sm text-muted-foreground">{confidence.note}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demographic Shift Prediction */}
      <Card>
        <CardHeader>
          <CardTitle>Demographic Shift Prediction (5 Years)</CardTitle>
          <CardDescription>Projected age group changes</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={demographicShift}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age_group" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="current_count" stroke="#3b82f6" name="Current" strokeWidth={2} />
              <Line type="monotone" dataKey="predicted_5yr" stroke="#10b981" name="Predicted (5yr)" strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Province Growth Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Province Growth Forecast</CardTitle>
          <CardDescription>Predicted voter growth by province</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {provinceGrowthForecast.map((item: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{item.province}</div>
                      <div className="text-sm text-muted-foreground">Youth: {item.youth_percentage}%</div>
                    </div>
                    <Badge variant={parseFloat(item.predicted_growth_rate) > 5 ? "default" : "secondary"}>
                      +{item.predicted_growth_rate}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-muted-foreground">Current</div>
                      <div className="font-medium">{item.current_voters.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Predicted</div>
                      <div className="font-medium">{item.predicted_5yr_voters.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Change</div>
                      <div className="font-medium text-green-600">+{item.predicted_change.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Gender Ratio Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Gender Ratio Convergence Forecast</CardTitle>
          <CardDescription>Predicted movement toward gender parity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {genderRatioForecast.slice(0, 7).map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{item.province}</div>
                  <div className="text-sm text-muted-foreground">{item.trend.replace(/_/g, ' ')}</div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Current</div>
                    <div className="font-medium">{item.current_ratio}:1</div>
                  </div>
                  <div className="text-muted-foreground">→</div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">5yr Predicted</div>
                    <div className="font-medium text-green-600">{item.predicted_5yr_ratio}:1</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// PRESCRIPTIVE TAB
// ============================================
const PrescriptiveTab = ({ data, loading }: { data: any; loading: boolean }) => {
  if (loading || !data) {
    return <AnalyticsLoadingSkeleton />;
  }

  const { recommendations, summary } = data;

  // Group recommendations by category
  const infrastructureRecs = recommendations.filter((r: any) => r.category === 'infrastructure');
  const engagementRecs = recommendations.filter((r: any) => r.category === 'engagement');
  const youthRecs = recommendations.filter((r: any) => r.category === 'youth_outreach');

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Prescriptive Analytics
          </CardTitle>
          <CardDescription>What should we do? • Actionable recommendations and optimization strategies</CardDescription>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Recommendations"
          value={summary.total_recommendations}
          subtitle="Action items"
          icon={Target}
          color="blue"
        />
        <MetricCard
          title="High Priority"
          value={summary.high_priority}
          subtitle="Critical issues"
          icon={AlertTriangle}
          color="red"
        />
        <MetricCard
          title="Medium Priority"
          value={summary.medium_priority}
          subtitle="Important items"
          icon={Info}
          color="yellow"
        />
        <MetricCard
          title="Categories"
          value={Object.keys(summary.categories).length}
          subtitle="Focus areas"
          icon={Brain}
          color="purple"
        />
      </div>

      {/* Infrastructure Recommendations */}
      {infrastructureRecs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Infrastructure Optimization
            </CardTitle>
            <CardDescription>{infrastructureRecs.length} recommendations for voting booth placement</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {infrastructureRecs.map((rec: any, index: number) => (
                  <RecommendationCard key={index} recommendation={rec} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Gender Engagement Recommendations */}
      {engagementRecs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Gender Engagement Strategy
            </CardTitle>
            <CardDescription>{engagementRecs.length} recommendations for female voter engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {engagementRecs.map((rec: any, index: number) => (
                  <RecommendationCard key={index} recommendation={rec} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Youth Outreach Recommendations */}
      {youthRecs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Youth Outreach Opportunities
            </CardTitle>
            <CardDescription>{youthRecs.length} recommendations for youth voter engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {youthRecs.map((rec: any, index: number) => (
                  <RecommendationCard key={index} recommendation={rec} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ============================================
// GEOGRAPHIC TAB
// ============================================
const GeographicTab = ({ data, loading }: { data: any; loading: boolean }) => {
  if (loading || !data) {
    return <AnalyticsLoadingSkeleton />;
  }

  const { provinceHeatmap, districtDensity } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5" />
            Geographic Analytics
          </CardTitle>
          <CardDescription>Spatial distribution • Heatmaps and density analysis</CardDescription>
        </CardHeader>
      </Card>

      {/* Province Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle>Province Voter Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={provinceHeatmap} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="province" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="voter_count" name="Total Voters">
                {provinceHeatmap?.map((entry, index) => {
                  const maxVoters = Math.max(...provinceHeatmap.map(p => parseInt(p.voter_count)));
                  const minVoters = Math.min(...provinceHeatmap.map(p => parseInt(p.voter_count)));
                  const ratio = (parseInt(entry.voter_count) - minVoters) / (maxVoters - minVoters);
                  
                  // Color gradient from light blue (low) to dark red (high)
                  const getHeatColor = (ratio: number) => {
                    if (ratio > 0.75) return '#dc2626'; // dark red
                    if (ratio > 0.5) return '#f97316'; // orange
                    if (ratio > 0.25) return '#fbbf24'; // yellow
                    return '#3b82f6'; // blue
                  };
                  
                  return <Cell key={`cell-${index}`} fill={getHeatColor(ratio)} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* District Density Table */}
      <Card>
        <CardHeader>
          <CardTitle>District Voter Density</CardTitle>
          <CardDescription>Top 20 districts by voter count</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {districtDensity.slice(0, 20).map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{item.district}</div>
                    <div className="text-sm text-muted-foreground">{item.province}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{parseInt(item.voter_count).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{item.municipalities} municipalities</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// TEMPORAL TAB
// ============================================
const TemporalTab = ({ data, loading }: { data: any; loading: boolean }) => {
  if (loading || !data) {
    return <AnalyticsLoadingSkeleton />;
  }

  const { cohortDistribution, provinceGrowthTrends } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Temporal Analytics
          </CardTitle>
          <CardDescription>Time-based trends • Cohort analysis and growth patterns</CardDescription>
        </CardHeader>
      </Card>

      {/* Age Cohort Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>New Eligible Voters (18-25 Age Group)</CardTitle>
          <CardDescription>Simulated registration periods</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cohortDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="registration_period" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="voter_count" fill="#06b6d4" name="Voter Count" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Province Growth Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Provincial Demographic Trends</CardTitle>
          <CardDescription>Young vs aging populations</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={provinceGrowthTrends} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="province" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="new_eligible" fill="#10b981" name="New Eligible (18-25)" />
              <Bar dataKey="aging_population" fill="#f59e0b" name="Aging (65+)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// MODEL DESCRIPTION TAB
// ============================================
const ModelDescriptionTab = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Model Description
          </CardTitle>
          <CardDescription>Analytics methodology • Data sources and statistical methods</CardDescription>
        </CardHeader>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Primary Dataset</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Nepal Voter Registration Database (18M+ records)</li>
              <li>PostgreSQL relational database with 6 tables</li>
              <li>Hierarchical structure: Provinces → Districts → Municipalities → Wards → Booths → Voters</li>
            </ul>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-2">Data Fields</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Demographics: Age, Gender, Voter ID</li>
              <li>Geographic: Province, District, Municipality, Ward, Voting Booth</li>
              <li>Metadata: Registration dates, booth assignments</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Methodologies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Descriptive */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Descriptive Analytics
            </h4>
            <p className="text-muted-foreground mb-2">Statistical aggregation and summarization</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
              <li>COUNT, AVG, SUM, MIN, MAX aggregations</li>
              <li>GROUP BY analysis across geographic hierarchies</li>
              <li>Standard deviation calculations for variance analysis</li>
            </ul>
          </div>

          <Separator />

          {/* Diagnostic */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Diagnostic Analytics
            </h4>
            <p className="text-muted-foreground mb-2">Root cause analysis and anomaly detection</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
              <li>Deviation analysis: Identifying statistical outliers (σ {'>'} 2)</li>
              <li>Correlation analysis: Age vs Gender distribution patterns</li>
              <li>Density mapping: Voters per geographic unit ratios</li>
              <li>Threshold-based anomaly detection (e.g., gender ratio {'>'} 1.2)</li>
            </ul>
          </div>

          <Separator />

          {/* Predictive */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Predictive Analytics
            </h4>
            <p className="text-muted-foreground mb-2">Forecasting models and trend projections</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
              <li>Linear aging model: Age cohort transitions over 5 years</li>
              <li>Growth rate calculation: Based on youth population percentage</li>
              <li>Convergence model: Gender parity projection (10% yearly convergence)</li>
              <li>Attrition factors: 15% for aging groups, 10% growth for elderly</li>
            </ul>
          </div>

          <Separator />

          {/* Prescriptive */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Prescriptive Analytics
            </h4>
            <p className="text-muted-foreground mb-2">Recommendation engine and optimization</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-6">
              <li>Threshold-based recommendations (e.g., 1000+ voters per booth)</li>
              <li>Priority scoring: High/Medium based on severity and impact</li>
              <li>Resource optimization: Target 800 voters per voting booth</li>
              <li>Multi-criteria decision analysis for engagement strategies</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Limitations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Limitations & Assumptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 mt-1">•</span>
              <span><strong>Static Data:</strong> Analysis based on current snapshot, no historical time-series available</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 mt-1">•</span>
              <span><strong>Simplified Models:</strong> Linear projections may not capture complex demographic dynamics</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 mt-1">•</span>
              <span><strong>External Factors:</strong> Migration, policy changes, and socio-economic shifts not modeled</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 mt-1">•</span>
              <span><strong>Confidence Level:</strong> Medium confidence due to lack of longitudinal data validation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 mt-1">•</span>
              <span><strong>Geographic Accuracy:</strong> Assumes accurate geographic hierarchy and booth assignments</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Technical Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Backend</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Node.js + Express.js REST API</li>
                <li>PostgreSQL 14+ with advanced queries</li>
                <li>Complex SQL: CTEs, Window Functions, JOINs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Frontend</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>React 18 + TypeScript</li>
                <li>Recharts for data visualization</li>
                <li>Tailwind CSS + shadcn/ui components</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================
// UTILITY COMPONENTS
// ============================================
const MetricCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
  >
    <Card className="card-hover">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg bg-${color}-500/10`}>
            <Icon className={`w-4 h-4 text-${color}-500`} />
          </div>
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="text-sm text-muted-foreground">{title}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  </motion.div>
);

const GeographicCard = ({ title, count }: { title: string; count: number }) => (
  <Card>
    <CardContent className="pt-6 text-center">
      <div className="text-3xl font-bold text-primary mb-1">{count}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </CardContent>
  </Card>
);

const InsightCard = ({ insight }: { insight: any }) => {
  const severityColors = {
    high: 'border-red-500 bg-red-500/5',
    medium: 'border-yellow-500 bg-yellow-500/5',
    low: 'border-green-500 bg-green-500/5'
  };

  return (
    <div className={`p-4 border-l-4 rounded-lg ${severityColors[insight.severity as keyof typeof severityColors]}`}>
      <div className="flex items-start gap-3">
        {insight.severity === 'high' && <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />}
        {insight.severity === 'medium' && <Info className="w-5 h-5 text-yellow-500 mt-0.5" />}
        {insight.severity === 'low' && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
        <div className="flex-1">
          <div className="font-medium mb-1">{insight.title}</div>
          <div className="text-sm text-muted-foreground mb-2">{insight.description}</div>
          <div className="text-xs text-muted-foreground italic">{insight.recommendation}</div>
        </div>
      </div>
    </div>
  );
};

const RecommendationCard = ({ recommendation }: { recommendation: any }) => {
  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  };

  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-medium">{recommendation.district}</div>
          <div className="text-sm text-muted-foreground">{recommendation.province}</div>
        </div>
        <Badge className={`${priorityColors[recommendation.priority as keyof typeof priorityColors]} text-white`}>
          {recommendation.priority}
        </Badge>
      </div>
      
      {recommendation.issue && (
        <div className="text-sm">
          <span className="font-medium">Issue: </span>
          <span className="text-muted-foreground">{recommendation.issue}</span>
        </div>
      )}

      {recommendation.opportunity && (
        <div className="text-sm">
          <span className="font-medium">Opportunity: </span>
          <span className="text-muted-foreground">{recommendation.opportunity}</span>
        </div>
      )}
      
      <div className="text-sm">
        <span className="font-medium">Recommendation: </span>
        <span className="text-muted-foreground">{recommendation.recommendation}</span>
      </div>

      {recommendation.actions && (
        <div className="text-sm">
          <span className="font-medium">Actions:</span>
          <ul className="list-disc list-inside ml-2 mt-1 space-y-1 text-muted-foreground">
            {recommendation.actions.map((action: string, idx: number) => (
              <li key={idx}>{action}</li>
            ))}
          </ul>
        </div>
      )}
      
      {recommendation.impact && (
        <div className="text-sm bg-muted p-2 rounded">
          <span className="font-medium">Expected Impact: </span>
          <span>{recommendation.impact}</span>
        </div>
      )}

      {recommendation.expected_impact && (
        <div className="text-sm bg-muted p-2 rounded">
          <span className="font-medium">Expected Impact: </span>
          <span>{recommendation.expected_impact}</span>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboardPage;
