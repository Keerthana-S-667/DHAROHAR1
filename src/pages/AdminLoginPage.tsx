import React, { useState } from 'react';
import { ArrowLeft, Shield, Key, Eye, EyeOff } from 'lucide-react';
import { Language } from '../types';

interface AdminLoginPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onNavigate,
  language
}) => {
  const [username, setUsername] = useState('');
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Admin verification placeholder. In the next phase, this will connect to the backend authentication system.');
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Navigation Breadcrumb / Go back */}
        <div className="flex items-center gap-2 text-xs text-[#b65a3a]">
          <button
            onClick={() => onNavigate('landing')}
            className="hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
        </div>

        {/* Themed Form Card */}
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/50 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#b65a3a]/5 rounded-full blur-2xl pointer-events-none" />

          {/* Logo Emblem Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#b65a3a] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#D4A85A]/10">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#4b2f23]">
              Administrator Access
            </h2>
            <p className="text-xs text-[#b65a3a] tracking-wider uppercase font-semibold">
              Heritage Information Portal
            </p>
          </div>

          <p className="text-xs text-[#4b2f23]/60 text-center leading-relaxed">
            Authorized personnel only. Please verify your cryptographic security key to publish or modify monument data structures.
          </p>

          <div className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b65a3a]">
                Username
              </label>
              <input
                id="admin-username-input"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. curator_asi"
                className="w-full bg-[#f5f0e6] border border-[#aa7b3f]/30 rounded-xl px-4 py-3 text-xs text-[#4b2f23] placeholder-[#F3EBDD]/30 outline-none focus:border-[#aa7b3f] transition-colors"
              />
            </div>

            {/* Cryptographic Key Input */}
            <div className="space-y-1 relative">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#b65a3a]">
                Security Passkey
              </label>
              <div className="relative">
                <input
                  id="admin-passkey-input"
                  type={showKey ? 'text' : 'password'}
                  required
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="ASI-••••-••••-••••"
                  className="w-full bg-[#f5f0e6] border border-[#aa7b3f]/30 rounded-xl pl-4 pr-12 py-3 text-xs text-[#4b2f23] placeholder-[#F3EBDD]/30 outline-none focus:border-[#aa7b3f] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#b65a3a]/70 hover:text-[#b65a3a] transition-colors"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            id="admin-login-submit-btn"
            type="submit"
            className="w-full py-4 rounded-xl bg-[#b65a3a] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#f5f0e6] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#D4A85A]/10 cursor-pointer"
          >
            <Key className="w-4 h-4" />
            <span>Unlock Admin Panel</span>
          </button>
        </form>
      </div>
    </div>
  );
};
