// Mock data for Nepal Election Data Analysis System

export const provinces = [
  { id: 1, name: "Province 1 (Koshi)", capital: "Biratnagar", districts: 14 },
  { id: 2, name: "Province 2 (Madhesh)", capital: "Janakpur", districts: 8 },
  { id: 3, name: "Province 3 (Bagmati)", capital: "Hetauda", districts: 13 },
  { id: 4, name: "Province 4 (Gandaki)", capital: "Pokhara", districts: 11 },
  { id: 5, name: "Province 5 (Lumbini)", capital: "Deukhuri", districts: 12 },
  { id: 6, name: "Province 6 (Karnali)", capital: "Birendranagar", districts: 10 },
  { id: 7, name: "Province 7 (Sudurpashchim)", capital: "Godawari", districts: 9 },
];

export const overviewStats = {
  totalVoters2079: 17988570,
  totalVoters2074: 15427369,
  netGrowth: 2561201,
  growthPercentage: 16.6,
  maleVoters: 8652104,
  femaleVoters: 9336466,
  genderRatio: 0.93,
  averageAge: 38.4,
  totalConstituencies: 165,
  totalCandidates: 2487,
  totalBooths: 21945,
  localLevels: 753,
};

export const provinceVoterData = [
  { 
    province: "Koshi", 
    voters2079: 2854312, 
    voters2074: 2456789, 
    growth: 16.2, 
    male: 1384563, 
    female: 1469749,
    color: "#C41E3A"
  },
  { 
    province: "Madhesh", 
    voters2079: 3156478, 
    voters2074: 2678934, 
    growth: 17.8, 
    male: 1608405, 
    female: 1548073,
    color: "#1565C0"
  },
  { 
    province: "Bagmati", 
    voters2079: 4235612, 
    voters2074: 3678456, 
    growth: 15.1, 
    male: 2075950, 
    female: 2159662,
    color: "#F9A825"
  },
  { 
    province: "Gandaki", 
    voters2079: 1876543, 
    voters2074: 1623478, 
    growth: 15.6, 
    male: 882375, 
    female: 994168,
    color: "#2E7D32"
  },
  { 
    province: "Lumbini", 
    voters2079: 2945678, 
    voters2074: 2534567, 
    growth: 16.2, 
    male: 1414726, 
    female: 1530952,
    color: "#7B1FA2"
  },
  { 
    province: "Karnali", 
    voters2079: 1234567, 
    voters2074: 1087654, 
    growth: 13.5, 
    male: 592592, 
    female: 641975,
    color: "#E65100"
  },
  { 
    province: "Sudurpashchim", 
    voters2079: 1685380, 
    voters2074: 1367491, 
    growth: 23.2, 
    male: 793493, 
    female: 891887,
    color: "#00838F"
  },
];

export const ageDistribution = [
  { ageGroup: "18-25", male: 1823456, female: 1967834, total: 3791290 },
  { ageGroup: "26-35", male: 2156789, female: 2345678, total: 4502467 },
  { ageGroup: "36-45", male: 1987654, female: 2134567, total: 4122221 },
  { ageGroup: "46-55", male: 1456789, female: 1567890, total: 3024679 },
  { ageGroup: "56-65", male: 789456, female: 834567, total: 1624023 },
  { ageGroup: "65+", male: 438960, female: 485930, total: 924890 },
];

export const parties = [
  { id: 1, name: "Nepali Congress", shortName: "NC", color: "#006400", seats: 89 },
  { id: 2, name: "CPN (UML)", shortName: "UML", color: "#FF0000", seats: 78 },
  { id: 3, name: "CPN (Maoist Centre)", shortName: "Maoist", color: "#8B0000", seats: 32 },
  { id: 4, name: "Rastriya Swatantra Party", shortName: "RSP", color: "#FFD700", seats: 20 },
  { id: 5, name: "Rastriya Prajatantra Party", shortName: "RPP", color: "#FFA500", seats: 14 },
  { id: 6, name: "Janata Samajbadi Party", shortName: "JSP", color: "#800080", seats: 12 },
  { id: 7, name: "Loktantrik Samajbadi Party", shortName: "LSP", color: "#4169E1", seats: 4 },
  { id: 8, name: "Independents", shortName: "IND", color: "#808080", seats: 16 },
];

export const electionResults = [
  {
    id: 1,
    constituency: "Kathmandu-1",
    province: "Bagmati",
    district: "Kathmandu",
    winner: "Ram Bahadur Thapa",
    party: "Nepali Congress",
    votes: 45678,
    runnerUp: "Shyam Kumar Shrestha",
    runnerUpParty: "CPN (UML)",
    runnerUpVotes: 38456,
    elected: true,
    margin: 7222,
  },
  {
    id: 2,
    constituency: "Lalitpur-1",
    province: "Bagmati",
    district: "Lalitpur",
    winner: "Sita Devi Maharjan",
    party: "CPN (UML)",
    votes: 52341,
    runnerUp: "Hari Prasad Shrestha",
    runnerUpParty: "Nepali Congress",
    runnerUpVotes: 48976,
    elected: true,
    margin: 3365,
  },
  {
    id: 3,
    constituency: "Pokhara-1",
    province: "Gandaki",
    district: "Kaski",
    winner: "Bijay Gurung",
    party: "Rastriya Swatantra Party",
    votes: 38945,
    runnerUp: "Mina Kumari Poudel",
    runnerUpParty: "Nepali Congress",
    runnerUpVotes: 32156,
    elected: true,
    margin: 6789,
  },
  {
    id: 4,
    constituency: "Biratnagar-1",
    province: "Koshi",
    district: "Morang",
    winner: "Prakash Rai",
    party: "CPN (Maoist Centre)",
    votes: 41234,
    runnerUp: "Sunita Limbu",
    runnerUpParty: "CPN (UML)",
    runnerUpVotes: 39876,
    elected: true,
    margin: 1358,
  },
  {
    id: 5,
    constituency: "Janakpur-1",
    province: "Madhesh",
    district: "Dhanusha",
    winner: "Mahesh Yadav",
    party: "Janata Samajbadi Party",
    votes: 35678,
    runnerUp: "Ramesh Shah",
    runnerUpParty: "Nepali Congress",
    runnerUpVotes: 28945,
    elected: true,
    margin: 6733,
  },
  {
    id: 6,
    constituency: "Butwal-1",
    province: "Lumbini",
    district: "Rupandehi",
    winner: "Krishna Prasad Pant",
    party: "Nepali Congress",
    votes: 44567,
    runnerUp: "Gita Sharma",
    runnerUpParty: "Rastriya Prajatantra Party",
    runnerUpVotes: 36789,
    elected: true,
    margin: 7778,
  },
];

export const casteGroups = [
  { name: "Brahmin", count: 2456789, percentage: 13.7, growth: 12.3 },
  { name: "Chhetri", count: 3156478, percentage: 17.5, growth: 14.5 },
  { name: "Magar", count: 1456789, percentage: 8.1, growth: 16.2 },
  { name: "Tharu", count: 1234567, percentage: 6.9, growth: 18.9 },
  { name: "Tamang", count: 1123456, percentage: 6.2, growth: 15.7 },
  { name: "Newar", count: 987654, percentage: 5.5, growth: 11.2 },
  { name: "Kami", count: 876543, percentage: 4.9, growth: 17.8 },
  { name: "Yadav", count: 789456, percentage: 4.4, growth: 19.5 },
  { name: "Rai", count: 756789, percentage: 4.2, growth: 14.3 },
  { name: "Gurung", count: 654321, percentage: 3.6, growth: 13.8 },
];

export const genderTrend = [
  { year: "2064", male: 7234567, female: 7123456 },
  { year: "2070", male: 7856789, female: 7987654 },
  { year: "2074", male: 8234567, female: 8567890 },
  { year: "2079", male: 8652104, female: 9336466 },
];

export const voterSearchResults = [
  { id: "V001234567", name: "राम बहादुर थापा", gender: "Male", age: 45, province: "Bagmati", district: "Kathmandu", municipality: "Kathmandu Metro", ward: 10, booth: 15 },
  { id: "V001234568", name: "सीता देवी शर्मा", gender: "Female", age: 38, province: "Bagmati", district: "Lalitpur", municipality: "Lalitpur Metro", ward: 5, booth: 8 },
  { id: "V001234569", name: "हरि प्रसाद पौडेल", gender: "Male", age: 52, province: "Gandaki", district: "Kaski", municipality: "Pokhara Metro", ward: 12, booth: 23 },
  { id: "V001234570", name: "कमला राई", gender: "Female", age: 29, province: "Koshi", district: "Morang", municipality: "Biratnagar Metro", ward: 7, booth: 11 },
  { id: "V001234571", name: "विष्णु गुरुङ", gender: "Male", age: 61, province: "Gandaki", district: "Kaski", municipality: "Pokhara Metro", ward: 3, booth: 5 },
];
