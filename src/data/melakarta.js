// 72 Melakarta Ragas with Katapayadi system
// Swara notation: S, R1/R2/R3, G1/G2/G3, M1/M2, P, D1/D2/D3, N1/N2/N3

// Ri-Ga combinations per chakra group (0-5)
const RI_GA = [
  ["R1", "G1"],
  ["R1", "G2"],
  ["R1", "G3"],
  ["R2", "G2"],
  ["R2", "G3"],
  ["R3", "G3"],
];

// Dha-Ni combinations per position within chakra (0-5)
const DHA_NI = [
  ["D1", "N1"],
  ["D1", "N2"],
  ["D1", "N3"],
  ["D2", "N2"],
  ["D2", "N3"],
  ["D3", "N3"],
];

export const getMelakarthaScale = (number) => {
  const n = number - 1;
  const ma = n < 36 ? "M1" : "M2";
  const adjustedN = n % 36;
  const chakraGroup = Math.floor(adjustedN / 6);
  const position = adjustedN % 6;
  const [ri, ga] = RI_GA[chakraGroup];
  const [dha, ni] = DHA_NI[position];
  return {
    arohana: ["S", ri, ga, ma, "P", dha, ni, "S'"],
    avarohana: ["S'", ni, dha, "P", ma, ga, ri, "S"],
    ma, ri, ga, dha, ni
  };
};

export const MELAKARTAS = [
  { number: 1,  name: "Kanakangi",      chakra: "Indu",   chakraNum: 1 },
  { number: 2,  name: "Ratnangi",       chakra: "Indu",   chakraNum: 1 },
  { number: 3,  name: "Ganamurti",      chakra: "Indu",   chakraNum: 1 },
  { number: 4,  name: "Vanaspati",      chakra: "Indu",   chakraNum: 1 },
  { number: 5,  name: "Manavati",       chakra: "Indu",   chakraNum: 1 },
  { number: 6,  name: "Tanarupi",       chakra: "Indu",   chakraNum: 1 },
  { number: 7,  name: "Senavati",       chakra: "Netra",  chakraNum: 2 },
  { number: 8,  name: "Hanumatodi",     chakra: "Netra",  chakraNum: 2 },
  { number: 9,  name: "Dhenuka",        chakra: "Netra",  chakraNum: 2 },
  { number: 10, name: "Natakapriya",    chakra: "Netra",  chakraNum: 2 },
  { number: 11, name: "Kokilapriya",    chakra: "Netra",  chakraNum: 2 },
  { number: 12, name: "Rupavati",       chakra: "Netra",  chakraNum: 2 },
  { number: 13, name: "Gayakapriya",    chakra: "Agni",   chakraNum: 3 },
  { number: 14, name: "Vakulabharanam", chakra: "Agni",   chakraNum: 3 },
  { number: 15, name: "Mayamalavagowla",chakra: "Agni",   chakraNum: 3 },
  { number: 16, name: "Chakravakam",    chakra: "Agni",   chakraNum: 3 },
  { number: 17, name: "Suryakantam",    chakra: "Agni",   chakraNum: 3 },
  { number: 18, name: "Hatakambari",    chakra: "Agni",   chakraNum: 3 },
  { number: 19, name: "Jhankaradhwani", chakra: "Veda",   chakraNum: 4 },
  { number: 20, name: "Natabhairavi",   chakra: "Veda",   chakraNum: 4 },
  { number: 21, name: "Keeravani",      chakra: "Veda",   chakraNum: 4 },
  { number: 22, name: "Kharaharapriya", chakra: "Veda",   chakraNum: 4 },
  { number: 23, name: "Gourimanohari",  chakra: "Veda",   chakraNum: 4 },
  { number: 24, name: "Varunapriya",    chakra: "Veda",   chakraNum: 4 },
  { number: 25, name: "Mararanjani",    chakra: "Bana",   chakraNum: 5 },
  { number: 26, name: "Charukesi",      chakra: "Bana",   chakraNum: 5 },
  { number: 27, name: "Sarasangi",      chakra: "Bana",   chakraNum: 5 },
  { number: 28, name: "Harikambhoji",   chakra: "Bana",   chakraNum: 5 },
  { number: 29, name: "Dheerasankarabharanam", chakra: "Bana", chakraNum: 5 },
  { number: 30, name: "Naganandini",    chakra: "Bana",   chakraNum: 5 },
  { number: 31, name: "Yagapriya",      chakra: "Rutu",   chakraNum: 6 },
  { number: 32, name: "Ragavardhini",   chakra: "Rutu",   chakraNum: 6 },
  { number: 33, name: "Gangeyabhushani",chakra: "Rutu",   chakraNum: 6 },
  { number: 34, name: "Vagadheeswari",  chakra: "Rutu",   chakraNum: 6 },
  { number: 35, name: "Shulini",        chakra: "Rutu",   chakraNum: 6 },
  { number: 36, name: "Chalanata",      chakra: "Rutu",   chakraNum: 6 },
  { number: 37, name: "Salagam",        chakra: "Rishi",  chakraNum: 7 },
  { number: 38, name: "Jalarnavam",     chakra: "Rishi",  chakraNum: 7 },
  { number: 39, name: "Jhalavarali",    chakra: "Rishi",  chakraNum: 7 },
  { number: 40, name: "Navanitam",      chakra: "Rishi",  chakraNum: 7 },
  { number: 41, name: "Pavani",         chakra: "Rishi",  chakraNum: 7 },
  { number: 42, name: "Raghupriya",     chakra: "Rishi",  chakraNum: 7 },
  { number: 43, name: "Gavambhodi",     chakra: "Vasu",   chakraNum: 8 },
  { number: 44, name: "Bhavapriya",     chakra: "Vasu",   chakraNum: 8 },
  { number: 45, name: "Shubhapantuvarali", chakra: "Vasu", chakraNum: 8 },
  { number: 46, name: "Shadvidhamargini", chakra: "Vasu", chakraNum: 8 },
  { number: 47, name: "Suvarnangi",     chakra: "Vasu",   chakraNum: 8 },
  { number: 48, name: "Divyamani",      chakra: "Vasu",   chakraNum: 8 },
  { number: 49, name: "Dhavalambari",   chakra: "Brahma", chakraNum: 9 },
  { number: 50, name: "Namanarayani",   chakra: "Brahma", chakraNum: 9 },
  { number: 51, name: "Kamavardhini",   chakra: "Brahma", chakraNum: 9 },
  { number: 52, name: "Ramapriya",      chakra: "Brahma", chakraNum: 9 },
  { number: 53, name: "Gamanashrama",   chakra: "Brahma", chakraNum: 9 },
  { number: 54, name: "Vishwambhari",   chakra: "Brahma", chakraNum: 9 },
  { number: 55, name: "Shamalangi",     chakra: "Disi",   chakraNum: 10 },
  { number: 56, name: "Shanmukhapriya", chakra: "Disi",   chakraNum: 10 },
  { number: 57, name: "Simhendramadhyamam", chakra: "Disi", chakraNum: 10 },
  { number: 58, name: "Hemavati",       chakra: "Disi",   chakraNum: 10 },
  { number: 59, name: "Dharmavati",     chakra: "Disi",   chakraNum: 10 },
  { number: 60, name: "Neetimati",      chakra: "Disi",   chakraNum: 10 },
  { number: 61, name: "Kantamani",      chakra: "Rudra",  chakraNum: 11 },
  { number: 62, name: "Rishabhapriya",  chakra: "Rudra",  chakraNum: 11 },
  { number: 63, name: "Latangi",        chakra: "Rudra",  chakraNum: 11 },
  { number: 64, name: "Vachaspati",     chakra: "Rudra",  chakraNum: 11 },
  { number: 65, name: "Mechakalyani",   chakra: "Rudra",  chakraNum: 11 },
  { number: 66, name: "Chitrambari",    chakra: "Rudra",  chakraNum: 11 },
  { number: 67, name: "Sucharitra",     chakra: "Aditya", chakraNum: 12 },
  { number: 68, name: "Jyotiswarupini", chakra: "Aditya", chakraNum: 12 },
  { number: 69, name: "Dhatuvardani",   chakra: "Aditya", chakraNum: 12 },
  { number: 70, name: "Nasikabhushani", chakra: "Aditya", chakraNum: 12 },
  { number: 71, name: "Kosalam",        chakra: "Aditya", chakraNum: 12 },
  { number: 72, name: "Rasikapriya",    chakra: "Aditya", chakraNum: 12 },
];

export const CHAKRAS = [
  { number: 1,  name: "Indu",   meaning: "Moon",       color: "#C8A96E" },
  { number: 2,  name: "Netra",  meaning: "Eyes",       color: "#B8860B" },
  { number: 3,  name: "Agni",   meaning: "Fire",       color: "#A0783C" },
  { number: 4,  name: "Veda",   meaning: "Vedas",      color: "#8B6914" },
  { number: 5,  name: "Bana",   meaning: "Arrows",     color: "#7A5830" },
  { number: 6,  name: "Rutu",   meaning: "Seasons",    color: "#6B4820" },
  { number: 7,  name: "Rishi",  meaning: "Sages",      color: "#5C3A10" },
  { number: 8,  name: "Vasu",   meaning: "Vasus",      color: "#4A2E08" },
  { number: 9,  name: "Brahma", meaning: "Creator",    color: "#3D2210" },
  { number: 10, name: "Disi",   meaning: "Directions", color: "#8B6914" },
  { number: 11, name: "Rudra",  meaning: "Destroyer",  color: "#A0783C" },
  { number: 12, name: "Aditya", meaning: "Suns",       color: "#B8860B" },
];

export const SWARA_STHANAS = {
  "S":  0, "R1": 1, "R2": 2, "R3": 3,
  "G1": 2, "G2": 3, "G3": 4,
  "M1": 5, "M2": 6, "P":  7,
  "D1": 8, "D2": 9, "D3": 10,
  "N1": 9, "N2": 10, "N3": 11,
};

export const getSwaraName = (semitone, melakartaScale) => {
  const { ri, ga, ma, dha, ni } = melakartaScale;
  const map = {
    0:  "Sa",
    1:  ri === "R1" ? "Shuddha Ri" : "—",
    2:  ri === "R2" ? "Chatushruti Ri" : ga === "G1" ? "Shuddha Ga" : "—",
    3:  ri === "R3" ? "Shatshruti Ri" : ga === "G2" ? "Sadharana Ga" : "—",
    4:  ga === "G3" ? "Antara Ga" : "—",
    5:  ma === "M1" ? "Shuddha Ma" : "—",
    6:  ma === "M2" ? "Prati Ma" : "—",
    7:  "Pa",
    8:  dha === "D1" ? "Shuddha Dha" : "—",
    9:  dha === "D2" ? "Chatushruti Dha" : ni === "N1" ? "Shuddha Ni" : "—",
    10: dha === "D3" ? "Shatshruti Dha" : ni === "N2" ? "Kaisika Ni" : "—",
    11: ni === "N3" ? "Kakali Ni" : "—",
  };
  return map[semitone] || "—";
};

export const isValidSwara = (semitone, melakartaScale) => {
  const { ri, ga, ma, dha, ni } = melakartaScale;
  const validSemitones = new Set([
    0,
    SWARA_STHANAS[ri],
    SWARA_STHANAS[ga],
    SWARA_STHANAS[ma],
    7,
    SWARA_STHANAS[dha],
    SWARA_STHANAS[ni],
  ]);
  return validSemitones.has(semitone);
};
