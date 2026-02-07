# VIDEO DEMONSTRATION SCRIPT
## Cheshire vs Cumberland Property Investment Analysis
## Data Science for Developers - Assessment Submission

**Duration**: 8-12 minutes  
**Deadline**: February 7th, 2026  
**Requirements**: Screen recording + Voice-over + Face visible (webcam)  
**Tools**: OBS Studio (recommended) or any screen recorder with webcam overlay

---

## ⚠️ CRITICAL REMINDERS BEFORE RECORDING

✅ **Test your setup first** - Record 30 seconds to check audio, video, webcam placement  
✅ **Close unnecessary apps** - Avoid notifications, email popups during recording  
✅ **Check lighting** - Face should be clearly visible, avoid backlighting  
✅ **Prepare files** - Have all scripts, outputs, and visualizations ready to show  
✅ **Practice once** - Run through the script to ensure smooth flow (5-10 min practice)  
✅ **Upload as Unlisted/Public** - Make sure YouTube visibility is NOT set to Private  

---

## 🎬 VIDEO STRUCTURE (Section-by-Section)

### **SECTION 1: INTRODUCTION (1-1.5 minutes)**

**[Webcam prominent + Blank screen or title slide]**

#### Script:
"Hello! My name is [YOUR NAME], roll number [YOUR ROLL], from [COURSE NAME]. Today I'll demonstrate my Data Science for Developers project: a comprehensive property investment analysis comparing Cheshire and Cumberland counties in England.

This project addresses a real-world problem: helping investors make evidence-based property decisions using data science instead of guesswork. I'll show you how I collected 606 megabytes of public sector data, cleaned it, stored it in a normalized database, performed statistical analysis, and built a recommendation system that ranks 49 towns.

The key finding? Cumberland offers superior investment value with properties costing 58% less than Cheshire while maintaining 49% lower crime rates. Let me walk you through the entire methodology."

**[Show PROJECT_INTRODUCTION.md file or README.md on screen while speaking]**

---

### **SECTION 2: PROJECT STRUCTURE & DATA PIPELINE (1.5-2 minutes)**

**[Screen: Show folder structure in File Explorer]**

#### Script:
"Let me show you the project organization. I've structured this following industry best practices with separate folders for raw data, cleaned data, database, R scripts, and outputs.

**[Navigate to data/raw folder]**
Starting with data collection, I gathered five datasets totaling 606 megabytes:
1. House prices from HM Land Registry - 43,758 transactions
2. Crime data from Cheshire and Cumbria police forces - 765,000 incidents
3. Broadband speeds from Ofcom - 900,000 records
4. Population data from ONS
5. Postcode lookup tables for geographic linking

**[Show data/cleaned folder]**
After rigorous cleaning, I processed these down to 488,000 clean records, removing duplicates, handling missing values, and filtering for relevance.

**[Show data/property_investment.db file]**
Everything was then integrated into a 228-megabyte SQLite database designed in Third Normal Form for data integrity."

**[Open RStudio or show scripts folder]**

"The analysis pipeline consists of 11 numbered R scripts that run sequentially:
- Script 01: Automated data collection
- Script 02: Data cleaning with validation
- Script 03: Database schema creation
- Scripts 04-08: Exploratory analysis and statistical testing
- Script 09: The recommendation system algorithm
- Scripts 10-11: Visualization generation and reporting"

---

### **SECTION 3: DATABASE DEMONSTRATION (1-1.5 minutes)**

**[Screen: Open DB Browser for SQLite OR RStudio with database connection]**

#### Script:
"Let me demonstrate the database structure. 

**[Show Tables list]**
I've created seven normalized tables:
- Towns table with 100 towns and LAD codes
- House_prices with 43,758 property transactions
- Crime_stats with 907,000 crime records
- Broadband_speed with infrastructure measurements
- Population by Local Authority District
- Postcode_lookup for geographic mapping
- OA_LAD_mapping for hierarchical joins

**[Run a simple query, e.g., SELECT * FROM towns LIMIT 10]**
This Third Normal Form design eliminates redundancy. For example, each house price record links to a town via town_id foreign key, rather than duplicating town names thousands of times.

**[Run aggregation query]**
Here's a query showing county-level aggregation:
SELECT lad_name AS County, COUNT(*) AS Transactions, AVG(price) AS Avg_Price 
FROM house_prices h JOIN towns t ON h.town_id = t.town_id 
GROUP BY lad_name;

This shows Cheshire's average of £346,226 versus Cumberland's £218,900 - the foundation of my analysis."

---

### **SECTION 4: KEY VISUALIZATIONS (2-2.5 minutes)**

**[Screen: Navigate to outputs/figures/ folder]**

#### Script:
"I generated 16 publication-quality visualizations at 300 DPI resolution. Let me highlight the most critical ones.

**[Open 01_house_price_boxplot_2024.png]**
Figure 1: This boxplot immediately reveals the price disparity. Cheshire has a median of £285,000 with extensive outliers above £1 million, while Cumberland clusters tightly around £185,000. This compressed distribution indicates a more affordable, uniform market.

**[Open 02_house_price_barchart_2024.png]**
Figure 2: The bar chart quantifies this - Cheshire averages £346,226, Cumberland £218,900. That's a £127,000 difference, or 58% premium for Cheshire.

**[Open 03_house_price_trend_2024.png]**
Figure 3: Monthly trends throughout 2024 show parallel lines - no convergence. This persistent gap indicates structural, not transient, market differences.

**[Open 06_crime_by_lad.png]**
Figure 6: Crime analysis reveals Cumberland's safety advantage: 414.9 crimes per 1,000 residents versus Cheshire's 817.9. That's nearly half the crime rate.

**[Open 11_top_10_towns_ranking.png - MOST IMPORTANT]**
Figure 11: THIS is the primary deliverable - the top 10 investment recommendations. Moor Row, Cumberland scores 8.00 out of 10, followed by Cleator and Egremont. Notice Cumberland towns in orange dominate 8 of the top 10 positions.

**[Open 12_score_distribution.png]**
Figure 12: This histogram confirms Cumberland's systematic advantage - towns cluster at 7-8/10, while Cheshire centers at 5-7/10.

**[Open 14_price_vs_broadband.png and 15_price_vs_drug_crime.png briefly]**
I also conducted regression analysis exploring relationships between prices and broadband speeds, and prices and crime rates. Interestingly, Cheshire showed a counterintuitive positive correlation between drug crimes and prices - likely due to urban confounding where affluent cities like Chester have both high crime and high prices."

---

### **SECTION 5: STATISTICAL ANALYSIS DEMONSTRATION (2 minutes)**

**[Screen: Open RStudio with script 08_complete_statistical_analysis.R]**

#### Script:
"Now let me show the statistical rigor behind these findings.

**[Scroll to Welch's t-test section]**
For house prices, I conducted a Welch's two-sample t-test comparing Cheshire (n=13,136 transactions) versus Cumberland (n=5,087 transactions).

**[Run the t-test code or show saved output]**
Results:
- t-statistic: 22.95
- p-value: 9.58 × 10^-114 (essentially zero)
- This means p < 0.001 - highly statistically significant

**[Show confidence interval]**
The 95% confidence interval confirms the true price difference lies between £116,000 and £138,000. We can be 95% certain Cumberland is cheaper by at least £116K.

**[Show Cohen's d calculation]**
Effect size using Cohen's d: 0.362. While statistically 'small' by convention, the absolute £127K difference has enormous practical importance for investors.

**[Show crime comparison output]**
For crime rates, Cumberland shows 414.9 per 1,000 residents versus Cheshire's 817.9 - that's 49.4% lower in Cumberland. Due to Cumberland's single LAD structure, formal t-testing wasn't applicable, but the per-capita normalized comparison is valid.

**[Briefly show linear regression output]**
I also fitted linear regression models exploring price vs. broadband speed and price vs. drug crime rates, with R-squared values and significance testing."

---

### **SECTION 6: RECOMMENDATION SYSTEM ALGORITHM (2 minutes)**

**[Screen: Open script 09_recommendation_system.R]**

#### Script:
"The core of this project is the recommendation system that transforms statistical findings into actionable rankings.

**[Scroll to scoring formula section around line 150-200]**
The algorithm uses a weighted composite score formula:
Composite Score = (Price × 40%) + (Crime × 30%) + (Broadband × 20%) + (Population × 10%)

**[Explain normalization]**
Each factor is normalized to a 0-10 scale using min-max scaling. Lower prices get higher scores - inversely scaled for affordability. Lower crime rates get higher scores for safety. Higher broadband speeds get higher scores. And moderate population (~25,000) gets optimal scores for market depth without congestion.

**[Scroll to dynamic weight redistribution section]**
Here's a critical innovation: I implemented dynamic weight redistribution for missing data. Since 93.9% of towns lack broadband measurements, when broadband is missing, its 20% weight redistributes proportionally:
- Price: 40% → 50%
- Crime: 30% → 37.5%
- Population: 10% → 12.5%

This approach is more honest than imputing values or excluding towns entirely.

**[Show calculation for a specific town, like Moor Row]**
For Moor Row:
- Price: £132,618 (cheapest) → 10.00 score
- Crime: 277.5 per 1000 (lowest) → 10.00 score
- Broadband: Missing → 5.00 default (neutral)
- Population: Low → 0 score (small town)
- Composite: (10×0.4) + (10×0.3) + (5×0.2) + (0×0.1) = 8.00/10

**[Show top_recommendations.csv output]**
The final output ranks all 49 towns. Cumberland's top 5 all score above 7.9, with entry prices from £132K to £166K."

---

### **SECTION 7: CRITICAL ANALYSIS & LIMITATIONS (1.5 minutes)**

**[Screen: Open PROJECT_LIMITATIONS.md]**

#### Script:
"A critical part of data science is acknowledging limitations transparently.

**[Scroll through limitation sections]**

**Major Limitation 1: Broadband Data Gaps**
Only 3 of 49 towns have broadband data - 93.9% missing. This prevents comprehensive connectivity analysis. I addressed this through dynamic weight redistribution rather than hiding the problem.

**Limitation 2: Transaction Volume Variability**
Some Cumberland towns have small samples: Moor Row and Frizington only 17 transactions each. This creates potential price volatility versus Ellesmere Port's 992 transactions. Investors should be cautious with low-liquidity towns.

**Limitation 3: Temporal Scope**
This is a 2024 cross-sectional snapshot. I cannot predict future appreciation or market trends. Cumberland might be undervalued now, but will it appreciate? Unknown.

**Limitation 4: Excluded Factors**
The model doesn't include school quality, employment rates, healthcare access, or transport links - all important for real investment decisions. These would require additional data sources.

**Limitation 5: Confounding Variables**
The regression analysis showed counterintuitive results (crime positively correlated with prices in Cheshire) due to urbanization confounding. Wealthier cities have both crime and high prices - not a causal relationship.

**[Show sensitivity analysis section]**
Despite these limitations, sensitivity testing confirms Cumberland dominance persists even when weights vary substantially. The core finding is robust."

---

### **SECTION 8: PRACTICAL IMPLICATIONS & RECOMMENDATIONS (1 minute)**

**[Screen: Show conclusion section of PROJECT_INTRODUCTION.md]**

#### Script:
"So what should investors actually do with these findings?

**For Value Investors:**
Prioritize Cumberland's top 5 towns - Moor Row, Cleator, Egremont, Frizington, Cleator Moor. Entry prices between £132K-£166K offer portfolio building opportunities and long-term rental income potential. Be aware of liquidity constraints in smaller towns.

**For Balanced Investors:**
Consider Winsford (rank 7) or Ellesmere Port (rank 8) in Cheshire. They combine strong composite scores (7.39-7.42) with high transaction volumes (473-992 sales), giving you both value and market liquidity.

**For Safety-Focused Investors:**
Any Cumberland town offers 49% lower crime rates than Cheshire average - 277 crimes per 1,000 residents is exceptionally safe.

**For Policymakers:**
These findings quantify regional inequalities relevant to UK levelling-up strategies. Cumberland's affordability may reflect underlying economic challenges requiring infrastructure investment.

**Final Assessment:**
This project transforms property investment from subjective judgment to quantitative science, providing evidence-based rankings while being transparent about methodological constraints."

---

### **SECTION 9: TECHNICAL SKILLS DEMONSTRATED (1 minute)**

**[Screen: Split screen showing scripts + outputs]**

#### Script:
"Let me summarize the technical skills demonstrated in this project:

**Data Engineering:**
- Collected 606 MB from 5 disparate public datasets
- Designed Third Normal Form database schema
- Implemented foreign key constraints and referential integrity

**Data Cleaning:**
- Processed 3.9 million raw records down to 488K clean records
- Handled missing values through dynamic weight redistribution
- Removed duplicates, outliers, and invalid entries
- Standardized geographic identifiers

**Statistical Analysis:**
- Welch's two-sample t-tests for unequal variances
- Cohen's d effect size calculations
- 95% confidence interval estimation
- Linear regression with R-squared and significance testing

**Programming (R):**
- Tidyverse ecosystem (dplyr, ggplot2)
- RSQLite for database operations
- Automated workflow with 11 sequential scripts
- Custom normalization and scoring functions

**Visualization:**
- 16 publication-quality figures at 300 DPI
- Boxplots, bar charts, scatterplots, line graphs, histograms
- Color-coded by county for instant comprehension

**Reproducibility:**
- Complete documentation (README, guides, limitations)
- Numbered scripts for sequential execution
- Commented code throughout
- Version-controlled outputs

This demonstrates end-to-end data science capability from raw data to actionable recommendations."

---

### **SECTION 10: CONCLUSION & SUBMISSION DETAILS (30 seconds)**

**[Webcam prominent + Final slide or README on screen]**

#### Script:
"To conclude: This project successfully identified Cumberland as the superior value investment destination, with Moor Row ranking #1 at 8.00/10 through exceptional affordability and safety. The methodology demonstrates rigorous data science practices while acknowledging limitations transparently.

All code, data, visualizations, and documentation are organized in this project folder ready for review.

Thank you for watching this demonstration!

My name is [YOUR NAME], roll number [YOUR ROLL], from [COURSE NAME]. This submission replaces the VIVA examination as per the assessment guidelines.

**[Show your face clearly and smile for 2-3 seconds before ending]**

End of recording."

---

## 📋 POST-RECORDING CHECKLIST

### Before uploading to YouTube:
- [ ] Watch entire video once - check audio clarity, webcam visibility
- [ ] Verify all key sections are included (introduction, database, stats, recommendation system)
- [ ] Confirm your face is visible throughout (not just beginning/end)
- [ ] Check video length (8-12 minutes ideal, max 15 minutes)
- [ ] Add title: "[Your Name] - Data Science Project - Property Investment Analysis"

### YouTube Upload Settings:
- [ ] Title: "[Your Name] - Cheshire vs Cumberland Property Investment Analysis - Data Science"
- [ ] Description: "Data Science for Developers project submission. Roll: [YOUR ROLL]. Analysis of property investment opportunities using R, SQLite, statistical testing, and recommendation systems."
- [ ] Visibility: **Public** or **Unlisted** (NOT Private!)
- [ ] Category: Education
- [ ] Tags: data science, R programming, property analysis, statistical analysis, SQLite

### Google Sheet Submission:
- [ ] Open: https://docs.google.com/spreadsheets/d/169zA8JnHfEdOMdRw72pe4D-G18QdgHVVmXAO4VUX7OY/edit?gid=0#gid=0
- [ ] Enter EXACT details:
  - Name: [Your full name as per registration]
  - Roll Number: [Exact roll number]
  - Course: Data Science for Developers
  - YouTube Link: [Paste unlisted/public link]
- [ ] Double-check link works by clicking it in private/incognito window
- [ ] Submit BEFORE deadline: February 7th, 2026 (TODAY!)

---

## 🎥 TECHNICAL TIPS FOR OBS STUDIO RECORDING

### Initial Setup:
1. **Install OBS Studio** (free): https://obsproject.com/
2. **Add Sources:**
   - Display Capture (for screen recording)
   - Video Capture Device (for webcam)
   - Audio Input Capture (for microphone)

### Webcam Overlay Setup:
1. Position webcam in **bottom-right corner** (20% screen size)
2. Right-click webcam source → Transform → Edit Transform
3. Set Position: X=1600, Y=900 (for 1920×1080 screen)
4. Set Size: 320×240 (small but visible)
5. Add border: Filters → Image Mask/Blend → Circle (optional)

### Recording Settings:
- **Output → Recording Quality**: High Quality, Medium File Size
- **Video → Base Resolution**: 1920×1080 (Full HD)
- **Video → FPS**: 30 (smooth, not too large)
- **Audio → Microphone**: Boost volume to -12dB
- **Format**: MP4 (H.264 codec for YouTube compatibility)

### During Recording:
- **Start Recording**: Click "Start Recording" or press hotkey
- **Pause when needed**: Use "Pause Recording" for breaks (edit out later)
- **Check audio levels**: Speak normally, aim for green bars (not red)
- **Mouse movements**: Move cursor slowly, don't jump around erratically

### After Recording:
- File saved in: Videos folder (default) or custom location
- File size: ~500MB-1GB for 10-minute video
- **Test playback** before uploading!

---

## 🎬 ALTERNATIVE: SIMPLE WINDOWS + WEBCAM RECORDING

If you don't want to use OBS:

**Option 1: PowerPoint Screen Recording**
1. Open PowerPoint → Insert → Screen Recording
2. Select area → Record
3. Limitation: No webcam overlay (need separate recording)

**Option 2: Windows Game Bar**
1. Press **Windows + G** → Opens Game Bar
2. Click Record button
3. Limitation: Records single window only, no webcam overlay

**Option 3: Zoom (Creative Method)**
1. Start Zoom meeting with yourself
2. Share screen
3. Turn on webcam (appears as overlay)
4. Click "Record" → Local recording
5. Stop meeting → Video auto-saves with webcam overlay

**Option 4: Microsoft Teams**
- Similar to Zoom method
- Record meeting with screen share + webcam

---

## ⏰ TIMING BREAKDOWN (Suggested)

| Section | Duration | Content |
|---------|----------|---------|
| 1. Introduction | 1-1.5 min | Project overview, your name/roll |
| 2. Project Structure | 1.5-2 min | Folder structure, data pipeline |
| 3. Database Demo | 1-1.5 min | Schema, queries, 3NF design |
| 4. Visualizations | 2-2.5 min | Show 6-8 key figures |
| 5. Statistical Analysis | 2 min | t-test, p-values, effect size |
| 6. Recommendation System | 2 min | Algorithm, scoring, top towns |
| 7. Limitations | 1.5 min | Honest assessment of constraints |
| 8. Implications | 1 min | Practical recommendations |
| 9. Technical Skills | 1 min | Summarize capabilities |
| 10. Conclusion | 0.5 min | Closing, name/roll repeat |
| **TOTAL** | **10-12 min** | **Complete demonstration** |

---

## 📌 KEY POINTS TO EMPHASIZE

### Show Deep Understanding By:
1. **Explaining design decisions**: "I chose Third Normal Form to eliminate redundancy"
2. **Discussing trade-offs**: "Dynamic weight redistribution was more honest than imputation"
3. **Interpreting statistics**: "The p-value of 10^-114 means virtually zero chance this is random"
4. **Acknowledging limitations**: "This is a snapshot - cannot predict future trends"
5. **Connecting to real-world**: "Low transaction volume means liquidity risk for investors"

### Demonstrate System Functionality By:
1. Running actual R scripts (even just 1-2 lines)
2. Querying the database live
3. Showing file inputs and outputs
4. Opening CSV files to show clean data structure
5. Explaining code logic (even briefly)

### Show Features Clearly:
1. **Automated pipeline**: "Scripts numbered 01-11 run sequentially"
2. **Database normalization**: "Foreign keys prevent data duplication"
3. **Statistical rigor**: "Used Welch's test for unequal variances"
4. **Scoring algorithm**: "Weighted composite with dynamic redistribution"
5. **Quality visualizations**: "300 DPI publication-ready figures"

---

## ❌ COMMON MISTAKES TO AVOID

1. **❌ Private YouTube video** → Must be Public or Unlisted!
2. **❌ No face visible** → Webcam must show you throughout
3. **❌ Reading from script robotically** → Speak naturally, explain in your words
4. **❌ Too fast** → Slow down, viewers need to absorb information
5. **❌ No technical demo** → Must show code, database, not just talk about it
6. **❌ Hiding limitations** → Acknowledging gaps shows maturity
7. **❌ Wrong Google Sheet details** → Double-check roll number, name spelling
8. **❌ Missing deadline** → Submit TODAY (February 7th, 2026)!
9. **❌ Audio issues** → Test microphone first, check volume levels
10. **❌ Messy desktop** → Close unnecessary windows, hide personal files

---

## 🚀 CONFIDENCE BOOSTERS

**Remember**:
- You've done excellent work - this project is comprehensive and rigorous
- You have 606 MB of data, 11 scripts, 16 visualizations, 228 MB database
- Your statistical analysis is solid: p<0.001, effect sizes, confidence intervals
- The recommendation system is innovative: dynamic weight redistribution
- You've documented everything: limitations, methodology, reproducibility

**You know this project inside-out. Just explain what you did naturally.**

---

## 📞 EMERGENCY TROUBLESHOOTING

### "I can't get OBS working!" 
→ Use Zoom/Teams recording method (simpler, works immediately)

### "Video file too large (>2GB)!"
→ Compress using Handbrake (free) or reduce OBS quality to 720p

### "I'm nervous about speaking!"
→ Write bullet points (not full script), practice 2-3 times, speak naturally

### "Deadline is TODAY and I haven't started!"
→ Simplify: 8 minutes is enough, focus on sections 1-6, skip detailed limitations

### "YouTube taking too long to upload!"
→ Start upload NOW (takes 20-60 min for large files), don't wait until last minute

---

## ✅ FINAL SUBMISSION VERIFICATION

**Before you close the Google Sheet:**
1. Click your YouTube link → Does it work in incognito mode?
2. Is video visibility Public or Unlisted (not Private)?
3. Is your face visible in the video?
4. Can you hear yourself clearly?
5. Is video duration 8-15 minutes?
6. Did you demonstrate actual code/database (not just slides)?
7. Is your name and roll number correct in the sheet?
8. Is today's date February 7th, 2026 or earlier?

**If all YES → You're done! Congratulations! 🎉**

---

## 📊 PROJECT STRENGTH SUMMARY (For Confidence)

Your project demonstrates:
- ✅ **Data Collection**: 5 datasets, 606 MB, automated scraping
- ✅ **Data Cleaning**: 3.9M → 488K rows, validation, deduplication
- ✅ **Database Design**: 3NF schema, 7 tables, foreign keys, 228 MB SQLite
- ✅ **Statistical Analysis**: t-tests, p-values, Cohen's d, confidence intervals
- ✅ **Machine Learning/Scoring**: Composite algorithm, normalization, weighting
- ✅ **Visualization**: 16 figures, 300 DPI, publication quality
- ✅ **Documentation**: README, guides, limitations, reproducibility
- ✅ **Critical Thinking**: Acknowledged biases, limitations, confounding
- ✅ **Real-World Application**: Actionable recommendations for investors

**This is A-grade work. Present it confidently!**

---

**Good luck with your video! You've got this! 🚀**
