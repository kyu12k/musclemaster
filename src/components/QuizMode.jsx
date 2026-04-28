import { useStore } from "../store/useStore";
import { muscles } from "../data/muscles";
import { useMemo } from "react";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function QuizResult({ total, wrong, onRetry, onExit }) {
  const correct = total - wrong.length;
  const pct = Math.round((correct / total) * 100);

  const emoji = pct === 100 ? "🏆" : pct >= 70 ? "👍" : "💪";
  const msg   = pct === 100 ? "완벽해요!" : pct >= 70 ? "잘 하셨어요!" : "조금 더 연습해봐요!";

  return (
    <div className="flex flex-col px-5 py-8 gap-6">
      {/* Score */}
      <div className="text-center">
        <div className="text-5xl mb-3">{emoji}</div>
        <h2 className="text-white text-2xl font-bold mb-1">{msg}</h2>
        <p className="text-white/40 text-sm">{total}문제 중 {correct}개 정답</p>
      </div>

      {/* Score bar */}
      <div className="bg-white/8 rounded-2xl p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-emerald-400 font-semibold">정답 {correct}</span>
            <span className="text-red-400 font-semibold">오답 {wrong.length}</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <span className="text-white font-bold text-xl shrink-0">{pct}%</span>
      </div>

      {/* Wrong list */}
      {wrong.length > 0 && (
        <div>
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">다시 볼 근육</p>
          <div className="space-y-1.5">
            {wrong.map((id) => {
              const m = muscles.find((x) => x.id === id);
              if (!m) return null;
              return (
                <div key={id} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                  <div>
                    <p className="text-white/90 text-sm font-medium">{m.name}</p>
                    <p className="text-white/30 text-xs">{m.group}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {wrong.length > 0 && (
          <button
            onClick={onRetry}
            className="flex-1 py-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-sm hover:bg-amber-500/30 transition-colors"
          >
            오답만 다시 풀기
          </button>
        )}
        <button
          onClick={onExit}
          className="flex-1 py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-500 transition-colors"
        >
          탐색으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default function QuizMode() {
  const {
    quizQueue, quizIndex, quizAnswer, quizRevealed, quizWrong,
    selectAnswer, nextQuiz, setMode, markProgress, startQuiz,
  } = useStore();

  const currentId = quizQueue[quizIndex];
  const current = muscles.find((m) => m.id === currentId);

  const options = useMemo(() => {
    if (!current) return [];
    const others = shuffle(muscles.filter((m) => m.id !== current.id)).slice(0, 3);
    return shuffle([current, ...others]);
  }, [currentId]);

  if (!current) {
    return (
      <QuizResult
        total={quizQueue.length}
        wrong={quizWrong}
        onRetry={() => startQuiz(shuffle(quizWrong))}
        onExit={() => setMode("explore")}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="h-1 bg-white/10 rounded-full mx-4 mt-4">
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-500"
          style={{ width: `${(quizIndex / quizQueue.length) * 100}%` }}
        />
      </div>
      <p className="text-white/30 text-xs text-center mt-2">
        {quizIndex + 1} / {quizQueue.length}
      </p>

      <div className="flex-1 flex flex-col justify-center px-5 gap-5 pb-safe" style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}>
        {/* Cue card */}
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-3">필라테스 큐잉</p>
          <ul className="space-y-2">
            {current.cues.map((cue, i) => (
              <li key={i} className="text-white text-sm leading-relaxed flex gap-2">
                <span className="text-violet-400 shrink-0">{i + 1}.</span>
                <span>{cue}</span>
              </li>
            ))}
          </ul>
          {quizRevealed && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">작용</p>
              <p className="text-white/80 text-xs leading-relaxed whitespace-pre-line">{current.action}</p>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-2">
          {options.map((opt) => {
            let style = "bg-white/5 border-white/10 text-white/80 hover:bg-white/10";
            if (quizRevealed) {
              if (opt.id === current.id) style = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300";
              else if (opt.id === quizAnswer) style = "bg-red-500/20 border-red-500/50 text-red-300";
              else style = "bg-white/3 border-white/5 text-white/30";
            }
            return (
              <button
                key={opt.id}
                disabled={quizRevealed}
                onClick={() => {
                  selectAnswer(opt.id);
                  markProgress(current.id, opt.id === current.id ? "done" : "learning");
                }}
                className={`border rounded-xl py-3 px-3 text-sm font-medium transition-all text-left ${style}`}
              >
                <p className="font-bold">{opt.name}</p>
              </button>
            );
          })}
        </div>

        {quizRevealed && (
          <button
            onClick={nextQuiz}
            className="w-full py-3 rounded-xl bg-violet-600 text-white font-semibold hover:bg-violet-500 transition-colors"
          >
            다음 문제 →
          </button>
        )}
      </div>
    </div>
  );
}
