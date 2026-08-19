import { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Send, 
  Tag, 
  X, 
  ShieldAlert,
  LocateFixed
} from 'lucide-react';

const CATEGORIES = [
  'Broken Streetlight',
  'Harassment Hotspot',
  'Unsafe Crossing',
  'Poor Cell Coverage',
  'Construction Obstacle',
  'Aggressive Animals',
  'Isolated Underpass',
  'Suspicious Loitering'
];

const SEVERITIES = [
  { level: 'Low', color: 'border-slate-600 text-slate-300 bg-slate-800/60', desc: 'Minor inconvenience' },
  { level: 'Medium', color: 'border-amber-500/50 text-amber-300 bg-amber-950/50', desc: 'Moderate caution required' },
  { level: 'High', color: 'border-orange-500/50 text-orange-300 bg-orange-950/50', desc: 'Significant hazard' },
  { level: 'Critical', color: 'border-rose-500/60 text-rose-300 bg-rose-950/60', desc: 'Immediate avoidance suggested' }
];

const QUICK_TAGS = ['#PitchBlack', '#NoCCTV', '#Underpass', '#BrokenSidewalk', '#Harassment', '#NoSignal', '#Isolated'];

export default function HazardReporter({
  onAddHazard,
  userLocation,
  onClose
}) {
  const [category, setCategory] = useState('Broken Streetlight');
  const [severity, setSeverity] = useState('High');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState(['#PitchBlack']);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUseGps = () => {
    if (userLocation) {
      setLocation(`Near ${userLocation.address || '37.7749° N, 122.4194° W'}`);
    } else {
      setLocation('37.7749° N, 122.4194° W');
    }
  };

  const handleToggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter a short hazard title.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Please provide a location or tap "Use Live GPS".');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a brief description to help fellow commuters.');
      return;
    }

    setIsSubmitting(true);

    const newHazard = {
      id: `haz-${Date.now()}`,
      category,
      severity,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      lat: userLocation?.lat || 37.7749,
      lng: userLocation?.lng || -122.4194,
      timestamp: 'Just now',
      upvotes: 1,
      verified: true,
      tags: selectedTags,
      photoUrl: photoPreview,
      resolved: false
    };

    setTimeout(() => {
      onAddHazard(newHazard);
      setIsSubmitting(false);
      if (onClose) onClose();
    }, 400);
  };

  return (
    <div className="glass-panel-elevated rounded-3xl p-5 sm:p-7 transition-all">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Log Community Hazard Report</h3>
            <p className="text-xs text-slate-400">Crowdsourced alerts update all commuter safety routes in real time.</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-900 border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-semibold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Category & Severity Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Hazard Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Severity Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Severity Level
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {SEVERITIES.map((s) => (
                <button
                  key={s.level}
                  type="button"
                  onClick={() => setSeverity(s.level)}
                  className={`py-2 text-[11px] font-bold rounded-lg border transition-all text-center ${
                    severity === s.level
                      ? `${s.color} ring-2 ring-white/20 shadow-sm`
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s.level}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Hazard Title */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Short Hazard Summary Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., 3 Streetlights completely dark between 4th & Elm"
            className="w-full py-2.5 px-3.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>

        {/* Location with Live GPS Autofill */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-400">
              Location / Cross Streets
            </label>
            <button
              type="button"
              onClick={handleUseGps}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <LocateFixed className="w-3 h-3" />
              <span>Use Current GPS</span>
            </button>
          </div>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Corner of 4th St & Market St underpass"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">
            Hazard Details & Commuter Context
          </label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the danger (e.g., zero visibility, blocked walkway, aggressive individuals, broken callbox)..."
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          />
        </div>

        {/* Quick Tag Chips */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center gap-1">
            <Tag className="w-3 h-3 text-cyan-400" />
            <span>Quick Safety Tags</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                    isSelected
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo Attachment Simulator */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center justify-between">
            <span>Attach Evidence Photo (Optional)</span>
            <span className="text-[11px] text-slate-500">Simulated Upload</span>
          </label>
          
          <div className="flex items-center gap-3">
            <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300 flex items-center gap-2 transition-all">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Choose Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>

            {photoPreview && (
              <div className="relative inline-block">
                <img
                  src={photoPreview}
                  alt="Hazard preview"
                  className="w-12 h-12 object-cover rounded-lg border border-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Broadcasting Alert to Community Network...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Broadcast Live Community Hazard Alert</span>
            </>
          )}
        </button>

      </form>
    </div>
  );
}
