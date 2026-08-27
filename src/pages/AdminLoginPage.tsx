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
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Navigation Breadcrumb / Go back */}
        <div className="flex items-center gap-2 text-xs text-[#D4A85A]">
          <button
            onClick={() => onNavigate('landing')}
            className="hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
        </div>

        {/* Themed Form Card */}
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[#2B2118] border border-[#D4A85A]/50 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4A85A]/5 rounded-full blur-2xl pointer-events-none" />

          {/* Logo Emblem Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#D4A85A] text-[#17130F] flex items-center justify-center mx-auto shadow-lg shadow-[#D4A85A]/10">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#F3EBDD]">
              Administrator Access
            </h2>
            <p className="text-xs text-[#D4A85A] tracking-wider uppercase font-semibold">
              Heritage Information Portal
            </p>
          </div>

          <p className="text-xs text-[#F3EBDD]/60 text-center leading-relaxed">
            Authorized personnel only. Please verify your cryptographic security key to publish or modify monument data structures.
          </p>

          <div className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#D4A85A]">
                Username
              </label>
              <input
                id="admin-username-input"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. curator_asi"
                className="w-full bg-[#17130F] border border-[#D4A85A]/30 rounded-xl px-4 py-3 text-xs text-[#F3EBDD] placeholder-[#F3EBDD]/30 outline-none focus:border-[#D4A85A] transition-colors"
              />
            </div>

            {/* Cryptographic Key Input */}
            <div className="space-y-1 relative">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#D4A85A]">
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
                  className="w-full bg-[#17130F] border border-[#D4A85A]/30 rounded-xl pl-4 pr-12 py-3 text-xs text-[#F3EBDD] placeholder-[#F3EBDD]/30 outline-none focus:border-[#D4A85A] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#D4A85A]/70 hover:text-[#D4A85A] transition-colors"
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
            className="w-full py-4 rounded-xl bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#D4A85A]/10 cursor-pointer"
          >
            <Key className="w-4 h-4" />
            <span>Unlock Admin Panel</span>
          </button>
        </form>
      </div>
    </div>
  );
};
