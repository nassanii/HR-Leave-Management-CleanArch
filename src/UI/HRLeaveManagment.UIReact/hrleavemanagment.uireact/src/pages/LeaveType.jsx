import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Calendar,
    X,
    AlertCircle,
    CheckCircle2,
    Filter
} from 'lucide-react';

import api from '../services/api';
import AuthContext from '../context/AuthContext';
import LeaveRequestService from '../services/LeaveRequestService';

const LeaveType = () => {
    const { user } = useContext(AuthContext);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState(null);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLeaveType, setCurrentLeaveType] = useState(null); // For editing
    const [isDeleting, setIsDeleting] = useState(null); // ID of type being deleted

    const navigate = useNavigate();

    const isAdmin = user?.role === 'Administrator';

    // Initialize Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [typesResponse, requestsData] = await Promise.all([
                    api.get('/LeaveType'),
                    LeaveRequestService.getAllLeaveRequests()
                ]);
                setLeaveTypes(typesResponse.data);
                setLeaveRequests(requestsData);
            } catch (err) {
                console.error(err);
                showNotification('Error loading data', 'error');
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

    // Calculate Statistics
    const stats = useMemo(() => {
        if (!leaveTypes.length) return { total: 0, avg: 0, mostUsed: '-' };

        // 1. Total Categories
        const total = leaveTypes.length;

        // 2. Avg. Allowance
        const totalDays = leaveTypes.reduce((sum, type) => sum + type.defaultDays, 0);
        // Changed to Total Allowance (Sum) per user request

        // 3. Most Used
        if (!leaveRequests.length) return { total, avg: totalDays, mostUsed: 'None' };

        const typeCounts = leaveRequests.reduce((acc, req) => {
            const typeId = req.leaveType?.id;
            if (typeId) {
                acc[typeId] = (acc[typeId] || 0) + 1;
            }
            return acc;
        }, {});

        const mostUsedTypeId = Object.keys(typeCounts).reduce((a, b) => typeCounts[a] > typeCounts[b] ? a : b, null);
        const mostUsedType = leaveTypes.find(lt => lt.id.toString() === mostUsedTypeId);

        const mostUsedName = mostUsedType ? mostUsedType.name : 'None';
        const mostUsedPercentage = mostUsedTypeId ? Math.round((typeCounts[mostUsedTypeId] / leaveRequests.length) * 100) : 0;

        return {
            total,
            avg: totalDays, // Using totalDays as the 'avg' property to keep downstream simple, or just rename.
            mostUsed: mostUsedName,
            mostUsedSub: mostUsedTypeId ? `${mostUsedPercentage}% of requests` : 'No data'
        };
    }, [leaveTypes, leaveRequests]);


    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = {
            id: currentLeaveType ? currentLeaveType.id : 0,
            name: formData.get('name'),
            defaultDays: parseInt(formData.get('defaultDays')),
        };

        try {
            if (currentLeaveType) {
                await api.put(`/LeaveType/${currentLeaveType.id}`, payload);
                setLeaveTypes(prev => prev.map(lt => lt.id === currentLeaveType.id ? { ...lt, ...payload, dateModified: new Date().toISOString() } : lt));
                showNotification(`${payload.name} updated successfully`);
            } else {
                const response = await api.post('/LeaveType', payload);
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

    return (
        <div className="w-full h-full"> {/* Container for page content */}

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Leave Types</h1>
                    <p className="text-slate-500 mt-1">Define the available categories of leave for your organization.</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all active:scale-95 w-full sm:w-auto"
                    >
                        <Plus size={20} />
                        Create New Type
                    </button>
                )}
            </div>

            <div className="mb-6 relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search leave types..."
                    className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <StatCard label="Total Categories" value={stats.total} subValue="Active types" />
                <StatCard label="Total Allowance" value={`${stats.avg} Days`} subValue="Per employee/year" />
                <StatCard label="Most Used" value={stats.mostUsed} subValue={stats.mostUsedSub || "Based on usage"} />
            </div>

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
                                {isAdmin && (
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
                                )}
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
                                {isAdmin && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right backdrop-blur-sm bg-slate-50/90">Actions</th>}
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
                                        {isAdmin && (
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
                                        )}
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
        </div>
    );
};

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