import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface RegionComparisonTableProps {
  data: Array<{
    region_name: string;
    total_voters: number;
    male_voters: number;
    female_voters: number;
    average_age: number;
    gender_ratio: string;
    male_percentage: string;
    female_percentage: string;
    [key: string]: any;
  }>;
  title: string;
  description?: string;
  delay?: number;
}

export function RegionComparisonTable({ 
  data, 
  title, 
  description = "Side-by-side comparison of regional statistics",
  delay = 0 
}: RegionComparisonTableProps) {
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="stat-card">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">Total Voters</TableHead>
                  <TableHead className="text-right">Male</TableHead>
                  <TableHead className="text-right">Female</TableHead>
                  <TableHead className="text-right">Avg Age</TableHead>
                  <TableHead className="text-right">Gender Ratio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {row.region_name}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">
                        {row.total_voters.toLocaleString()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-semibold">{row.male_voters.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">
                          {row.male_percentage}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-semibold">{row.female_voters.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground">
                          {row.female_percentage}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">
                        {row.average_age} years
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {row.gender_ratio}:1
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
