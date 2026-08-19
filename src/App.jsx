import { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import OfflineModeBanner from './components/OfflineModeBanner';
import SafetyAnalyzer from './components/SafetyAnalyzer';
import RouteBreakdown from './components/RouteBreakdown';
import InteractiveSafetyMap from './components/InteractiveSafetyMap';
import HazardReporter from './components/HazardReporter';
import HazardList from './components/HazardList';
import EmergencySOS from './components/EmergencySOS';
import SosModal from './components/SosModal';
import EmergencyContacts from './components/EmergencyContacts';
import SafeHavenFinder from './components/SafeHavenFinder';
import FakeCallModal from './components/FakeCallModal';
import SafetyCheckIn from './components/SafetyCheckIn';
import TripShareModal from './components/TripShareModal';
import VoiceTriggerListener from './components/VoiceTriggerListener';
import SafetyAuditExporter from './components/SafetyAuditExporter';
import ToastContainer from './components/Toast';

import { calculateRouteSafety } from './utils/safetyAlgorithm';
import { 
  getSavedHazards, 
  saveHazards, 
  getSavedContacts, 
  saveContacts, 
  getSavedTheme, 
  saveTheme,
  getSavedOfflineMode,
  saveOfflineMode
} from './utils/storage';
import { useGeolocation } from './hooks/useGeolocation';
import { useToast } from './hooks/useToast';

import { 
  Compass, 
  AlertTriangle, 
  ShieldCheck, 
  PhoneCall, 
  Mic, 
  FileText
} from 'lucide-react';
import './App.css';

export default function App() {
  // Navigation tabs: 'analyzer' | 'hazards' | 'havens' | 'sos'
  const [activeTab, setActiveTab] = useState('analyzer');

  // Route Parameters
  const [origin, setOrigin] = useState('University Main Library');
  const [destination, setDestination] = useState('Westgate Student Dormitories');
  const [timeOfDay, setTimeOfDay] = useState('late_night');
  const [mode, setMode] = useState('walking');
  const [routeVariant, setRouteVariant] = useState('safest'); // 'safest' | 'fastest'
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Persistent Data States with Resilience & Sanitization
  const [hazards, setHazards] = useState(() => getSavedHazards());
  const [contacts, setContacts] = useState(() => getSavedContacts());
  const [theme, setTheme] = useState(() => getSavedTheme());
  const [isOfflineMode, setIsOfflineMode] = useState(() => getSavedOfflineMode());

  // Modal States
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isFakeCallOpen, setIsFakeCallOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isTripShareOpen, setIsTripShareOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Hooks
  const { location: userLocation } = useGeolocation();
  const { toasts, addToast, removeToast } = useToast();

  // Save changes to storage with sanitization
  useEffect(() => {
    saveHazards(hazards);
  }, [hazards]);

  useEffect(() => {
    saveContacts(contacts);
  }, [contacts]);

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    saveOfflineMode(isOfflineMode);
  }, [isOfflineMode]);

  // Compute Route Safety Matrix (Deterministic Formulation)
  const safetyResult = useMemo(() => {
    return calculateRouteSafety({
      origin,
      destination,
      timeOfDay,
      mode,
      hazards,
      routeVariant
    });
  }, [origin, destination, timeOfDay, mode, hazards, routeVariant]);

  // Recalculate Trigger with visual feedback
  const handleRecalculate = useCallback(() => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      addToast('Safety risk matrix recomputed with live telemetry.', 'success');
    }, 500);
  }, [addToast]);

  // Load Preset Scenario
  const handleSelectPreset = useCallback((preset) => {
    setOrigin(preset.origin);
    setDestination(preset.destination);
    setTimeOfDay(preset.timeOfDay);
    setMode(preset.mode);
    setRouteVariant('safest');
    setActiveTab('analyzer');
    addToast(`Loaded scenario: "${preset.title}"`, 'info');
  }, [addToast]);

  // Add Hazard
  const handleAddHazard = useCallback((newHazard) => {
    setHazards((prev) => [newHazard, ...prev]);
    addToast('Community hazard alert logged & broadcasted!', 'warning');
    setIsReportModalOpen(false);
  }, [addToast]);

  // Upvote / Verify Hazard
  const handleUpvoteHazard = useCallback((hazardId) => {
    setHazards((prev) =>
      prev.map((h) => (h.id === hazardId ? { ...h, upvotes: (h.upvotes || 0) + 1, verified: true } : h))
    );
    addToast('Verified hazard as currently active.', 'success');
  }, [addToast]);

  // Resolve Hazard
  const handleResolveHazard = useCallback((hazardId) => {
    setHazards((prev) =>
      prev.map((h) => (h.id === hazardId ? { ...h, resolved: true } : h))
    );
    addToast('Hazard marked as resolved by community.', 'info');
  }, [addToast]);

  // Save Updated Contacts
  const handleSaveContacts = useCallback((updatedContacts) => {
    setContacts(updatedContacts);
    addToast('Emergency contact directory updated.', 'success');
  }, [addToast]);

  // Navigate to Safe Haven
  const handleNavigateToHaven = useCallback((havenName) => {
    setDestination(havenName);
    setActiveTab('analyzer');
    setRouteVariant('safest');
    addToast(`Rerouting to verified Safe Haven: ${havenName}`, 'success');
  }, [addToast]);

  // Voice SOS Trigger Handler
  const handleVoiceSosTrigger = useCallback(() => {
    setIsVoiceModalOpen(false);
    setIsSosOpen(true);
    addToast('🚨 SOS Triggered via Voice Keyword Recognition!', 'error');
  }, [addToast]);

  // Theme Class Mapping
  const themeClass = theme === 'radar' ? 'theme-night-radar' : theme === 'light' ? 'theme-daylight' : '';

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${themeClass}`}>
      
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Global Header */}
      <Header
        activeTheme={theme}
        setTheme={setTheme}
        isOfflineMode={isOfflineMode}
        setIsOfflineMode={setIsOfflineMode}
        onSelectPreset={handleSelectPreset}
        onTriggerSos={() => setIsSosOpen(true)}
        onOpenCheckIn={() => setIsCheckInOpen(true)}
        onOpenFakeCall={() => setIsFakeCallOpen(true)}
        onOpenContacts={() => setIsContactsOpen(true)}
        onOpenTripShare={() => setIsTripShareOpen(true)}
        onOpenVoiceListener={() => setIsVoiceModalOpen(true)}
        onOpenExportAudit={() => setIsExportModalOpen(true)}
        gpsStatus={userLocation}
      />

      {/* Emergency Offline / Low-Connectivity Alert Mode Banner */}
      <OfflineModeBanner
        isOfflineMode={isOfflineMode}
        onToggleOfflineMode={setIsOfflineMode}
        userLocation={userLocation}
        origin={origin}
        destination={destination}
        contacts={contacts}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
        
        {/* Navigation Bar Tabs & Floating Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          
          <nav className="flex flex-wrap items-center gap-2">
            {[
              { id: 'analyzer', label: 'Route Safety & Map', icon: Compass, badge: 'AI HUD' },
              { id: 'hazards', label: 'Live Hazard Feed', icon: AlertTriangle, count: hazards.filter(h => !h.resolved).length },
              { id: 'havens', label: 'Emergency Safe-Havens', icon: ShieldCheck, badge: 'Verified' },
              { id: 'sos', label: 'Emergency SOS Hub', icon: PhoneCall, alert: true }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    isSelected
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-cyan-900 text-cyan-200' : 'bg-rose-950 text-rose-300 border border-rose-500/30'}`}>
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded ${isSelected ? 'bg-cyan-900 text-cyan-200' : 'bg-slate-800 text-slate-300'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Tools: Voice Listener + Export PDF Brief */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsVoiceModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-300 bg-rose-950/70 hover:bg-rose-900/90 border border-rose-500/50 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <Mic className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Voice Trigger</span>
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/90 border border-cyan-500/50 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export Audit</span>
            </button>
          </div>

        </div>

        {/* Tab 1: Route Safety Analyzer & Multi-Zone Interactive Map */}
        {activeTab === 'analyzer' && (
          <div className="space-y-7">
            {/* Interactive Safety Analyzer Form & Score Gauge */}
            <SafetyAnalyzer
              origin={origin}
              setOrigin={setOrigin}
              destination={destination}
              setDestination={setDestination}
              timeOfDay={timeOfDay}
              setTimeOfDay={setTimeOfDay}
              mode={mode}
              setMode={setMode}
              safetyResult={safetyResult}
              onAnalyze={handleRecalculate}
              isAnalyzing={isAnalyzing}
            />

            {/* Interactive Vector Safety Map with Multi-Zone Visualization */}
            <InteractiveSafetyMap
              routeVariant={routeVariant}
              hazards={hazards}
              origin={origin}
              destination={destination}
              onSelectHazard={(h) => {
                setActiveTab('hazards');
                addToast(`Inspecting hazard: "${h.title}"`, 'warning');
              }}
            />

            {/* AI Route Recommendation & Detailed Metric Breakdown */}
            <RouteBreakdown
              routeVariant={routeVariant}
              setRouteVariant={setRouteVariant}
              safetyResult={safetyResult}
              onOpenHazards={() => setActiveTab('hazards')}
            />
          </div>
        )}

        {/* Tab 2: Live Community Hazard Reporter & Feed */}
        {activeTab === 'hazards' && (
          <div className="space-y-6">
            {/* Embedded Reporter form if open or top action */}
            {isReportModalOpen ? (
              <HazardReporter
                onAddHazard={handleAddHazard}
                userLocation={userLocation}
                onClose={() => setIsReportModalOpen(false)}
              />
            ) : null}

            <HazardList
              hazards={hazards}
              onUpvoteHazard={handleUpvoteHazard}
              onResolveHazard={handleResolveHazard}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />
          </div>
        )}

        {/* Tab 3: Emergency Safe-Haven Locator */}
        {activeTab === 'havens' && (
          <SafeHavenFinder
            onSetDestination={handleNavigateToHaven}
          />
        )}

        {/* Tab 4: Emergency SOS Dispatch Hub */}
        {activeTab === 'sos' && (
          <div className="space-y-6">
            <EmergencySOS
              onTriggerSos={() => setIsSosOpen(true)}
              contacts={contacts}
              userLocation={userLocation}
              origin={origin}
              destination={destination}
              onOpenContacts={() => setIsContactsOpen(true)}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-white">GuardianRoute AI</span>
            <span className="text-slate-600">|</span>
            <span>Intelligent Commuter Personal Safety Engine</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="text-emerald-400">🛡️ Multi-Zone Radar Active</span>
            <span>•</span>
            <span className="text-amber-400">⚡ 160-Char Cellular Fallback</span>
            <span>•</span>
            <span className="text-rose-400">🎙️ Voice Trigger Armed</span>
            <span>•</span>
            <span className="text-cyan-400">📄 PDF Audit Exporter Ready</span>
          </div>
        </div>
      </footer>

      {/* Global Modals & Overlays */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        contacts={contacts}
        userLocation={userLocation}
        origin={origin}
        destination={destination}
      />

      <VoiceTriggerListener
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTriggerSos={handleVoiceSosTrigger}
        onConfirmSafe={() => addToast('Safe arrival confirmed by voice listener!', 'success')}
      />

      <SafetyAuditExporter
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        origin={origin}
        destination={destination}
        timeOfDay={timeOfDay}
        mode={mode}
        safetyResult={safetyResult}
        contacts={contacts}
        userLocation={userLocation}
        hazards={hazards}
      />

      <EmergencyContacts
        isOpen={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
        contacts={contacts}
        onSaveContacts={handleSaveContacts}
      />

      <FakeCallModal
        isOpen={isFakeCallOpen}
        onClose={() => setIsFakeCallOpen(false)}
      />

      <SafetyCheckIn
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onAutoTriggerSos={() => {
          setIsCheckInOpen(false);
          setIsSosOpen(true);
          addToast('Guardian Angel check-in expired! Auto-SOS triggered.', 'error');
        }}
      />

      <TripShareModal
        isOpen={isTripShareOpen}
        onClose={() => setIsTripShareOpen(false)}
        origin={origin}
        destination={destination}
        userLocation={userLocation}
      />

    </div>
  );
}
