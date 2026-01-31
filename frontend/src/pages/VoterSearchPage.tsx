import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import api from "@/services/api";
import { Voter, Province, District, Municipality, Ward } from "@/types";
import { Search, User, MapPin, Download, Filter, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const VoterSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [genderFilter, setGenderFilter] = useState("all");
  
  // Hierarchical location filters
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedMunicipality, setSelectedMunicipality] = useState("all");
  const [selectedWard, setSelectedWard] = useState("all");
  
  // Data for dropdowns
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Voter[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);

  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const data = await api.hierarchy.getProvinces();
        setProvinces(data);
      } catch (err) {
        console.error("Failed to load provinces:", err);
      }
    };
    loadProvinces();
  }, []);

  // Load districts when province changes
  useEffect(() => {
    if (selectedProvince && selectedProvince !== "all") {
      const loadDistricts = async () => {
        try {
          const data = await api.hierarchy.getDistricts(selectedProvince);
          setDistricts(data);
          // Reset dependent selections
          setSelectedDistrict("all");
          setSelectedMunicipality("all");
          setSelectedWard("all");
          setMunicipalities([]);
          setWards([]);
        } catch (err) {
          console.error("Failed to load districts:", err);
        }
      };
      loadDistricts();
    } else {
      setDistricts([]);
      setSelectedDistrict("all");
      setSelectedMunicipality("all");
      setSelectedWard("all");
      setMunicipalities([]);
      setWards([]);
    }
  }, [selectedProvince]);

  // Load municipalities when district changes
  useEffect(() => {
    if (selectedDistrict && selectedDistrict !== "all") {
      const loadMunicipalities = async () => {
        try {
          const data = await api.hierarchy.getMunicipalities(selectedDistrict);
          setMunicipalities(data);
          // Reset dependent selections
          setSelectedMunicipality("all");
          setSelectedWard("all");
          setWards([]);
        } catch (err) {
          console.error("Failed to load municipalities:", err);
        }
      };
      loadMunicipalities();
    } else {
      setMunicipalities([]);
      setSelectedMunicipality("all");
      setSelectedWard("all");
      setWards([]);
    }
  }, [selectedDistrict]);

  // Load wards when municipality changes
  useEffect(() => {
    if (selectedMunicipality && selectedMunicipality !== "all") {
      const loadWards = async () => {
        try {
          const data = await api.hierarchy.getWards(selectedMunicipality);
          setWards(data);
          // Reset dependent selections
          setSelectedWard("all");
        } catch (err) {
          console.error("Failed to load wards:", err);
        }
      };
      loadWards();
    } else {
      setWards([]);
      setSelectedWard("all");
    }
  }, [selectedMunicipality]);

  const handleSearch = async () => {
    // Check if we have any valid search criteria
    const hasQuery = searchQuery.trim().length > 0;
    const hasDistrict = selectedDistrict && selectedDistrict !== "all";
    const hasMunicipality = selectedMunicipality && selectedMunicipality !== "all";
    const hasWard = selectedWard && selectedWard !== "all";
    
    if (!hasQuery && !hasDistrict && !hasMunicipality && !hasWard) {
      setError("Please enter a search query or select a location");
      return;
    }
    
    setIsSearching(true);
    setError(null);
    setCurrentPage(1);
    
    try {
      let response;
      
      // Build search params based on location hierarchy
      const districtName = hasDistrict ? districts.find(d => d.id.toString() === selectedDistrict)?.name_np || "" : "";
      const municipalityName = hasMunicipality ? municipalities.find(m => m.id.toString() === selectedMunicipality)?.name_np || "" : "";
      const wardNumber = hasWard ? wards.find(w => w.id.toString() === selectedWard)?.ward_number?.toString() || "" : "";
      
      // If any location filter is selected, use location-based search (which now supports name filtering)
      if (districtName || municipalityName || wardNumber) {
        const nameParam = (searchType === "name" && searchQuery) ? searchQuery : undefined;
        const voterIdParam = (searchType === "voter_id" && searchQuery) ? searchQuery : undefined;
        response = await api.voters.getByLocation(districtName, municipalityName, wardNumber, nameParam, voterIdParam);
      } else {
        // Pure name or voter ID search without location filters
        const searchParams: any = {};
        
        if (searchType === "name" && searchQuery) {
          searchParams.name = searchQuery;
        } else if (searchType === "voter_id" && searchQuery) {
          searchParams.voter_id = searchQuery;
        }
        
        if (genderFilter !== "all") {
          searchParams.gender = genderFilter === "male" ? "पुरुष" : "महिला";
        }
        
        response = await api.voters.search(searchParams);
      }
      
      const resultData = response.data || [];
      setResults(resultData);
      setTotalResults(resultData.length);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to search voters. Please check if the backend server is running.");
      setResults([]);
      setTotalResults(0);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedProvince("all");
    setSelectedDistrict("all");
    setSelectedMunicipality("all");
    setSelectedWard("all");
    setResults([]);
    setError(null);
    setCurrentPage(1);
    setTotalResults(0);
  };

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="section-title text-3xl">Voter Search System</h1>
        <p className="section-subtitle">
          Search across 18M+ voter records with advanced filtering
        </p>
      </motion.div>

      {/* Search Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="stat-card mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Type */}
          <Select value={searchType} onValueChange={setSearchType}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Search by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (नाम)</SelectItem>
              <SelectItem value="voter_id">Voter ID</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>

          {/* Search Input */}
          <div className="flex-1 relative">
            <Input
              placeholder={
                searchType === "name" 
                  ? "Enter name in Nepali or English..." 
                  : searchType === "voter_id"
                  ? "Enter Voter ID..."
                  : "Use location filters below..."
              }
              value={searchType === "location" ? "" : searchQuery}
              onChange={(e) => {
                if (searchType !== "location") {
                  setSearchQuery(e.target.value);
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pr-10"
              disabled={searchType === "location"}
            />
            {(searchQuery || selectedProvince || selectedDistrict || selectedMunicipality) && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button onClick={handleSearch} disabled={isSearching} className="gap-2">
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>

        {/* Advanced Filters - Hierarchical Location Selection */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">Location Hierarchy:</span>
          </div>

          {/* Province */}
          <Select value={selectedProvince} onValueChange={setSelectedProvince}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Province" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Provinces</SelectItem>
              {provinces.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>{p.name_np}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* District */}
          <Select 
            value={selectedDistrict} 
            onValueChange={setSelectedDistrict}
            disabled={!selectedProvince || selectedProvince === "all"}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={(selectedProvince && selectedProvince !== "all") ? "Select District" : "Select Province First"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {districts.map((d) => (
                <SelectItem key={d.id} value={d.id.toString()}>{d.name_np}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Municipality */}
          <Select 
            value={selectedMunicipality} 
            onValueChange={setSelectedMunicipality}
            disabled={!selectedDistrict || selectedDistrict === "all"}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={(selectedDistrict && selectedDistrict !== "all") ? "Select Municipality" : "Select District First"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Municipalities</SelectItem>
              {municipalities.map((m) => (
                <SelectItem key={m.id} value={m.id.toString()}>{m.name_np}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Ward */}
          <Select 
            value={selectedWard} 
            onValueChange={setSelectedWard}
            disabled={!selectedMunicipality || selectedMunicipality === "all"}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder={(selectedMunicipality && selectedMunicipality !== "all") ? "Select Ward" : "Select Municipality First"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wards</SelectItem>
              {wards.map((w) => (
                <SelectItem key={w.id} value={w.id.toString()}>Ward {w.ward_number}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex-1" />

          {/* Gender Filter */}
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-[150px]">
              <User className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male (पुरुष)</SelectItem>
              <SelectItem value="female">Female (महिला)</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="gap-2" onClick={clearSearch}>
            <Filter className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-4"
        >
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stat-card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              Search Results 
              <span className="text-muted-foreground font-normal ml-2">
                ({results.length} records found)
              </span>
            </h3>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Voter ID</th>
                  <th>Name</th>
                  <th>Parent's Name</th>
                  <th>Partner's Name</th>
                  <th>Gender</th>
                  <th>Age</th>
                  <th>Province</th>
                  <th>District</th>
                  <th>Municipality</th>
                  <th>Ward</th>
                  <th>Booth</th>
                </tr>
              </thead>
              <tbody>
                {results
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((voter, index) => (
                    <motion.tr
                      key={voter.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="cursor-pointer hover:bg-primary/5"
                    >
                      <td className="mono text-xs font-medium">{voter.voter_id || voter.id}</td>
                      <td className="font-medium">{voter.name_np}</td>
                      <td className="text-sm">{voter.parents_name_np || "N/A"}</td>
                      <td className="text-sm">{voter.partners_name_np || "N/A"}</td>
                      <td>
                        <Badge variant={voter.gender === "पुरुष" ? "secondary" : "default"}>
                          {voter.gender}
                        </Badge>
                      </td>
                      <td>{voter.age || "N/A"}</td>
                      <td className="text-sm">{voter.province_name || "N/A"}</td>
                      <td className="text-sm">{voter.district_name || "N/A"}</td>
                      <td className="text-sm">{voter.municipality_name || "N/A"}</td>
                      <td className="text-center">{voter.ward_number || "N/A"}</td>
                      <td className="text-center">{voter.booth_name || "N/A"}</td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border p-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalResults)} to {Math.min(currentPage * itemsPerPage, totalResults)} of {totalResults} records
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Page {currentPage} of {Math.ceil(totalResults / itemsPerPage)}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage >= Math.ceil(totalResults / itemsPerPage)}
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalResults / itemsPerPage), prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {results.length === 0 && !isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="stat-card text-center py-16"
        >
          <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Search the Voter Database</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter a name, voter ID, or location to search across 18+ million voter records 
            from the Election Commission of Nepal.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Badge variant="outline">Nepali Unicode Support</Badge>
            <Badge variant="outline">Server-side Pagination</Badge>
            <Badge variant="outline">Privacy Masking</Badge>
            <Badge variant="outline">CSV Export</Badge>
          </div>
        </motion.div>
      )}

      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-4 rounded-lg bg-muted/50 border border-border"
      >
        <p className="text-xs text-muted-foreground text-center">
          🔒 <strong>Privacy Notice:</strong> Voter data is sourced from the Election Commission of Nepal 
          and is subject to privacy regulations. Personal information may be partially masked for privacy protection.
        </p>
      </motion.div>
    </MainLayout>
  );
};

export default VoterSearchPage;
