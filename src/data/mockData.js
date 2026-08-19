/**
 * Pre-seeded Mock Data for GuardianRoute AI
 * Includes location presets, multi-category safe havens, safety zones,
 * community hazards, sample contacts, and decoy personas.
 */

export const LOCATION_PRESETS = [
  { id: 'campus_lib', name: 'University Main Library', address: '450 University Ave, Campus North', lat: 37.7749, lng: -122.4194, zone: 'Campus Security District' },
  { id: 'metro_central', name: 'Metro Station Central Hub', address: '800 Market St, Downtown', lat: 37.7833, lng: -122.4089, zone: 'High Transit Area' },
  { id: 'dorms_west', name: 'Westgate Student Dormitories', address: '120 Dormitory Way, Westside', lat: 37.7690, lng: -122.4467, zone: 'Residential Corridor' },
  { id: 'tech_park', name: 'Innovation Tech Park', address: '100 Silicon Way, Tech Corridor', lat: 37.7892, lng: -122.3942, zone: 'Commercial District' },
  { id: 'arts_district', name: 'Downtown Arts & Nightlife Square', address: '320 Gallery Row, Arts District', lat: 37.7610, lng: -122.4215, zone: 'Entertainment District' },
  { id: 'suburban_sq', name: 'Suburban Green Residences', address: '640 Oak Ridge Road, Northwood', lat: 37.7550, lng: -122.4550, zone: 'Quiet Suburban' },
  { id: 'medical_center', name: 'Metropolitan Medical Hospital', address: '505 Parnassus Ave, Medical District', lat: 37.7635, lng: -122.4578, zone: 'Healthcare Corridor' },
  { id: 'waterfront_pier', name: 'Waterfront Ferry Terminal', address: 'The Embarcadero, Pier 1', lat: 37.7955, lng: -122.3937, zone: 'Waterfront Zone' }
];

export const DEMO_PRESETS = [
  {
    id: 'preset_campus_late',
    title: '🌙 Campus Solo Walk at 2:00 AM',
    origin: 'University Main Library',
    destination: 'Westgate Student Dormitories',
    timeOfDay: 'late_night',
    mode: 'walking',
    description: 'High risk late-night walking route through dimly lit campus perimeter.'
  },
  {
    id: 'preset_arts_metro',
    title: '🎭 Arts Square to Metro Station at 11:30 PM',
    origin: 'Downtown Arts & Nightlife Square',
    destination: 'Metro Station Central Hub',
    timeOfDay: 'late_night',
    mode: 'walking',
    description: 'Compares poorly-lit shortcut alley vs well-monitored arterial avenue.'
  },
  {
    id: 'preset_tech_cab',
    title: '🚕 Tech Park to Suburban Green via Cab (Dusk)',
    origin: 'Innovation Tech Park',
    destination: 'Suburban Green Residences',
    timeOfDay: 'dusk',
    mode: 'cab',
    description: 'Evaluates ride-hailing safety, verified route checkpoints, and live telemetry.'
  },
  {
    id: 'preset_transit_rush',
    title: '🚆 Ferry Terminal to Medical Center (Public Transit)',
    origin: 'Waterfront Ferry Terminal',
    destination: 'Metropolitan Medical Hospital',
    timeOfDay: 'day',
    mode: 'transit',
    description: 'Analyzes crowd density, station security cameras, and transfer safety.'
  }
];

export const TIME_OF_DAY_OPTIONS = [
  { id: 'day', label: 'Daylight (08:00 - 18:00)', icon: 'Sun', riskModifier: 0, desc: 'Highest natural visibility, active footfall' },
  { id: 'dusk', label: 'Dusk / Evening (18:00 - 22:00)', icon: 'Sunset', riskModifier: 12, desc: 'Decreasing luminescence, peak transit flow' },
  { id: 'late_night', label: 'Late Night (22:00 - 03:00)', icon: 'Moon', riskModifier: 28, desc: 'Low pedestrian density, reduced transit' },
  { id: 'pre_dawn', label: 'Pre-Dawn (03:00 - 08:00)', icon: 'Sunrise', riskModifier: 18, desc: 'Minimal ambient lighting, isolated pathways' }
];

export const TRAVEL_MODES = [
  { id: 'walking', label: 'Walking / Solo Foot', icon: 'Footprints', speedMph: 3.1, safetyFocus: 'Streetlights, pedestrian density, open storefronts' },
  { id: 'cab', label: 'Cab / Ride-Hailing', icon: 'Car', speedMph: 24.0, speedModifier: 4.5, safetyFocus: 'Safe pickup zones, GPS route monitoring, ride verification' },
  { id: 'transit', label: 'Public Transit', icon: 'Train', speedMph: 16.5, speedModifier: 2.8, safetyFocus: 'Well-lit transit stops, security guards, crowded carriages' },
  { id: 'cycling', label: 'Micro-mobility / Bike', icon: 'Bike', speedMph: 12.0, speedModifier: 2.2, safetyFocus: 'Protected bike lanes, road illumination, traffic safety' }
];

/**
 * Safety Zones overlaying the city map:
 * Green (Safe Zones), Yellow (Caution Corridors), Red (High-Risk Hazard Hotspots)
 */
export const SAFETY_ZONES = [
  {
    id: 'zone-green-1',
    type: 'safe',
    name: 'University Protected Blue-Light Corridor',
    cx: 210,
    cy: 350,
    r: 65,
    color: '#10b981',
    fillColor: 'rgba(16, 185, 129, 0.18)',
    borderColor: 'rgba(52, 211, 153, 0.7)',
    lumens: '96% Luminescence',
    footfall: 'High (Campus Police Escorts)',
    cctv: 'Active 360° Cameras (9 Nodes)',
    riskLevel: 'Very Low Risk',
    description: 'Equipped with emergency blue-light callboxes every 50 meters and constant student security patrols.'
  },
  {
    id: 'zone-green-2',
    type: 'safe',
    name: 'Market Street Commercial Safe Haven Zone',
    cx: 560,
    cy: 140,
    r: 70,
    color: '#10b981',
    fillColor: 'rgba(16, 185, 129, 0.18)',
    borderColor: 'rgba(52, 211, 153, 0.7)',
    lumens: '92% Commercial Lighting',
    footfall: 'High (Open 24/7 Stores)',
    cctv: 'Municipal & Store CCTV Active',
    riskLevel: 'Very Low Risk',
    description: 'High ambient footfall corridor featuring open 24/7 pharmacies, well-lit transit shelters, and security.'
  },
  {
    id: 'zone-yellow-1',
    type: 'caution',
    name: 'Elmwood Residential Transition Walkway',
    cx: 390,
    cy: 330,
    r: 58,
    color: '#f59e0b',
    fillColor: 'rgba(245, 158, 11, 0.16)',
    borderColor: 'rgba(251, 191, 36, 0.7)',
    lumens: '62% Moderate Lighting',
    footfall: 'Moderate / Intermittent',
    cctv: 'Partial Corner Coverage',
    riskLevel: 'Moderate Caution',
    description: 'Quiet residential sidewalk. Good road visibility but occasional tree canopy shadows between lampposts.'
  },
  {
    id: 'zone-yellow-2',
    type: 'caution',
    name: 'Northwood Avenue Side Pathway',
    cx: 500,
    cy: 280,
    r: 52,
    color: '#f59e0b',
    fillColor: 'rgba(245, 158, 11, 0.16)',
    borderColor: 'rgba(251, 191, 36, 0.7)',
    lumens: '58% Ambient Lighting',
    footfall: 'Low Evening Footfall',
    cctv: 'Traffic Camera at Intersection',
    riskLevel: 'Moderate Caution',
    description: 'Safe during daylight and dusk; solo commuters advised to stay on the main roadway after 11 PM.'
  },
  {
    id: 'zone-red-1',
    type: 'hazard',
    name: '4th & Elm Streetlight Outage Sector',
    cx: 320,
    cy: 290,
    r: 45,
    color: '#f43f5e',
    fillColor: 'rgba(244, 63, 94, 0.24)',
    borderColor: 'rgba(244, 63, 94, 0.85)',
    lumens: '18% Pitch Dark',
    footfall: 'Deserted / Blind Spot',
    cctv: 'None (CCTV Offline)',
    riskLevel: 'High Risk Hazard',
    description: 'Cluster of 4 municipal streetlights out. Zero visibility on pedestrian sidewalk. AI reroutes around this sector.'
  },
  {
    id: 'zone-red-2',
    type: 'hazard',
    name: 'Central Underpass Tunnel #2 Hotspot',
    cx: 460,
    cy: 210,
    r: 48,
    color: '#f43f5e',
    fillColor: 'rgba(244, 63, 94, 0.24)',
    borderColor: 'rgba(244, 63, 94, 0.85)',
    lumens: '24% Poor Tunnel Lighting',
    footfall: 'Isolated / Loitering Reported',
    cctv: '1 Camera (Obstructed View)',
    riskLevel: 'Critical Risk Hotspot',
    description: 'Multiple active community harassment and aggressive loitering reports logged. Direct shortcut passes through here.'
  }
];

export const INITIAL_HAZARDS = [
  {
    id: 'haz-101',
    category: 'Broken Streetlight',
    severity: 'High',
    title: 'Cluster of 4 Streetlights Out on 4th & Elm',
    description: 'Entire block is pitch dark between Oak St and Elm St. Zero visibility on pedestrian sidewalk.',
    location: '4th St & Elm St (near Campus East Gate)',
    lat: 37.7735,
    lng: -122.4250,
    timestamp: '25 mins ago',
    upvotes: 19,
    verified: true,
    tags: ['#PitchBlack', '#SidewalkHazard', '#UrgentRepair'],
    resolved: false
  },
  {
    id: 'haz-102',
    category: 'Harassment Hotspot',
    severity: 'Critical',
    title: 'Aggressive Loitering at Underpass Walkway',
    description: 'Group blocking underpass pedestrian stairs, verbal harassment reported by multiple solo commuters.',
    location: 'Central Underpass Pedestrian Tunnel #2',
    lat: 37.7801,
    lng: -122.4150,
    timestamp: '1 hour ago',
    upvotes: 34,
    verified: true,
    tags: ['#Underpass', '#Harassment', '#AvoidRoute'],
    resolved: false
  },
  {
    id: 'haz-103',
    category: 'Construction Obstacle',
    severity: 'Medium',
    title: 'Sidewalk Scaffolding Narrow Bottleneck',
    description: 'Construction barriers force pedestrians onto narrow road shoulder with no safety buffer.',
    location: 'Market St between 6th & 7th',
    lat: 37.7818,
    lng: -122.4110,
    timestamp: '3 hours ago',
    upvotes: 12,
    verified: true,
    tags: ['#Construction', '#NarrowPassage'],
    resolved: false
  },
  {
    id: 'haz-104',
    category: 'Poor Cell Coverage',
    severity: 'Low',
    title: 'Cellular Dead Zone in Lower Valley Pathway',
    description: 'Carrier signal drops to 0 bars for approx 300 meters near ravine footbridge.',
    location: 'Pine Creek Ravine Footbridge',
    lat: 37.7660,
    lng: -122.4380,
    timestamp: 'Yesterday',
    upvotes: 8,
    verified: false,
    tags: ['#NoSignal', '#SOSCallbox'],
    resolved: false
  }
];

export const SAFE_HAVENS = [
  {
    id: 'sh-01',
    name: 'Metropolitan Police Precinct #1',
    type: '24/7 Police Station',
    category: 'police',
    address: '767 Bryant St, Downtown',
    phone: '+1 (555) 911-0100',
    distance: '0.3 mi',
    lat: 37.7765,
    lng: -122.4042,
    navUrl: 'https://www.google.com/maps/dir/?api=1&destination=37.7765,-122.4042',
    openHours: 'Open 24/7 / Armed Security',
    features: ['Armed Security on site', '24/7 Lobby Emergency Callbox', 'AED Defibrillator', 'Direct 911 Dispatch Desk']
  },
  {
    id: 'sh-02',
    name: 'Campus Guardian Security HQ & Escort Desk',
    type: '24/7 Campus Security Post',
    category: 'campus',
    address: '100 University Plaza, Building A',
    phone: '+1 (555) 888-SAFE',
    distance: '0.2 mi',
    lat: 37.7752,
    lng: -122.4210,
    navUrl: 'https://www.google.com/maps/dir/?api=1&destination=37.7752,-122.4210',
    openHours: '24/7 Student Safety Escort Dispatch',
    features: ['Instant Student Escort Patrol', 'Monitored Blue-Light Hub', 'First Aid Station', 'Direct Radio Link']
  },
  {
    id: 'sh-03',
    name: 'Mercy General Emergency Trauma Center',
    type: '24/7 Emergency Hospital & ER',
    category: 'hospital',
    address: '450 Stanyan St',
    phone: '+1 (555) 911-0200',
    distance: '0.6 mi',
    lat: 37.7725,
    lng: -122.4530,
    navUrl: 'https://www.google.com/maps/dir/?api=1&destination=37.7725,-122.4530',
    openHours: '24/7 Staffed Emergency Trauma Department',
    features: ['24/7 Triage Reception', 'Armed Hospital Security', 'Emergency Medical Care', 'Safe Waiting Area']
  },
  {
    id: 'sh-04',
    name: 'GreenCross 24/7 Pharmacy & Mart',
    type: 'Verified Safe Local Shop / Pharmacy',
    category: 'pharmacy',
    address: '1100 Market St',
    phone: '+1 (555) 432-8800',
    distance: '0.4 mi',
    lat: 37.7795,
    lng: -122.4135,
    navUrl: 'https://www.google.com/maps/dir/?api=1&destination=37.7795,-122.4135',
    openHours: 'Open 24 Hours / Well-Lit Commercial Partner',
    features: ['High Footfall & Well Lit', 'Perimeter Floodlights', 'Emergency Landline Phone', 'Verified Safe Space Partner']
  },
  {
    id: 'sh-05',
    name: 'BrightStar 24/7 Transit Hub Diner',
    type: 'Verified Safe Local Shop & Transit Post',
    category: 'business',
    address: '520 4th St',
    phone: '+1 (555) 321-4455',
    distance: '0.5 mi',
    lat: 37.7810,
    lng: -122.3995,
    navUrl: 'https://www.google.com/maps/dir/?api=1&destination=37.7810,-122.3995',
    openHours: '24/7 Open Commercial Partner',
    features: ['Constant Staff Presence', 'Well-Lit Exterior Corridor', 'Public Wi-Fi & Phone Charging', 'CCTV Covered']
  },
  {
    id: 'sh-06',
    name: 'Metro Station Central Security Booth',
    type: '24/7 Transit Police Booth',
    category: 'police',
    address: '800 Market St, Platform Concourse',
    phone: '+1 (555) 911-0988',
    distance: '0.3 mi',
    lat: 37.7833,
    lng: -122.4089,
    navUrl: 'https://www.google.com/maps/dir/?api=1&destination=37.7833,-122.4089',
    openHours: '24/7 Monitored Transit Booth',
    features: ['Station Transit Officer', 'Emergency Intercom', 'Full CCTV Monitoring', 'Direct Platform Access']
  }
];

export const DEFAULT_CONTACTS = [
  {
    id: 'c-01',
    name: 'Sarah Miller (Mom)',
    phone: '+1 (555) 234-5678',
    relationship: 'Family',
    isPrimary: true,
    autoNotify: true
  },
  {
    id: 'c-02',
    name: 'Campus Police Dispatch',
    phone: '+1 (555) 888-7233',
    relationship: 'Security',
    isPrimary: false,
    autoNotify: true
  },
  {
    id: 'c-03',
    name: 'Alex Rivera (Roommate)',
    phone: '+1 (555) 876-5432',
    relationship: 'Friend',
    isPrimary: false,
    autoNotify: true
  }
];

export const FAKE_CALL_PERSONAS = [
  {
    id: 'mom',
    name: 'Mom',
    subtitle: 'Mobile +1 (555) 234-5678',
    avatar: '👩‍👧',
    script: [
      "Hey sweetie! Where are you right now? I'm already waiting by the porch with the lights on.",
      "Are you walking alone or did your friends walk with you?",
      "Okay good, stay on speaker with me until you walk right through the door. I'm watching the road from here."
    ]
  },
  {
    id: 'campus_sec',
    name: 'Campus Patrol Officer Dave',
    subtitle: 'Campus Safety Escort Desk',
    avatar: '👮‍♂️',
    script: [
      "Hello, this is Campus Safety Patrol Unit 4. We see your route tracking ping active near the quad.",
      "Our squad cruiser is idling by the corner of University Ave if you need a direct safety escort.",
      "Copy that, we have your location locked. Proceed along the lit corridor, we have visual on you."
    ]
  },
  {
    id: 'uber_driver',
    name: 'Driver Marcus (Silver Camry)',
    subtitle: 'Uber Pick-up in 1 min',
    avatar: '🚖',
    script: [
      "Hi! I'm pulling up right in front of the brightly lit pharmacy entrance with hazard lights blinking.",
      "Silver Toyota Camry, license plate 7XYZ99. I see you waving, I'll unlock the doors now."
    ]
  }
];
