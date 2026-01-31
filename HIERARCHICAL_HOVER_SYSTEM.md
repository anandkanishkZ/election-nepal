# 🗺️ Hierarchical Hover System - Documentation

## Overview
The GIS Map implements an intelligent **3-tier hierarchical hover system** that dynamically displays contextual information based on the current navigation level.

---

## 🎯 System Architecture

### Three Hierarchical Levels

#### 1️⃣ **Province Level** (Root Level)
- **View**: Shows all 7 provinces of Nepal
- **Hover Behavior**: 
  - Displays province name (e.g., "Bagmati Pradesh")
  - Shows province number
  - Icon: 🏛️ Government building
  - Action hint: "Click to view districts in this province"
- **Visual**: Green color scheme (#10b981)

#### 2️⃣ **District Level** (Mid Level)
- **View**: Shows districts within selected province
- **Hover Behavior**:
  - Displays district name (e.g., "Kathmandu")
  - Shows parent province information
  - Icon: 🏘️ Cityscape
  - Action hint: "Click to view municipalities in this district"
- **Visual**: Orange color scheme (#f59e0b)
- **Navigation**: Filtered to show only districts in the selected province

#### 3️⃣ **Municipality Level** (Leaf Level)
- **View**: Shows municipalities within selected district
- **Hover Behavior**:
  - Displays municipality name (e.g., "Kathmandu Metropolitan City")
  - Shows municipality type badge
  - Shows parent district information
  - Type-specific icons:
    - 🏙️ Mahanagarpalika (Metropolitan)
    - 🏘️ Nagarpalika (Urban Municipality)
    - 🏞️ Gaunpalika (Rural Municipality)
  - Info hint: "Hover to view details"
- **Visual**: Color-coded by type:
  - Red (#dc2626): Metropolitan
  - Purple (#8b5cf6): Urban
  - Cyan (#06b6d4): Rural

---

## 💡 Key Features

### 1. **Context-Aware Tooltips**
```typescript
// Province Level
Tooltip: "🏛️ Bagmati Pradesh"
Subtext: "Province 3"
Action: "👆 Click to view districts in this province"

// District Level (when province selected)
Tooltip: "🏘️ Kathmandu"
Subtext: "In Bagmati Pradesh"
Action: "👆 Click to view municipalities in this district"

// Municipality Level (when district selected)
Tooltip: "🏙️ Kathmandu Metropolitan City"
Subtext: "Mahanagarpalika"
Info: "District: Kathmandu"
Action: "ℹ️ Hover to view details"
```

### 2. **Dynamic Hover Info Box**
Located at **bottom-left** of the map, displays:
- Feature name with appropriate icon
- Hierarchical context
- Type badge (for municipalities)
- Interactive hints

### 3. **Enhanced Map Popups**
- Auto-open on hover at all levels
- Rich styling with icons and colors
- Contextual information based on level
- Professional design with shadows and borders

### 4. **Visual Hierarchy Indicator**
Progress bar in control panel shows:
- Current level (highlighted in primary color)
- Completed levels (filled)
- Future levels (gray)

---

## 🔄 Navigation Flow

```
Nepal (Country)
    ↓ (Hover shows provinces)
7 Provinces
    ↓ (Click province → Hover shows districts)
77 Districts
    ↓ (Click district → Hover shows municipalities)
776 Municipalities
```

### Navigation Controls
- **Home Button**: Return to province view
- **Back Button**: Go up one level
- **Breadcrumb**: Shows current path (e.g., "Nepal → Bagmati Pradesh → 13 Districts")

---

## 🎨 Visual Design System

### Color Coding by Level
| Level | Color | Hex | Purpose |
|-------|-------|-----|---------|
| Province | Green | #10b981 | Root administrative level |
| District | Orange | #f59e0b | Mid-level administrative division |
| Metro Municipality | Red | #dc2626 | Metropolitan cities |
| Urban Municipality | Purple | #8b5cf6 | Urban municipalities |
| Rural Municipality | Cyan | #06b6d4 | Rural municipalities |
| Selected/Hovered | Blue | #3b82f6 | User interaction |

### Interactive States
1. **Default**: Base color with 50% opacity
2. **Hover**: Same color, 60% opacity, blue border
3. **Selected**: Blue fill, 70% opacity, thick border
4. **Clicked**: Smooth transition to next level

---

## 🛠️ Technical Implementation

### Key Components

#### 1. **State Management**
```typescript
const [viewLevel, setViewLevel] = useState<ViewLevel>('provinces');
const [hoveredFeature, setHoveredFeature] = useState<GeoJSONFeature | null>(null);
const [selectedProvince, setSelectedProvince] = useState<GeoJSONFeature | null>(null);
const [selectedDistrict, setSelectedDistrict] = useState<GeoJSONFeature | null>(null);
```

#### 2. **Dynamic Data Filtering**
- Provinces: Load all 7 provinces
- Districts: Filter by `selectedProvince.PROVINCE`
- Municipalities: Filter by `selectedDistrict.DISTRICT`

#### 3. **Event Handlers**
```typescript
layer.on({
  mouseover: (e) => {
    setHoveredFeature(feature);
    layer.setStyle({ weight: 3, fillOpacity: 0.7 });
    layer.openPopup(); // Auto-open at all levels
  },
  mouseout: (e) => {
    setHoveredFeature(null);
    layer.setStyle(styleFeature(feature));
    layer.closePopup();
  },
  click: (e) => {
    // Navigate to next level if applicable
  }
});
```

#### 4. **Popup Generation**
```typescript
// Dynamic popup based on hierarchy level
const icon = viewLevel === 'provinces' ? '🏛️' : 
             viewLevel === 'districts' ? '🏘️' : 
             getTypeIcon(props.TYPE);

layer.bindPopup(`
  <div class="p-4 min-w-[220px]">
    <div class="flex items-start gap-3">
      <span class="text-2xl">${icon}</span>
      <div>
        <div class="font-bold">${name}</div>
        <div class="text-sm">${subtext}</div>
      </div>
    </div>
    <div class="text-xs">${extra}</div>
  </div>
`, { className: 'custom-popup' });
```

---

## 📊 Data Structure

### GeoJSON Feature Properties

#### Province Level
```json
{
  "PR_NAME": "Bagmati Pradesh",
  "PROVINCE": 3,
  "OBJECTID": 3
}
```

#### District Level
```json
{
  "DISTRICT": "Kathmandu",
  "PR_NAME": "Bagmati Pradesh",
  "PROVINCE": 3,
  "OBJECTID": 25
}
```

#### Municipality Level
```json
{
  "LOCAL": "Kathmandu Metropolitan City",
  "DISTRICT": "Kathmandu",
  "TYPE": "Mahanagarpalika",
  "OBJECTID": 123
}
```

---

## 🎯 User Experience Goals

### 1. **Intuitive Navigation**
- Clear visual feedback on hover
- Obvious action prompts
- Consistent interaction patterns

### 2. **Contextual Information**
- Show relevant data for current level
- Maintain parent context
- Progressive disclosure

### 3. **Visual Hierarchy**
- Color-coded levels
- Icon system for quick recognition
- Size and weight variations

### 4. **Performance**
- Instant hover response
- Smooth transitions
- Efficient data filtering

---

## 🚀 Advanced Features

### 1. **Smart Bounds Adjustment**
- Automatically zooms to fit selected region
- Smooth animation between levels
- Maintains appropriate padding

### 2. **Type-Based Styling**
- Different colors for municipality types
- Visual distinction in legend
- Consistent with Nepali administrative structure

### 3. **Accessibility**
- High contrast colors
- Clear text hierarchy
- Interactive keyboard navigation (future)

### 4. **Responsive Design**
- Adapts to different screen sizes
- Touch-friendly on mobile
- Optimized for tablets

---

## 📈 Statistics Display

Each level shows relevant statistics:

### Province Level
- Total voters across all provinces
- Gender distribution
- 7 provinces overview

### District Level
- Voters in selected province
- Number of districts shown
- District-level statistics

### Municipality Level
- Municipality type distribution
- Ward-level details (future)
- Local voter statistics

---

## 🔧 Configuration

### File Locations
```
/frontend/src/components/map/AwesomeHierarchicalMap.tsx
/frontend/src/index.css (Leaflet overrides)
/frontend/public/geojson/
  ├── nepal-provinces.geojson
  ├── nepal-districts.geojson
  └── nepal-municipalities.geojson
```

### Customization Options
```typescript
// Hover delay
const HOVER_DELAY = 0; // milliseconds

// Popup offset
offset: [0, -10]

// Style weights
weight: isHovered ? 3 : 2

// Fill opacity
fillOpacity: isHovered ? 0.7 : 0.5
```

---

## 🐛 Debugging Tips

### Common Issues

1. **Popup not showing**
   - Check if `bindPopup` is called in `onEachFeature`
   - Verify popup CSS classes

2. **Wrong data displayed**
   - Verify property names match GeoJSON structure
   - Check filtering logic

3. **Performance issues**
   - Limit number of features rendered
   - Use React.memo for expensive components
   - Debounce hover events if needed

---

## 📝 Future Enhancements

### Planned Features
1. ✅ Hierarchical hover system (COMPLETED)
2. ⏳ Ward-level navigation (4th tier)
3. ⏳ Search and highlight functionality
4. ⏳ Export selected region
5. ⏳ Comparison mode (side-by-side)
6. ⏳ Heat map overlay options
7. ⏳ Time-series animation
8. ⏳ Custom boundary drawing

---

## 👥 For Developers

### Adding a New Level

To add another hierarchical level (e.g., wards):

1. **Update Type Definition**
```typescript
type ViewLevel = 'provinces' | 'districts' | 'municipalities' | 'wards';
```

2. **Add GeoJSON File**
```typescript
const GEOJSON_FILES = {
  // ... existing
  wards: '/geojson/nepal-wards.geojson',
};
```

3. **Add State**
```typescript
const [selectedMunicipality, setSelectedMunicipality] = useState<GeoJSONFeature | null>(null);
```

4. **Update Hover Logic**
```typescript
if (viewLevel === 'wards') {
  name = props.WARD_NO || 'Ward';
  // ... additional logic
}
```

5. **Add Click Handler**
```typescript
const handleMunicipalityClick = useCallback((feature: GeoJSONFeature) => {
  setSelectedMunicipality(feature);
  setViewLevel('wards');
}, []);
```

---

## 📚 Resources

### Nepal Administrative Structure
- 7 Provinces (Pradesh)
- 77 Districts (Jilla)
- 753 Local Units:
  - 6 Mahanagarpalika (Metropolitan)
  - 11 Upamahanagarpalika (Sub-metropolitan)
  - 276 Nagarpalika (Municipality)
  - 460 Gaunpalika (Rural Municipality)

### Related Documentation
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

---

## ✅ Testing Checklist

- [ ] Hover on province shows province name
- [ ] Click province navigates to districts
- [ ] Hover on district shows district name and parent province
- [ ] Click district navigates to municipalities
- [ ] Hover on municipality shows full details with type
- [ ] Back button returns to previous level
- [ ] Home button returns to province view
- [ ] Breadcrumb updates correctly
- [ ] Hover info box displays contextual information
- [ ] Map popups auto-open on hover
- [ ] Visual hierarchy indicator updates
- [ ] Color coding is consistent
- [ ] Performance is smooth with no lag

---

## 🎓 Learning Points

### Key Concepts Demonstrated
1. **Hierarchical Data Visualization**
2. **State Management for Navigation**
3. **Dynamic UI Based on Context**
4. **GeoJSON Processing and Filtering**
5. **Leaflet.js Advanced Integration**
6. **React Component Optimization**
7. **Framer Motion Animations**
8. **Responsive Map Design**

---

## 📞 Support

For issues or questions:
1. Check the [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
2. Review console logs for errors
3. Verify GeoJSON data integrity
4. Test in different browsers

---

**Last Updated**: January 20, 2026  
**Version**: 2.0.0  
**Status**: ✅ Production Ready
