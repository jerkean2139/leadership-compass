import React, { useState } from 'react';
import { ResultsDisplay } from './ResultsDisplay';
import { Direction, Result } from '../types';
import { Link } from 'react-router-dom';

// Predefined avatar profiles
const avatarProfiles = {
  summitSeeker: {
    name: "Summit Seeker Profile",
    description: "A determined, goal-oriented leader who drives for results",
    scores: {
      north: 70,
      east: 40,
      south: 25,
      west: 35
    }
  },
  horizonHunter: {
    name: "Horizon Hunter Profile",
    description: "A visionary, innovative leader who loves exploring new possibilities",
    scores: {
      north: 35,
      east: 75,
      south: 30,
      west: 30
    }
  },
  valleyGuardian: {
    name: "Valley Guardian Profile",
    description: "A supportive, people-focused leader who values harmony and relationships",
    scores: {
      north: 25,
      east: 30,
      south: 75,
      west: 40
    }
  },
  forestSage: {
    name: "Forest Sage Profile",
    description: "A thoughtful, analytical leader who makes careful, data-driven decisions",
    scores: {
      north: 35,
      east: 30,
      south: 40,
      west: 65
    }
  }
};

const RandomResults = () => {
  const [result, setResult] = useState<Result | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const generateResults = (profileKey: keyof typeof avatarProfiles) => {
    const profile = avatarProfiles[profileKey];
    const scores = profile.scores as Record<Direction, number>;
    
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

    setResult(newResult);
    setSelectedAvatar(profileKey);
  };

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
          
          {!result ? (
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-gray-600 mb-8">
                Choose an avatar profile to see what their leadership compass results would look like.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {Object.entries(avatarProfiles).map(([key, profile]) => (
                  <button 
                    key={key}
                    onClick={() => generateResults(key as keyof typeof avatarProfiles)}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 text-left"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{profile.name}</h3>
                    <p className="text-gray-600">{profile.description}</p>
                    <div className="mt-4 text-blue-600 font-medium">Generate Results →</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg text-gray-600 mb-4">
                Here are the results for the {selectedAvatar && avatarProfiles[selectedAvatar as keyof typeof avatarProfiles].name}.
              </p>
              <button 
                onClick={() => setResult(null)}
                className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition mb-8"
              >
                ← Choose Another Avatar
              </button>
            </div>
          )}
        </div>

        {result && (
          <>
            <ResultsDisplay result={result} />
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">What would you like to do?</h3>
              <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
                <Link
                  to="/"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
                >
                  Back to Home
                </Link>
                <button
                  onClick={() => window.print()}
                  className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
                >
                  Print Results
                </button>
                <Link
                  to="/assessment"
                  className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition"
                >
                  Take the Assessment
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RandomResults;