import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    Calendar,
    Users,
    Settings,
    ChevronRight,
    LayoutDashboard,
    Clock,
    ShieldCheck,
    X,
    AlertCircle,
    CheckCircle2,
    Menu
} from 'lucide-react';

import api from '../services/api';

const LeaveType = () => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState(null);

    // Responsive States
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLeaveType, setCurrentLeaveType] = useState(null); // For editing
    const [isDeleting, setIsDeleting] = useState(null); // ID of type being deleted

    // Initialize Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // GET requests return the data directly from axios if configured, 
                // but usually axios returns { data: ... }. 
                // Let's assume axios interceptor or standard behavior.
                const response = await api.get('/LeaveType');
                setLeaveTypes(response.data);
            } catch (err) {
                console.error(err);
                showNotification('Error loading leave types', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const filteredData = useMemo(() => {
        return leaveTypes.filter(lt =>
            lt.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [leaveTypes, searchQuery]);

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        // Ensure keys match what backend expects (case-insensitive usually ok in JSON but be careful)
        const payload = {
            id: currentLeaveType ? currentLeaveType.id : 0,
            name: formData.get('name'),
            defaultDays: parseInt(formData.get('defaultDays')),
        };

        try {
            if (currentLeaveType) {
                // PUT: api/LeaveType/{id}
                await api.put(`/LeaveType/${currentLeaveType.id}`, payload);

                // Optimistic update or refetch. Let's update local state.
                const nowStr = new Date().toISOString();
                setLeaveTypes(prev => prev.map(lt => lt.id === currentLeaveType.id ? { ...lt, ...payload, dateModified: new Date().toISOString() } : lt)); // Optimistic update of Modified Date
                showNotification(`${payload.name} updated successfully`);
            } else {
                // POST: api/LeaveType
                const response = await api.post('/LeaveType', payload);

                // Response might be the ID (int) based on Controller: `return CreatedAtAction(..., new { id = response })`
                // But the body of the response is the ID.
                // Let's create a temp object to show immediately, or ideally refetch.
                const newId = response.data;
                const newEntry = { ...payload, id: newId, dateCreated: new Date().toISOString() };

                setLeaveTypes(prev => [...prev, newEntry]);
                showNotification(`${payload.name} created successfully`);
            }
            closeModal();
        } catch (error) {
            console.error(error);
            showNotification('Failed to save changes', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            // DELETE: api/LeaveType/{id}
            await api.delete(`/LeaveType/${id}`);

            setLeaveTypes(prev => prev.filter(lt => lt.id !== id));
            setIsDeleting(null);
            showNotification('Leave type deleted');
        } catch (error) {
            console.error(error);
            showNotification('Failed to delete leave type', 'error');
        }
    };

    const openModal = (type = null) => {
        setCurrentLeaveType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentLeaveType(null);
    };

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
                {/* Close button for mobile only */}
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="md:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
                >
                    <X size={20} />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
                <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => navigate('/')} />
                <SidebarItem icon={<Users size={20} />} label="Employees" onClick={() => navigate('/employees')} />
                <SidebarItem icon={<Calendar size={20} />} label="Leave Requests" onClick={() => navigate('/leave-requests')} />
                <SidebarItem icon={<Clock size={20} />} label="Allocations" onClick={() => navigate('/leave-allocation')} />
                <SidebarItem icon={<ShieldCheck size={20} />} label="Leave Types" active onClick={() => navigate('/leavetypes')} />
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
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar & Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <aside className="relative w-64 max-w-[80%] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg font-semibold text-slate-800 truncate hidden sm:block">Leave Management Configuration</h2>
                        <h2 className="text-lg font-semibold text-slate-800 truncate sm:hidden">Leave Types</h2>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search leave types..."
                                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-48 md:w-64 outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {/* Mobile Search Icon Only */}
                        <button className="sm:hidden w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                            <Search size={20} />
                        </button>

                        <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                            <Settings size={20} className="text-slate-600" />
                        </button>
                    </div>
                </header>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="w-full max-w-full">
                        {/* Page Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 hidden sm:block">Leave Types</h1>
                                <p className="text-slate-500 mt-1 hidden sm:block">Define the available categories of leave for your organization.</p>
                            </div>
                            <button
                                onClick={() => openModal()}
                                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all active:scale-95 w-full sm:w-auto"
                            >
                                <Plus size={20} />
                                Create New Type
                            </button>
                        </div>

                        {/* Stats Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                            <StatCard label="Total Categories" value={leaveTypes.length} subValue="+1 this month" />
                            <StatCard label="Avg. Allowance" value="28 Days" subValue="Standard policy" />
                            <StatCard label="Most Used" value="Annual Leave" subValue="82% of requests" />
                        </div>

                        {/* Data Table */}
                        {/* Data Table Container */}
                        {/* Mobile Card List View */}
                        <div className="md:hidden space-y-4">
                            {loading ? (
                                [...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 animate-pulse">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
                                            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                                            <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                                        </div>
                                    </div>
                                ))
                            ) : filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                                    <Calendar size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                                                    <p className="text-xs text-slate-500 mt-0.5">ID: {item.id}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openModal(item)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setIsDeleting(item)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Allowance</p>
                                                <span className="inline-flex px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                                                    {item.defaultDays} Days
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Last Modified</p>
                                                <span className="text-sm font-medium text-slate-600">
                                                    {item.dateModified ? new Date(item.dateModified).toLocaleDateString() : '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    No leave types found matching "{searchQuery}"
                                </div>
                            )}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:flex bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-col h-[calc(100vh-320px)] min-h-[400px]">
                            <div className="flex-1 overflow-y-auto overflow-x-auto relative custom-scrollbar">
                                <table className="w-full text-left min-w-[600px]">
                                    <thead>
                                        <tr className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-sm">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider backdrop-blur-sm bg-slate-50/90">Leave Type Name</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider backdrop-blur-sm bg-slate-50/90">Default Days</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider backdrop-blur-sm bg-slate-50/90">Last Modified</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right backdrop-blur-sm bg-slate-50/90">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {loading ? (
                                            [...Array(3)].map((_, i) => <SkeletonRow key={i} />)
                                        ) : filteredData.length > 0 ? (
                                            filteredData.map((item) => (
                                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                                <Calendar size={20} />
                                                            </div>
                                                            <span className="font-semibold text-slate-800">{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                                                            {item.defaultDays} Days
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm text-slate-500">
                                                        {item.dateModified ? new Date(item.dateModified).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => openModal(item)}
                                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            >
                                                                <Edit2 size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => setIsDeleting(item)}
                                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                                    No leave types found matching "{searchQuery}"
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Custom Notifications Overlay */}
                {notification && (
                    <div className={`fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 duration-300 z-[100] ${notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'
                        }`}>
                        {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} className="text-emerald-400" />}
                        <span className="font-medium">{notification.message}</span>
                    </div>
                )}

                {/* MODAL: CREATE / EDIT */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="px-8 pt-8 pb-4 flex justify-between items-center">
                                <h3 className="text-2xl font-bold text-slate-800">
                                    {currentLeaveType ? 'Update Leave Type' : 'Create Leave Type'}
                                </h3>
                                <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-8 pt-2 space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Type Name</label>
                                    <input
                                        name="name"
                                        required
                                        defaultValue={currentLeaveType?.name || ''}
                                        placeholder="e.g. Annual Leave, Sick Leave"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Default Allowance (Days)</label>
                                    <input
                                        name="defaultDays"
                                        type="number"
                                        required
                                        min="1"
                                        defaultValue={currentLeaveType?.defaultDays || ''}
                                        placeholder="e.g. 21"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-medium"
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
                                    >
                                        {currentLeaveType ? 'Save Changes' : 'Create Type'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* MODAL: DELETE CONFIRMATION */}
                {isDeleting && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Trash2 size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Are you sure?</h3>
                                <p className="text-slate-500 mb-8 leading-relaxed">
                                    You are about to delete <span className="font-bold text-slate-700">"{isDeleting.name}"</span>.
                                    This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsDeleting(null)}
                                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                                    >
                                        Keep it
                                    </button>
                                    <button
                                        onClick={() => handleDelete(isDeleting.id)}
                                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-100 transition-all active:scale-95"
                                    >
                                        Delete Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

/** Sub-components */

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

const StatCard = ({ label, value, subValue }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <div className="flex items-baseline gap-3 mt-2">
            <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
            <span className="text-xs font-medium text-emerald-500">{subValue}</span>
        </div>
    </div>
);

const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
                <div className="w-24 h-4 bg-slate-100 rounded"></div>
            </div>
        </td>
        <td className="px-6 py-5"><div className="w-12 h-4 bg-slate-100 rounded"></div></td>
        <td className="px-6 py-5"><div className="w-20 h-4 bg-slate-100 rounded"></div></td>
        <td className="px-6 py-5"><div className="w-16 h-4 bg-slate-100 rounded ml-auto"></div></td>
    </tr>
);

export default LeaveType;