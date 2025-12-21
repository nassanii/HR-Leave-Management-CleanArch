import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Users,
    LayoutDashboard,
    Calendar,
    Clock,
    ShieldCheck,
    Settings,
    Menu,
    X,
    ChevronRight,
    User,
    Mail,
    Briefcase
} from 'lucide-react';
import EmployeeService from '../services/EmployeeService';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dateJoined: new Date().toISOString().split('T')[0],
        dateOfBirth: ''
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const data = await EmployeeService.getAllEmployees();
            setEmployees(data);
        } catch (error) {
            console.error('Failed to load employees', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const openCreateModal = () => {
        setIsEditMode(false);
        setSelectedEmployeeId(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            dateJoined: new Date().toISOString().split('T')[0],
            dateOfBirth: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (employee) => {
        setIsEditMode(true);
        setSelectedEmployeeId(employee.id);
        setFormData({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            dateJoined: employee.dateJoined ? employee.dateJoined.split('T')[0] : '',
            dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await EmployeeService.updateEmployee(selectedEmployeeId, { ...formData, id: selectedEmployeeId });
            } else {
                await EmployeeService.createEmployee(formData);
            }
            await fetchEmployees();
            setIsModalOpen(false);
        } catch (error) {
            console.error(isEditMode ? 'Failed to update employee' : 'Failed to create employee', error);
        }
    };

    const openDeleteModal = (employee) => {
        setEmployeeToDelete(employee);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!employeeToDelete) return;
        try {
            await EmployeeService.deleteEmployee(employeeToDelete.id);
            await fetchEmployees();
            setIsDeleteModalOpen(false);
            setEmployeeToDelete(null);
        } catch (error) {
            console.error('Failed to delete employee', error);
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const navigate = useNavigate();

    const SidebarContent = () => (
        <>
            <div className="p-6 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                        H
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800">HR Connect</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="md:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
                <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => navigate('/')} />
                <SidebarItem icon={<Users size={20} />} label="Employees" active onClick={() => navigate('/employees')} />
                <SidebarItem icon={<Calendar size={20} />} label="Leave Requests" onClick={() => navigate('/leave-requests')} />
                <SidebarItem icon={<Clock size={20} />} label="Allocations" onClick={() => navigate('/leave-allocation')} />
                <SidebarItem icon={<ShieldCheck size={20} />} label="Leave Types" onClick={() => navigate('/leavetypes')} />
                <SidebarItem icon={<Settings size={20} />} label="Settings" />
            </nav>

            <div className="p-4 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                        AD
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate">Admin User</p>
                        <p className="text-xs text-slate-500 truncate">admin@hr.com</p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-[#F9FAFB] text-slate-900 font-sans overflow-hidden">
            {/* Sidebar (Duplicate of other pages) */}
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar & Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <aside className="relative w-64 max-w-[80%] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-500 rounded-lg"><Menu size={24} /></button>
                        <h2 className="text-lg font-semibold text-slate-800">Employees</h2>
                    </div>
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">Employee Directory</h1>
                        <button onClick={openCreateModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-indigo-100">
                            <Plus size={20} />
                            Add Employee
                        </button>
                    </div>

                    {/* Desktop Table & Mobile Cards */}
                    {/* Mobile Card List View */}
                    <div className="md:hidden space-y-4">
                        {loading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 animate-pulse">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                                        <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                                    </div>
                                </div>
                            ))
                        ) : filteredEmployees.length > 0 ? (
                            filteredEmployees.map(emp => (
                                <div key={emp.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                                                {emp.firstName?.[0]}{emp.lastName?.[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">{emp.firstName} {emp.lastName}</h3>
                                                <p className="text-xs text-slate-500 mt-0.5">{emp.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => openEditModal(emp)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => openDeleteModal(emp)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Joined Date</p>
                                        <span className="text-sm font-medium text-slate-700">
                                            {new Date(emp.dateJoined || Date.now()).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                No employees found.
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:flex bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-col h-[calc(100vh-240px)] min-h-[400px]">
                        <div className="flex-1 overflow-y-auto overflow-x-auto relative custom-scrollbar">
                            <table className="w-full text-left min-w-[800px]">
                                <thead>
                                    <tr className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-sm">
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase backdrop-blur-sm bg-slate-50/90">Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase backdrop-blur-sm bg-slate-50/90">Email</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase backdrop-blur-sm bg-slate-50/90">Joined Date</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right backdrop-blur-sm bg-slate-50/90">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loading ? (
                                        <tr><td colSpan="4" className="p-6 text-center text-slate-500">Loading...</td></tr>
                                    ) : filteredEmployees.length > 0 ? (
                                        filteredEmployees.map(emp => (
                                            <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                                            {emp.firstName?.[0]}{emp.lastName?.[0]}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-slate-900">{emp.firstName} {emp.lastName}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">{emp.email}</td>
                                                <td className="px-6 py-4 text-slate-600">{new Date(emp.dateJoined || Date.now()).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => openEditModal(emp)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button onClick={() => openDeleteModal(emp)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="p-6 text-center text-slate-500">No employees found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Create/Edit Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-slate-800">{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">First Name</label>
                                        <input name="firstName" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" onChange={handleInputChange} value={formData.firstName} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Last Name</label>
                                        <input name="lastName" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" onChange={handleInputChange} value={formData.lastName} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                                    <input name="email" type="email" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" onChange={handleInputChange} value={formData.email} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Date Joined</label>
                                    <input name="dateJoined" type="date" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" onChange={handleInputChange} value={formData.dateJoined} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
                                    <input name="dateOfBirth" type="date" required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" onChange={handleInputChange} value={formData.dateOfBirth} />
                                </div>
                                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg mt-4">
                                    {isEditMode ? 'Update Employee' : 'Create Employee'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Employee?</h3>
                            <p className="text-slate-500 mb-6">Are you sure you want to remove <span className="font-semibold text-slate-900">{employeeToDelete?.firstName} {employeeToDelete?.lastName}</span>? This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors">Cancel</button>
                                <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-100 transition-colors">Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const SidebarItem = ({ icon, label, active = false, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group ${active ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}>
        <div className="flex items-center gap-3">
            <span className={active ? 'text-indigo-600' : 'group-hover:text-indigo-600 transition-colors'}>{icon}</span>
            <span className="text-sm font-semibold">{label}</span>
        </div>
        {active && <ChevronRight size={14} className="text-indigo-400" />}
    </div>
);

export default Employees;
