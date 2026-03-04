import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import PredictionForm from './components/PredictionForm';
import ResultsDashboard from './components/ResultsDashboard';

function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAwaking, setIsAwaking] = useState(false); // NEW: Tracks if server is waking up
  
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    setIsAwaking(false); // Reset on new request

    // NEW: If the request takes more than 4 seconds, assume the Render server is waking up
    const wakeUpTimer = setTimeout(() => {
      setIsAwaking(true);
    }, 4000);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      
      const response = await axios.post(`${API_URL}/api/predict/`, {
        job_role: jobRole,
        industry: industry
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error connecting to Django:", error);
      alert("Error: Please ensure your Django server is running.");
    } finally {
      // NEW: Clear the timer and reset states when the request finishes
      clearTimeout(wakeUpTimer);
      setIsLoading(false);
      setIsAwaking(false);
    }
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

        {/* NEW: Friendly Warning Alert */}
        {isAwaking && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-xl flex items-center justify-center gap-3 animate-in fade-in duration-500">
            <svg className="animate-spin h-5 w-5 text-indigo-600 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
              Waking up the AI server! Since this is a free host, this first request might take up to 50 seconds. Hang tight! 🚀
            </p>
          </div>
        )}

        <PredictionForm onAnalyze={fetchPrediction} isLoading={isLoading} />
        
        {results && <ResultsDashboard results={results} isDarkMode={isDarkMode} />}
      </main>
    </div>
  );
}

export default App;