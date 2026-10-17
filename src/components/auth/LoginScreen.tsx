import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ComicButton } from '../common/ComicButton';
import { ComicCard } from '../common/ComicCard';
import { Shield, Smartphone, User, Lock, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../../services/soundEffects';

export const LoginScreen: React.FC = () => {
  const { loginUser } = useApp();
  const [authMethod, setAuthMethod] = useState<'username' | 'phone'>('username');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authMethod === 'username') {
      if (!username.trim()) {
        setErrorMsg('Please enter your superhero alias or username.');
        return;
      }
      if (!password.trim() || password.length < 4) {
        setErrorMsg('Password must be at least 4 characters.');
        return;
      }
      loginUser({ type: 'username', identifier: username.trim(), name: username.trim() });
    } else {
      if (!phoneNumber.trim() || phoneNumber.length < 7) {
        setErrorMsg('Please enter a valid phone number.');
        return;
      }
      if (!password.trim() || password.length < 4) {
        setErrorMsg('Password must be at least 4 characters.');
        return;
      }
      loginUser({
        type: 'phone',
        identifier: `${countryCode} ${phoneNumber.trim()}`,
        name: `Agent ${phoneNumber.slice(-4)}`
      });
    }
  };

  const handleQuickDemo = (roleName: string) => {
    soundFx.playLevelUp();
    loginUser({
      type: 'username',
      identifier: roleName,
      name: roleName
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 comic-paper-bg relative overflow-hidden">
      {/* Background Graphic Watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'url(/spider.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(30%)'
        }}
      />

      <div className="w-full max-w-[400px] z-10 animate-pop-in">
        {/* Logo Badge */}
        <div className="text-center mb-5">
          <div className="w-16 h-16 bg-comic-red border-3 border-comic-black rounded-2xl comic-shadow-lg mx-auto flex items-center justify-center mb-2 animate-bounce-short">
            <span className="text-3xl">🕷️</span>
          </div>
          <h1 className="font-comic text-3xl uppercase tracking-wider text-stone-900 leading-none">
            SPIDER TRACKER
          </h1>
          <p className="text-xs font-black uppercase tracking-widest text-comic-red font-comic mt-1">
            Mobile AI Productivity & Habit Core
          </p>
        </div>

        <ComicCard variant="white" bodyClassName="p-5">
          {/* Method Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setAuthMethod('username');
                setErrorMsg('');
              }}
              className={`py-2 px-3 rounded-xl border-2 border-comic-black font-comic text-xs uppercase font-black transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'username'
                  ? 'bg-comic-red text-white comic-shadow-sm scale-102'
                  : 'bg-stone-100 text-stone-700'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Username
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setAuthMethod('phone');
                setErrorMsg('');
              }}
              className={`py-2 px-3 rounded-xl border-2 border-comic-black font-comic text-xs uppercase font-black transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'phone'
                  ? 'bg-comic-red text-white comic-shadow-sm scale-102'
                  : 'bg-stone-100 text-stone-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Phone Number
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2.5 mb-3 bg-red-100 border-2 border-comic-black rounded-xl text-xs font-bold text-red-900 animate-wiggle">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            {authMethod === 'username' ? (
              <div>
                <label className="block font-comic uppercase text-xs text-stone-800 mb-1">
                  Superhero Alias / Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="e.g. PeterParker, SpiderHero"
                    className="w-full pl-9 pr-3 py-2 bg-paper-light border-2 border-comic-black rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-comic-red"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block font-comic uppercase text-xs text-stone-800 mb-1">
                  Mobile Phone Number
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    className="px-2 py-2 bg-paper-light border-2 border-comic-black rounded-xl text-xs font-black text-stone-900"
                  >
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+49">🇩🇪 +49</option>
                  </select>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-stone-400">
                      <Smartphone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full pl-9 pr-3 py-2 bg-paper-light border-2 border-comic-black rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-comic-red"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block font-comic uppercase text-xs text-stone-800 mb-1">
                Access Security Passcode
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-stone-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-paper-light border-2 border-comic-black rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-comic-red"
                />
              </div>
            </div>

            <div className="pt-1">
              <ComicButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                sound="punch"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                ENTER SPIDER HQ ⚡
              </ComicButton>
            </div>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="mt-4 pt-3 border-t-2 border-stone-200 text-center">
            <span className="text-[10px] font-comic uppercase text-stone-500 font-bold block mb-2">
              Instant Demo Access
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('Spider Hero')}
                className="flex-1 py-1.5 bg-amber-100 hover:bg-amber-200 border-2 border-comic-black rounded-xl text-[11px] font-comic font-black uppercase transition-all"
              >
                🕷️ Spider Hero
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('Spider Cadet')}
                className="flex-1 py-1.5 bg-blue-100 hover:bg-blue-200 border-2 border-comic-black rounded-xl text-[11px] font-comic font-black uppercase transition-all"
              >
                ⚡ Fast Guest
              </button>
            </div>
          </div>
        </ComicCard>
      </div>
    </div>
  );
};
