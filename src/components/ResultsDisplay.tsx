import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Result, Direction } from '../types';
import { descriptions } from '../data/descriptions';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale } from 'chart.js';
import { Pie, PolarArea } from 'react-chartjs-2';
import { generatePDFFromElement, generateUserReport, generateManagerReport } from '../lib/pdfExport';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, RadialLinearScale, Tooltip, Legend);

interface ResultsDisplayProps {
  result: Result;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const { primary, secondary, percentages, scores } = result;
  const [showPdfPreview, setShowPdfPreview] = useState<false | 'user' | 'manager'>(false);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async (type: 'user' | 'manager') => {
    if (!pdfContentRef.current) return;
    
    try {
      const fileName = `leadership-compass-${type}-report-${new Date().toISOString().split('T')[0]}.pdf`;
      await generatePDFFromElement(pdfContentRef.current, fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating your PDF. Please try again.');
    }
  };

  const renderIcon = (direction: Direction) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-8 h-8"
    >
      <path d={descriptions[direction].icon} />
    </svg>
  );

  const chartData = {
    labels: Object.keys(percentages).map(dir => descriptions[dir as Direction].title),
    datasets: [
      {
        data: Object.values(percentages),
        backgroundColor: [
          'rgba(78, 201, 240, 0.7)',  // North - Summit Seeker
          'rgba(159, 211, 61, 0.7)',   // East - Horizon Hunter
          'rgba(255, 159, 64, 0.7)',   // South - Valley Guardian
          'rgba(153, 102, 255, 0.7)',  // West - Forest Sage
        ],
        borderColor: [
          'rgba(78, 201, 240, 1)',
          'rgba(159, 211, 61, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const swotAnalysis = {
    strengths: [
      ...descriptions[primary].strengths.slice(0, 2),
      ...descriptions[secondary].strengths.slice(0, 1),
    ],
    weaknesses: descriptions[primary].challenges.slice(0, 2),
    opportunities: [
      `Leverage ${descriptions[primary].title}'s ${descriptions[primary].traits[0].toLowerCase()} with ${descriptions[secondary].title}'s ${descriptions[secondary].traits[0].toLowerCase()}`,
      `Build on your natural ${descriptions[primary].strengths[0].toLowerCase()} abilities`,
    ],
    threats: [
      descriptions[primary].challenges[0],
      `Potential tension between ${descriptions[primary].traits[0].toLowerCase()} and ${descriptions[secondary].traits[0].toLowerCase()} approaches`,
    ],
  };

  const getJourneyDescription = (type: Direction) => {
    switch(type) {
      case 'north':
        return 'Like a determined summit seeker, you navigate with purpose and clarity. Your path is direct, your vision is focused on the peak ahead. Just as mountain climbers make quick, decisive moves to reach their goals, you naturally drive toward results with conviction and purpose.';
      case 'east':
        return 'Like an exploratory horizon hunter, you scan distant vistas for new possibilities. Your path follows the rising sun toward innovation and discovery. Just as dawn reveals new landscapes, you naturally illuminate creative approaches and inspire others to see beyond conventional boundaries.';
      case 'south':
        return 'Like a nurturing valley guardian, you create spaces where diverse elements thrive together. Your path winds through connected communities, fostering growth and harmony. Just as valleys support rich ecosystems, you naturally cultivate environments where relationships flourish and everyone feels valued.';
      case 'west':
        return 'Like a thoughtful forest sage, you observe patterns and connections others might miss. Your path follows ancient wisdom through careful analysis and reflection. Just as forest keepers understand the intricate balance of their domain, you naturally see the detailed systems that support lasting success.';
    }
  };

  const getTerrainAnalogy = (type: Direction) => {
    switch(type) {
      case 'north':
        return 'mountain peaks';
      case 'east':
        return 'expansive horizons';
      case 'south':
        return 'nurturing valleys';
      case 'west':
        return 'deep forests';
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 relative">
      {/* Back to Home breadcrumb */}
      <div className="mb-4">
        <Link to="/" className="inline-flex items-center text-[#2E2A5E] hover:text-[#9FD33D] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>
      </div>
      
      {/* PDF Preview Panel */}
      {showPdfPreview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {showPdfPreview === 'user' ? 'Leader Report Preview' : 'Manager Report Preview'}
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleExportPDF(showPdfPreview)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => setShowPdfPreview(false)}
                  className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="p-6">
              <div ref={pdfContentRef} dangerouslySetInnerHTML={{ 
                __html: showPdfPreview === 'user' 
                  ? generateUserReport(result) 
                  : generateManagerReport(result) 
              }} />
            </div>
          </div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 text-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#4CC9F0]/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#9FD33D]/10 blur-3xl"></div>
          
          <h2 className="text-4xl font-bold mb-4 relative z-10">Your Leadership Compass</h2>
          <p className="text-xl opacity-90 relative z-10">Discovering Your Natural Direction</p>
          
          <div className="flex justify-center mt-8 gap-4 relative z-10">
            <button
              onClick={() => setShowPdfPreview('user')}
              className="bg-[#9FD33D] text-[#2E2A5E] px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Your Report
            </button>
            <button
              onClick={() => setShowPdfPreview('manager')}
              className="bg-white text-[#2E2A5E] px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Manager Report
            </button>
          </div>
        </div>

        <div className="p-8 bg-gray-50">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Leadership Terrain Map</h3>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="max-w-md mx-auto">
              <PolarArea data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h4 className="text-xl font-semibold mb-4">Direction Distribution</h4>
              {Object.entries(percentages).map(([direction, percentage]) => (
                <div key={direction} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{descriptions[direction as Direction].title}</span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: chartData.datasets[0].backgroundColor[
                          Object.keys(percentages).indexOf(direction)
                        ],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {renderIcon(primary)}
                  <h3 className="text-2xl font-bold text-blue-900">
                    {descriptions[primary].title}
                  </h3>
                </div>
                <span className="text-xl font-semibold text-blue-600">
                  {percentages[primary].toFixed(0)}%
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Key Characteristics:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {descriptions[primary].traits.map((trait, index) => (
                      <li key={index}>{trait}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Natural Strengths:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {descriptions[primary].strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="prose prose-sm">
                  <p className="text-gray-700 italic">
                    {getJourneyDescription(primary)}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {renderIcon(secondary)}
                  <h3 className="text-2xl font-bold text-gray-900">
                    {descriptions[secondary].title}
                  </h3>
                </div>
                <span className="text-xl font-semibold text-gray-600">
                  {percentages[secondary].toFixed(0)}%
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Key Characteristics:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {descriptions[secondary].traits.map((trait, index) => (
                      <li key={index}>{trait}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Natural Strengths:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {descriptions[secondary].strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="prose prose-sm">
                  <p className="text-gray-700 italic">
                    {`Your secondary direction as a ${descriptions[secondary].title} is like traversing secondary trails that complement your main path, providing ${getTerrainAnalogy(secondary)} that enrich your leadership journey.`}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-xl p-8 shadow-md"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Leadership Terrain Analysis</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h4 className="text-lg font-semibold text-green-700">Natural High Ground</h4>
                </div>
                <ul className="list-disc list-inside space-y-2 text-green-600">
                  {swotAnalysis.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-red-700">Challenging Terrain</h4>
                </div>
                <ul className="list-disc list-inside space-y-2 text-red-600">
                  {swotAnalysis.weaknesses.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h4 className="text-lg font-semibold text-blue-700">Unexplored Paths</h4>
                </div>
                <ul className="list-disc list-inside space-y-2 text-blue-600">
                  {swotAnalysis.opportunities.map((opportunity, index) => (
                    <li key={index}>{opportunity}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50 p-6 rounded-lg border border-amber-100">
                <div className="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-amber-700">Trail Hazards</h4>
                </div>
                <ul className="list-disc list-inside space-y-2 text-amber-600">
                  {swotAnalysis.threats.map((threat, index) => (
                    <li key={index}>{threat}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 shadow-md relative overflow-hidden"
          >
            {/* Decorative terrain-like elements */}
            <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-[#9FD33D]/10 rounded-full blur-2xl"></div>
            <div className="absolute -left-8 -top-8 w-24 h-24 bg-[#4CC9F0]/10 rounded-full blur-2xl"></div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Leadership Journey Map</h3>
            <div className="prose prose-lg text-gray-700">
              <p className="mb-4">
                {`The trails of ${descriptions[primary].title} and ${descriptions[secondary].title} converge to create your unique leadership journey, a path that blends ${descriptions[primary].traits[0].toLowerCase()} with ${descriptions[secondary].traits[0].toLowerCase()}.`}
              </p>
              <p className="mb-4">
                {descriptions[primary].workStyle}
              </p>
              <p>
                {`This powerful combination makes you particularly effective in environments that require both ${descriptions[primary].strengths[0].toLowerCase()} and ${descriptions[secondary].strengths[0].toLowerCase()}. Your ability to navigate ${getTerrainAnalogy(primary)} while maintaining awareness of ${getTerrainAnalogy(secondary)} gives you a versatile leadership approach that can adapt to various challenges along your journey.`}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};