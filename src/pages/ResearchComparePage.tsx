import React from 'react';
import { ArrowLeft, Landmark, Award, BookOpen, Layers, HardHat } from 'lucide-react';
import { Language } from '../types';
import { useStore } from '../store/store';
import { heritageService } from '../services/heritageService';

interface ResearchComparePageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const ResearchComparePage: React.FC<ResearchComparePageProps> = ({
  onNavigate,
  language
}) => {
  const store = useStore();

  // Load the selected monuments
  const selectedIds = store.selectedComparisonMonuments;
  const monument1 = selectedIds[0] ? heritageService.getMonumentById(selectedIds[0]) : null;
  const monument2 = selectedIds[1] ? heritageService.getMonumentById(selectedIds[1]) : null;

  if (!monument1 || !monument2) {
    return (
      <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <Landmark className="w-12 h-12 text-[#b65a3a] mx-auto animate-pulse" />
          <h2 className="text-xl font-bold">Comparison target not ready</h2>
          <p className="text-xs text-[#4b2f23]/60 leading-relaxed">
            Please return to the Research Home page and select exactly two monuments to perform a comparative study.
          </p>
          <button 
            onClick={() => onNavigate('research')} 
            className="px-4 py-2.5 rounded-xl bg-[#b65a3a] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#f5f0e6] transition-colors cursor-pointer"
          >
            Back to Research
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('research')}
            className="hover:underline flex items-center gap-1.5 text-xs text-[#b65a3a] font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Research Portal
          </button>
          
          <button
            onClick={() => store.clearComparisonMonuments()}
            className="px-3.5 py-1.5 rounded-xl border border-red-900/30 bg-[#f5f0e6] hover:bg-red-950/20 text-red-400 text-[10px] font-bold uppercase transition-colors cursor-pointer"
          >
            Reset Comparison List
          </button>
        </div>

        {/* Header Block */}
        <div className="space-y-1">
          <span className="text-[9px] uppercase font-bold text-[#b65a3a] tracking-wider block">Comparative Analysis Studio</span>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#4b2f23]">
            Comparative Model: {monument1.name} vs {monument2.name}
          </h1>
        </div>

        {/* Comparison grid matrix */}
        <div className="rounded-3xl border border-[#aa7b3f]/30 bg-[#ede3d1]/80 overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#ede3d1] border-b border-[#aa7b3f]/25 text-[10px] text-[#b65a3a] uppercase tracking-wider font-bold">
                <th className="p-4 w-1/4">Category</th>
                <th className="p-4 w-3/8 border-l border-[#aa7b3f]/15">{monument1.name}</th>
                <th className="p-4 w-3/8 border-l border-[#aa7b3f]/15">{monument2.name}</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-[#D4A85A]/15 text-[#4b2f23]/90">
              {/* Image Banner */}
              <tr>
                <td className="p-4 font-bold text-[#b65a3a]">Monument Preview</td>
                <td className="p-4 border-l border-[#aa7b3f]/15">
                  <img src={monument1.heroImage} alt={monument1.name} className="w-full h-36 object-cover rounded-xl border border-[#aa7b3f]/10" />
                </td>
                <td className="p-4 border-l border-[#aa7b3f]/15">
                  <img src={monument2.heroImage} alt={monument2.name} className="w-full h-36 object-cover rounded-xl border border-[#aa7b3f]/10" />
                </td>
              </tr>

              {/* Location */}
              <tr>
                <td className="p-4 font-bold text-[#b65a3a]">Location</td>
                <td className="p-4 border-l border-[#aa7b3f]/15 font-medium">
                  {monument1.location.city}, {monument1.location.state}
                </td>
                <td className="p-4 border-l border-[#aa7b3f]/15 font-medium">
                  {monument2.location.city}, {monument2.location.state}
                </td>
              </tr>

              {/* Dynasty */}
              <tr>
                <td className="p-4 font-bold text-[#b65a3a]">Dynasty / Patron</td>
                <td className="p-4 border-l border-[#aa7b3f]/15">
                  {monument1.dynasty} <span className="text-[10px] text-[#4b2f23]/65">({monument1.ruler})</span>
                </td>
                <td className="p-4 border-l border-[#aa7b3f]/15">
                  {monument2.dynasty} <span className="text-[10px] text-[#4b2f23]/65">({monument2.ruler})</span>
                </td>
              </tr>

              {/* Historical Period */}
              <tr>
                <td className="p-4 font-bold text-[#b65a3a]">Epoch Era</td>
                <td className="p-4 border-l border-[#aa7b3f]/15 font-mono">{monument1.period}</td>
                <td className="p-4 border-l border-[#aa7b3f]/15 font-mono">{monument2.period}</td>
              </tr>

              {/* Architecture Style */}
              <tr>
                <td className="p-4 font-bold text-[#b65a3a]">Architecture Style</td>
                <td className="p-4 border-l border-[#aa7b3f]/15 font-medium">{monument1.architectureStyle}</td>
                <td className="p-4 border-l border-[#aa7b3f]/15 font-medium">{monument2.architectureStyle}</td>
              </tr>

              {/* Construction Material */}
              <tr>
                <td className="p-4 font-bold text-[#b65a3a]">Material Composition</td>
                <td className="p-4 border-l border-[#aa7b3f]/15">
                  {monument1.constructionMaterial || monument1.material}
                </td>
                <td className="p-4 border-l border-[#aa7b3f]/15">
                  {monument2.constructionMaterial || monument2.material}
                </td>
              </tr>

              {/* Construction Technique */}
              <tr>
                <td className="p-4 font-bold text-[#b65a3a]">Construction Technique</td>
                <td className="p-4 border-l border-[#aa7b3f]/15">
                  {monument1.constructionTechnique || 'Interlocking block joint structural dry masonry.'}
                </td>
                <td className="p-4 border-l border-[#aa7b3f]/15">
                  {monument2.constructionTechnique || 'Interlocking block joint structural dry masonry.'}
                </td>
              </tr>

              {/* Cultural Significance */}
              <tr>
                <td className="p-4 font-bold text-[#b65a3a]">Cultural Significance</td>
                <td className="p-4 border-l border-[#aa7b3f]/15 leading-relaxed text-[#4b2f23]/80">{monument1.culturalSignificance}</td>
                <td className="p-4 border-l border-[#aa7b3f]/15 leading-relaxed text-[#4b2f23]/80">{monument2.culturalSignificance}</td>
              </tr>

              {/* UNESCO Status */}
              <tr>
                <td className="p-4 font-bold text-[#b65a3a]">UNESCO Listing</td>
                <td className="p-4 border-l border-[#aa7b3f]/15">
                  {monument1.unescoYear ? `Inscribed in ${monument1.unescoYear}` : 'Protected regional site'}
                </td>
                <td className="p-4 border-l border-[#aa7b3f]/15">
                  {monument2.unescoYear ? `Inscribed in ${monument2.unescoYear}` : 'Protected regional site'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
