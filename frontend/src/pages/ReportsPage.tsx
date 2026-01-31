import { useState } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { provinces, overviewStats } from "@/data/mockData";
import { FileText, Download, FileSpreadsheet, File, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reportTypes = [
  {
    id: "executive",
    name: "Executive Summary",
    description: "High-level overview with key metrics and insights",
    icon: FileText,
  },
  {
    id: "province",
    name: "Province Report",
    description: "Detailed analysis for a specific province",
    icon: FileText,
  },
  {
    id: "district",
    name: "District Report",
    description: "Granular data at district level",
    icon: FileText,
  },
  {
    id: "full",
    name: "Full Dataset Export",
    description: "Complete voter database export",
    icon: FileSpreadsheet,
  },
];

const exportFormats = [
  { id: "csv", name: "CSV", icon: FileSpreadsheet },
  { id: "xlsx", name: "Excel (XLSX)", icon: FileSpreadsheet },
  { id: "pdf", name: "PDF Report", icon: File },
];

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [includeCharts, setIncludeCharts] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Would trigger actual download here
    }, 2000);
  };

  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="section-title text-3xl">Reports & Exports</h1>
        <p className="section-subtitle">
          Generate comprehensive reports and export voter data in multiple formats
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Report Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 stat-card"
        >
          <h3 className="section-title">Select Report Type</h3>
          <p className="section-subtitle">Choose the type of report you want to generate</p>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {reportTypes.map((report, index) => (
              <motion.button
                key={report.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                onClick={() => setSelectedReport(report.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  selectedReport === report.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedReport === report.id ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    <report.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{report.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                  </div>
                  {selectedReport === report.id && (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Report Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stat-card"
        >
          <h3 className="section-title">Configuration</h3>
          <p className="section-subtitle">Customize your report</p>
          
          <div className="space-y-6">
            {/* Province Filter */}
            {(selectedReport === "province" || selectedReport === "district") && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Province</label>
                <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose province" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map((p) => (
                      <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Export Format */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <div className="grid grid-cols-3 gap-2">
                {exportFormats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      selectedFormat === format.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <format.icon className="h-5 w-5 mx-auto mb-1" />
                    <span className="text-xs font-medium">{format.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            {selectedFormat === "pdf" && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Options</label>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="charts" 
                    checked={includeCharts}
                    onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
                  />
                  <label htmlFor="charts" className="text-sm">
                    Include charts & visualizations
                  </label>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <Button 
              className="w-full gap-2" 
              size="lg"
              disabled={!selectedReport || isGenerating}
              onClick={handleGenerate}
            >
              <Download className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats for Report */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 stat-card"
      >
        <h3 className="section-title">Report Preview</h3>
        <p className="section-subtitle">Summary of data to be included</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Records</p>
            <p className="text-2xl font-bold mt-1">{overviewStats.totalVoters2079.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Provinces</p>
            <p className="text-2xl font-bold mt-1">7</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Districts</p>
            <p className="text-2xl font-bold mt-1">77</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Local Levels</p>
            <p className="text-2xl font-bold mt-1">{overviewStats.localLevels}</p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg border border-border bg-card">
          <h4 className="font-semibold mb-3">Report Contents</h4>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Executive summary with key findings
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Province-wise voter distribution
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Gender ratio analysis
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Age group demographics
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Growth comparison (2074 vs 2079)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              Constituency-wise results
            </li>
          </ul>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default ReportsPage;
