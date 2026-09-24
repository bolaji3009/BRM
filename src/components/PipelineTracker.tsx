import React, { useState } from 'react';
import {
  Kanban,
  PhoneCall,
  Users,
  Building,
  Plus,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock,
  TrendingUp,
  Briefcase,
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
  { id: 'PRICING_REVIEW', title: 'Pricing & Rate Review', color: 'border-amber-300 bg-amber-50/50' },
  { id: 'PROPOSAL_SENT', title: 'Proposal Sent', color: 'border-cyan-300 bg-cyan-50/50' },
  { id: 'CLOSED_WON', title: 'Closed Won', color: 'border-emerald-300 bg-emerald-50/50' },
  { id: 'CLOSED_LOST', title: 'Closed Lost', color: 'border-rose-300 bg-rose-50/50' },
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-cyan-500/20 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full border border-cyan-500/30 mb-3">
              <TrendingUp className="w-4 h-4" />
              <span>Broker Relationship CRM & Sales Enablement</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Deal Pipeline & Touchpoint Tracker</h2>
            <p className="text-slate-300 text-sm mt-1">
              Track corporate bids, manage client negotiations, and log interaction history.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Total Pipeline Value</p>
              <p className="text-xl font-extrabold text-teal-400 font-mono">
                ₦{calculatePipelineTotal().toLocaleString()}
              </p>
            </div>

            <div className="flex items-center space-x-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveTab('PIPELINE')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'PIPELINE' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Deal Pipeline
              </button>
              <button
                onClick={() => setActiveTab('ENGAGEMENTS')}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'ENGAGEMENTS' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Touchpoint Logs
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {activeTab === 'PIPELINE' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto">
            {STAGES.map((stage) => {
              const stageDeals = deals.filter((d) => d.stage === stage.id);
              const stageTotal = stageDeals.reduce((acc, d) => acc + d.totalPremium, 0);

              return (
                <div key={stage.id} className={`p-4 rounded-xl border ${stage.color} flex flex-col justify-between min-w-[240px]`}>
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                      <h4 className="font-bold text-slate-900 text-xs">{stage.title}</h4>
                      <span className="text-[10px] bg-white text-slate-700 font-extrabold px-2 py-0.5 rounded-full border shadow-xs">
                        {stageDeals.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {stageDeals.map((deal) => (
                        <div key={deal.id} className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-400 transition-all">
                          <p className="font-bold text-slate-900 text-xs">{deal.companyName}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{deal.totalLives} Enrollees</p>
                          <p className="text-xs font-extrabold text-teal-700 font-mono mt-2">
                            ₦{deal.totalPremium.toLocaleString()}
                          </p>

                          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">{deal.contactPerson}</span>
                            <select
                              value={deal.stage}
                              onChange={(e) => onUpdateDealStage(deal.id, e.target.value)}
                              className="bg-slate-50 text-slate-700 font-semibold border border-slate-200 rounded px-1.5 py-0.5"
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
              <h3 className="text-base font-bold text-slate-900">Logged Interaction Touchpoints</h3>
              <button
                onClick={() => setShowLogModal(true)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Log New Interaction</span>
              </button>
            </div>

            <div className="space-y-3">
              {engagements.map((eng) => (
                <div key={eng.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-teal-100 text-teal-800 rounded-lg shrink-0 mt-0.5">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{eng.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{eng.notes}</p>
                      <div className="flex items-center space-x-3 mt-2 text-[11px] text-slate-400">
                        <span>Logged by: <strong className="text-slate-700">{eng.loggedBy}</strong></span>
                        <span>•</span>
                        <span>Channel: <strong className="text-slate-700">{eng.channel}</strong></span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] bg-white border border-slate-200 text-slate-500 font-semibold px-2.5 py-1 rounded-full shrink-0">
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Log Interaction Touchpoint</h3>
            <form onSubmit={handleLogInteraction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Corporate Rate Sheet Sent to CEO"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Interaction Channel</label>
                <select
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                >
                  <option value="CALL">Phone Call</option>
                  <option value="MEETING">In-Person Meeting</option>
                  <option value="EMAIL">Email Correspondence</option>
                  <option value="PITCH">Corporate Pitch Presentation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Interaction Notes</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details of discussion and agreed next steps..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg shadow"
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
