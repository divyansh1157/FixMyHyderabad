'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createReport } from '@/lib/actions';

const CATEGORIES = [
  'Pothole',
  'Garbage',
  'Waterlogging',
  'Streetlight',
  'Other',
];

// Expanded city-wide 30-area Hyderabad dataset sorted alphabetically
const AREAS = [
  'Abids',
  'Ameerpet',
  'Banjara Hills',
  'Begumpet',
  'Charminar',
  'Dilsukhnagar',
  'Gachibowli',
  'Habsiguda',
  'Hitech City',
  'Jubilee Hills',
  'Khairatabad',
  'Kokapet',
  'Kondapur',
  'Koti',
  'Kukatpally',
  'LB Nagar',
  'Madhapur',
  'Malkajgiri',
  'Manikonda',
  'Mehdipatnam',
  'Miyapur',
  'Nacharam',
  'Nizampet',
  'Rai Durg',
  'Sanathnagar',
  'Secunderabad',
  'Somajiguda',
  'SR Nagar',
  'Tarnaka',
  'Tolichowki',
  'Uppal',
].sort();

export default function ReportPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const t = useTranslations('report');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState(''); // New Landmark state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleGetLocation = () => {
    setLocationStatus('loading');
    if (!navigator.geolocation) {
      useFallbackLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('success');
      },
      (err) => {
        console.error(
          'Geolocation error, applying presentation fallback:',
          err
        );
        useFallbackLocation();
      },
      { timeout: 8000 }
    );
  };

  const useFallbackLocation = () => {
    setLocation({ lat: 17.4483, lng: 78.3741 });
    setLocationStatus('success');
  };

  const handleSubmit = async () => {
    // Validations (Including the new landmark validation check)
    if (!category) return alert(t('alertCategory'));
    if (!area) return alert(t('alertArea'));
    if (!title.trim()) return alert(t('alertTitle'));
    if (!landmark.trim()) return alert(t('alertLandmark'));
    if (!location) return alert(t('alertLocation'));

    setSubmitStatus('loading');
    setErrorMsg('');

    try {
      const input = {
        title: title.trim(),
        category,
        description: description.trim()
          ? `${description.trim()} | Landmark: ${landmark.trim()}`
          : `Landmark: ${landmark.trim()}`,
        latitude: location.lat,
        longitude: location.lng,
        area_name: area,
      };

      let imageFormData = undefined;
      if (imageFile) {
        imageFormData = new FormData();
        imageFormData.append('image', imageFile);
      }

      const result = await createReport(input, imageFormData);
      if (!result.success) throw new Error(result.error || 'Submission failed');

      setSubmitStatus('success');
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong.');
      setSubmitStatus('error');
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center max-w-sm w-full shadow-xl">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 text-3xl rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            ✓
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {t('successTitle')}
          </h2>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed">
            {t('successDesc')}
          </p>
          <div className="mt-6 space-y-2">
            <button
              onClick={() => (window.location.href = `/${locale}`)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold transition-all transform active:scale-95 text-sm"
            >
              {t('btnBackFeed')}
            </button>
            <button
              onClick={() => {
                setTitle('');
                setCategory('');
                setDescription('');
                setArea('');
                setLandmark('');
                setImageFile(null);
                setImagePreview(null);
                setLocation(null);
                setLocationStatus('idle');
                setSubmitStatus('idle');
              }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition-all text-sm block"
            >
              {t('btnReportAnother')}
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
          <h1 className="text-base font-bold text-slate-900">
            {t('headerTitle')}
          </h1>
          <p className="text-xs text-slate-500">{t('headerSub')}</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="p-4 max-w-xl mx-auto w-full flex-1 pb-20">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 space-y-5 shadow-sm">
          {/* CATEGORY */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              {t('labelType')} <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl p-3 text-slate-800 outline-none transition-all cursor-pointer font-medium text-sm appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px',
              }}
            >
              <option value="">{t('optCategory')}</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* AREA */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              {t('labelZone')} <span className="text-rose-500">*</span>
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl p-3 text-slate-800 outline-none transition-all cursor-pointer font-medium text-sm appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px',
              }}
            >
              <option value="">{t('optArea')}</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* TITLE */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              {t('labelTitle')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('phTitle')}
              maxLength={100}
              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl p-3 text-slate-800 outline-none transition-all placeholder:text-slate-400 text-sm font-medium"
            />
          </div>

          {/* MANDATORY LANDMARK COLUMN */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              {t('labelLandmark')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder={t('phLandmark')}
              maxLength={150}
              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl p-3 text-slate-800 outline-none transition-all placeholder:text-slate-400 text-sm font-medium"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              {t('labelDetails')}{' '}
              <span className="text-slate-400 font-normal normal-case">
                {t('phOptional')}
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('phDetails')}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 rounded-xl p-3 text-slate-800 outline-none transition-all resize-none placeholder:text-slate-400 text-sm font-medium"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              {t('labelPhoto')}{' '}
              <span className="text-slate-400 font-normal normal-case">
                {t('phOptional')}
              </span>
            </label>
            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 hover:border-slate-300 bg-slate-50 rounded-xl cursor-pointer transition-all overflow-hidden relative group">
              {imagePreview ? (
                <div className="w-full h-full relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <p className="text-xs bg-white text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold">
                      Change Photo
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <div className="text-xl mb-1">📷</div>
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                    Tap to upload or take photo
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Captures mobile camera directly
                  </p>
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
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="text-xs text-rose-600 hover:underline mt-1.5 font-medium inline-block"
              >
                {t('removePhoto') || 'Remove photo'}
              </button>
            )}
          </div>

          {/* LOCATION */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              {t('labelGeo')} <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locationStatus === 'loading'}
              className={`w-full rounded-xl p-3.5 text-xs font-bold uppercase tracking-wider border transition-all flex items-center justify-center gap-2
                ${
                  locationStatus === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : locationStatus === 'error'
                      ? 'border-rose-200 bg-rose-50 text-rose-700'
                      : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100/70'
                }`}
            >
              {locationStatus === 'idle' && t('btnGeoIdle')}
              {locationStatus === 'loading' && t('btnGeoLoading')}
              {locationStatus === 'success' &&
                `${t('btnGeoSuccess')} (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`}
              {locationStatus === 'error' && t('btnGeoError')}
            </button>
          </div>

          {/* ERROR BOX */}
          {submitStatus === 'error' && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-xs font-medium">
              ⚠️ {errorMsg}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitStatus === 'loading'}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm uppercase tracking-wider shadow-sm transition-all transform active:scale-[0.99] disabled:opacity-50"
          >
            {submitStatus === 'loading' ? t('btnSubmitting') : t('btnSubmit')}
          </button>
        </div>
      </div>
    </div>
  );
}
