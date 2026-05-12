import { useEffect, useState } from "react";

export type AttackEvent = {
  id: string;
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  sourceIp: string;
  targetEndpoint: string;
  timestamp: Date;
};

export type HealingEvent = {
  id: string;
  attackType: string;
  status: "Healed" | "Reversed";
  patchApplied: string;
  timestamp: Date;
  reverseDeadline: Date;
};

export type TrafficData = {
  time: string;
  normal: number;
  attack: number;
};

// Data Generator
const attackTypes = ["SQL Injection", "XSS", "Path Traversal", "Command Injection", "Brute Force", "SSRF"];
const severities: ("Critical" | "High" | "Medium" | "Low")[] = ["Critical", "High", "Medium", "Low"];
const endpoints = ["/api/login", "/api/upload", "/dashboard", "/api/users", "/profile"];

const generateRandomIp = () => `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

export function useMockEngine() {
  const [traffic, setTraffic] = useState<TrafficData[]>([]);
  const [attacks, setAttacks] = useState<AttackEvent[]>([]);
  const [healingEvents, setHealingEvents] = useState<HealingEvent[]>([]);

  // Init initial traffic data
  useEffect(() => {
    const initialTraffic: TrafficData[] = [];
    const now = new Date();
    for (let i = 20; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 2000);
      initialTraffic.push({
        time: time.toLocaleTimeString([], { hour12: false }),
        normal: Math.floor(Math.random() * 50) + 100,
        attack: Math.random() > 0.8 ? Math.floor(Math.random() * 10) + 1 : 0,
      });
    }
    setTraffic(initialTraffic);
  }, []);

  // Engine loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      // Update traffic
      setTraffic((prev) => {
        const newTraffic = [...prev.slice(1)];
        const isAttackSpike = Math.random() > 0.7;
        newTraffic.push({
          time: now.toLocaleTimeString([], { hour12: false }),
          normal: Math.floor(Math.random() * 50) + 100,
          attack: isAttackSpike ? Math.floor(Math.random() * 40) + 10 : Math.floor(Math.random() * 2),
        });
        return newTraffic;
      });

      // Generate attack randomly
      if (Math.random() > 0.6) {
        const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        
        const newAttack: AttackEvent = {
          id: Math.random().toString(36).substring(7),
          type,
          severity,
          sourceIp: generateRandomIp(),
          targetEndpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
          timestamp: now,
        };
        
        setAttacks((prev) => [newAttack, ...prev].slice(0, 15)); // Keep last 15

        // If attack is Critical/High, trigger auto-healing
        if (severity === "Critical" || severity === "High") {
          const deadline = new Date(now.getTime() + 30 * 60000); // 30 minutes later
          const newHealing: HealingEvent = {
            id: newAttack.id,
            attackType: type,
            status: "Healed",
            patchApplied: `Auto-patch for ${type}`,
            timestamp: now,
            reverseDeadline: deadline,
          };
          setHealingEvents((prev) => [newHealing, ...prev].slice(0, 10)); // Keep last 10
        }
      }
    }, 2000); // Every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const reverseHealing = (id: string) => {
    setHealingEvents((prev) =>
      prev.map((h) => (h.id === id ? { ...h, status: "Reversed" } : h))
    );
  };

  return { traffic, attacks, healingEvents, reverseHealing };
}
