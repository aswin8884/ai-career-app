import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

const PredictionForm = ({ onAnalyze, isLoading }) => {
  const [jobRole, setJobRole] = useState('Data Analyst');
  const [industry, setIndustry] = useState('Technology');

  const roles = ["Data Analyst", "Accountant", "Teacher", "Software Engineer", "HR Manager", "Financial Analyst"];
  const industries = ["Technology", "Finance", "Healthcare", "Retail", "Energy"];

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze({ jobRole, industry });
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 max-w-3xl mx-auto mb-8 transition-all hover:shadow-md">
      <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-6">Analyze Your Role</h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Current Job Role</label>
          <select 
            value={jobRole} 
            onChange={(e) => setJobRole(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
          >
            {roles.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Industry</label>
          <select 
            value={industry} 
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
          >
            {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>
        </div>

        <div className="flex items-end">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full md:w-auto h-[50px] bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            {isLoading ? 'Analyzing...' : 'Analyze Risk'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PredictionForm;