import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { parties } from "@/data/mockData";
import api from "@/services/api";
import { ElectionResult } from "@/types";
import { CheckCircle2, XCircle, Download, Filter, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ElectionResultsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [partyFilter, setPartyFilter] = useState("all");
  const [results, setResults] = useState<ElectionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.electionResults.getAll();
        setResults(response.data || []);
      } catch (error) {
        console.error("Failed to fetch election results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const filteredResults = results.filter((result) => {
    const matchesSearch = 
      result.municipality_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.district_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.province_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getPartyColor = (partyName: string) => {
    const party = parties.find((p) => p.name === partyName);
    return party?.color || "#808080";
  };

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="section-title text-3xl">Election 2079 Results</h1>
        <p className="section-subtitle">
          Federal Parliament constituency-wise results and candidate profiles
        </p>
      </motion.div>

      {/* Party Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8"
      >
        {parties.slice(0, 8).map((party, index) => (
          <motion.div
            key={party.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * index }}
            className="stat-card p-4 text-center cursor-pointer hover:scale-105 transition-transform"
            style={{ borderLeftColor: party.color, borderLeftWidth: 4 }}
          >
            <p className="text-2xl font-bold" style={{ color: party.color }}>
              {party.seats}
            </p>
            <p className="text-xs text-muted-foreground font-medium">{party.shortName}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="flex-1">
          <Input
            placeholder="Search municipality, district, or province..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </motion.div>

      {/* Results Table */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="stat-card text-center py-16"
        >
          <Loader2 className="h-16 w-16 mx-auto text-muted-foreground animate-spin mb-4" />
          <p className="text-muted-foreground">Loading election results...</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="stat-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Municipality</th>
                  <th>District</th>
                  <th>Province</th>
                  <th>Total Voters</th>
                  <th>Male Voters</th>
                  <th>Female Voters</th>
                  <th>Average Age</th>
                  <th>Gender Ratio</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((result, index) => {
                  const genderRatio = result.female_voters > 0 
                    ? (result.male_voters / result.female_voters).toFixed(2) 
                    : "N/A";
                  
                  return (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <td className="font-semibold">{result.municipality_name}</td>
                      <td>{result.district_name}</td>
                      <td className="text-sm text-muted-foreground">{result.province_name}</td>
                      <td className="mono font-semibold">{result.total_voters.toLocaleString()}</td>
                      <td className="mono">{result.male_voters.toLocaleString()}</td>
                      <td className="mono">{result.female_voters.toLocaleString()}</td>
                      <td className="mono">{Number(result.average_age).toFixed(1)} yrs</td>
                      <td className="mono font-medium">{genderRatio}:1</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredResults.length === 0 && !loading && (
            <div className="text-center py-12 text-muted-foreground">
              No results found matching your criteria.
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border p-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredResults.length} of {results.length} municipalities
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </MainLayout>
  );
};

export default ElectionResultsPage;
