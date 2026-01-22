import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import FloatingInput from '../components/FloatingInput';
import SocialButton from '../components/SocialButton';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            navigate('/');
        } catch (err) {
            setError('Invalid Credentials');
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-md">
            <div className="mb-10 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
                    <Mail size={32} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900">HR Portal</h1>
                <p className="mt-3 text-slate-500">Sign in to manage your leave requests</p>
            </div>

            <form onSubmit={onSubmit}>
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                <FloatingInput
                    id="email"
                    name="email"
                    type="email"
                    label="Email address"
                    icon={Mail}
                    value={email}
                    onChange={onChange}
                />
                <FloatingInput
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    value={password}
                    onChange={onChange}
                />

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <input
                            id="remember"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor="remember" className="text-sm font-medium text-gray-600 cursor-pointer">
                            Remember me
                        </label>
                    </div>
                    <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                    </a>
                </div>

                <button className="group w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all active:scale-[0.98]">
                    Access Dashboard
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
            </form>

            <div className="mt-8 relative hidden">
                {/* Hidden social login for now since backend support isn't ready */}
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-400 font-medium">Or continue with</span>
                </div>
            </div>

            {/* 
            <div className="mt-8 pt-6 border-t border-gray-100 text-center lg:hidden">
                <p className="text-sm text-gray-500">
                    Not a member?{' '}
                    <Link
                        to="/register"
                        className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all"
                    >
                        Sign up now
                    </Link>
                </p>
            </div>
             */}
        </div>
    );
};

export default Login;
