import { useEffect, useRef, useState } from "react"
import { useQuestions } from "../../store/questions"
import { PopUpContainer } from "../../components/popups/popUpContainer"
import "./javaScriptQuiz.css"

export const JavaScriptQuizPage = () => {
    const questions = useQuestions(state => state.questions)
    const currentQuestion = useQuestions(state => state.currentQuestion)
    const nextQuestion = useQuestions(state => state.nextQuestion)
    const priorQuestion = useQuestions(state => state.priorQuestion)
    const moveToQuestion = useQuestions(state => state.moveToQuestion)
    const getQuestions = useQuestions(state => state.getQuestions)
    const selectAnswer = useQuestions(state => state.selectAnswer)
    const restart = useQuestions(state => state.restart)
    const [isOpen, setIsOpen] = useState(false)
    const idSetInterval = useRef(null)
    const timer = useQuestions(state => state.timer)
    const setTimer = useQuestions(state => state.setTimer)
    const [showResults, setShowResult] = useState(false)


    const [infoProgress, setInfoProgress] = useState({
        correct: 0,
        incorrect: 0,
        unanswerd: 0
    })

    const createInterval = () => { // fix the problem when the navigator enters to the background
        if (idSetInterval.current) {
            clearInterval(idSetInterval)
        }
        idSetInterval.current = setInterval(() => {
            if (useQuestions.getState().timer - 1 <= 0) {
                clearInterval(idSetInterval.current)
                handleFinishGame()
                return
            }
            setTimer(useQuestions.getState().timer - 1)
        }, 1000)
    }

    useEffect(() => {
        if (questions.length > 0 && timer > 0) {
            createInterval();
        }
        return (() => {
            if (idSetInterval.current) {
                clearInterval(idSetInterval.current)
            }
        }
        )
    }, [])


    useEffect(() => {
        if (questions.length === 0) {
            return
        }

        let correct = 0
        let incorrect = 0
        let unanswerd = 0

        questions.forEach(question => {
            if (question.answerSelected === null) {
                unanswerd++;
            } else {
                if (question.answerSelected === question.Correct) {
                    correct++
                } else {
                    incorrect++
                }
            }
        })

        setInfoProgress({
            correct: correct,
            incorrect: incorrect,
            unanswerd: unanswerd
        })

    }, [questions])



    const handleStartQuiz = () => {
        getQuestions()
        setTimer(100);
        setInfoProgress({
            correct: 0,
            incorrect: 0,
            unanswerd: 0
        })
        createInterval();
    }

    const handleFinishGame = () => {
        setShowResult(true)
        setIsOpen(false)
        restart()
    }

    const handleSelectAnswer = (indexQuestion, indexAsnwer) => {
        if (questions[indexQuestion].answerSelected !== null) return
        selectAnswer(indexQuestion, indexAsnwer)
    }

    const getColor = (question, index) => {
        if (question.answerSelected != null) {
            if (index === question.Correct) {
                return "correct"
            }

            if (question.answerSelected === index && index !== question.Correct) {
                return "incorrect"
            }
        }
        return ""
    }


    const handleMoveToQuestion = (num) => {
        moveToQuestion(num);
        setIsOpen(false)
    }

    function calculateScore(correct, incorrect, unanswered) {
        const totalQuestions = correct + incorrect + unanswered;
        if (totalQuestions === 0) return { score: 0, emoji: '😭' };

        const score = (correct / totalQuestions) * 100;
        let emoji;

        if (score < 20) emoji = '😭';
        else if (score < 40) emoji = '😟';
        else if (score < 60) emoji = '😐';
        else if (score < 80) emoji = '😀';
        else if (score < 100) emoji = '😲';
        else emoji = '😲';

        return { score: score.toFixed(1), emoji };
    }



    return (
        <div className="containerJavaScriptQuizPage">
            <div className="brighnessBackground b1">

            </div>

            <div className="brighnessBackground b2">

            </div>
            <div className="containerQuiz">
                <div className="titlte">
                    <div className="img">
                        <img src="/images/javascript.svg" alt="" />
                    </div>
                    <div className="text">
                        <p>JavaScript Quiz</p>
                    </div>
                </div>
                {
                    questions.length === 0 && !showResults ?
                        <button className="btnBlue btnStart" onClick={() => {
                            handleStartQuiz()
                        }}>¡START!</button>
                        :
                        ""
                }

                {
                    showResults ?
                        <>
                            <div className="resultsContainer">
                                <div className="cardResult">
                                    <h1 >
                                        Quiz Results
                                    </h1>
                                    <p className="score">
                                        {
                                            calculateScore(infoProgress.correct, infoProgress.incorrect, infoProgress.unanswerd).score
                                        } / 100
                                    </p>

                                    <div className="simbol">
                                        {
                                            calculateScore(infoProgress.correct, infoProgress.incorrect, infoProgress.unanswerd).emoji
                                        }
                                    </div>


                                    <p>
                                        ✅ {infoProgress.correct} Correct
                                    </p>
                                    <p>
                                        ❌ {infoProgress.incorrect} Incorrect
                                    </p>
                                    <p>
                                        ❓ {infoProgress.unanswerd} Unanswered
                                    </p>

                                    <button className="btnBlue" onClick={() => { setShowResult(false) }}>Go Back</button>
                                </div>
                            </div>

                        </> :
                        ""
                }


                {
                    questions.length > 0 && questions.length > 0 ?
                        <>

                            <div className="quizIime">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5z" />
                                    <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64l.012-.013.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5M8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3" />
                                </svg>
                                <p>
                                    {timer}
                                </p>
                            </div>

                            <div className="questionContainer">

                                <div className="question">
                                    <p>
                                        {questions[currentQuestion].Question}
                                    </p>
                                </div>

                                <div className="answers">
                                    {
                                        questions[currentQuestion].Answers.map((element, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className={"answer " + getColor(questions[currentQuestion], index)}
                                                    onClick={() => {
                                                        handleSelectAnswer(currentQuestion, index)
                                                    }}
                                                >
                                                    <p>{element}</p>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="menuQuestions">
                                    <button onClick={priorQuestion}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
                                    </button>
                                    <p className="tagNumberQuestion" onClick={() => { setIsOpen(true) }}>
                                        {
                                            `${currentQuestion + 1}/${questions.length}`
                                        }
                                    </p>
                                    <button onClick={nextQuestion}>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" /></svg>
                                    </button>
                                </div>

                                <div className="infoProgress">
                                    <p>
                                        ✅ {infoProgress.correct} Correct
                                    </p>
                                    <p>
                                        ❌ {infoProgress.incorrect} Incorrect
                                    </p>
                                    <p>
                                        ❓ {infoProgress.unanswerd} Unanswered
                                    </p>
                                </div>
                            </div>



                            <button className="btnBlue" onClick={handleFinishGame}>
                                ¡FINISH!
                            </button>
                        </>
                        :
                        ""
                }
            </div>

            <PopUpContainer isOpen={isOpen} close={() => { setIsOpen(false) }}>
                <p className="titlePopUp">List Of Questions</p>
                <div className="listQuestions">
                    {
                        questions.map((element, index) => {
                            return (
                                <div
                                    key={`square${index}`}
                                    className="square"
                                    onClick={() => { handleMoveToQuestion(index) }}
                                    style={{ backgroundColor: element.answerSelected != null ? "#1A75D1" : "" }}
                                >
                                    <p>{index + 1}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </PopUpContainer>
        </div>
    )

}