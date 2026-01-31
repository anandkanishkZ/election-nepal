import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { provinceVoterData } from "@/data/mockData";

// Nepal province coordinates (approximate centers)
const provinceCoordinates: Record<string, [number, number]> = {
  "Koshi": [27.0, 87.3],
  "Madhesh": [26.8, 85.9],
  "Bagmati": [27.7, 85.4],
  "Gandaki": [28.3, 84.1],
  "Lumbini": [27.9, 82.8],
  "Karnali": [29.3, 82.2],
  "Sudurpashchim": [29.3, 80.5],
};

export function NepalMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on Nepal
    const map = L.map(mapRef.current, {
      center: [28.3949, 84.1240],
      zoom: 7,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    // Add province markers
    provinceVoterData.forEach((province) => {
      const coords = provinceCoordinates[province.province];
      if (coords) {
        // Create a custom circle marker sized by voter count
        const radius = Math.sqrt(province.voters2079 / 100000) * 3;
        
        const circle = L.circleMarker(coords, {
          radius: radius,
          fillColor: province.color,
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7,
        }).addTo(map);

        // Add popup
        circle.bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-base mb-2">${province.province} Province</h3>
            <div class="space-y-1 text-sm">
              <p><strong>Total Voters:</strong> ${province.voters2079.toLocaleString()}</p>
              <p><strong>Male:</strong> ${province.male.toLocaleString()}</p>
              <p><strong>Female:</strong> ${province.female.toLocaleString()}</p>
              <p><strong>Growth:</strong> <span style="color: green;">+${province.growth}%</span></p>
            </div>
          </div>
        `, { className: "nepal-popup" });

        // Add label
        L.marker(coords, {
          icon: L.divIcon({
            className: "province-label",
            html: `<div style="background: ${province.color}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${province.province}</div>`,
            iconSize: [80, 20],
            iconAnchor: [40, 30],
          }),
        }).addTo(map);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const selectedData = selectedProvince 
    ? provinceVoterData.find((p) => p.province === selectedProvince) 
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="stat-card overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1">
          <h3 className="section-title">Nepal Election Map</h3>
          <p className="section-subtitle mb-0">Click on provinces to view details</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {provinceVoterData.map((p) => (
            <button
              key={p.province}
              onClick={() => setSelectedProvince(p.province === selectedProvince ? null : p.province)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedProvince === p.province
                  ? "text-white shadow-md"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
              style={selectedProvince === p.province ? { backgroundColor: p.color } : {}}
            >
              {p.province}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div ref={mapRef} className="h-[400px] lg:h-[500px] rounded-xl" />
        
        {selectedData && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 right-4 glass-panel p-4 max-w-xs"
          >
            <h4 className="font-bold text-lg mb-3" style={{ color: selectedData.color }}>
              {selectedData.province} Province
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Voters</span>
                <span className="font-semibold">{selectedData.voters2079.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Male</span>
                <span className="font-semibold">{selectedData.male.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Female</span>
                <span className="font-semibold">{selectedData.female.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="text-muted-foreground">Growth</span>
                <span className="growth-positive">+{selectedData.growth}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
