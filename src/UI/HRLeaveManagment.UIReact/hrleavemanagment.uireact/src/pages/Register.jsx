import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, UserPlus } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import FloatingInput from '../components/FloatingInput';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        userName: '',
        password: '',
        role: 'Employee'
    });

    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const { firstName, lastName, email, userName, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/employees'); // Redirect to employees list to show the new record
        } catch (err) {
            console.error("Registration Error Details:", err.response?.data); // Log to console for the user to see

            let errorMessage = 'Registration failed';

            if (err.response?.data) {
                const data = err.response.data;

                // Case 1: Custom Exception format { Message: "...", Details: "..." }
                if (data.Message) {
                    errorMessage = data.Message;
                    if (data.Details) errorMessage += `: ${data.Details}`;
                }
                // Case 2: Validation Errors format { errors: { Field: ["error"] }, title: "..." }
                else if (data.errors) {
                    // Extract the first validation error
                    const firstField = Object.keys(data.errors)[0];
                    errorMessage = data.errors[firstField][0];
                }
                // Case 3: Simple message property (lowercase)
                else if (data.message) {
                    errorMessage = data.message;
                }
                // Case 4: Title only
                else if (data.title) {
                    errorMessage = data.title;
                }
            }

            setError(errorMessage);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] p-4">
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-indigo-600 px-8 py-8 text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                        <UserPlus size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Create Employee Account</h1>
                    <p className="text-indigo-100 text-lg mt-2">Add a new user to the organization.</p>
                </div>

                <div className="p-8">
                    <form onSubmit={onSubmit} className="space-y-5">
                        {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}

                        <div className="grid grid-cols-2 gap-4">
                            <FloatingInput
                                id="firstName"
                                name="firstName"
                                type="text"
                                label="First Name"
                                value={firstName}
                                onChange={onChange}
                            />
                            <FloatingInput
                                id="lastName"
                                name="lastName"
                                type="text"
                                label="Last Name"
                                value={lastName}
                                onChange={onChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FloatingInput
                                id="userName"
                                name="userName"
                                type="text"
                                label="Username"
                                value={userName}
                                onChange={onChange}
                            />
                            <FloatingInput
                                id="email"
                                name="email"
                                type="email"
                                label="Email address"
                                icon={Mail}
                                value={email}
                                onChange={onChange}
                            />
                        </div>

                        <FloatingInput
                            id="password"
                            name="password"
                            type="password"
                            label="Create Password"
                            value={password}
                            onChange={onChange}
                        />

                        <div className="relative">
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={onChange}
                                className="block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-xl border-2 border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
                            >
                                <option value="Employee">Employee</option>
                                <option value="Administrator">Administrator</option>
                            </select>
                            <label
                                htmlFor="role"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-indigo-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
                            >
                                Select Role
                            </label>
                        </div>

                        <button className="group w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all active:scale-[0.98] mt-4">
                            Create Account
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
