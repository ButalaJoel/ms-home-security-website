import { Building2, Home, Hotel, ParkingSquare, School, type LucideIcon } from "lucide-react";

// Content for the 5 Solutions pages. Category names must match the POS categories.
export interface Solution {
  slug: string;
  label: string;
  icon: LucideIcon;
  title: string;
  intro: string;
  needs: { title: string; text: string }[];
  categories: string[];
  package: string[];
}

export const SOLUTION_PAGES: Solution[] = [
  {
    slug: "homes", label: "Homes", icon: Home,
    title: "Security for your home",
    intro: "Watch your gate and compound from your phone, know when someone comes in, and stop carrying keys.",
    needs: [
      { title: "See who's at the gate", text: "Cameras on the gate, door and compound, viewed live on your phone wherever you are." },
      { title: "Know when something is wrong", text: "Alarms and sensors on doors, windows and walls, with a siren and alerts to your phone." },
      { title: "No more lost keys", text: "Smart locks open with fingerprint, PIN or card, and you choose who can come in." },
    ],
    categories: ["CCTV Cameras", "Alarms & Sensors", "Smart Locks"],
    package: ["4 to 8 cameras with night vision", "Recorder with 1 to 2 weeks of recording", "Phone viewing set up for the family", "Alarm on the main doors (optional)", "Smart lock on the main door (optional)"],
  },
  {
    slug: "shops-offices", label: "Shops & Offices", icon: Building2,
    title: "Security for shops and offices",
    intro: "Protect stock and cash, control who opens which door, and record staff time without paper registers.",
    needs: [
      { title: "Cover the counter and stores", text: "Clear cameras on the till, entrance and stock room, with recordings you can play back." },
      { title: "Staff attendance", text: "Fingerprint or face terminals that record arrival and departure for HR and payroll." },
      { title: "Fewer blind spots", text: "Convex mirrors on corners and aisles so staff can see the whole shop floor." },
    ],
    categories: ["CCTV Cameras", "Access Control & Attendance", "Convex Mirrors"],
    package: ["Cameras on entrance, counter and stores", "Recorder with owner phone viewing", "Attendance terminal with reports", "Door access for offices or stores", "Convex mirrors for blind corners"],
  },
  {
    slug: "schools", label: "Schools", icon: School,
    title: "Security for schools",
    intro: "Keep track of who enters the compound, cover dormitories and gates, and keep guards in touch.",
    needs: [
      { title: "Gate and compound", text: "Cameras on gates, walkways and dormitory entrances, watched from one screen." },
      { title: "Visitors and staff", text: "Access control and attendance for staff, and a clear record of visitors." },
      { title: "Guards in touch", text: "Walkie-talkies so guards and the duty teacher can reach each other at once." },
    ],
    categories: ["CCTV Cameras", "Access Control & Attendance", "Walkie-Talkies & Radios"],
    package: ["Cameras on gates, walkways and dormitories", "Central viewing screen in the office", "Staff attendance terminal", "Radios for guards and duty staff", "Metal detector wand for events (optional)"],
  },
  {
    slug: "hotels-events", label: "Hotels & Events", icon: Hotel,
    title: "Security for hotels and events",
    intro: "Card-key room locks, screening at the entrance and radios for your team.",
    needs: [
      { title: "Room access", text: "Hotel smart locks with cards for guests and staff, so lost keys are no longer a problem." },
      { title: "Screen the entrance", text: "Handheld wands or walk-through metal detectors for gates, halls and events." },
      { title: "Team communication", text: "Walkie-talkies for security, reception and events staff." },
    ],
    categories: ["Smart Locks", "Metal Detectors", "Walkie-Talkies & Radios", "CCTV Cameras"],
    package: ["Hotel card locks for rooms", "Walk-through or handheld metal detectors", "Radios for security and events teams", "Cameras on entrances, parking and corridors"],
  },
  {
    slug: "parking-estates", label: "Parking & Estates", icon: ParkingSquare,
    title: "Parking, estates and traffic",
    intro: "Control vehicles at the gate, manage parking and queues, and record every car that comes in.",
    needs: [
      { title: "Vehicle gates", text: "Boom barriers and turnstiles that open for residents, staff or paid tickets." },
      { title: "Parking and queues", text: "Parking systems and queue management for car parks, banks and offices." },
      { title: "See every car", text: "Cameras on entrances and exits, with clear recordings of vehicles." },
    ],
    categories: ["Parking, Traffic & Queue Systems", "CCTV Cameras", "Convex Mirrors"],
    package: ["Boom barrier at the entrance", "Turnstiles for pedestrians", "Cameras on entry and exit lanes", "Convex mirrors at ramps and corners", "Queue management system (optional)"],
  },
];

export const solutionBySlug = (slug: string) => SOLUTION_PAGES.find(s => s.slug === slug);
