import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { ComparisonCard } from "@/components/dashboard/ComparisonCard";
import { RegionComparisonTable } from "@/components/dashboard/RegionComparisonTable";
import { MultiRegionChart } from "@/components/dashboard/MultiRegionChart";
import { ComparisonFilter } from "@/components/dashboard/ComparisonFilter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/services/api";
import { BarChart3, TrendingUp, Users, Download, RefreshCw } from "lucide-react";

const ComparativeAnalysisPage = () => {
  const [loading, setLoading] = useState(false);
  const [provinceComparison, setProvinceComparison] = useState<any>(null);
  const [districtRankings, setDistrictRankings] = useState<any>(null);
  const [genderComparison, setGenderComparison] = useState<any>(null);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [comparisonType, setComparisonType] = useState<'province' | 'district'>('province');
  const [regionComparisonData, setRegionComparisonData] = useState<any>(null);

  useEffect(() => {
    fetchComparativeData();
  }, []);

  const fetchComparativeData = async () => {
    setLoading(true);
    try {
      const [provinceRes, districtRes, genderRes] = await Promise.all([
        api.comparative.getProvinceComparison(),
        api.comparative.getDistrictRankings('total_voters', 15),
        api.comparative.compareGenderRatio('province'),
      ]);

      setProvinceComparison(provinceRes.data);
      setDistrictRankings(districtRes.data);
      setGenderComparison(genderRes.data);
    } catch (error) {
      console.error('Failed to fetch comparative data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompareRegions = async () => {
    if (selectedRegions.length < 2) {
      alert('Please select at least 2 regions to compare');
      return;
    }

    try {
      const response = await api.comparative.compareRegions(comparisonType, selectedRegions);
      setRegionComparisonData(response.data);
    } catch (error) {
      console.error('Failed to compare regions:', error);
    }
  };

  const handleFilterChange = (filters: { provinces: string[]; districts: string[] }) => {
    if (comparisonType === 'province') {
      setSelectedRegions(filters.provinces);
    } else {
      setSelectedRegions(filters.districts);
    }
  };

  const exportData = () => {
    console.log('Export data:', { provinceComparison, districtRankings, regionComparisonData });
    alert('Export feature coming soon!');
  };

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-8 h-8 text-primary" />
              <h1 className="text-3xl lg:text-4xl font-bold">Comparative Analysis</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              In-depth comparison of voter demographics across regions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchComparativeData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <Card className="stat-card">
          <CardHeader>
            <CardTitle>Custom Region Comparison</CardTitle>
            <CardDescription>Select regions to compare side-by-side</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-wrap items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Comparison Type</label>
                <Select value={comparisonType} onValueChange={(value: 'province' | 'district') => { setComparisonType(value); setSelectedRegions([]); }}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="province">Provinces</SelectItem>
                    <SelectItem value="district">Districts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">Selected Regions ({selectedRegions.length})</label>
                <div className="text-sm text-muted-foreground">
                  {selectedRegions.length > 0 ? selectedRegions.join(', ') : 'Use filters below to select regions'}
                </div>
              </div>
              <Button onClick={handleCompareRegions} disabled={selectedRegions.length < 2}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Compare Selected
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {provinceComparison && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
          <ComparisonFilter
            provinces={provinceComparison.map((p: any) => ({ value: p.province, label: p.province, count: p.total_voters }))}
            districts={districtRankings?.map((d: any) => ({ value: d.district, label: d.district, count: d.total_voters })) || []}
            onFilterChange={handleFilterChange}
          />
        </motion.div>
      )}

      {regionComparisonData && regionComparisonData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-6">
          <RegionComparisonTable
            data={regionComparisonData}
            title="Selected Regions Comparison"
            description={`Comparing ${regionComparisonData.length} ${comparisonType}${regionComparisonData.length > 1 ? 's' : ''}`}
          />
        </motion.div>
      )}

      <Tabs defaultValue="provinces" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="provinces">Provinces</TabsTrigger>
          <TabsTrigger value="districts">Districts</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="provinces" className="space-y-6">
          {loading ? (
            <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div><p className="mt-4 text-muted-foreground">Loading province data...</p></div>
          ) : provinceComparison ? (
            <>
              <RegionComparisonTable data={provinceComparison} title="All Provinces Comparison" description="Comprehensive comparison of all 7 provinces" delay={0.2} />
              <ComparisonCard title="Total Voters by Province" regions={provinceComparison.map((p: any) => ({ name: p.province, value: p.total_voters, subtitle: `${p.total_districts} districts, ${p.total_municipalities} municipalities`, color: `hsl(${Math.random() * 360}, 70%, 50%)` }))} unit="voters" delay={0.3} />
              <MultiRegionChart data={provinceComparison.map((p: any) => ({ name: p.province, male: p.male_voters, female: p.female_voters, total: p.total_voters }))} dataKeys={[{ key: 'male', name: 'Male Voters', color: '#3B82F6' }, { key: 'female', name: 'Female Voters', color: '#EC4899' }]} title="Gender Distribution Across Provinces" description="Male vs Female voter counts by province" yAxisLabel="Number of Voters" delay={0.4} />
            </>
          ) : <div className="text-center py-12 text-muted-foreground">No province data available</div>}
        </TabsContent>

        <TabsContent value="districts" className="space-y-6">
          {loading ? (
            <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div><p className="mt-4 text-muted-foreground">Loading district data...</p></div>
          ) : districtRankings ? (
            <>
              <ComparisonCard title="Top 15 Districts by Voter Count" regions={districtRankings.map((d: any) => ({ name: d.district, value: d.total_voters, subtitle: `Province: ${d.province}`, color: `hsl(${(d.rank * 20) % 360}, 70%, 50%)` }))} unit="voters" delay={0.2} />
              <MultiRegionChart data={districtRankings.slice(0, 10).map((d: any) => ({ name: d.district, male: d.male_voters, female: d.female_voters }))} dataKeys={[{ key: 'male', name: 'Male', color: '#3B82F6' }, { key: 'female', name: 'Female', color: '#EC4899' }]} title="Gender Distribution - Top 10 Districts" description="Male vs Female voters in largest districts" yAxisLabel="Voters" delay={0.3} />
            </>
          ) : <div className="text-center py-12 text-muted-foreground">No district data available</div>}
        </TabsContent>

        <TabsContent value="demographics" className="space-y-6">
          {loading ? (
            <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div><p className="mt-4 text-muted-foreground">Loading demographic data...</p></div>
          ) : genderComparison ? (
            <>
              <ComparisonCard title="Gender Ratio Comparison" regions={genderComparison.slice(0, 10).map((g: any) => ({ name: g.name, value: parseFloat(g.gender_ratio), subtitle: `Male: ${g.male_percentage}%, Female: ${g.female_percentage}%`, color: parseFloat(g.gender_ratio) > 1 ? '#3B82F6' : '#EC4899' }))} unit="ratio" delay={0.2} />
              <Card className="stat-card"><CardHeader><CardTitle>Gender Statistics by Province</CardTitle><CardDescription>Detailed gender breakdown</CardDescription></CardHeader><CardContent><div className="space-y-4">{genderComparison.slice(0, 7).map((region: any, index: number) => (<div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"><div><h4 className="font-semibold">{region.name}</h4><p className="text-sm text-muted-foreground">Total: {region.total.toLocaleString()} voters</p></div><div className="text-right"><p className="text-sm"><span className="text-blue-600 font-semibold">♂ {region.male.toLocaleString()}</span>{' / '}<span className="text-pink-600 font-semibold">♀ {region.female.toLocaleString()}</span></p><p className="text-xs text-muted-foreground">Ratio: {region.gender_ratio}:1</p></div></div>))}</div></CardContent></Card>
            </>
          ) : <div className="text-center py-12 text-muted-foreground">No demographic data available</div>}
        </TabsContent>
      </Tabs>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8">
        <Card className="stat-card bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Comparative Insights</CardTitle></CardHeader>
          <CardContent>{provinceComparison && (<div className="grid md:grid-cols-3 gap-4 text-center"><div><p className="text-3xl font-bold text-primary">{provinceComparison.length}</p><p className="text-sm text-muted-foreground">Provinces Analyzed</p></div><div><p className="text-3xl font-bold text-primary">{provinceComparison.reduce((sum: number, p: any) => sum + p.total_districts, 0)}</p><p className="text-sm text-muted-foreground">Total Districts</p></div><div><p className="text-3xl font-bold text-primary">{provinceComparison.reduce((sum: number, p: any) => sum + p.total_voters, 0).toLocaleString()}</p><p className="text-sm text-muted-foreground">Total Voters</p></div></div>)}</CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  );
};

export default ComparativeAnalysisPage;
