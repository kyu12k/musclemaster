import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set, get) => ({
      // 'explore' | 'quiz'
      mode: "explore",
      selectedMuscleId: null,
      cardStep: 0, // 0:기시 1:정지 2:작용 3:큐잉
      // muscle progress: { [id]: 'unseen' | 'learning' | 'done' }
      progress: {},

      setMode: (mode) => set({ mode, selectedMuscleId: null, cardStep: 0 }),
      selectMuscle: (id) => set({ selectedMuscleId: id, cardStep: 0 }),
      clearMuscle: () => set({ selectedMuscleId: null, cardStep: 0 }),
      nextStep: () => set((s) => ({ cardStep: Math.min(s.cardStep + 1, 3) })),
      prevStep: () => set((s) => ({ cardStep: Math.max(s.cardStep - 1, 0) })),
      setStep: (n) => set({ cardStep: n }),

      markProgress: (id, status) =>
        set((s) => ({ progress: { ...s.progress, [id]: status } })),

      getProgress: (id) => get().progress[id] ?? "unseen",

      resetProgress: () => set({ progress: {} }),

      // Quiz state
      quizQueue: [],
      quizIndex: 0,
      quizAnswer: null,
      quizRevealed: false,
      quizWrong: [], // ids that were answered incorrectly

      startQuiz: (queue) =>
        set({ quizQueue: queue, quizIndex: 0, quizAnswer: null, quizRevealed: false, quizWrong: [], mode: "quiz" }),
      nextQuiz: () =>
        set((s) => ({
          quizIndex: s.quizIndex + 1,
          quizAnswer: null,
          quizRevealed: false,
          cardStep: 0,
        })),
      selectAnswer: (id) =>
        set((s) => {
          const correctId = s.quizQueue[s.quizIndex];
          const wrong = id !== correctId ? [...s.quizWrong, correctId] : s.quizWrong;
          return { quizAnswer: id, quizRevealed: true, quizWrong: wrong };
        }),
    }),
    {
      name: "musclemaster-storage",
      partialize: (s) => ({ progress: s.progress }),
    }
  )
);
