import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { AwesomeHierarchicalMap } from "@/components/map/AwesomeHierarchicalMap";

const GISMapPage = () => {
  return (
    <MainLayout>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="section-title text-3xl">🗺️ GIS Map System</h1>
        <p className="section-subtitle">
          Interactive hierarchical navigation: 
          <span className="text-primary font-semibold"> 7 Provinces → 77 Districts → 776 Municipalities</span>
        </p>
      </motion.div>

      <AwesomeHierarchicalMap />
    </MainLayout>
  );
};

export default GISMapPage;
