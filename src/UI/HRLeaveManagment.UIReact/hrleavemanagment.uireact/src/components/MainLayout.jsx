import { useState } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import { HelpCircle, X, ExternalLink } from 'lucide-react';

const MainLayout = ({ children }) => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden relative">
            {/* Sidebar (Desktop) */}
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <TopHeader toggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

                <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="w-full max-w-full mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Floating Help Widget */}
            <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
                {showHelp && (
                    <div className="mb-4 bg-white p-5 rounded-2xl shadow-2xl border border-indigo-50 w-72 animate-in slide-in-from-bottom-4 duration-200 fade-in">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-slate-800 text-base">Need Assistance?</h4>
                            <button
                                onClick={() => setShowHelp(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-50 rounded-lg"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                            Check our documentation for detailed guides on how to manage leaves and employee data.
                        </p>
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95">
                            <span>View Documentation</span>
                            <ExternalLink size={16} />
                        </button>
                    </div>
                )}

                <button
                    onClick={() => setShowHelp(!showHelp)}
                    className={`h-14 w-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${showHelp
                        ? 'bg-slate-800 text-white rotate-90'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                >
                    {showHelp ? <X size={24} /> : <HelpCircle size={28} />}
                </button>
            </div>
        </div>
    );
};

export default MainLayout;
