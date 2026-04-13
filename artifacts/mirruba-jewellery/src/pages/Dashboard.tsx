import { useState, useEffect } from "react";
import { Link as LinkIcon, Key, Eye, EyeOff, CheckCircle, XCircle, Loader2, Shield, LogOut, Store, Globe, MessageCircle, Mail, Phone, MapPin, Code } from "lucide-react";
import logoImg from "@assets/LogoAlaaEdited.df4b9638e3b8557a4379_(1)_1776081454867.png";

function getApiUrl(path: string): string {
  return `/api${path}`;
}

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [storeUrl, setStoreUrl] = useState("");
  const [consumerKey, setConsumerKey] = useState("");
  const [consumerSecret, setConsumerSecret] = useState("");
  const [hasKeys, setHasKeys] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const [storeName, setStoreName] = useState("");
  const [tagline, setTagline] = useState("");
  const [currency, setCurrency] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [developerName, setDeveloperName] = useState("");
  const [developerUrl, setDeveloperUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [savingStore, setSavingStore] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [storeMessage, setStoreMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [stats, setStats] = useState<{ products: number; categories: number } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"wc" | "store">("wc");

  useEffect(() => {
    const saved = sessionStorage.getItem("dashboard_token");
    if (saved) {
      setToken(saved);
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && token) {
      loadSettings();
      loadStats();
    }
  }, [isLoggedIn, token]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch(getApiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        sessionStorage.setItem("dashboard_token", data.token);
        setIsLoggedIn(true);
      } else {
        setLoginError("Invalid password");
      }
    } catch {
      setLoginError("Connection error");
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setToken("");
    setPassword("");
    sessionStorage.removeItem("dashboard_token");
  }

  async function loadSettings() {
    try {
      const res = await fetch(getApiUrl("/settings"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStoreUrl(data.storeUrl);
      setConsumerKey(data.consumerKey);
      setConsumerSecret(data.consumerSecret);
      setHasKeys(data.hasKeys);
      if (data.store) {
        setStoreName(data.store.storeName || "");
        setTagline(data.store.tagline || "");
        setCurrency(data.store.currency || "");
        setWhatsappNumber(data.store.whatsappNumber || "");
        setContactEmail(data.store.contactEmail || "");
        setContactPhone(data.store.contactPhone || "");
        setAddress(data.store.address || "");
        setFacebookUrl(data.store.facebookUrl || "");
        setInstagramUrl(data.store.instagramUrl || "");
        setDeveloperName(data.store.developerName || "");
        setDeveloperUrl(data.store.developerUrl || "");
      }
    } catch {}
  }

  async function loadStats() {
    setStatsLoading(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        fetch(getApiUrl("/wc/products")),
        fetch(getApiUrl("/wc/categories")),
      ]);
      const prods = await prodsRes.json();
      const cats = await catsRes.json();
      setStats({
        products: Array.isArray(prods) ? prods.length : 0,
        categories: Array.isArray(cats) ? cats.length : 0,
      });
    } catch {
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }

  async function handleSaveWc(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(getApiUrl("/settings"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ storeUrl, consumerKey, consumerSecret }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: data.message || "Store settings saved!" });
        loadSettings();
        loadStats();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save" });
      }
    } catch {
      setMessage({ type: "error", text: "Connection error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveStore(e: React.FormEvent) {
    e.preventDefault();
    setSavingStore(true);
    setStoreMessage(null);
    try {
      const res = await fetch(getApiUrl("/settings"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          store: {
            storeName, tagline, currency, whatsappNumber,
            contactEmail, contactPhone, address,
            facebookUrl, instagramUrl, developerName, developerUrl,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStoreMessage({ type: "success", text: "Store settings saved! Refresh the site to see changes." });
      } else {
        setStoreMessage({ type: "error", text: data.error || "Failed to save" });
      }
    } catch {
      setStoreMessage({ type: "error", text: "Connection error" });
    } finally {
      setSavingStore(false);
    }
  }

  async function handleTest() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(getApiUrl("/settings/test"), {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTestResult(data);
    } catch {
      setTestResult({ success: false, message: "Connection error" });
    } finally {
      setTesting(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#0f0d0c] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-gold" />
            </div>
            <h1 className="font-serif text-2xl text-white mb-2">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Enter your admin password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 bg-[#1a1816] border border-border rounded-xl text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
              autoFocus
            />
            {loginError && (
              <p className="text-red-400 text-sm text-center">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loginLoading || !password}
              className="w-full py-3 bg-gold text-white rounded-xl font-medium tracking-wide transition-all hover:bg-gold/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Sign In
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0d0c]">
      <header className="border-b border-border/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Mirruba Jewellery" className="h-11 w-auto" />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Products" value={stats.products} loading={statsLoading} />
            <StatCard label="Categories" value={stats.categories} loading={statsLoading} />
            <StatCard label="Store" value={hasKeys ? "Connected" : "Not Set"} loading={statsLoading} isStatus statusOk={hasKeys} />
            <StatCard label="API" value={testResult ? (testResult.success ? "Active" : "Error") : "Unknown"} loading={statsLoading} isStatus statusOk={testResult?.success} />
          </div>
        )}

        <div className="flex gap-2 border-b border-border/30 pb-0">
          <button
            onClick={() => setActiveTab("wc")}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
              activeTab === "wc"
                ? "border-gold text-gold"
                : "border-transparent text-muted-foreground hover:text-white"
            }`}
          >
            <Globe className="w-4 h-4 inline mr-2" />
            Store API
          </button>
          <button
            onClick={() => setActiveTab("store")}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
              activeTab === "store"
                ? "border-gold text-gold"
                : "border-transparent text-muted-foreground hover:text-white"
            }`}
          >
            <Store className="w-4 h-4 inline mr-2" />
            Store Settings
          </button>
        </div>

        {activeTab === "wc" && (
          <div className="bg-[#1a1816] rounded-2xl border border-border/30 overflow-hidden">
            <div className="px-6 py-5 border-b border-border/20">
              <h2 className="font-serif text-lg text-white flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-gold" />
                Store Connection
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Connect your store by entering its URL and API credentials</p>
            </div>

            <form onSubmit={handleSaveWc} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Store URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <input
                    type="url"
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                    placeholder="https://your-store.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#0f0d0c] border border-border rounded-xl text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Consumer Key</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <input
                    type={showKey ? "text" : "password"}
                    value={consumerKey}
                    onChange={(e) => setConsumerKey(e.target.value)}
                    placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full pl-10 pr-12 py-3 bg-[#0f0d0c] border border-border rounded-xl text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-white transition-colors"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Consumer Secret</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <input
                    type={showSecret ? "text" : "password"}
                    value={consumerSecret}
                    onChange={(e) => setConsumerSecret(e.target.value)}
                    placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full pl-10 pr-12 py-3 bg-[#0f0d0c] border border-border rounded-xl text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors font-mono text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-white transition-colors"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {message && (
                <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                  message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {message.type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
                  {message.text}
                </div>
              )}

              {testResult && (
                <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                  testResult.success ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {testResult.success ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
                  {testResult.message}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-gold text-white rounded-xl font-medium tracking-wide transition-all hover:bg-gold/90 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Settings
                </button>
                <button
                  type="button"
                  onClick={handleTest}
                  disabled={testing}
                  className="flex-1 py-3 bg-transparent border border-gold/40 text-gold rounded-xl font-medium tracking-wide transition-all hover:bg-gold/10 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Test Connection
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "store" && (
          <div className="bg-[#1a1816] rounded-2xl border border-border/30 overflow-hidden">
            <div className="px-6 py-5 border-b border-border/20">
              <h2 className="font-serif text-lg text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-gold" />
                Store Branding & Contact
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Customize the website for any store — name, contact, social links, and more</p>
            </div>

            <form onSubmit={handleSaveStore} className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <Store className="w-3.5 h-3.5 inline mr-1.5" />
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="My Jewellery Store"
                    className="w-full px-4 py-3 bg-[#0f0d0c] border border-border rounded-xl text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="An Icon Of Absolute Femininity"
                    className="w-full px-4 py-3 bg-[#0f0d0c] border border-border rounded-xl text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Currency</label>
                  <input
                    type="text"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    placeholder="AED"
                    className="w-full px-4 py-3 bg-[#0f0d0c] border border-border rounded-xl text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <MessageCircle className="w-3.5 h-3.5 inline mr-1.5" />
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="971501045496"
                    className="w-full px-4 py-3 bg-[#0f0d0c] border border-border rounded-xl text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <Mail className="w-3.5 h-3.5 inline mr-1.5" />
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contact@store.com"
                    className="w-full px-4 py-3 bg-[#0f0d0c] border border-border rounded-xl text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <Phone className="w-3.5 h-3.5 inline mr-1.5" />
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+971 501 045 496"
                    className="w-full px-4 py-3 bg-[#0f0d0c] border border-border rounded-xl text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  <MapPin className="w-3.5 h-3.5 inline mr-1.5" />
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Sharjah, Emirates, Central Market"
                  className="w-full px-4 py-3 bg-[#0f0d0c] border border-border rounded-xl text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Facebook URL</label>
                  <input
                    type="url"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                    className="w-full px-4 py-3 bg-[#0f0d0c] border border-border rounded-xl text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Instagram URL</label>
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                    className="w-full px-4 py-3 bg-[#0f0d0c] border border-border rounded-xl text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    <Code className="w-3.5 h-3.5 inline mr-1.5" />
                    Developer Name
                  </label>
                  <input
                    type="text"
                    value={developerName}
                    onChange={(e) => setDeveloperName(e.target.value)}
                    placeholder="Mr Apps"
                    className="w-full px-4 py-3 bg-[#0f0d0c] border border-border rounded-xl text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Developer URL</label>
                  <input
                    type="url"
                    value={developerUrl}
                    onChange={(e) => setDeveloperUrl(e.target.value)}
                    placeholder="https://mr-appss.com/"
                    className="w-full px-4 py-3 bg-[#0f0d0c] border border-border rounded-xl text-white placeholder:text-muted-foreground/50 focus:outline-none focus:border-gold transition-colors text-sm"
                  />
                </div>
              </div>

              {storeMessage && (
                <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                  storeMessage.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {storeMessage.type === "success" ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
                  {storeMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={savingStore}
                className="w-full py-3 bg-gold text-white rounded-xl font-medium tracking-wide transition-all hover:bg-gold/90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingStore ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Save Store Settings
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value, loading, isStatus, statusOk }: {
  label: string;
  value: string | number;
  loading: boolean;
  isStatus?: boolean;
  statusOk?: boolean;
}) {
  return (
    <div className="bg-[#1a1816] rounded-xl border border-border/30 p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
      {loading ? (
        <div className="h-7 bg-muted rounded w-16 animate-pulse" />
      ) : isStatus ? (
        <p className={`text-lg font-serif ${statusOk ? "text-emerald-400" : statusOk === false ? "text-red-400" : "text-muted-foreground"}`}>
          {value}
        </p>
      ) : (
        <p className="text-2xl font-serif text-white">{value}</p>
      )}
    </div>
  );
}
