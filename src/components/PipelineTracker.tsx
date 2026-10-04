import React, { useState } from 'react';
import {
  PhoneCall,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { QuoteDealData, EngagementData, BrokerData } from '@/lib/mockDb';

interface PipelineTrackerProps {
  deals: QuoteDealData[];
  engagements: EngagementData[];
  broker: BrokerData;
  onAddEngagement: (newEng: Partial<EngagementData>) => void;
  onUpdateDealStage: (dealId: string, newStage: any) => void;
}

const STAGES = [
  { id: 'LEAD', title: 'Lead Generation', color: 'border-slate-300 bg-slate-50' },
  { id: 'PRICING_REVIEW', title: 'Pricing & Rate Review', color: 'border-teal-200 bg-[#E0F2F4]/50' },
  { id: 'PROPOSAL_SENT', title: 'Proposal Sent', color: 'border-teal-300 bg-[#E0F2F4]' },
  { id: 'CLOSED_WON', title: 'Closed Won', color: 'border-teal-400 bg-teal-100' },
  { id: 'CLOSED_LOST', title: 'Closed Lost', color: 'border-pink-200 bg-[#FCE8E6]' },
];

export const PipelineTracker: React.FC<PipelineTrackerProps> = ({
  deals,
  engagements,
  broker,
  onAddEngagement,
  onUpdateDealStage,
}) => {
  const [activeTab, setActiveTab] = useState<'PIPELINE' | 'ENGAGEMENTS'>('PIPELINE');
  const [showLogModal, setShowLogModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newChannel, setNewChannel] = useState('CALL');
  const [newNotes, setNewNotes] = useState('');

  const handleLogInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEngagement({
      brokerId: broker.id,
      title: newTitle,
      channel: newChannel,
      notes: newNotes,
      loggedBy: `${broker.companyName}`,
      scheduledAt: new Date().toISOString(),
    });
    setNewTitle('');
    setNewNotes('');
    setShowLogModal(false);
  };

  const calculatePipelineTotal = () => {
    return deals.reduce((acc, d) => acc + d.totalPremium, 0);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E5E5E3] overflow-hidden">
      {/* Banner */}
      <div className="bg-[#FFFFFF] p-6 sm:p-8 border-b border-[#E5E5E3]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#E0F2F4] text-[#0299A7] text-xs font-bold px-3 py-1 rounded-full mb-3">
              <TrendingUp className="w-4 h-4 text-[#0299A7]" />
              <span>Broker Relationship CRM & Sales Enablement</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#22282B]">Deal Pipeline & Touchpoint Tracker</h2>
            <p className="text-slate-600 text-sm mt-1">
              Track corporate bids, manage client negotiations, and log interaction history.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-[#E0F2F4] p-3 rounded-xl border border-teal-200 text-right">
              <p className="text-[10px] text-[#037A86] font-bold uppercase">Total Pipeline Value</p>
              <p className="text-xl font-black text-[#0299A7] font-mono">
                ₦{calculatePipelineTotal().toLocaleString()}
              </p>
            </div>

            <div className="flex items-center space-x-1.5 bg-[#F2F2F0] p-1.5 rounded-xl border border-[#E5E5E3]">
              <button
                onClick={() => setActiveTab('PIPELINE')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'PIPELINE' ? 'bg-[#0299A7] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Deal Pipeline
              </button>
              <button
                onClick={() => setActiveTab('ENGAGEMENTS')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'ENGAGEMENTS' ? 'bg-[#0299A7] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Touchpoint Logs
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 bg-white">
        {activeTab === 'PIPELINE' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto">
            {STAGES.map((stage) => {
              const stageDeals = deals.filter((d) => d.stage === stage.id);
              const stageTotal = stageDeals.reduce((acc, d) => acc + d.totalPremium, 0);

              return (
                <div key={stage.id} className={`p-4 rounded-xl border ${stage.color} flex flex-col justify-between min-w-[240px]`}>
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                      <h4 className="font-bold text-[#22282B] text-xs">{stage.title}</h4>
                      <span className="text-[10px] bg-white text-[#037A86] font-extrabold px-2 py-0.5 rounded-full border shadow-xs">
                        {stageDeals.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {stageDeals.map((deal) => (
                        <div key={deal.id} className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-[#0299A7] transition-all">
                          <p className="font-bold text-slate-900 text-xs">{deal.companyName}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{deal.totalLives} Enrollees</p>
                          <p className="text-xs font-extrabold text-[#037A86] font-mono mt-2">
                            ₦{deal.totalPremium.toLocaleString()}
                          </p>

                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="text-slate-500">{deal.contactPerson}</span>
                            <select
                              value={deal.stage}
                              onChange={(e) => onUpdateDealStage(deal.id, e.target.value)}
                              className="bg-slate-50 text-slate-800 font-bold border border-slate-200 rounded px-1.5 py-0.5"
                            >
                              <option value="LEAD">Lead</option>
                              <option value="PRICING_REVIEW">Pricing</option>
                              <option value="PROPOSAL_SENT">Proposal</option>
                              <option value="CLOSED_WON">Closed Won</option>
                              <option value="CLOSED_LOST">Lost</option>
                            </select>
                          </div>
                        </div>
                      ))}

                      {stageDeals.length === 0 && (
                        <p className="text-[11px] text-slate-400 italic text-center py-6">No active deals in this stage</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-slate-200/80 text-right">
                    <p className="text-[10px] text-slate-500">Stage Subtotal</p>
                    <p className="text-xs font-bold font-mono text-slate-800">
                      ₦{stageTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#037A86]">Logged Interaction Touchpoints</h3>
              <button
                onClick={() => setShowLogModal(true)}
                className="px-4 py-2 bg-[#0299A7] hover:bg-[#037A86] text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Log New Interaction</span>
              </button>
            </div>

            <div className="space-y-3">
              {engagements.map((eng) => (
                <div key={eng.id} className="p-4 border border-slate-200 rounded-xl bg-[#F2F2F0] flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-[#E0F2F4] text-[#037A86] rounded-lg shrink-0 mt-0.5">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#22282B] text-sm">{eng.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{eng.notes}</p>
                      <div className="flex items-center space-x-3 mt-2 text-[11px] text-slate-500">
                        <span>Logged by: <strong className="text-slate-800">{eng.loggedBy}</strong></span>
                        <span>•</span>
                        <span>Channel: <strong className="text-slate-800">{eng.channel}</strong></span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] bg-white border border-slate-200 text-[#037A86] font-bold px-2.5 py-1 rounded-full shrink-0">
                    {new Date(eng.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Log Touchpoint Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-[#037A86] mb-4">Log Interaction Touchpoint</h3>
            <form onSubmit={handleLogInteraction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Corporate Rate Sheet Sent to CEO"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#0299A7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Interaction Channel</label>
                <select
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#0299A7]"
                >
                  <option value="CALL">Phone Call</option>
                  <option value="MEETING">In-Person Meeting</option>
                  <option value="EMAIL">Email Correspondence</option>
                  <option value="PITCH">Corporate Pitch Presentation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Interaction Notes</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details of discussion and agreed next steps..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-[#0299A7]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0299A7] text-white text-xs font-bold rounded-lg shadow hover:bg-[#037A86]"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
