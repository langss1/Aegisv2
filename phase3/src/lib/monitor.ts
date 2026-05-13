import { sendMessage, getChatId } from "./telegram";

export interface MonitorTarget {
  url: string;
  name: string;
  status: "UP" | "DOWN" | "SLOW";
  lastCheck: number;
  responseTime: number;
}

const targets: Map<string, MonitorTarget> = new Map();

export async function addMonitor(url: string, name: string) {
  targets.set(url, {
    url,
    name,
    status: "UP",
    lastCheck: Date.now(),
    responseTime: 0,
  });
  console.log(`[Monitor] Added target: ${url}`);
}

export async function checkTargets() {
  const chatId = getChatId();
  
  for (const [url, target] of targets.entries()) {
    const start = Date.now();
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      const duration = Date.now() - start;
      
      const prevStatus = target.status;
      target.status = res.ok ? "UP" : "DOWN";
      target.responseTime = duration;
      target.lastCheck = Date.now();

      if (prevStatus === "UP" && target.status === "DOWN" && chatId) {
        await sendMessage(chatId, `🚨 <b>MONITOR ALERT: ${target.name} is DOWN!</b>\n\nURL: ${url}\nStatus: ${res.status}\nTime: ${new Date().toLocaleString()}`);
      } else if (prevStatus === "DOWN" && target.status === "UP" && chatId) {
        await sendMessage(chatId, `✅ <b>MONITOR RECOVERED: ${target.name} is UP</b>\n\nURL: ${url}\nResponse Time: ${duration}ms\nTime: ${new Date().toLocaleString()}`);
      }
    } catch (err) {
      const prevStatus = target.status;
      target.status = "DOWN";
      target.lastCheck = Date.now();
      
      if (prevStatus === "UP" && chatId) {
        await sendMessage(chatId, `🚨 <b>MONITOR ALERT: ${target.name} is DOWN!</b>\n\nURL: ${url}\nError: ${String(err)}\nTime: ${new Date().toLocaleString()}`);
      }
    }
  }
}

// Auto-start monitoring if targets exist
if (typeof setInterval !== "undefined") {
  setInterval(checkTargets, 60000); // Check every minute
}
