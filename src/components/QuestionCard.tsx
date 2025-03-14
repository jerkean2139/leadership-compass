import React from 'react';
import { Question, Direction } from '../types';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: Question;
  onSubmit: (scores: { [key in Direction]: number }) => void;
  isLast: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onSubmit, isLast }) => {
  const { register, handleSubmit, formState: { isValid } } = useForm({
    mode: 'onChange'
  });

  const onSubmitForm = (data: any) => {
    const scores = {
      north: data.answer === 'north' ? 4 : 1,
      east: data.answer === 'east' ? 4 : 1,
      south: data.answer === 'south' ? 4 : 1,
      west: data.answer === 'west' ? 4 : 1
    };
    onSubmit(scores);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmitForm)} className="w-full max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">{question.text}</h3>
        
        <div className="space-y-4">
          {(Object.keys(question.options) as Direction[]).map((direction) => (
            <div key={direction} className="question-option">
              <input
                type="radio"
                id={direction}
                value={direction}
                {...register('answer', { required: true })}
                className="sr-only"
              />
              <label
                htmlFor={direction}
                className="flex-1 pl-6 py-2 cursor-pointer text-gray-700 text-lg"
              >
                {question.options[direction]}
              </label>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Select the option that best describes you
          </p>
          <button
            type="submit"
            disabled={!isValid}
            className="bg-[#9FD33D] text-[#2E2A5E] px-8 py-3 rounded-lg text-lg font-medium
                     hover:bg-[#8FBD35] disabled:bg-gray-400 disabled:cursor-not-allowed
                     transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            {isLast ? 'View Your Results' : 'Continue'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};