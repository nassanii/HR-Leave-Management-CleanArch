import { Layers, Star } from 'lucide-react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const AuthLayout = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
        <div className="flex min-h-screen w-full bg-gray-50 font-sans text-gray-900">

            {/* LEFT SIDE - Artistic / Branding */}
            <div className="hidden lg:flex w-1/2 relative bg-indigo-900 items-center justify-center overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-900 to-slate-900 opacity-90"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                {/* Animated Shapes */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-screen blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-400/20 rounded-full mix-blend-screen blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-400/30 rounded-full mix-blend-screen blur-3xl"></div>

                {/* Content */}
                <div className="relative z-10 p-16 text-white max-w-xl">
                    <Link to="/" className="mb-8 inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-xl hover:bg-white/20 transition-all">
                        <Layers size={32} />
                    </Link>

                    <h2 className="text-5xl font-bold tracking-tight mb-6 leading-tight">
                        Turn your ideas into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">reality</span>.
                    </h2>

                    <p className="text-lg text-indigo-100 mb-12 leading-relaxed opacity-90">
                        Join thousands of developers and designers building the future with Nexus Digital.
                        Seamless workflow, powerful analytics, and beautiful design.
                    </p>

                    {/* Testimonial Card */}
                    <div className="bg-white/10 border border-white/10 backdrop-blur-md p-6 rounded-2xl shadow-2xl">
                        <div className="flex gap-1 text-yellow-400 mb-4">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <p className="text-indigo-50 italic mb-6">
                            "This platform completely changed how we handle our design systems. It's intuitive, fast, and simply beautiful."
                        </p>
                        <div className="flex items-center gap-4">
                            <img
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                alt="User"
                                className="h-10 w-10 rounded-full border-2 border-white/20"
                            />
                            <div>
                                <h4 className="font-bold text-sm">Alex Morgan</h4>
                                <p className="text-xs text-indigo-200">Senior Product Designer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - Interaction Area */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 bg-white relative">

                {/* Mobile Logo */}
                <Link to="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
                    <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                        <Layers size={18} />
                    </div>
                    <span className="font-bold text-xl text-gray-900">Nexus</span>
                </Link>

                {/* Top Right Navigation (Switcher) */}


                {/* Dynamic Form Content */}
                <Outlet />

            </div>
        </div>
    );
};

export default AuthLayout;
