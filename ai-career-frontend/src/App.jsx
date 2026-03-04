import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import PredictionForm from './components/PredictionForm';
import ResultsDashboard from './components/ResultsDashboard';

function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle function that also updates the HTML class for Tailwind
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

const fetchPrediction = async ({ jobRole, industry }) => {
    setIsLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://ai-career-app.onrender.com';
      
      const response = await axios.post(`${API_URL}/api/predict/`, {
        job_role: jobRole,
        industry: industry
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error connecting to Django:", error);
      alert("Error: Please ensure your Django server is running.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 md:py-16">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Future-Proof Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">Career</span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Powered by our Machine Learning model. Analyze your current role and discover the safest tech transitions with high skill demand.
          </p>
        </div>

        <PredictionForm onAnalyze={fetchPrediction} isLoading={isLoading} />
        
        {results && <ResultsDashboard results={results} isDarkMode={isDarkMode} />}
      </main>
    </div>
  );
}

export default App;