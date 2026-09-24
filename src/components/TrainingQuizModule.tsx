import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  PlayCircle,
  FileText,
  Download,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { BrokerData } from '@/lib/mockDb';

interface TrainingQuizModuleProps {
  broker: BrokerData;
  onUpdateBroker: (updated: Partial<BrokerData>) => void;
}

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Under National Health Insurance Authority (NHIA) regulations, what is the mandatory requirement for a broker before presenting official HMO rate cards to corporate clients?",
    options: [
      "No license is needed for corporate pitches.",
      "The broker must have an active NAICOM license and verified NHIA accreditation status.",
      "Brokers only require CAC corporate registration.",
      "Brokers can sell without accreditation if they have a signed letter of intent.",
    ],
    correct: 1,
  },
  {
    id: 2,
    question: "According to FIRS regulations, what is the standard Withholding Tax (WHT) deduction rate on commission payouts for a Corporate Brokerage Firm in Nigeria?",
    options: ["10%", "5%", "15%", "0%"],
    correct: 1,
  },
  {
    id: 3,
    question: "How does Mitera Health's banded pricing discount structure operate for corporate workforce volume?",
    options: ["Flat price regardless of headcount.", "Price per enrollee increases as headcount grows.", "Price per enrollee decreases progressively at 50+ and 100+ enrollee bands.", "Discounts are only provided for executive care plans."],
    correct: 2,
  },
  {
    id: 4,
    question: "What is the primary objective of the NDPA 2023 compliance consent requirement in the Mitera BRM Portal?",
    options: [
      "To allow selling enrollee data to third-party marketers.",
      "To legally protect and process corporate PII solely for HMO enrollment and regulatory audit.",
      "To bypass NHIA background checks.",
      "To enforce non-refundable subscription deposits.",
    ],
    correct: 1,
  },
];

export const TrainingQuizModule: React.FC<TrainingQuizModuleProps> = ({
  broker,
  onUpdateBroker,
}) => {
  const [activeTab, setActiveTab] = useState<'COURSE' | 'QUIZ'>('COURSE');
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(broker.quizScore || null);
  const [passed, setPassed] = useState<boolean>(broker.quizPassed || false);

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleCalculateQuiz = () => {
    let correctCount = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct) {
        correctCount += 1;
      }
    });

    const finalScore = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
    const isPassed = finalScore >= 75;

    setScore(finalScore);
    setPassed(isPassed);
    setSubmitted(true);

    onUpdateBroker({
      quizPassed: isPassed,
      quizScore: finalScore,
      certifiedAt: isPassed ? new Date().toISOString() : undefined,
    });
  };

  const generateCertificatePdf = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Decorative Borders
    doc.setDrawColor(14, 116, 144); // Teal 700
    doc.setLineWidth(3);
    doc.rect(10, 10, 277, 190);

    doc.setDrawColor(16, 185, 129); // Emerald 500
    doc.setLineWidth(1);
    doc.rect(14, 14, 269, 182);

    // Header
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(15, 23, 42);
    doc.text('MITERA HEALTH LIMITED', 148.5, 40, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(14, 116, 144);
    doc.text('NATIONAL HEALTH INSURANCE AUTHORITY (NHIA) COMPLIANCE CERTIFICATION', 148.5, 50, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text('This is to certify that', 148.5, 70, { align: 'center' });

    // Broker Name
    doc.setFontSize(24);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(broker.companyName.toUpperCase(), 148.5, 85, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(
      'has successfully completed the Mandatory NHIA Code of Ethics, Product Structure,',
      148.5,
      100,
      { align: 'center' }
    );
    doc.text(
      'and Corporate Health Insurance Distribution Curriculum.',
      148.5,
      107,
      { align: 'center' }
    );

    // Score & Code Info
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129);
    doc.text(`Passing Grade: ${score ?? 90}% | NHIA Accreditation Code: ${broker.nhiaAccreditationNo || 'NHIA/ACT/9902'}`, 148.5, 122, { align: 'center' });

    // Date & Signatures
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Issued Date: ${new Date().toLocaleDateString('en-GB')}`, 50, 160);
    doc.text(`Certificate No: MTR-CERT-${broker.brokerCode || '1001'}`, 200, 160);

    doc.setLineWidth(0.5);
    doc.setDrawColor(203, 213, 225);
    doc.line(40, 175, 100, 175);
    doc.line(195, 175, 255, 175);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('Head of Legal & Compliance', 70, 180, { align: 'center' });
    doc.text('Managing Director / CEO', 225, 180, { align: 'center' });

    doc.save(`Mitera_Broker_Certificate_${broker.brokerCode || '1001'}.pdf`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30 mb-3">
              <GraduationCap className="w-4 h-4" />
              <span>Mandatory Partner Training & Certification</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">NHIA Ethics & Product Mastery Course</h2>
            <p className="text-slate-300 text-sm mt-1">
              Complete product training modules and achieve at least 75% score on the ethics assessment to sell Mitera Care Plans.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('COURSE')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'COURSE' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Course Modules
            </button>
            <button
              onClick={() => setActiveTab('QUIZ')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'QUIZ' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Ethics & Assessment Quiz
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {activeTab === 'COURSE' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 hover:border-teal-300 transition-all">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">NHIA Regulatory Guidelines & Code of Ethics</h4>
                    <p className="text-xs text-slate-500">Duration: 15 mins • Video & PDF</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Overview of National Health Insurance Authority Act 2022, compliance checks, mandatory SLAs, and ethical representation of HMO benefits.
                </p>
                <div className="flex items-center justify-between text-xs font-semibold text-teal-700">
                  <span className="flex items-center space-x-1">
                    <PlayCircle className="w-4 h-4" />
                    <span>Watch Training Video</span>
                  </span>
                  <span className="text-emerald-600 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 hover:border-teal-300 transition-all">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Mitera Plan Architecture & Hospital Network Tiers</h4>
                    <p className="text-xs text-slate-500">Duration: 20 mins • Interactive Guide</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  In-depth breakdown of Retail Bronze, Corporate Silver, Executive Gold, and Maternity Savings Cards®. Learn how to match client budgets to hospital tiers.
                </p>
                <div className="flex items-center justify-between text-xs font-semibold text-teal-700">
                  <span className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>Read Plan Structure</span>
                  </span>
                  <span className="text-emerald-600 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-emerald-950 text-base">Ready for your Certification Quiz?</h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Take the 4-question assessment. Scoring 75% or higher unlocks your official Mitera Partner Accreditation Certificate.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('QUIZ')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-md shrink-0"
              >
                Start Quiz Now
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 max-w-3xl mx-auto">
            {/* Quiz Result Header if completed */}
            {submitted || passed ? (
              <div
                className={`p-6 rounded-2xl border ${
                  passed ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {passed ? (
                      <Award className="w-10 h-10 text-emerald-600" />
                    ) : (
                      <XCircle className="w-10 h-10 text-rose-600" />
                    )}
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900">
                        {passed ? 'Congratulations! Certification Earned' : 'Assessment Not Passed'}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Your Score: <span className="font-bold text-slate-900">{score ?? 90}%</span> (Passing score: 75%)
                      </p>
                    </div>
                  </div>

                  {passed && (
                    <button
                      onClick={generateCertificatePdf}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Certificate PDF</span>
                    </button>
                  )}
                </div>
              </div>
            ) : null}

            {/* Questions List */}
            <div className="space-y-6">
              {QUIZ_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="p-5 border border-slate-200 rounded-xl bg-slate-50/60">
                  <p className="font-bold text-slate-900 text-sm mb-3">
                    <span className="text-teal-700 mr-1.5">Q{idx + 1}.</span> {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      const isCorrect = q.correct === optIdx;

                      let btnStyle = 'border-slate-200 bg-white text-slate-700 hover:border-slate-300';
                      if (submitted) {
                        if (isCorrect) btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                        else if (isSelected) btnStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                      } else if (isSelected) {
                        btnStyle = 'border-teal-600 bg-teal-50 text-teal-900 font-semibold ring-2 ring-teal-500/20';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full text-left p-3 text-xs rounded-lg border transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!submitted && (
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleCalculateQuiz}
                  disabled={Object.keys(selectedAnswers).length < QUIZ_QUESTIONS.length}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
                >
                  Submit Assessment Quiz
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
