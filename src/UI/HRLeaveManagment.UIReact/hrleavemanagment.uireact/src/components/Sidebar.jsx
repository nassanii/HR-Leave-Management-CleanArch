import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layers, Users, Calendar, FileText, Settings, LayoutDashboard, Mail, LogOut, User as UserIcon } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const isActive = (path) => {
        return location.pathname === path ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
    };

    const onLogout = () => {
        logout();
        navigate('/');
    };

    const isAdmin = user?.role === 'Administrator';

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 h-full flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                            <Mail size={18} />
                        </div>
                        <span className="font-bold text-xl text-gray-900 tracking-tight">HR Portal</span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="md:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <LogOut size={20} className="rotate-180" /> {/* Using logout icon as close/back or we could import X */}
                    </button>
                </div>

                <div className="p-4 flex-grow overflow-y-auto custom-scrollbar">
                    <nav className="space-y-1">
                        <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" activeClass={isActive('/')} />

                        {isAdmin && (
                            <>
                                <div className="pt-4 pb-2">
                                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</p>
                                </div>
                                <SidebarLink to="/employees" icon={Users} label="Employees" activeClass={isActive('/employees')} />
                            </>
                        )}
                        <SidebarLink to="/leave-allocation" icon={Calendar} label="Allocations" activeClass={isActive('/leave-allocation')} />

                        <div className="pt-4 pb-2">
                            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Requests</p>
                        </div>
                        <SidebarLink to="/leave-request" icon={FileText} label="Leave Requests" activeClass={isActive('/leave-request')} />

                        <div className="pt-4 pb-2">
                            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Configuration</p>
                        </div>
                        <SidebarLink to="/leave-type" icon={Settings} label="Leave Types" activeClass={isActive('/leave-type')} />
                        {isAdmin && (
                            <SidebarLink to="/register" icon={Users} label="Create Account" activeClass={isActive('/register')} />
                        )}
                    </nav>
                </div>

                {/* User Profile Footer */}
                {user && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
                                {user.firstName ? user.firstName[0] : <UserIcon size={18} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">
                                    {user.firstName || user.userName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user.role || 'Employee'}
                                </p>
                            </div>
                            <button
                                onClick={onLogout}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
};

const SidebarLink = ({ to, icon: Icon, label, activeClass }) => (
    <Link
        to={to}
        className={`group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeClass}`}
    >
        <Icon size={18} />
        <span>{label}</span>
    </Link>
);

export default Sidebar;
