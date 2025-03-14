import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { FeatureCard } from './ui/FeatureCard';
import { COLORS, CONTAINER_STYLES } from '../constants/theme';

const features = [
  {
    title: 'Research-Based Insights',
    description: 'Built on proven leadership frameworks and validated through extensive research and real-world application.'
  },
  {
    title: 'Quick & Actionable',
    description: 'Complete the assessment in just 10 minutes and receive immediate, practical insights you can apply today.'
  },
  {
    title: 'Team Alignment',
    description: 'Understand how to leverage different leadership styles to build stronger, more effective teams.'
  }
] as const;

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#2E2A5E]">
      {/* Navigation */}
      <nav className="bg-white">
        <div className={CONTAINER_STYLES.maxWidth + " py-4"}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-16">
              <div className="flex items-center">
                <img src="/compass.svg" alt="Compass Logo" className="h-8 w-8 mr-2 text-[#2E2A5E]" />
                <span className="text-xl font-bold text-[#2E2A5E]">Leadership Compass</span>
              </div>
              <div className="hidden md:flex space-x-8">
                {['Assessment', 'Sample Results', 'Features'].map((item) => (
                  <Link
                    key={item}
                    to={
                      item === 'Features' 
                        ? '#features' 
                        : item === 'Sample Results'
                          ? '/random-results'
                          : `/${item.toLowerCase()}`
                    }
                    className="text-gray-600 hover:text-[#2E2A5E]"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            <Button to="/assessment" variant="secondary">Start Assessment</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className={CONTAINER_STYLES.maxWidth + " py-20"}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative z-10"
            >
              <h2 className="text-[#4CC9F0] uppercase tracking-wider mb-4 font-semibold">
                Welcome to Leadership Compass
              </h2>
              <h1 className="text-5xl font-bold mb-6 text-white">
                The place leaders go to discover their true direction
              </h1>
              <p className="text-xl text-gray-300 mb-12">
                We help leaders understand their natural style, align their teams, and build the roadmap they
                need to achieve extraordinary results. Whether you're developing your leadership approach or
                building high-performing teams, we're here to guide your journey.
              </p>
              <Button to="/assessment" variant="accent">Take the Assessment Now</Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative z-10"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#4CC9F0]/20 backdrop-blur-sm p-6 rounded-lg">
                  <h3 className="text-[#4CC9F0] font-semibold mb-2">North</h3>
                  <p className="text-white opacity-90">Results-driven leadership</p>
                </div>
                <div className="bg-[#9FD33D]/20 backdrop-blur-sm p-6 rounded-lg mt-8">
                  <h3 className="text-[#9FD33D] font-semibold mb-2">East</h3>
                  <p className="text-white opacity-90">Innovative thinking</p>
                </div>
                <div className="bg-[#9FD33D]/20 backdrop-blur-sm p-6 rounded-lg">
                  <h3 className="text-[#9FD33D] font-semibold mb-2">South</h3>
                  <p className="text-white opacity-90">Team harmony</p>
                </div>
                <div className="bg-[#4CC9F0]/20 backdrop-blur-sm p-6 rounded-lg mt-8">
                  <h3 className="text-[#4CC9F0] font-semibold mb-2">West</h3>
                  <p className="text-white opacity-90">Analytical precision</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#4CC9F0]/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#9FD33D]/10 blur-3xl"></div>
      </div>

      {/* Features */}
      <div id="features" className="bg-white py-20">
        <div className={CONTAINER_STYLES.maxWidth}>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#2E2A5E]">
              Why Choose Leadership Compass?
            </h2>
            <p className="text-gray-600 mt-4">
              Discover the benefits of understanding your leadership style
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                delay={index * 0.2}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-[#2E2A5E] text-white py-20">
        <div className={CONTAINER_STYLES.maxWidth + " text-center"}>
          <h2 className="text-3xl font-bold mb-6">Ready to Discover Your Leadership Style?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of leaders who have gained valuable insights through our assessment.
            Start your journey today.
          </p>
          <Button to="/assessment" variant="accent">Begin Your Assessment</Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;