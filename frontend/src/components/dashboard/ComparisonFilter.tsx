import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FilterIcon, XIcon } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface ComparisonFilterProps {
  provinces?: FilterOption[];
  districts?: FilterOption[];
  onFilterChange: (filters: {
    provinces: string[];
    districts: string[];
  }) => void;
}

export function ComparisonFilter({ provinces = [], districts = [], onFilterChange }: ComparisonFilterProps) {
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleProvinceToggle = (province: string) => {
    const updated = selectedProvinces.includes(province)
      ? selectedProvinces.filter(p => p !== province)
      : [...selectedProvinces, province];
    setSelectedProvinces(updated);
    onFilterChange({ provinces: updated, districts: selectedDistricts });
  };

  const handleDistrictToggle = (district: string) => {
    const updated = selectedDistricts.includes(district)
      ? selectedDistricts.filter(d => d !== district)
      : [...selectedDistricts, district];
    setSelectedDistricts(updated);
    onFilterChange({ provinces: selectedProvinces, districts: updated });
  };

  const clearAll = () => {
    setSelectedProvinces([]);
    setSelectedDistricts([]);
    onFilterChange({ provinces: [], districts: [] });
  };

  const activeFiltersCount = selectedProvinces.length + selectedDistricts.length;

  return (
    <Card className="stat-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FilterIcon className="w-5 h-5" />
              Comparison Filters
            </CardTitle>
            <CardDescription>
              Select regions to compare
              {activeFiltersCount > 0 && ` (${activeFiltersCount} active)`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearAll}>
                <XIcon className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse' : 'Expand'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Provinces */}
            <div>
              <h4 className="font-semibold mb-3 text-sm">Provinces</h4>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-3">
                  {provinces.map((province) => (
                    <div key={province.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`province-${province.value}`}
                        checked={selectedProvinces.includes(province.value)}
                        onCheckedChange={() => handleProvinceToggle(province.value)}
                      />
                      <Label
                        htmlFor={`province-${province.value}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {province.label}
                        {province.count && (
                          <span className="text-muted-foreground ml-2">
                            ({province.count.toLocaleString()})
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Districts */}
            <div>
              <h4 className="font-semibold mb-3 text-sm">
                Districts {selectedDistricts.length > 0 && `(${selectedDistricts.length})`}
              </h4>
              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-3">
                  {districts.map((district) => (
                    <div key={district.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`district-${district.value}`}
                        checked={selectedDistricts.includes(district.value)}
                        onCheckedChange={() => handleDistrictToggle(district.value)}
                      />
                      <Label
                        htmlFor={`district-${district.value}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {district.label}
                        {district.count && (
                          <span className="text-muted-foreground ml-2">
                            ({district.count.toLocaleString()})
                          </span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
