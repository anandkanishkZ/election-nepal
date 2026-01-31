# 🧪 Hierarchical Hover System - Testing Guide

## Quick Test Checklist

### ✅ Pre-Testing Setup
- [ ] Backend server running on `http://localhost:5000`
- [ ] Frontend dev server running
- [ ] Browser console open (F12)
- [ ] GeoJSON files present in `/frontend/public/geojson/`

---

## 🎯 Test Scenarios

### **Test 1: Province Level Hover**
**Expected Behavior:**
1. Load the GIS Map page
2. Hover over any province (e.g., Bagmati Pradesh)
3. ✅ Popup appears with:
   - 🏛️ Icon
   - Province name (e.g., "Bagmati Pradesh")
   - Province number (e.g., "Province 3")
   - Action text: "👆 Click to view districts..."
4. ✅ Bottom-left hover info box shows:
   - Province name
   - Province number
   - "Click to explore deeper"
5. ✅ Province highlights with blue border
6. ✅ Fill opacity increases to 70%

**Test Province Names:**
- Province No 1
- Province No 2
- Bagmati Pradesh
- Gandaki Pradesh
- Province No 5
- Karnali Pradesh
- Sudurpashchim Pradesh

---

### **Test 2: District Level Hover**
**Expected Behavior:**
1. Click on Bagmati Pradesh
2. Map zooms to show Bagmati districts
3. Breadcrumb shows: "Nepal → Bagmati Pradesh → 13 Districts"
4. Hierarchy indicator: ██ (Province filled, District active)
5. Hover over Kathmandu district
6. ✅ Popup appears with:
   - 🏘️ Icon
   - District name: "Kathmandu"
   - Subtitle: "In Bagmati Pradesh"
   - Action: "👆 Click to view municipalities..."
7. ✅ Hover info box shows:
   - "Kathmandu"
   - "Bagmati Pradesh"
   - "Click to explore deeper"
8. ✅ District highlights with blue border

**Test Districts in Bagmati:**
- Kathmandu
- Lalitpur
- Bhaktapur
- Chitwan
- Dhading
- (+ 8 more)

---

### **Test 3: Municipality Level Hover**
**Expected Behavior:**
1. Click on Kathmandu district
2. Map zooms to show Kathmandu municipalities
3. Breadcrumb: "Nepal → Bagmati Pradesh → Kathmandu → 11 Municipalities"
4. Hierarchy indicator: ██ (All three filled)
5. Hover over "Kathmandu Metropolitan City"
6. ✅ Popup appears with:
   - 🏙️ Icon (for Mahanagarpalika)
   - Municipality name: "Kathmandu Metropolitan City"
   - Badge: [Mahanagarpalika]
   - Info: "District: Kathmandu"
   - Action: "ℹ️ Hover to view details"
7. ✅ Hover info box shows:
   - "Kathmandu Metropolitan City"
   - Type badge (colored)
   - District name
   - "Hover to view details"
8. ✅ Municipality colored by type:
   - Red for Mahanagarpalika
   - Purple for Nagarpalika
   - Cyan for Gaunpalika

**Test Municipalities in Kathmandu:**
- Kathmandu (Mahanagarpalika) → 🔴 Red
- Kirtipur (Nagarpalika) → 🟣 Purple
- Budhanilkantha (Nagarpalika) → 🟣 Purple
- Tokha (Nagarpalika) → 🟣 Purple
- Tarakeshwar (Nagarpalika) → 🟣 Purple
- (+ 6 more Gaunapalika) → 🔵 Cyan

---

### **Test 4: Navigation Controls**
**Expected Behavior:**
1. ✅ Home button returns to Province view
2. ✅ Back button:
   - From Municipality → District
   - From District → Province
   - Disabled at Province level
3. ✅ Breadcrumb updates correctly at each level
4. ✅ Hierarchy indicator fills progressively
5. ✅ Map zooms smoothly with each transition

---

### **Test 5: Hover Info Box**
**Location:** Bottom-left corner of map

**At Province Level:**
```
┌──────────────────────────────────┐
│ 📍  Bagmati Pradesh              │
│ Province 3                        │
│ 👆 Click to explore deeper       │
└──────────────────────────────────┘
```

**At District Level:**
```
┌──────────────────────────────────┐
│ 📍  Kathmandu                    │
│ Bagmati Pradesh                   │
│ 👆 Click to explore deeper       │
└──────────────────────────────────┘
```

**At Municipality Level:**
```
┌──────────────────────────────────┐
│ 📍  Kathmandu Metropolitan City  │
│ [Mahanagarpalika]                │
│ District: Kathmandu              │
│ ℹ️ Hover to view details         │
└──────────────────────────────────┘
```

---

### **Test 6: Map Popups**
**Expected Behavior:**
1. ✅ Popup appears instantly on hover (no delay)
2. ✅ Popup closes when mouse leaves feature
3. ✅ Popup positioned above feature
4. ✅ Popup has custom styling:
   - Rounded corners (12px)
   - Shadow
   - White background
   - Border with primary color
5. ✅ Popup content is formatted properly
6. ✅ Icons display correctly (emoji support)

---

### **Test 7: Visual Styling**
**Expected at Each Level:**

| Level | Base Color | Hover Color | Border Color |
|-------|-----------|-------------|--------------|
| Province | 🟢 Green (#10b981) | 🔵 Light Blue | 🔵 Navy Blue |
| District | 🟠 Orange (#f59e0b) | 🔵 Light Blue | 🔵 Navy Blue |
| Mahanagarpalika | 🔴 Red (#dc2626) | 🔵 Light Blue | 🔵 Navy Blue |
| Nagarpalika | 🟣 Purple (#8b5cf6) | 🔵 Light Blue | 🔵 Navy Blue |
| Gaunpalika | 🔵 Cyan (#06b6d4) | 🔵 Light Blue | 🔵 Navy Blue |

**Opacity Tests:**
- Default: 50%
- Hover: 70%
- Selected: 70% (blue fill)

---

### **Test 8: Control Panel Updates**
**Expected Updates:**

1. **Navigation Tips Section:**
   - Province level: "Hover over any province..."
   - District level: "Hover to see district names..."
   - Municipality level: "Hover to see municipality details..."

2. **Current Level Indicator:**
   - Shows active level name
   - Displays feature count
   - Updates on navigation

3. **Hierarchy Progress Bar:**
   ```
   Province   District   Municipal
   ████████   ████████   ░░░░░░░░   (at District level)
   ```

4. **Feature List:**
   - Shows filtered features
   - Highlights selected feature
   - Scrollable if > 100 items

5. **Legend:**
   - Updates based on current level
   - Shows relevant colors
   - Includes "Hovered/Selected" state

---

### **Test 9: Edge Cases**
**Test These Scenarios:**

1. ✅ Hover rapidly between features
   - No lag or flickering
   - Smooth transitions

2. ✅ Click while hovering
   - Transition to next level works
   - No duplicate popups

3. ✅ Hover on small features
   - Popup doesn't block feature
   - Hover area is accurate

4. ✅ Navigate back while hovering
   - Hover state resets properly
   - No orphaned popups

5. ✅ Zoom in/out while hovering
   - Hover still works
   - Popup repositions correctly

6. ✅ Resize browser window
   - Responsive layout maintained
   - Hover box stays visible

---

### **Test 10: Performance**
**Metrics to Check:**

1. ✅ Hover response time: < 50ms
   - Use browser DevTools Performance tab
   - Record hover interaction
   - Check frame rate

2. ✅ Memory usage stays stable
   - Check Task Manager
   - Should not exceed 200MB

3. ✅ No console errors
   - Check for warnings
   - Verify all assets load

4. ✅ Smooth animations
   - 60fps target
   - No stuttering

---

## 🐛 Common Issues & Solutions

### Issue 1: Popup Not Showing
**Symptoms:** Hover doesn't display popup
**Solutions:**
- Check `bindPopup` is called in `onEachFeature`
- Verify popup CSS is loaded
- Check console for errors
- Ensure GeoJSON has valid properties

### Issue 2: Wrong Feature Name
**Symptoms:** Incorrect name displayed
**Solutions:**
- Check property names match GeoJSON
- Verify filtering logic for current level
- Check `selectedProvince` and `selectedDistrict` state

### Issue 3: Hover Box Not Updating
**Symptoms:** Bottom-left box shows old data
**Solutions:**
- Check `hoveredFeature` state updates
- Verify `AnimatePresence` is working
- Check component re-render logic

### Issue 4: Colors Not Correct
**Symptoms:** Wrong colors for municipality types
**Solutions:**
- Check `getColor` function logic
- Verify TYPE property in GeoJSON
- Check CSS color definitions

### Issue 5: Navigation Doesn't Work
**Symptoms:** Clicking doesn't navigate to next level
**Solutions:**
- Check click handlers are attached
- Verify state updates (`setViewLevel`)
- Check filtering logic
- Ensure GeoJSON files exist

---

## 📊 Test Results Template

```
Test Date: _________________
Tester: ____________________
Browser: ___________________

✅ Province Hover       [ PASS / FAIL ]
✅ District Hover       [ PASS / FAIL ]
✅ Municipality Hover   [ PASS / FAIL ]
✅ Navigation Controls  [ PASS / FAIL ]
✅ Hover Info Box      [ PASS / FAIL ]
✅ Map Popups          [ PASS / FAIL ]
✅ Visual Styling      [ PASS / FAIL ]
✅ Control Panel       [ PASS / FAIL ]
✅ Edge Cases          [ PASS / FAIL ]
✅ Performance         [ PASS / FAIL ]

Notes:
_____________________________________________
_____________________________________________
_____________________________________________

Overall Status: [ PASS / FAIL ]
```

---

## 🚀 Quick Test Commands

### Start Backend
```bash
cd backend
npm start
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Check GeoJSON Files
```bash
ls frontend/public/geojson/
# Should show:
# nepal-provinces.geojson
# nepal-districts.geojson
# nepal-municipalities.geojson
```

### Open Browser
```
http://localhost:5173
Navigate to: GIS Map page
```

---

## ✅ Sign-Off Checklist

**Before Deployment:**
- [ ] All 10 test scenarios pass
- [ ] No console errors
- [ ] Performance metrics met
- [ ] Cross-browser tested (Chrome, Firefox, Edge)
- [ ] Mobile responsive verified
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Git commit with descriptive message

**Browsers to Test:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (if available)

**Devices to Test:**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## 📞 Reporting Issues

If you find any issues:

1. Note the exact steps to reproduce
2. Take a screenshot
3. Check browser console for errors
4. Note browser version and OS
5. Document expected vs actual behavior

**Issue Template:**
```
Title: [Brief description]

Steps to Reproduce:
1. ...
2. ...
3. ...

Expected: ...
Actual: ...

Browser: ...
OS: ...
Console Errors: ...
```

---

**Last Updated:** January 20, 2026  
**Version:** 2.0.0  
**Status:** Ready for Testing ✅
