import React, { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, ShieldCheck, GraduationCap, PlayCircle, ExternalLink, Sparkles, Loader2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';

const ResultsDashboard = ({ results, isDarkMode }) => {
  const isHighRisk = results.automation_risk_percent > 40;
  
  const textColor = isDarkMode ? 'white' : '#475569';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';

  // State for the AI Coach
  const [coachPlans, setCoachPlans] = useState({});
  const [loadingCoach, setLoadingCoach] = useState({});

  // Fetch the Generative AI Plan
  const handleAskCoach = async (targetRole) => {
    setLoadingCoach(prev => ({ ...prev, [targetRole]: true }));
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await axios.post(`${API_URL}/api/coach/`, {
        current_role: results.current_role,
        target_role: targetRole
      });
      setCoachPlans(prev => ({ ...prev, [targetRole]: response.data.coach_plan }));
    } catch (error) {
      console.error("Error fetching AI Coach plan", error);
    }
    setLoadingCoach(prev => ({ ...prev, [targetRole]: false }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* Risk Score Card */}
      <div className={`p-6 rounded-2xl flex items-center gap-5 shadow-sm border ${isHighRisk ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800/50' : 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800/50'}`}>
        <div className={`p-4 rounded-full ${isHighRisk ? 'bg-red-100 text-red-600 dark:bg-red-800/50 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-800/50 dark:text-green-400'}`}>
          {isHighRisk ? <AlertTriangle className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Predicted Automation Risk</h3>
          <p className={`text-4xl font-bold ${isHighRisk ? 'text-red-700 dark:text-white' : 'text-green-700 dark:text-white'}`}>
            {results.automation_risk_percent}%
          </p>
        </div>
      </div>

      {/* Recommendations Chart */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
            <TrendingUp className="text-indigo-600 dark:text-indigo-400 w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recommended Future Roles</h2>
        </div>
        
        {results.recommended_transitions.length > 0 ? (
          <>
            <div className="h-72 w-full mb-8">
              <ResponsiveContainer>
                <BarChart data={results.recommended_transitions} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor={isDarkMode ? '#818cf8' : '#6366f1'} stopOpacity={0.9}/>
                      <stop offset="95%" stopColor={isDarkMode ? '#a78bfa' : '#8b5cf6'} stopOpacity={1}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                  <XAxis type="number" domain={[0, 100]} stroke={textColor} />
                  <YAxis dataKey="job_role" type="category" width={140} stroke={textColor} fontWeight="500" />
                  
                  <Tooltip 
                    cursor={{fill: isDarkMode ? '#334155' : '#f8fafc'}}
                    contentStyle={{ 
                      backgroundColor: isDarkMode ? '#1e293b' : 'white',
                      borderColor: isDarkMode ? '#475569' : '#e2e8f0',
                      borderRadius: '12px', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                    }}
                    itemStyle={{ 
                      color: isDarkMode ? 'white' : '#1e293b', 
                      fontWeight: '500'
                    }}
                    labelStyle={{
                      color: isDarkMode ? 'white' : '#0f172a', 
                      fontWeight: 'bold',
                      marginBottom: '8px'
                    }}
                    formatter={(value) => [`${value.toFixed(1)}%`, 'Automation Risk']}
                  />

                  <ReferenceLine 
                    x={results.automation_risk_percent} 
                    stroke="#ef4444" 
                    strokeDasharray="4 4" 
                    label={{ position: 'top', value: 'Current Risk', fill: '#ef4444', fontSize: 12, fontWeight: 'bold' }} 
                  />
                  
                  <Bar dataKey="accurate_risk_percent" radius={[0, 6, 6, 0]} barSize={36}>
                    {results.recommended_transitions.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="url(#colorRisk)" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Course Recommendations & AI Coach */}
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Your Upskilling Action Plan
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {results.recommended_transitions.map((job, index) => (
                <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all bg-slate-50/50 dark:bg-slate-800/50">
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold text-xl text-slate-800 dark:text-white">{job.job_role}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Target Risk: {job.accurate_risk_percent.toFixed(1)}%</p>
                    </div>
                    
                    {/* Generative AI Button */}
                    <button 
                      onClick={() => handleAskCoach(job.job_role)}
                      disabled={loadingCoach[job.job_role]}
                      className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-70 text-sm"
                    >
                      {loadingCoach[job.job_role] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {loadingCoach[job.job_role] ? 'Thinking...' : 'Ask AI Coach'}
                    </button>
                  </div>

                  {/* AI Output Display Area with PDF Export Logic */}
                  {coachPlans[job.job_role] && (
                    <div className="mt-4 border border-indigo-100 dark:border-indigo-800/50 rounded-xl overflow-hidden shadow-sm">
                      
                      {/* Top Bar with Download Button */}
                      <div className="bg-indigo-50 dark:bg-indigo-900/40 px-5 py-3 flex justify-between items-center border-b border-indigo-100 dark:border-indigo-800/50">
                        <span className="text-sm font-semibold text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" /> 
                          AI Transition Roadmap
                        </span>
                        
                      <button 
                          onClick={() => {
                            // 1. Get the raw text from the AI plan
                            const planText = coachPlans[job.job_role];
                            
                            // 2. Create a temporary, clean HTML container just for the PDF
                            const printContainer = document.createElement('div');
                            printContainer.style.padding = '40px';
                            printContainer.style.fontFamily = 'Arial, sans-serif';
                            printContainer.style.color = '#1e293b'; // Slate-800
                            printContainer.style.backgroundColor = '#ffffff';
                            printContainer.style.lineHeight = '1.6';

                            // 3. Add the clean title
                            const title = document.createElement('h1');
                            title.innerText = `Transition Plan: ${job.job_role}`;
                            title.style.color = '#4338ca'; // Indigo-700
                            title.style.borderBottom = '2px solid #e0e7ff';
                            title.style.paddingBottom = '10px';
                            title.style.marginBottom = '24px';
                            title.style.fontSize = '24px';
                            printContainer.appendChild(title);

                            // 4. Very simple Markdown parsing for the PDF
                            const content = document.createElement('div');
                            
                            // We split the AI text by double newlines to get paragraphs/sections
                            const sections = planText.split('\n\n');
                            
                            sections.forEach(section => {
                                if (section.startsWith('### ')) {
                                    // It's a heading
                                    const h3 = document.createElement('h3');
                                    h3.innerText = section.replace('### ', '');
                                    h3.style.color = '#4338ca';
                                    h3.style.marginTop = '20px';
                                    h3.style.marginBottom = '10px';
                                    h3.style.fontSize = '18px';
                                    content.appendChild(h3);
                                } else if (section.startsWith('* ') || section.startsWith('- ')) {
                                    // It's a list (we handle this basic case)
                                    const ul = document.createElement('ul');
                                    ul.style.marginTop = '0';
                                    ul.style.marginBottom = '15px';
                                    ul.style.paddingLeft = '20px';
                                    
                                    const items = section.split('\n');
                                    items.forEach(item => {
                                        if (item.trim()) {
                                            const li = document.createElement('li');
                                            // Remove the '* ' and handle basic bolding '**text**'
                                            let text = item.replace(/^[\*\-]\s/, '');
                                            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                                            li.innerHTML = text;
                                            li.style.marginBottom = '8px';
                                            ul.appendChild(li);
                                        }
                                    });
                                    content.appendChild(ul);
                                } else {
                                    // Standard paragraph
                                    const p = document.createElement('p');
                                    let text = section;
                                    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                                    p.innerHTML = text;
                                    p.style.marginBottom = '15px';
                                    content.appendChild(p);
                                }
                            });
                            
                            printContainer.appendChild(content);

                            // 5. Generate PDF from this clean container!
                            const opt = {
                              margin:       0.5,
                              filename:     `${job.job_role.replace(/\s+/g, '_')}_Career_Roadmap.pdf`,
                              image:        { type: 'jpeg', quality: 0.98 },
                              html2canvas:  { scale: 2 },
                              jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
                            };
                            
                            html2pdf().set(opt).from(printContainer).save();
                          }}
                          className="flex items-center gap-1 text-xs font-medium text-indigo-700 dark:text-indigo-400 bg-white dark:bg-slate-800 px-3 py-1.5 rounded hover:bg-indigo-100 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Save PDF
                        </button>
                      </div>

                      {/* The Actual Styled Content to be Exported */}
                      <div 
                        id={`roadmap-${job.job_role.replace(/\s+/g, '-')}`} 
                        className="p-8 bg-white dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 max-w-none"
                      >
                        {/* Hidden title that only shows up in the PDF! */}
                        <div className="pdf-title" style={{ display: 'none' }}>
                          <h1 style={{ color: '#4f46e5', marginBottom: '24px', fontSize: '28px', fontWeight: '800', borderBottom: '2px solid #e0e7ff', paddingBottom: '10px' }}>
                            Transition Plan: {job.job_role}
                          </h1>
                        </div>
                        
                        {/* Custom Styled Markdown */}
                        <ReactMarkdown 
                          components={{
                            h3: ({node, ...props}) => <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 mt-8 mb-4 flex items-center gap-2 border-b border-indigo-100 dark:border-indigo-900/50 pb-2" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold text-slate-900 dark:text-white" {...props} />,
                            ul: ({node, ...props}) => <ul className="space-y-3 my-4 list-none pl-0" {...props} />,
                            li: ({node, ...props}) => (
                              <li className="flex items-start gap-3 text-base leading-relaxed" {...props}>
                                <span className="text-indigo-500 mt-1 flex-shrink-0">•</span>
                                <span>{props.children}</span>
                              </li>
                            ),
                            p: ({node, ...props}) => <p className="mb-4 text-base leading-relaxed" {...props} />,
                          }}
                        >
                          {coachPlans[job.job_role]}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {/* External Links */}
                  <div className="flex flex-col md:flex-row gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <a href={job.coursera_link} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                      <ExternalLink className="w-4 h-4"/> Coursera Certificates
                    </a>
                    <a href={job.youtube_link} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                      <PlayCircle className="w-4 h-4"/> YouTube Courses
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 border-dashed">
            <ShieldCheck className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">You are already in one of the safest roles in this industry!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDashboard;