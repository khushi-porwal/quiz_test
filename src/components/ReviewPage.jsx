import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questionIndex, questions, answers } = location.state || {};

  if (questionIndex === undefined) return <h2>No Data Available</h2>;

  return (
    <div className="quiz-container">
      <h2>Review Answer</h2>
      <p><strong>Question:</strong> {questions[questionIndex].question}</p>
      <p><strong>Your Answer:</strong> {answers[questionIndex]}</p>
      <p>
        <strong>Correct Answer:</strong> {questions[questionIndex].options[questions[questionIndex].correct]}
      </p>
      <button onClick={() => navigate("/quiz", { state: { questionIndex } })}>Back to Question</button>
    </div>
  );
};

export default ReviewPage;
