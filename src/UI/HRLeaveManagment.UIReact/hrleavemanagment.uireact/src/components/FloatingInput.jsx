import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const FloatingInput = ({ id, type, label, icon: Icon, value, onChange, name }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="relative mb-5">
            <input
                type={inputType}
                id={id}
                name={name}
                className="peer block w-full rounded-xl border-2 border-gray-200 bg-transparent px-4 pb-3.5 pt-4 text-sm text-gray-900 focus:border-indigo-600 focus:outline-none focus:ring-0 placeholder-transparent transition-colors"
                placeholder={label}
                value={value}
                onChange={onChange}
            />
            <label
                htmlFor={id}
                className="absolute left-4 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-indigo-600"
            >
                {label}
            </label>

            {/* Icon on right for password toggle, or generic icon */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {isPassword ? (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="hover:text-gray-600 focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                ) : (
                    Icon && <Icon size={18} />
                )}
            </div>
        </div>
    );
};

export default FloatingInput;
