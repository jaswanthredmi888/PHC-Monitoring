import React, { useState } from 'react';
import { AuthUser } from '../types';
import { DEMO_USERS } from '../data/mockData';
import { AppLogo } from './AppLogo';
import { useThemeLanguage, Language } from '../context/ThemeLanguageContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  HelpCircle,
  X,
  Globe
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { t, language, setLanguage } = useThemeLanguage();
  const [selectedDemoUser, setSelectedDemoUser] = useState<AuthUser>(DEMO_USERS[0]);
  const [emailOrId, setEmailOrId] = useState(DEMO_USERS[0].email);
  const [password, setPassword] = useState('••••••••••');
  const [selectedRole, setSelectedRole] = useState(DEMO_USERS[0].role);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleSelectDemoUser = (user: AuthUser) => {
    setSelectedDemoUser(user);
    setEmailOrId(user.email);
    setSelectedRole(user.role);
    setPassword('••••••••••');
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailOrId.trim()) {
      setErrorMessage(t.emailOrIdLabel);
      return;
    }

    if (!password.trim()) {
      setErrorMessage(t.passwordLabel);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const matched = DEMO_USERS.find(
        u => u.email.toLowerCase() === emailOrId.toLowerCase() || u.employeeCode.toLowerCase() === emailOrId.toLowerCase()
      );

      const authenticatedUser: AuthUser = matched || {
        id: `user-${Date.now()}`,
        name: selectedDemoUser.name || 'Medical Officer',
        role: selectedRole,
        designation: selectedDemoUser.designation,
        employeeCode: emailOrId.includes('@') ? 'MH-PHC-2026-REG' : emailOrId.toUpperCase(),
        district: selectedDemoUser.district,
        phcName: selectedDemoUser.phcName,
        email: emailOrId,
        initials: selectedDemoUser.initials || 'MO'
      };

      onLogin(authenticatedUser);
    }, 450);
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'mr', label: 'मराठी' },
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'ta', label: 'தமிழ்' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative">

      {/* Top Bar with Language Selector */}
      <div className="w-full bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AppLogo size="sm" />
          <span className="font-bold text-xs sm:text-sm text-slate-800 tracking-tight">
            {t.appName}
          </span>
        </div>

        {/* Global Language Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-0.5" />
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code)}
              className={`px-2 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                language === l.code
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Login Card Center */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md">

          {/* Card Container */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
            
            {/* Header / Brand */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="p-1 rounded-full bg-white ring-4 ring-slate-100 shadow-xs">
                  <AppLogo size="lg" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  <span className="text-orange-500">SEVA</span>
                  <span className="text-green-600">Link</span>{' '}
                  <span className="text-black">Monitoring</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
                  {t.loginSubtitle}
                </p>
              </div>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Official Identifier / Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  {t.emailOrIdLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    type="text"
                    required
                    value={emailOrId}
                    onChange={(e) => setEmailOrId(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Security PIN / Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    {t.passwordLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHelpModal(true)}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    {t.forgotPin}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role / Duty Assignment */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  {t.dutyDesignationLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <select
                    id="login-role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  >
                    <option value="Medical Officer (In-Charge)">{t.roleMedicalOfficer}</option>
                    <option value="Tele-Consultant Specialist">{t.roleTeleConsultant}</option>
                    <option value="ASHA Field Supervisor">{t.roleAshaSupervisor}</option>
                    <option value="District Epidemiologist">{t.roleEpidemiologist}</option>
                  </select>
                </div>
              </div>

              {/* Remember Station & Security Info */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>{t.rememberTerminal}</span>
                </label>
                <span className="text-[11px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {t.secureEncryption}
                </span>
              </div>

              {/* Submit Button */}
              <button
                id="btn-submit-login"
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{t.authenticating}</span>
                  </>
                ) : (
                  <>
                    <span>{t.enterPortalButton}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

            {/* Quick Demo Sign-in Section */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t.quickDemoLoginTitle}
                </span>
                <span className="text-[10px] text-blue-600 font-semibold">1-Click</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEMO_USERS.map((user) => {
                  const isSelected = selectedDemoUser.id === user.id;
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleSelectDemoUser(user)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition flex items-center gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-300 text-slate-900'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {user.initials}
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-slate-900 truncate leading-tight">{user.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{user.role.split('(')[0]}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Official Compliance Footer inside card */}
            <div className="pt-2 text-center text-[11px] text-slate-400 space-y-1">
              <p>Ayushman Bharat Digital Mission (ABDM) Compliant Node</p>
              <p className="text-[10px]">Restricted to authorized Ministry & PHC health staff only.</p>
            </div>

          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          <span className="font-semibold">
            <span className="text-orange-500">SEVA</span>
            <span className="text-green-600">Link</span>{' '}
            <span className="text-black">Monitoring</span>
          </span>
          <span className="mx-2">•</span>
          <span>{t.subtitle}</span>
        </div>
      </footer>

      {/* Help & IT Support Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>{t.helpModalTitle}</span>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>{t.helpDescription}</p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px] text-slate-700">
                <p><strong>District Nodal Officer:</strong> 020-2612-4011</p>
                <p><strong>Toll-Free Health Support:</strong> 104 / 108</p>
                <p><strong>Support Email:</strong> phc-support@maharashtra.gov.in</p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
