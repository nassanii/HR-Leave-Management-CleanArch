const SocialButton = ({ icon, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-all"
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default SocialButton;
