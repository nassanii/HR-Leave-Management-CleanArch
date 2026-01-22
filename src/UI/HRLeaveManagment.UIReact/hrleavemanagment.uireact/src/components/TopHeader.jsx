import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Bell, Menu } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const TopHeader = ({ toggleSidebar }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
                onClick={toggleSidebar}
                className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
                <Menu size={20} />
            </button>

            <div className="flex items-center gap-4 ml-auto">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="h-8 w-px bg-gray-200 mx-1"></div>

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900 leading-none">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500 mt-1">{user?.userName}</p>
                    </div>
                    <div className="h-9 w-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center border border-indigo-200">
                        <User size={18} />
                    </div>
                    <button
                        onClick={onLogout}
                        className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default TopHeader;
