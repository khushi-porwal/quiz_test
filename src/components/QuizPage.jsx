import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correct: 1 },
  { question: "Capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correct: 2 },
  { question: "What is the largest planet?", options: ["Earth", "Jupiter", "Mars", "Saturn"], correct: 1 },
  { question: "Who wrote 'Hamlet'?", options: ["Shakespeare", "Hemingway", "Tolstoy", "Austen"], correct: 0 },
  { question: "What is the boiling point of water?", options: ["90°C", "100°C", "110°C", "120°C"], correct: 1 },
  { question: "Which element has the symbol 'O'?", options: ["Oxygen", "Gold", "Silver", "Osmium"], correct: 0 },
  { question: "Which gas do plants absorb?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct: 2 },
  { question: "What is the currency of Japan?", options: ["Yen", "Won", "Ringgit", "Dollar"], correct: 0 },
  { question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
  { question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Brisbane"], correct: 2 }
];

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [questionTimer, setQuestionTimer] = useState(15);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [attempted, setAttempted] = useState(Array(questions.length).fill(false));
  const [score, setScore] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft > 0) {
      const mainTimer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(mainTimer);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (questionTimer > 0 && !reviewMode) {
      const questionInterval = setInterval(() => setQuestionTimer((prev) => prev - 1), 1000);
      return () => clearInterval(questionInterval);
    }
  }, [questionTimer, reviewMode]);

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (!attempted[currentQuestion]) {
      const isCorrect = selectedOption === questions[currentQuestion].correct;
      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[currentQuestion] = selectedOption;
        return newAnswers;
      });
      setFeedback(isCorrect ? "correct" : "incorrect");
      setAttempted((prev) => {
        const newAttempted = [...prev];
        newAttempted[currentQuestion] = true;
        return newAttempted;
      });
      if (isCorrect) {
        setScore(score + 1);
      }
      setReviewMode(true);
      setShowQuestion(false);
    }
  };

  const handleNext = () => {
    if (reviewMode && !showQuestion) {
      setShowQuestion(true);
    } else {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setFeedback(null);
        setQuestionTimer(15);
        setReviewMode(false);
        setShowQuestion(false);
      } else {
        navigate("/result", { state: { score, total: questions.length } });
      }
    }
  };

  const handlePrev = () => {
    if (showQuestion) {
      setShowQuestion(false);
    } else if (reviewMode) {
      setShowQuestion(true);
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setReviewMode(true);
      setShowQuestion(false);
    }
  };

  return (
    <div className="quiz-container">
      {reviewMode && !showQuestion ? (
        <>
          <h2>Review Answer</h2>
          <p>Question: {questions[currentQuestion].question}</p>
          <p>Your Answer: {questions[currentQuestion].options[answers[currentQuestion]]}</p>
          <p>Correct Answer: {questions[currentQuestion].options[questions[currentQuestion].correct]}</p>
          <button className="prev-button" onClick={handlePrev} disabled={currentQuestion === 0}>Prev</button>
          <button className="next-button" onClick={handleNext}>Next</button>
        </>
      ) : (
        <>
          <div className="timer">Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</div>
          <div className="question-timer">Question Timer: {questionTimer}</div>
          <h2>{questions[currentQuestion].question}</h2>
          <div className="options">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`option ${selectedOption === index ? "selected" : ""}`}
                onClick={() => handleOptionSelect(index)}
                disabled={attempted[currentQuestion]}
              >
                {option}
              </button>
            ))}
          </div>
          {selectedOption !== null && !attempted[currentQuestion] ? (
            <button className="next-button" onClick={handleSubmit}>Submit</button>
          ) : (
            <button className="next-button" onClick={handleNext}>{currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next"}</button>
          )}
        </>
      )}
    </div>
  );
};

export default QuizPage;
