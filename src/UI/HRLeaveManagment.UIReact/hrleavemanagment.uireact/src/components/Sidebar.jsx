import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layers, Users, Calendar, FileText, Settings, LayoutDashboard } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { user } = useContext(AuthContext);

    const isActive = (path) => {
        return location.pathname === path ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
    };

    const isAdmin = user?.role === 'Administrator';

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-full hidden md:flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <Link to="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                        <Layers size={18} />
                    </div>
                    <span className="font-bold text-xl text-gray-900 tracking-tight">Nexus</span>
                </Link>
            </div>

            <div className="p-4 flex-grow overflow-y-auto">
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


        </aside>
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
