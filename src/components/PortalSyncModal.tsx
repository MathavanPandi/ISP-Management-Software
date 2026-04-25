import React, { useState } from "react";
import {
  X,
  RefreshCw,
  Shield,
  Lock,
  Globe,
  Check,
  AlertCircle,
  Zap,
  Phone,
  MessageSquare,
  HelpCircle,
  Camera,
  Smartphone,
} from "lucide-react";
import { ISPProvider } from "../types";
import { cn } from "../lib/utils";
import { portalSyncService } from "../services/portalSyncService";
import { AutomationGuide } from "./AutomationGuide";

interface PortalSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  providers: ISPProvider[];
  activeProviderId: string;
}

export function PortalSyncModal({
  isOpen,
  onClose,
  onSuccess,
  providers,
  activeProviderId,
}: PortalSyncModalProps) {
  const [step, setStep] = React.useState<
    "config" | "syncing" | "success" | "error"
  >("config");
  const [selectedProviderId, setSelectedProviderId] =
    React.useState(activeProviderId);
  const [authType, setAuthType] = React.useState<"credentials" | "api">(
    "credentials",
  );
  const [isTesting, setIsTesting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [syncMethod, setSyncMethod] = React.useState<"credentials" | "mobile" | "scan" | null>(null);
  const [scanningImage, setScanningImage] = React.useState(false);

  // Airtel specific states
  const [mobileNumber, setMobileNumber] = React.useState("9840087266");
  const [otp, setOtp] = React.useState("");
  const [isOtpSent, setIsOtpSent] = React.useState(false);
  const [sendingOtp, setSendingOtp] = React.useState(false);
  const [syncResult, setSyncResult] = React.useState<{
    locationsSyncedCount: number;
    plansCount: number;
  } | null>(null);
  const [showGuide, setShowGuide] = React.useState(false);
  const [bridgeDetected, setBridgeDetected] = React.useState(false);
  const [bridgeOnline, setBridgeOnline] = React.useState(false);

  const selectedProvider = providers.find((p) => p.id === selectedProviderId);
  const isAirtel = selectedProvider?.name.toLowerCase().includes("airtel");
  const isACT = selectedProvider?.name.toLowerCase().includes("act");
  const isJio = selectedProvider?.name.toLowerCase().includes("jio");
  const useOtpFlow = isAirtel || isACT;

  React.useEffect(() => {
    if (isOpen) {
      setStep("config");
      setSyncMethod(useOtpFlow ? "mobile" : "credentials");
      setSelectedProviderId(activeProviderId);
      setErrorMessage(null);
      setIsOtpSent(false);
      setOtp("");
      setBridgeDetected(false);
    }
  }, [isOpen, activeProviderId, useOtpFlow]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanningImage(true);
    setErrorMessage(null);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
      });
      reader.readAsDataURL(file);
      const dataUrl = await base64Promise;
      const base64 = dataUrl.split(',')[1];
      
      const extracted = await portalSyncService.scanBill(base64, file.type);
      console.log("Extracted:", extracted);

      // Successfully extracted data from bill/screenshot
      setSyncResult({
        locationsSyncedCount: 1,
        plansCount: 1,
      });
      setStep("success");
    } catch (err) {
      console.error("Scan error:", err);
      setErrorMessage("Could not read details from this image. Please try again or use OTP sync.");
    } finally {
      setScanningImage(false);
    }
  };

  // Check bridge system status
  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await portalSyncService.getBridgeStatus();
        setBridgeOnline(res.online);
      } catch (err) {
        setBridgeOnline(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // Polling for bridge OTP
  React.useEffect(() => {
    let pollInterval: any;
    
    if (isOtpSent && step === "config" && syncMethod === "mobile") {
      pollInterval = setInterval(async () => {
        try {
          const res = await portalSyncService.checkBridgeOTP(mobileNumber);
          if (res.found) {
            setOtp(res.otp);
            setBridgeDetected(true);
            clearInterval(pollInterval);
          }
        } catch (err) {
          console.error("Poll Error:", err);
        }
      }, 3000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isOtpSent, mobileNumber, step, syncMethod]);

  const handleSendOtp = async () => {
    setSendingOtp(true);
    try {
      await portalSyncService.sendOTP(
        mobileNumber,
        selectedProvider?.name || "",
      );
      setIsOtpSent(true);
      setErrorMessage(null);
      // Simulated browser notification for testing
      console.log(`[SIMULATED SMS] From: ${selectedProvider?.name} Message: Your OTP is 123456`);
    } catch (err) {
      console.error("OTP Send Error:", err);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSync = async () => {
    setStep("syncing");
    try {
      let result;
      if (useOtpFlow) {
        result = await portalSyncService.verifyOTPAndSync(
          mobileNumber,
          otp,
          selectedProviderId,
        );
      } else {
        // Standard credentials flow
        result = await portalSyncService.syncWithCredentials(
          "PortalUser_01", // Example username
          selectedProviderId,
        );
      }

      setSyncResult({
        locationsSyncedCount: result.locationsSynced,
        plansCount: result.plansUpdated,
      });
      setStep("success");
    } catch (err: any) {
      console.error("Sync Error:", err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Portal authentication failed. Please check your credentials or OTP and try again.",
      );
      setStep("error");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1A2B4C] flex items-center justify-center text-white">
              <RefreshCw
                size={20}
                className={cn(step === "syncing" && "animate-spin")}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 italic serif">
                Portal Sync Configuration
              </h3>
              <p className="text-xs text-slate-500">
                Automate plan and due date updates
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          {step === "config" && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Select Provider
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {providers.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProviderId(p.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                        selectedProviderId === p.id
                          ? "bg-[#007AFF]/5 border-[#007AFF] text-[#007AFF] shadow-sm"
                          : "bg-white border-slate-100 text-slate-600 hover:border-slate-200",
                      )}
                    >
                      <Globe size={16} />
                      <span className="text-xs font-bold">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                  <button
                    onClick={() => {
                      setSyncMethod(useOtpFlow ? "mobile" : "credentials");
                      setAuthType("credentials");
                    }}
                    className={cn(
                      "flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                      syncMethod !== "scan"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700",
                    )}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setSyncMethod("scan")}
                    className={cn(
                      "flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1",
                      syncMethod === "scan"
                        ? "bg-white text-[#007AFF] shadow-sm"
                        : "text-slate-500 hover:text-slate-700",
                    )}
                  >
                    <Smartphone size={12} />
                    AI Scan
                  </button>
                  <button
                    onClick={() => {
                      setSyncMethod(null);
                      setAuthType("api");
                    }}
                    className={cn(
                      "flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                      authType === "api" && syncMethod !== "scan"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700",
                    )}
                  >
                    API
                  </button>
                </div>

                {syncMethod === "scan" ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl space-y-2">
                      <h4 className="text-[10px] font-bold text-emerald-900 flex items-center gap-2 uppercase tracking-tight">
                        <Zap size={14} className="text-emerald-500" />
                        AI Extraction Mode
                      </h4>
                      <p className="text-[10px] text-emerald-700 leading-relaxed">
                        Don't want to log in? Just upload a screenshot of your ISP dashboard or a bill. Gemini will extract plans and dates automatically.
                      </p>
                    </div>

                    <div className="relative group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={scanningImage}
                      />
                      <div className={cn(
                        "p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all",
                        scanningImage 
                          ? "bg-slate-50 border-slate-200" 
                          : "bg-white border-[#007AFF]/20 group-hover:border-[#007AFF] group-hover:bg-[#007AFF]/5"
                      )}>
                        {scanningImage ? (
                          <>
                            <RefreshCw className="animate-spin text-[#007AFF]" size={32} />
                            <p className="text-sm font-bold text-slate-900">AI Scanning...</p>
                            <p className="text-[10px] text-slate-500 italic">Extracting plan intelligence</p>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center text-[#007AFF]">
                              <Camera size={24} />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-slate-900">Upload Screenshot or Bill</p>
                              <p className="text-[10px] text-slate-500 mt-1">AI-powered extraction</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : authType === "credentials" ? (
                  <div className="space-y-3">
                    {useOtpFlow ? (
                      <>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              Mobile Number ({selectedProvider?.name})
                            </label>
                            <div className={cn(
                              "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tight transition-all",
                              bridgeOnline ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                            )}>
                              <div className={cn("w-1.5 h-1.5 rounded-full", bridgeOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
                              {bridgeOnline ? "Bridge Online" : "Bridge Offline"}
                            </div>
                          </div>
                          <div className="relative flex gap-2">
                            <div className="relative flex-1">
                              <Phone
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                size={16}
                              />
                              <input
                                type="text"
                                value={mobileNumber}
                                onChange={(e) =>
                                  setMobileNumber(e.target.value)
                                }
                                placeholder="9840087266"
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                              />
                            </div>
                            <button
                              onClick={handleSendOtp}
                              disabled={sendingOtp || !mobileNumber}
                              className="px-4 py-2 bg-[#FF6B00] text-white rounded-lg text-xs font-bold hover:bg-[#E66000] transition-colors disabled:opacity-50 h-full"
                            >
                              {sendingOtp ? (
                                <RefreshCw size={14} className="animate-spin" />
                              ) : isOtpSent ? (
                                "Resend"
                              ) : (
                                "Send OTP"
                              )}
                            </button>
                            <button
                              onClick={() => setShowGuide(true)}
                              className="w-10 h-10 flex items-center justify-center bg-[#007AFF]/10 text-[#007AFF] rounded-lg hover:bg-[#007AFF]/20 transition-colors"
                              title="Automation Bridge Guide"
                            >
                              <HelpCircle size={18} />
                            </button>
                          </div>
                        </div>
                        {isOtpSent && (
                          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-[#007AFF]">
                              Verification OTP
                            </label>
                            <div className="relative">
                              <MessageSquare
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#007AFF]"
                                size={16}
                              />
                              <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                className={cn(
                                  "w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 font-bold tracking-widest transition-all",
                                  bridgeDetected 
                                    ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                                    : "bg-[#007AFF]/5 border border-[#007AFF]/30 text-[#007AFF]"
                                )}
                              />
                              {bridgeDetected && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 animate-in zoom-in duration-300">
                                  <Check size={16} />
                                </div>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400">
                              Enter OTP received on {mobileNumber} to
                              authenticate.
                            </p>
                            <div className={cn(
                              "mt-2 p-2 rounded-lg border flex items-center gap-2 transition-all",
                              bridgeDetected 
                                ? "bg-emerald-100 border-emerald-200" 
                                : "bg-emerald-50 border-emerald-100"
                            )}>
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                bridgeDetected ? "bg-emerald-500" : "bg-emerald-500 animate-pulse"
                              )} />
                              <p className={cn(
                                "text-[10px] font-medium",
                                bridgeDetected ? "text-emerald-800" : "text-emerald-700"
                              )}>
                                {bridgeDetected 
                                  ? "Bridge Success: OTP received and auto-filled!" 
                                  : "Listening for Mobile Bridge... (OTP will auto-fill if automation is set up)"}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Portal Username / ID
                          </label>
                          <div className="relative">
                            <Shield
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                              size={16}
                            />
                            <input
                              type="text"
                              placeholder={
                                isJio ? "JioID / UserID" : "e.g. MIZAJ_IT_001"
                              }
                              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Password
                          </label>
                          <div className="relative">
                            <Lock
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                              size={16}
                            />
                            <input
                              type="password"
                              placeholder="••••••••"
                              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      API Access Token
                    </label>
                    <div className="relative">
                      <Zap
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={16}
                      />
                      <input
                        type="text"
                        placeholder="sk_live_..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      You can generate this in the {selectedProvider?.name}{" "}
                      Developer Portal.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === "syncing" && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-[#007AFF] animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-[#007AFF]">
                  <RefreshCw size={32} />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 italic serif">
                  Syncing Data...
                </h4>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">
                  Fetching latest plan details and due dates from{" "}
                  {selectedProvider?.name} portal.
                </p>
              </div>
              <div className="w-full max-w-xs bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#007AFF] h-full w-2/3 animate-pulse"></div>
              </div>
              <div className="space-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Check size={12} className="text-emerald-500" />
                  Authenticating with {isAirtel ? "OTP" : "API"}
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw
                    size={12}
                    className="text-[#007AFF] animate-spin"
                  />
                  Fetching Location IDs
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <div className="w-3 h-3 rounded-full border border-slate-300"></div>
                  Updating Plan Master
                </div>
              </div>
            </div>
          )}

          {step === "error" && (
            <div className="py-10 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
                <AlertCircle size={40} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-slate-900 italic serif">
                  Sync Failed
                </h4>
                <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                  {errorMessage}
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={handleSync}
                  className="w-full py-3 bg-[#007AFF] text-white rounded-xl font-bold text-sm hover:bg-[#0066CC] transition-all shadow-lg shadow-[#007AFF]/20 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  Try Again
                </button>
                <button
                  onClick={() => setStep("config")}
                  className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                >
                  Back to Configuration
                </button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 animate-in zoom-in duration-300">
                <Check size={40} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 italic serif">
                  Sync Complete!
                </h4>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">
                  Successfully updated {syncResult?.locationsSyncedCount || 0}{" "}
                  locations and {syncResult?.plansCount || 0} plans from{" "}
                  {selectedProvider?.name}.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center space-y-1">
                  <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                    Plans Updated
                  </div>
                  <div className="text-3xl font-bold text-slate-900 leading-none">
                    {(syncResult?.plansCount || 0).toString().padStart(2, "0")}
                  </div>
                  <div className="text-[9px] text-emerald-600/60 font-medium">
                    Auto-discovered
                  </div>
                </div>
                <div className="p-5 bg-[#007AFF]/5 rounded-2xl border border-[#007AFF]/10 flex flex-col items-center justify-center space-y-1">
                  <div className="text-[10px] font-bold text-[#007AFF] uppercase tracking-widest">
                    Locations Synced
                  </div>
                  <div className="text-3xl font-bold text-slate-900 leading-none">
                    {(syncResult?.locationsSyncedCount || 0)
                      .toString()
                      .padStart(2, "0")}
                  </div>
                  <div className="text-[9px] text-[#007AFF]/60 font-medium">
                    Live data linked
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="w-full py-3 bg-[#1A2B4C] text-white rounded-xl font-bold text-sm hover:bg-[#111d33] transition-all shadow-lg shadow-[#1A2B4C]/20"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>

        {step === "config" && (
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSync}
              disabled={useOtpFlow ? !isOtpSent : false}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#007AFF] text-white rounded-lg font-bold text-sm hover:bg-[#0066CC] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={18} />
              {useOtpFlow ? "Verify & Sync" : "Start Sync"}
            </button>
          </div>
        )}
      </div>
      </div>
      {showGuide && <AutomationGuide onClose={() => setShowGuide(false)} />}
    </>
  );
}
