import { useState } from "react";
import { useStore } from "./store/useStore";
import { muscles, groups } from "./data/muscles";
import BodyMap from "./components/BodyMap";
import MuscleCard from "./components/MuscleCard";
import MuscleList from "./components/MuscleList";
import QuizMode from "./components/QuizMode";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function App() {
  const { mode, setMode, selectedMuscleId, startQuiz, progress, resetProgress } = useStore();
  const [bodySide, setBodySide] = useState("front");
  const [activeTab, setActiveTab] = useState("map");
  const [confirmReset, setConfirmReset] = useState(false);
  const [showQuizPicker, setShowQuizPicker] = useState(false);
  const [filterGroup, setFilterGroup] = useState(null); // null = 전체

  const stats = {
    unseen: muscles.filter((m) => !progress[m.id] || progress[m.id] === "unseen").length,
    learning: muscles.filter((m) => progress[m.id] === "learning").length,
    done: muscles.filter((m) => progress[m.id] === "done").length,
  };

  const handleStartQuiz = (group = null) => {
    const pool = group ? muscles.filter((m) => m.group === group) : muscles;
    const queue = shuffle(pool).map((m) => m.id);
    startQuiz(queue);
    setShowQuizPicker(false);
  };

  const handleReset = () => {
    if (confirmReset) {
      resetProgress();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto">
      {/* Header */}
      <header className="px-5 pt-5 pb-3 border-b border-white/8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">머슬마스터</h1>
            <p className="text-white/40 text-xs">필라테스 해부학 큐잉</p>
          </div>
          <div className="flex items-center gap-2">
            {mode !== "quiz" && (
              <button
                onClick={handleReset}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  confirmReset
                    ? "bg-red-500/20 border border-red-500/50 text-red-400"
                    : "bg-white/6 text-white/35 hover:text-white/60 hover:bg-white/10"
                }`}
              >
                {confirmReset ? "확인?" : "초기화"}
              </button>
            )}
            {mode === "quiz" ? (
              <button
                onClick={() => setMode("explore")}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 text-white/60 hover:bg-white/15 transition-colors"
              >
                × 퀴즈 종료
              </button>
            ) : (
              <button
                onClick={() => setShowQuizPicker((v) => !v)}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 text-white hover:bg-violet-500 transition-colors"
              >
                퀴즈 시작
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <Stat label="미학습" value={stats.unseen} color="text-white/40" />
          <Stat label="학습중" value={stats.learning} color="text-amber-400" />
          <Stat label="완료"   value={stats.done}     color="text-emerald-400" />
        </div>

        {/* Quiz group picker */}
        {showQuizPicker && (
          <div className="mt-3 p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">범위 선택</p>
            <button
              onClick={() => handleStartQuiz(null)}
              className="w-full text-left px-3 py-2 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm font-medium hover:bg-violet-600/30 transition-colors"
            >
              전체 ({muscles.length}개)
            </button>
            {groups.map((g) => (
              <button
                key={g}
                onClick={() => handleStartQuiz(g)}
                className="w-full text-left px-3 py-2 rounded-lg bg-white/5 text-white/70 text-sm hover:bg-white/10 transition-colors"
              >
                {g} ({muscles.filter((m) => m.group === g).length}개)
              </button>
            ))}
          </div>
        )}
      </header>

      {mode === "quiz" ? (
        <div className="flex-1 overflow-y-auto">
          <QuizMode />
        </div>
      ) : (
        <>
          <div className="flex border-b border-white/8">
            {[["map", "바디맵"], ["list", "목록"]].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-violet-400 border-b-2 border-violet-400"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === "map" ? (
              <div className="p-4">
                {/* 전면/후면 토글 */}
                <div className="flex gap-2 mb-3 justify-center">
                  {[["front", "전면"], ["back", "후면"]].map(([s, label]) => (
                    <button
                      key={s}
                      onClick={() => setBodySide(s)}
                      className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        bodySide === s
                          ? "bg-violet-600 text-white"
                          : "bg-white/8 text-white/50 hover:bg-white/12"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* 그룹 필터 */}
                <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setFilterGroup(null)}
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      filterGroup === null
                        ? "bg-violet-600 text-white"
                        : "bg-white/8 text-white/50 hover:bg-white/12"
                    }`}
                  >
                    전체
                  </button>
                  {groups.map((g) => (
                    <button
                      key={g}
                      onClick={() => setFilterGroup(filterGroup === g ? null : g)}
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        filterGroup === g
                          ? "bg-violet-600 text-white"
                          : "bg-white/8 text-white/50 hover:bg-white/12"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                {/* 범례 */}
                <div className="flex gap-4 justify-center mb-3">
                  {[["bg-white/20", "미학습"], ["bg-amber-400", "학습중"], ["bg-emerald-400", "완료"]].map(([cls, label]) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${cls}`} />
                      <span className="text-white/40 text-xs">{label}</span>
                    </div>
                  ))}
                </div>

                <BodyMap side={bodySide} filterGroup={filterGroup} />
                <p className="text-center text-white/25 text-xs mt-3">근육 영역을 탭해서 카드를 열어보세요</p>
              </div>
            ) : (
              <div className="p-4">
                <MuscleList />
              </div>
            )}
          </div>
        </>
      )}

      {selectedMuscleId && <MuscleCard />}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-sm font-bold ${color}`}>{value}</span>
      <span className="text-white/30 text-xs">{label}</span>
    </div>
  );
}
