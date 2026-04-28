import { useState } from "react";
import { useStore } from "../store/useStore";
import { muscles } from "../data/muscles";

const STEPS = [
  { key: "origin",    label: "기시 (Origin)",    icon: "📍", color: "from-violet-600 to-purple-700" },
  { key: "insertion", label: "정지 (Insertion)",  icon: "🎯", color: "from-blue-600 to-cyan-700" },
  { key: "action",    label: "작용 (Action)",     icon: "⚡", color: "from-emerald-600 to-teal-700" },
  { key: "cues",      label: "필라테스 큐잉",     icon: "🗣️", color: "from-pink-600 to-rose-700" },
];

export default function MuscleCard() {
  const { selectedMuscleId, cardStep, nextStep, prevStep, setStep, clearMuscle, markProgress } = useStore();
  const [imgError, setImgError] = useState(false);
  const [showEn, setShowEn] = useState(false);

  const muscle = muscles.find((m) => m.id === selectedMuscleId);
  if (!muscle) return null;

  const step = STEPS[cardStep];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#13131f] rounded-2xl overflow-hidden shadow-2xl border border-white/10 max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className={`bg-gradient-to-r ${step.color} p-5 shrink-0`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-xs font-medium mb-1">{muscle.group}</p>
              <h2 className="text-white text-2xl font-bold">{muscle.name}</h2>
              <button
                onClick={() => setShowEn((v) => !v)}
                className="text-white/50 text-xs mt-0.5 hover:text-white/80 transition-colors flex items-center gap-1"
              >
                {showEn ? "▲ 영문명 숨기기" : "▼ 영문명 보기"}
              </button>
              {showEn && (
                <p className="text-white/70 text-sm mt-1">{muscle.nameEn}</p>
              )}
            </div>
            <button
              onClick={clearMuscle}
              className="text-white/60 hover:text-white text-2xl leading-none ml-4 mt-1"
            >
              ×
            </button>
          </div>

          {/* Step indicators */}
          <div className="flex gap-2 mt-4">
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                  i <= cardStep ? "bg-white" : "bg-white/25"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">
          {/* Anatomy image */}
          {muscle.imageUrl && !imgError && (
            <div className="bg-white mx-4 mt-4 rounded-xl overflow-hidden flex items-center justify-center" style={{ minHeight: "180px", maxHeight: "240px" }}>
              <img
                src={muscle.imageUrl}
                alt={`${muscle.name} 해부학 이미지`}
                className="w-full h-full object-contain"
                style={{ maxHeight: "240px" }}
                onError={() => setImgError(true)}
              />
            </div>
          )}

          {/* Attribution */}
          {muscle.imageUrl && !imgError && (
            <p className="text-white/20 text-[10px] text-center mt-1 px-4">
              출처: Wikimedia Commons (CC BY-SA / Public Domain)
            </p>
          )}

          {/* Related exercises — always visible */}
          {muscle.exercises?.length > 0 && (
            <div className="px-5 pt-3 pb-1">
              <p className="text-white/35 text-[11px] font-semibold uppercase tracking-wider mb-2">관련 운동</p>
              <div className="flex flex-wrap gap-1.5">
                {muscle.exercises.map((ex) => (
                  <span
                    key={ex}
                    className="px-2.5 py-1 rounded-full text-xs font-medium border"
                    style={{
                      borderColor: muscle.color + "60",
                      color: muscle.color,
                      backgroundColor: muscle.color + "15",
                    }}
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Step label */}
          <div className="px-5 pt-3 pb-2 flex items-center gap-2">
            <span className="text-lg">{step.icon}</span>
            <span className="text-white/50 text-sm font-semibold tracking-wider uppercase">{step.label}</span>
          </div>

          {/* Content */}
          <div className="px-5 pb-4">
            {cardStep === 3 ? (
              <ul className="space-y-3">
                {muscle.cues.map((cue, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-pink-400 font-bold mt-0.5 shrink-0">{i + 1}.</span>
                    <p className="text-white/90 text-sm leading-relaxed">{cue}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">{muscle[step.key]}</p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="px-5 py-4 border-t border-white/8 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={prevStep}
            disabled={cardStep === 0}
            className="px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm font-medium disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            ← 이전
          </button>

          {cardStep < 3 ? (
            <button
              onClick={nextStep}
              className={`flex-1 py-2.5 rounded-xl bg-gradient-to-r ${step.color} text-white font-semibold text-sm hover:opacity-90 transition-opacity`}
            >
              다음 단계 →
            </button>
          ) : (
            <div className="flex-1 flex gap-2">
              <button
                onClick={() => { markProgress(muscle.id, "learning"); clearMuscle(); }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-sm hover:bg-amber-500/30 transition-colors"
              >
                △ 다시볼게요
              </button>
              <button
                onClick={() => { markProgress(muscle.id, "done"); clearMuscle(); }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold text-sm hover:bg-emerald-500/30 transition-colors"
              >
                ✓ 외웠어요
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
