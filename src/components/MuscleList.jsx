import { useState } from "react";
import { useStore } from "../store/useStore";
import { muscles, groups } from "../data/muscles";


const PROGRESS_STYLE = {
  unseen:   { dot: "bg-white/20",    text: "미학습" },
  learning: { dot: "bg-amber-400",   text: "학습중" },
  done:     { dot: "bg-emerald-400", text: "완료"   },
};

export default function MuscleList() {
  const { selectMuscle, getProgress } = useStore();
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = q
    ? muscles.filter(
        (m) =>
          m.name.includes(q) ||
          m.nameEn.toLowerCase().includes(q) ||
          m.group.includes(q) ||
          m.exercises?.some((ex) => ex.toLowerCase().includes(q))
      )
    : muscles;

  const visibleGroups = q
    ? [...new Set(filtered.map((m) => m.group))]
    : groups;

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="근육명, 그룹, 운동명 검색..."
          className="w-full bg-white/6 border border-white/10 rounded-xl pl-9 pr-9 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-violet-500/60 focus:bg-white/8 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Results count when searching */}
      {q && (
        <p className="text-white/30 text-xs px-1">
          {filtered.length}개 근육 검색됨
        </p>
      )}

      {/* List */}
      {visibleGroups.map((group) => {
        const groupMuscles = filtered.filter((m) => m.group === group);
        if (!groupMuscles.length) return null;
        return (
          <div key={group}>
            <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 px-1">{group}</h3>
            <div className="space-y-1">
              {groupMuscles.map((m) => {
                const prog = getProgress(m.id);
                const style = PROGRESS_STYLE[prog];
                return (
                  <button
                    key={m.id}
                    onClick={() => selectMuscle(m.id)}
                    className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="shrink-0 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-sm font-medium leading-tight">{m.name}</p>
                      <p className="text-white/0 group-hover:text-white/40 text-xs truncate transition-colors duration-150">{m.nameEn}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      <span className="text-white/30 text-xs">{style.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {q && filtered.length === 0 && (
        <p className="text-center text-white/25 text-sm py-8">검색 결과가 없어요</p>
      )}
    </div>
  );
}
