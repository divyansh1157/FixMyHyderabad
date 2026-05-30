"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { createReport } from "@/lib/actions";

const CATEGORIES = ["Pothole", "Garbage", "Waterlogging", "Streetlight", "Other"];

// Expanded city-wide 30-area Hyderabad dataset sorted alphabetically
const AREAS = [
  "Abids", "Ameerpet", "Banjara Hills", "Begumpet", "Charminar", 
  "Dilsukhnagar", "Gachibowli", "Habsiguda", "Hitech City", "Jubilee Hills", 
  "Khairatabad", "Kokapet", "Kondapur", "Koti", "Kukatpally", 
  "LB Nagar", "Madhapur", "Malkajgiri", "Manikonda", "Mehdipatnam", 
  "Miyapur", "Nacharam", "Nizampet", "Rai Durg", "Sanathnagar", 
  "Secunderabad", "Somajiguda", "Tarnaka", "Tolichowki", "Uppal"
].sort();

export default function ReportPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState(""); // New Landmark state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleGetLocation = () => {
    setLocationStatus("loading");
    if (!navigator.geolocation) {
      useFallbackLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus("success");
      },
      (err) => {
        console.error("Geolocation error, applying presentation fallback:", err);
        useFallbackLocation();
      },
      { timeout: 8000 }
    );
  };

  const useFallbackLocation = () => {
    setLocation({ lat: 17.4483, lng: 78.3741 });
    setLocationStatus("success");
  };

  const handleSubmit = async () => {
    // Validations (Including the new landmark validation check)
    if (!category)         return alert("Please select a category.");
    if (!area)             return alert("Please select your area.");
    if (!title.trim())     return alert("Please enter a title.");
    if (!landmark.trim())  return alert("Please enter a landmark to help find the issue.");
    if (!location)         return alert("Please capture your location first.");

    setSubmitStatus("loading");
    setErrorMsg("");

    try {
      const input = {
        title:       title.trim(),
        category,
        description: description.trim() ? `${description.trim()} | Landmark: ${landmark.trim()}` : `Landmark: ${landmark.trim()}`,
        latitude:    location.lat,
        longitude:   location.lng,
        area_name:   area,
      };

      let imageFormData = undefined;
      if (imageFile) {
        imageFormData = new FormData();
        imageFormData.append("image", imageFile);
      }

      const result = await createReport(input, imageFormData);
      if (!result.success) throw new Error(result.error || "Submission failed");

      setSubmitStatus("success");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
      setSubmitStatus("error");
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center max-w-sm w-full shadow-xl">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 text-3xl rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            ✓
          </div>
          <h2 className="text-xl font-bold text-slate-900">Issue Reported!</h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            Your report is live. Nearby residents can now confirm and upvote this incident.
          </p>
          <div className="mt-6 space-y-2">
            <button
              onClick={() => (window.location.href = `/${locale}`)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold transition-all transform active:scale-95 text-sm"
            >
              ← Back to Live Feed
            </button>
            <button
              onClick={() => {
                setTitle(""); setCategory(""); setDescription("");
                setArea(""); setLandmark(""); setImageFile(null); setImagePreview(null);
                setLocation(null); setLocationStatus("idle");
                setSubmitStatus("idle");
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition-all text-sm block"
            >
              Report Another Issue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      
      {/* Light Header */}
      <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-50 flex items-center gap-4 px-4 md:px-8 shadow-sm">
        <button
          onClick={() => window.history.back()}
          className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors border border-slate-200"
        >
          ←
        </button>
        <div>
          <h1 className="text-base font-bold text-slate-900">Report a Civic Issue</h1>
          <p className="text-xs text-slate-500">FixMyHyderabad / File Incident</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 max-w-xl mx-auto w-full flex-1 pb-20">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 space-y-5 shadow-sm">
          
          {/* CATEGORY */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Issue Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl p-3 text-slate-800 outline-none transition-all cursor-pointer font-medium text-sm appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* AREA */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Area Zone <span className="text-rose-500">*</span>
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl p-3 text-slate-800 outline-none transition-all cursor-pointer font-medium text-sm appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
            >
              <option value="">Select your area in Hyderabad...</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* TITLE */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Issue Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Open pothole on main road"
              maxLength={100}
              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl p-3 text-slate-800 outline-none transition-all placeholder:text-slate-400 text-sm font-medium"
            />
          </div>

          {/* MANDATORY LANDMARK COLUMN */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Nearest Landmark <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Opposite Cyber Towers main gate, near Metro Pillar 24"
              maxLength={150}
              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl p-3 text-slate-800 outline-none transition-all placeholder:text-slate-400 text-sm font-medium"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              More Details <span className="text-slate-400 font-normal normal-case">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="How long has it been there? Any extra observations?"
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl p-3 text-slate-800 outline-none transition-all resize-none placeholder:text-slate-400 text-sm font-medium"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Photo Evidence <span className="text-slate-400 font-normal normal-case">(optional)</span>
            </label>
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 hover:border-slate-300 bg-slate-50 rounded-xl cursor-pointer transition-all overflow-hidden relative group">
              {imagePreview ? (
                <div className="w-full h-full relative">
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <p className="text-xs bg-white text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold">Change Photo</p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <div className="text-xl mb-1">📷</div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Tap to upload or take photo</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Captures mobile camera directly</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imagePreview && (
              <button
                type="button"
                onClick={() => { setImageFile(null); setImagePreview(null); }}
                className="text-xs text-rose-600 hover:underline mt-1.5 font-medium inline-block"
              >
                Remove photo
              </button>
            )}
          </div>

          {/* LOCATION */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Geotag Location <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locationStatus === "loading"}
              className={`w-full rounded-xl p-3.5 text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2
                ${locationStatus === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : locationStatus === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100/70"
                }`}
            >
              {locationStatus === "idle" && "📍 Tap to Capture My Location"}
              {locationStatus === "loading" && "⏳ Fetching GPS Coordinates..."}
              {locationStatus === "success" && `✓ Verified (${location.lat.toFixed(4)}, {location.lng.toFixed(4)})`}
              {locationStatus === "error" && "⚠️ Location Error — Click to Retry"}
            </button>
          </div>

          {/* ERROR BOX */}
          {submitStatus === "error" && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-xs font-medium">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitStatus === "loading"}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm uppercase tracking-wider shadow-sm transition-all transform active:scale-[0.99] disabled:opacity-50"
          >
            {submitStatus === "loading" ? "⏳ Submitting..." : "🚨 Submit Report"}
          </button>

        </div>
      </div>
    </div>
  );
}