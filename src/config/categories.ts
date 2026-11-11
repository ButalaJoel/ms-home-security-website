import {
  Cctv, Siren, Eye, Fingerprint, LockKeyhole, ScanLine, Radio, TrafficCone,
  type LucideIcon,
} from "lucide-react";

// The 8 product categories, named exactly as in the POS.
export interface Category {
  name: string;
  slug: string;
  short: string;
  blurb: string;
  icon: LucideIcon;
  group: "Surveillance" | "Access & Entry" | "Communication & Traffic";
}

export const CATEGORIES: Category[] = [
  { name: "CCTV Cameras", slug: "cctv-cameras", short: "CCTV", blurb: "Indoor, outdoor and solar cameras with recording and phone viewing.", icon: Cctv, group: "Surveillance" },
  { name: "Alarms & Sensors", slug: "alarms-sensors", short: "Alarms", blurb: "Intruder alarms and beam sensors for doors, walls and perimeters.", icon: Siren, group: "Surveillance" },
  { name: "Convex Mirrors", slug: "convex-mirrors", short: "Mirrors", blurb: "Safety mirrors for blind corners, shops and parking.", icon: Eye, group: "Surveillance" },
  { name: "Access Control & Attendance", slug: "access-control", short: "Access control", blurb: "Fingerprint, card and face terminals for doors and staff time.", icon: Fingerprint, group: "Access & Entry" },
  { name: "Smart Locks", slug: "smart-locks", short: "Smart locks", blurb: "Keyless locks for homes, hotels and aluminium doors.", icon: LockKeyhole, group: "Access & Entry" },
  { name: "Metal Detectors", slug: "metal-detectors", short: "Metal detectors", blurb: "Handheld wands and walk-through gates for entrances and events.", icon: ScanLine, group: "Access & Entry" },
  { name: "Walkie-Talkies & Radios", slug: "walkie-talkies", short: "Walkie-talkies", blurb: "Motorola and Baofeng radios for guards, sites and events.", icon: Radio, group: "Communication & Traffic" },
  { name: "Parking, Traffic & Queue Systems", slug: "parking-traffic", short: "Parking & queues", blurb: "Boom barriers, turnstiles, parking and queue management.", icon: TrafficCone, group: "Communication & Traffic" },
];

export const categoryBySlug = (slug: string) => CATEGORIES.find(c => c.slug === slug);
export const categoryByName = (name: string) => CATEGORIES.find(c => c.name === name);
