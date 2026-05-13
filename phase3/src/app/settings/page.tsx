"use client";

import { useState, useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  RotateCcw,
  Bot,
  MessageSquare,
  Brain,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";

/* ─────────────────────────────────────────────────────── */
/*  Helper: masked token display                          */
/* ─────────────────────────────────────────────────────── */
function maskToken(val: string) {
  if (!val || val.length < 12) return val;
  return val.slice(0, 6) + "••••••••" + val.slice(-4);
}

/* ─────────────────────────────────────────────────────── */
/*  Step component for guides                             */
/* ─────────────────────────────────────────────────────── */
function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
        {n}
      </div>
      <div>
        <p className="text-xs font-semibold text-foreground mb-1">{title}</p>
        <div className="text-xs text-muted-foreground leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  Inline code chip                                      */
/* ─────────────────────────────────────────────────────── */
function Code({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const text = typeof children === "string" ? children : "";
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <span
      onClick={copy}
      title="Klik untuk copy"
      className="inline-flex items-center gap-1 cursor-pointer bg-secondary/70 border border-border rounded px-1.5 py-0.5 font-mono text-[11px] text-primary hover:bg-secondary transition-colors select-all"
    >
      {children}
      {copied ? (
        <Check className="h-2.5 w-2.5 text-success" />
      ) : (
        <Copy className="h-2.5 w-2.5 text-muted-foreground" />
      )}
    </span>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  Collapsible Guide Panel                               */
/* ─────────────────────────────────────────────────────── */
function GuidePanel({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`rounded-lg border ${color} overflow-hidden`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          {icon}
          {title}
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/50">
          <div className="pt-3 space-y-3">{children}</div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  Main Page                                             */
/* ─────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const policies = useSettingsStore((s) => s.policies);
  const togglePolicy = useSettingsStore((s) => s.togglePolicy);
  const resetPolicies = useSettingsStore((s) => s.resetPolicies);

  /* ── Integration config state ── */
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [deepseekKey, setDeepseekKey] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveMsg, setSaveMsg] = useState("");

  const [currentConfig, setCurrentConfig] = useState<{
    telegramBotTokenSet: boolean;
    telegramChatId: string;
    deepseekApiKeySet: boolean;
  } | null>(null);

  /* ── Load current config on mount ── */
  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((d) => {
        setCurrentConfig(d);
        if (d.telegramChatId) setChatId(d.telegramChatId);
      })
      .catch(console.error);
  }, []);

  /* ── Save integration config ── */
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveStatus("idle");
    try {
      const body: Record<string, string> = {};
      if (botToken) body.telegramBotToken = botToken;
      if (chatId) body.telegramChatId = chatId;
      if (deepseekKey) body.deepseekApiKey = deepseekKey;

      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.ok) {
        setSaveStatus("success");
        setSaveMsg("Konfigurasi berhasil disimpan!");
        // refresh status
        const refreshed = await fetch("/api/config").then((r) => r.json());
        setCurrentConfig(refreshed);
        setBotToken("");
        setDeepseekKey("");
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err) {
      setSaveStatus("error");
      setSaveMsg(String(err));
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Settings</h1>
          <p className="text-xs text-muted-foreground">
            Konfigurasi integrasi Telegram, DeepSeek AI, dan healing policies
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetPolicies}>
          <RotateCcw className="h-3 w-3" />
          Reset Defaults
        </Button>
      </div>

      {/* ─────────────────────────────────────────
          INTEGRATION CONFIG CARD
      ───────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            Konfigurasi Integrasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current status badges */}
          {currentConfig && (
            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                  currentConfig.telegramBotTokenSet
                    ? "bg-success/15 text-success border border-success/30"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                <Bot className="h-3 w-3" />
                Telegram Token: {currentConfig.telegramBotTokenSet ? "✓ Terset" : "✗ Belum diset"}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                  currentConfig.telegramChatId
                    ? "bg-success/15 text-success border border-success/30"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                <MessageSquare className="h-3 w-3" />
                Chat ID: {currentConfig.telegramChatId || "✗ Belum diset"}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                  currentConfig.deepseekApiKeySet
                    ? "bg-success/15 text-success border border-success/30"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
                }`}
              >
                <Brain className="h-3 w-3" />
                DeepSeek AI: {currentConfig.deepseekApiKeySet ? "✓ Terset" : "✗ Belum diset"}
              </span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {/* Telegram Bot Token */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                <Bot className="h-3.5 w-3.5 inline mr-1.5 text-blue-400" />
                Telegram Bot Token
              </label>
              <div className="relative">
                <input
                  type={showToken ? "text" : "password"}
                  value={botToken}
                  onChange={(e) => setBotToken(e.target.value)}
                  placeholder={
                    currentConfig?.telegramBotTokenSet
                      ? "••••••••  (sudah terset — kosongkan jika tidak ingin ubah)"
                      : "1234567890:AABBCCddEEFFggHHiiJJkk..."
                  }
                  className="w-full rounded-md border border-border bg-secondary/30 px-3 py-2 text-xs font-mono text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showToken ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Format: <Code>1234567890:AABBccDDeeFF...</Code>
              </p>
            </div>

            {/* Telegram Chat ID */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                <MessageSquare className="h-3.5 w-3.5 inline mr-1.5 text-blue-400" />
                Telegram Chat ID
              </label>
              <input
                type="text"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="Contoh: -1001234567890  atau  987654321"
                className="w-full rounded-md border border-border bg-secondary/30 px-3 py-2 text-xs font-mono text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Grup: dimulai dengan <Code>-100</Code> · Pribadi: angka positif
              </p>
            </div>

            {/* DeepSeek API Key */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                <Brain className="h-3.5 w-3.5 inline mr-1.5 text-purple-400" />
                DeepSeek API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={deepseekKey}
                  onChange={(e) => setDeepseekKey(e.target.value)}
                  placeholder={
                    currentConfig?.deepseekApiKeySet
                      ? "••••••••  (sudah terset — kosongkan jika tidak ingin ubah)"
                      : "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  }
                  className="w-full rounded-md border border-border bg-secondary/30 px-3 py-2 text-xs font-mono text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Dapatkan di{" "}
                <a
                  href="https://platform.deepseek.com/api_keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-0.5"
                >
                  platform.deepseek.com <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </p>
            </div>

            {/* Save button + status */}
            <div className="flex items-center gap-3">
              <Button type="submit" size="sm" disabled={saving}>
                <Save className="h-3 w-3" />
                {saving ? "Menyimpan..." : "Simpan Konfigurasi"}
              </Button>
              {saveStatus === "success" && (
                <span className="flex items-center gap-1.5 text-xs text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" /> {saveMsg}
                </span>
              )}
              {saveStatus === "error" && (
                <span className="flex items-center gap-1.5 text-xs text-destructive">
                  <AlertCircle className="h-3.5 w-3.5" /> {saveMsg}
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────
          PANDUAN / GUIDES
      ───────────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          📖 Panduan Cara Mendapatkan Token & Chat ID
        </h2>
        <div className="space-y-3">
          {/* Guide: Telegram Bot Token */}
          <GuidePanel
            title="Cara Mendapat Telegram Bot Token"
            icon={<Bot className="h-4 w-4 text-blue-400" />}
            color="border-blue-500/30"
          >
            <Step n={1} title="Buka Telegram, cari @BotFather">
              Buka aplikasi Telegram di HP atau PC. Di kotak pencarian ketik{" "}
              <Code>@BotFather</Code> dan pilih akun yang bercentang biru ✓.
            </Step>
            <Step n={2} title="Mulai percakapan">
              Klik <strong>START</strong> atau kirim pesan <Code>/start</Code> ke BotFather.
            </Step>
            <Step n={3} title="Buat bot baru">
              Kirim perintah <Code>/newbot</Code>. BotFather akan meminta:
              <ul className="mt-1.5 space-y-1 list-disc list-inside ml-2">
                <li>
                  <strong>Nama bot</strong> — nama tampilan, misal: <Code>AEGIS Monitor</Code>
                </li>
                <li>
                  <strong>Username bot</strong> — harus unik &amp; diakhiri <Code>_bot</Code>,
                  misal: <Code>aegis_monitor_bot</Code>
                </li>
              </ul>
            </Step>
            <Step n={4} title="Salin token">
              Setelah sukses, BotFather akan memberikan pesan berisi token seperti:
              <div className="mt-1.5 bg-secondary/60 rounded px-2 py-1.5 font-mono text-[11px] text-primary">
                5678901234:AABBCCddEEFFggHHiiJJkkLLmm
              </div>
              Salin token tersebut dan paste di kolom <strong>Telegram Bot Token</strong> di atas.
            </Step>
            <div className="flex items-center gap-1.5 mt-1">
              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" /> Buka @BotFather langsung
              </a>
            </div>
          </GuidePanel>

          {/* Guide: Chat ID */}
          <GuidePanel
            title="Cara Mendapat Telegram Chat ID"
            icon={<MessageSquare className="h-4 w-4 text-blue-400" />}
            color="border-blue-500/30"
          >
            <p className="text-xs text-muted-foreground mb-2">
              Ada 2 cara tergantung apakah Anda ingin notifikasi ke chat{" "}
              <strong>pribadi</strong> atau <strong>grup</strong>.
            </p>

            <p className="text-xs font-semibold text-foreground">A. Chat Pribadi</p>
            <Step n={1} title="Cari @userinfobot di Telegram">
              Cari <Code>@userinfobot</Code> di Telegram, lalu kirim <Code>/start</Code>.
            </Step>
            <Step n={2} title="Salin ID Anda">
              Bot akan membalas dengan info akun Anda. Nomor di baris <strong>Id:</strong>{" "}
              adalah Chat ID pribadi Anda — biasanya angka positif seperti <Code>987654321</Code>.
            </Step>

            <p className="text-xs font-semibold text-foreground mt-3">B. Grup / Channel</p>
            <Step n={1} title="Tambahkan bot ke grup">
              Buka grup Telegram Anda → klik nama grup → Add Members → tambahkan bot Anda (username yang dibuat tadi).
            </Step>
            <Step n={2} title="Kirim pesan di grup">
              Kirim sembarang pesan di grup tersebut.
            </Step>
            <Step n={3} title="Cek getUpdates">
              Buka browser, akses URL berikut (ganti <Code>TOKEN</Code> dengan token bot Anda):
              <div className="mt-1.5 bg-secondary/60 rounded px-2 py-1.5 font-mono text-[10px] text-primary break-all">
                https://api.telegram.org/botTOKEN/getUpdates
              </div>
            </Step>
            <Step n={4} title="Cari chat.id">
              Cari bagian <Code>&quot;chat&quot;</Code> → <Code>&quot;id&quot;</Code> di response JSON. Nilainya dimulai dengan{" "}
              <Code>-100...</Code> untuk grup/supergroup.
            </Step>

            <p className="text-xs text-muted-foreground mt-2">
              💡 <strong>Tip:</strong> Jika menggunakan grup, pastikan bot memiliki izin{" "}
              <em>Send Messages</em>.
            </p>
          </GuidePanel>

          {/* Guide: DeepSeek */}
          <GuidePanel
            title="Cara Mendapat DeepSeek API Key"
            icon={<Brain className="h-4 w-4 text-purple-400" />}
            color="border-purple-500/30"
          >
            <Step n={1} title="Daftar/Login ke DeepSeek Platform">
              Buka{" "}
              <a
                href="https://platform.deepseek.com"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-0.5"
              >
                platform.deepseek.com <ExternalLink className="h-2.5 w-2.5" />
              </a>{" "}
              dan daftar dengan email Anda.
            </Step>
            <Step n={2} title="Buka menu API Keys">
              Setelah login, klik avatar/profil di pojok kanan atas → pilih{" "}
              <strong>API Keys</strong>.
            </Step>
            <Step n={3} title="Buat API Key baru">
              Klik <strong>Create new secret key</strong>. Beri nama misal{" "}
              <Code>AEGIS</Code>, lalu klik <strong>Create</strong>.
            </Step>
            <Step n={4} title="Salin key">
              Key hanya ditampilkan sekali. Salin segera dan paste di kolom{" "}
              <strong>DeepSeek API Key</strong> di atas.
            </Step>
            <p className="text-xs text-muted-foreground mt-2">
              💡 API Key saat ini sudah dikonfigurasi dari default AEGIS. Anda hanya perlu mengubah
              jika memiliki key sendiri.
            </p>
          </GuidePanel>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          HEALING POLICIES TABLE
      ───────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Healing Policies</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead className="border-b border-border bg-secondary/30">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Attack Type</th>
                <th className="px-4 py-2.5 font-medium">Min Severity</th>
                <th className="px-4 py-2.5 font-medium">Patch Name</th>
                <th className="px-4 py-2.5 font-medium">WAF Rule</th>
                <th className="px-4 py-2.5 font-medium text-center">Enabled</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/40">
                  <td className="px-4 py-2.5 font-medium text-foreground">{p.attackType}</td>
                  <td className="px-4 py-2.5">
                    <Badge tone="outline">{p.minSeverity}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{p.patchName}</td>
                  <td className="px-4 py-2.5 font-mono-tabular text-muted-foreground">{p.wafRuleId}</td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => togglePolicy(p.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        p.enabled ? "bg-success" : "bg-secondary"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                          p.enabled ? "translate-x-[18px]" : "translate-x-[3px]"
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
