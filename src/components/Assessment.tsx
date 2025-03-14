import React from 'react';
import { QuestionCard } from './QuestionCard';
import { ResultsDisplay } from './ResultsDisplay';
import { questions } from '../data/questions';
import { Direction, Answer, Result } from '../types';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<Result | null>(null);

  const calculateResults = (allAnswers: Answer[]): Result => {
    const totalScores = {
      north: 0,
      east: 0,
      south: 0,
      west: 0
    };

    allAnswers.forEach(answer => {
      Object.entries(answer.scores).forEach(([direction, score]) => {
        totalScores[direction as Direction] += score;
      });
    });

    const total = Object.values(totalScores).reduce((a, b) => a + b, 0);
    const percentages = Object.entries(totalScores).reduce((acc, [direction, score]) => ({
      ...acc,
      [direction]: (score / total) * 100
    }), {} as Record<Direction, number>);

    const sortedDirections = Object.entries(totalScores)
      .sort(([, a], [, b]) => b - a)
      .map(([direction]) => direction as Direction);

    return {
      primary: sortedDirections[0],
      secondary: sortedDirections[1],
      scores: totalScores,
      percentages
    };
  };

  const handleAnswer = (scores: { [key in Direction]: number }) => {
    const newAnswers = [...answers, { questionId: currentQuestion + 1, scores }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const finalResult = calculateResults(newAnswers);
      setResult(finalResult);
    }
  };

  return (
    <div className="assessment-container min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto mb-4">
        <Link to="/" className="inline-flex items-center text-white hover:text-[#9FD33D] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
      </div>
      
      {!result ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Leadership Compass Assessment</h1>
            <p className="text-lg text-white mb-2">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#9FD33D] h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <QuestionCard
            question={questions[currentQuestion]}
            onSubmit={handleAnswer}
            isLast={currentQuestion === questions.length - 1}
          />
        </motion.div>
      ) : (
        <ResultsDisplay result={result} />
      )}
    </div>
  );
}

export default Assessment;