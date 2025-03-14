import React, { useEffect, useState } from 'react';
import { ResultsDisplay } from './ResultsDisplay';
import { Direction, Result } from '../types';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const RandomResults = () => {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateAndSaveResults = async () => {
      try {
        const directions: Direction[] = ['north', 'east', 'south', 'west'];
        const scores = directions.reduce((acc, direction) => ({
          ...acc,
          [direction]: Math.floor(Math.random() * 40) + 10 // Random score between 10-50
        }), {} as Record<Direction, number>);

        const total = Object.values(scores).reduce((a, b) => a + b, 0);
        const percentages = Object.entries(scores).reduce((acc, [direction, score]) => ({
          ...acc,
          [direction]: (score / total) * 100
        }), {} as Record<Direction, number>);

        const sortedDirections = Object.entries(scores)
          .sort(([, a], [, b]) => b - a)
          .map(([direction]) => direction as Direction);

        const newResult = {
          primary: sortedDirections[0],
          secondary: sortedDirections[1],
          scores,
          percentages
        };

        // Save to Supabase
        const { error: supabaseError } = await supabase
          .from('results')
          .insert([{
            primary_direction: newResult.primary,
            secondary_direction: newResult.secondary,
            scores: newResult.scores,
            percentages: newResult.percentages
          }]);

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        setResult(newResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    generateAndSaveResults();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Generating your sample results...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-gray-600 mb-4">No results available</div>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-block text-blue-600 hover:text-blue-800 mb-8"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sample Assessment Results</h1>
          <p className="text-lg text-gray-600">
            This is an example of what your personalized results will look like.
          </p>
        </div>
        <ResultsDisplay result={result} />
      </div>
    </div>
  );
};

export default RandomResults;