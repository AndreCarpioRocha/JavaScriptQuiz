import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useQuestions = create(
    persist(
        (set, get) => ({
            questions: [],
            currentQuestion: 0,
            timer: 0,
            nextQuestion: () => {
                if (get().questions.length === 0) return;

                let auxNext = get().currentQuestion + 1;
                if (auxNext >= get().questions.length) return;

                set({ currentQuestion: auxNext });
            },
            priorQuestion: () => {
                if (get().questions.length === 0) return;

                let auxPrior = get().currentQuestion - 1;
                if (auxPrior < 0) return;

                set({ currentQuestion: auxPrior });
            },
            moveToQuestion: (num) => {
                num = parseInt(num)
                if (isNaN((num))) {
                    return
                }
                if (num < 0 || num >= get().questions.length) {
                    return
                }

                set({ currentQuestion: num })
            }
            ,
            getQuestions: async () => {
                try {
                    let res = await fetch('/files/questions.json');

                    if (!res.ok) {
                        return
                    }

                    let resJSON = await res.json();
                    set({ questions: resJSON, currentQuestion: 0 });
                } catch (error) {
                    console.error("Error al obtener preguntas:", error);
                }
            },
            selectAnswer: (indexQuestion, indexAnwer) => {
                let auxQuestions = structuredClone(get().questions)
                auxQuestions[indexQuestion].answerSelected = indexAnwer;
                set({ questions: auxQuestions })
            },

            restart: () => {
                set({ questions: [], currentQuestion: 0, timer: 0 })
            },
            setTimer: (num) => {

                set({ timer: num })
            }
        }),
        {
            name: "questios",
            version: 1,
        }
    )
)