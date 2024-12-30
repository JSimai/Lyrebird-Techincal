export const COLORS = {
  PRIMARY: '#457CBF',
  RECORDING: '#D53F3F',
  RECORDING_200: '#F7D9D9',

  // Neutral colors
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_100: '#F5F5F5',
  GRAY_200: '#EEEEEE',
  GRAY_300: '#E0E0E0',
  GRAY_400: '#BDBDBD',
  GRAY_500: '#9E9E9E',
  GRAY_600: '#757575',
  GRAY_700: '#616161',
  GRAY_800: '#424242',
  GRAY_900: '#212121',

  // Status colors
  SUCCESS: '#34C759',
  ERROR: '#D53F3F',
  WARNING: '#FF9500',
  INFO: '#5856D6',
} as const;

export const firstNames = [
  'John', 'Emma', 'Michael', 'Sarah', 'David', 'Lisa', 'James', 'Maria', 
  'Robert', 'Jennifer', 'William', 'Linda', 'Richard', 'Patricia', 'Thomas'
];

export const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez'
];

export const summaries = [
  {
    text: "Patient reports wheezing and chest tightness for past week. Night-time symptoms affecting sleep quality. Exercise tolerance has decreased significantly. History of seasonal allergies may be contributing factor.",
    subjective: "Wheezing\nNocturnal cough\nShortness of breath with exercise\nChest tightness",
    pmh: "Seasonal allergies\nEczema",
    medications: "None",
    familyHistory: "Father and sister with asthma",
    examination: "Wheezing on expiration\nPeak flow 300 L/min\nO2 sat 97%",
    assessment: "Adult-onset asthma",
    plan: "Prescribed albuterol inhaler\nPFT scheduled\nAsthma action plan created"
  },
  {
    text: "Middle-aged patient with gradual weight gain and fatigue. Reports snoring and daytime sleepiness. Blood pressure elevated at last three visits. Diet includes frequent fast food.",
    subjective: "Weight gain over 2 years\nSnoring\nDaytime somnolence\nDecreased energy",
    pmh: "None",
    medications: "None",
    familyHistory: "Father - type 2 diabetes\nMother - hypertension",
    examination: "Weight: 95kg\nBMI: 32\nBP: 142/88\nHR: 82",
    assessment: "Metabolic syndrome\nSuspected sleep apnea",
    plan: "Sleep study referral\nDietitian consult\nHbA1c test ordered"
  },
  {
    text: "Patient experiencing epigastric pain and heartburn for 3 months. Symptoms worse after large meals and when lying down. Reports frequent use of OTC antacids. Diet includes spicy foods and coffee.",
    subjective: "Epigastric pain\nHeartburn\nRegurgitation\nNocturnal symptoms",
    pmh: "None",
    medications: "OTC antacids",
    familyHistory: "Unremarkable",
    examination: "Mild epigastric tenderness\nBMI: 27\nVitals stable",
    assessment: "Gastroesophageal reflux disease (GERD)",
    plan: "PPI trial\nDietary modifications\nFollow-up in 4 weeks"
  },
  {
    text: "Young adult presenting with panic attacks and persistent worry. Difficulty concentrating at work. Sleep disruption reported. Social withdrawal increasing over past month.",
    subjective: "Panic attacks 2-3x/week\nConstant worry\nInsomnia\nPoor concentration",
    pmh: "None",
    medications: "None",
    familyHistory: "Mother with anxiety disorder",
    examination: "Anxious affect\nMild tremor\nBP slightly elevated",
    assessment: "Generalized anxiety disorder\nPanic disorder",
    plan: "Psychology referral\nSSRI discussed\nStress management education"
  },
  {
    text: "Elderly patient with progressive memory loss over 18 months. Family reports difficulty with daily tasks. Getting lost in familiar places. Mood changes noted.",
    subjective: "Memory decline\nDisorientation\nMood changes\nDifficulty with ADLs",
    pmh: "Hypertension\nOsteoarthritis",
    medications: "Lisinopril\nParacetamol",
    familyHistory: "Father with dementia",
    examination: "MMSE score: 22/30\nNormal vitals\nSteady gait",
    assessment: "Suspected early Alzheimer's disease",
    plan: "Neurology referral\nMRI ordered\nCaregiver support discussed"
  },
  {
    text: "Patient reports chronic lower back pain after lifting injury. Pain radiating down left leg. Numbness in foot noted. Affecting sleep and work performance.",
    subjective: "Lower back pain\nLeft sciatica\nFoot numbness\nWeakness in left leg",
    pmh: "None",
    medications: "OTC NSAIDs",
    familyHistory: "Unremarkable",
    examination: "Positive straight leg raise\nReduced sensation L5 dermatome\nNormal reflexes",
    assessment: "Lumbar disc herniation",
    plan: "MRI ordered\nPhysical therapy referral\nPrescribed muscle relaxants"
  },
  {
    text: "Young female with irregular menstrual cycles and acne. Weight gain despite diet changes. Increased facial hair growth noted. Family history of PCOS.",
    subjective: "Irregular periods\nAcne\nHirsutism\nWeight gain",
    pmh: "None",
    medications: "Multivitamins",
    familyHistory: "Mother and sister with PCOS",
    examination: "BMI: 28\nAcne on face\nIncreased facial hair",
    assessment: "Suspected Polycystic Ovary Syndrome",
    plan: "Hormone levels ordered\nUltrasound scheduled\nMetformin discussed"
  },
  {
    text: "Patient presents with chronic migraines lasting 2-3 days. Symptoms include visual aura and nausea. Light sensitivity has increased over past month. Patient reports stress at work as potential trigger.",
    subjective: "Migraines 2-3 times per week\nPhotophobia\nNausea during episodes\nVisual aura preceding headache",
    pmh: "Seasonal allergies",
    medications: "OTC ibuprofen PRN",
    familyHistory: "Mother suffers from chronic migraines",
    examination: "BP: 122/78\nHR: 72\nAfebrile\nNeurological exam normal",
    assessment: "Chronic migraine with aura",
    plan: "Prescribed sumatriptan\nMigraine diary recommended\nFollow-up in 2 weeks"
  },
  {
    text: "Elderly patient reports progressive joint pain in knees and hands. Morning stiffness lasting over an hour. Difficulty with daily activities increasing. Some relief with warm compresses.",
    subjective: "Joint pain in hands and knees\nMorning stiffness >1 hour\nDecreased grip strength\nFatigue",
    pmh: "Hypertension\nOsteoporosis",
    medications: "Lisinopril 10mg daily\nCalcium supplements",
    familyHistory: "Mother had rheumatoid arthritis",
    examination: "Swollen MCP joints\nReduced ROM in knees\nNo erythema",
    assessment: "Suspected rheumatoid arthritis",
    plan: "RF and anti-CCP tests ordered\nRheumatology referral\nPrescribed NSAIDs"
  },
  {
    text: "Young adult with sudden onset chest pain and shortness of breath. Episodes worse with exertion. Patient reports recent long-haul flight. Anxiety about condition noted.",
    subjective: "Chest pain\nDyspnea on exertion\nRecent 12-hour flight\nCalf pain",
    pmh: "None",
    medications: "Oral contraceptives",
    familyHistory: "Unremarkable",
    examination: "Tachycardic\nMild calf tenderness\nO2 sat 94%",
    assessment: "Suspected pulmonary embolism",
    plan: "D-dimer test\nChest CT ordered\nED admission"
  }
];