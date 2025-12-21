import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
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
    Menu,
    Briefcase
} from 'lucide-react';

import LeaveAllocationService from '../services/LeaveAllocationService';
import LeaveTypeService from '../services/LeaveTypeService';
import EmployeeService from '../services/EmployeeService';

const LeaveAllocation = () => {
    const [allocations, setAllocations] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState(null);

    // Responsive States
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAllocation, setCurrentAllocation] = useState(null); // For editing
    const [isDeleting, setIsDeleting] = useState(null); // ID of allocation being deleted
    const [isAllocating, setIsAllocating] = useState(false); // Mode: True = Create New, False = Edit

    // Allocation Form State
    const [allocateToAll, setAllocateToAll] = useState(true);

    // Initialize Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allocData, typeData, empData] = await Promise.all([
                    LeaveAllocationService.getAllAllocations(),
                    LeaveTypeService.getAllLeaveTypes(),
                    EmployeeService.getAllEmployees()
                ]);
                setAllocations(allocData);
                setLeaveTypes(typeData);
                setEmployees(empData);
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

    const getEmployeeName = (id) => {
        // ID might be string in allocation but int in employee table
        const emp = employees.find(e => e.id == id);
        return emp ? `${emp.firstName} ${emp.lastName}` : `Employee #${id}`;
    };

    const filteredData = useMemo(() => {
        return allocations.filter(item => {
            const empName = getEmployeeName(item.employeeId).toLowerCase();
            const leaveTypeName = item.leaveType ? item.leaveType.name.toLowerCase() : '';
            const query = searchQuery.toLowerCase();
            return empName.includes(query) || leaveTypeName.includes(query);
        });
    }, [allocations, searchQuery, employees]);

    const handleAllocate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const leaveTypeId = parseInt(formData.get('leaveTypeId'));

        const payload = {
            leaveTypeId,
            employeeId: allocateToAll ? null : parseInt(formData.get('employeeId'))
        };

        try {
            await LeaveAllocationService.createAllocation(payload);
            showNotification('Leave allocated successfully');

            // Refresh
            const updatedAllocations = await LeaveAllocationService.getAllAllocations();
            setAllocations(updatedAllocations);

            closeModal();
        } catch (error) {
            console.error(error);
            showNotification('Failed to allocate leave', 'error');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const payload = {
            id: currentAllocation.id,
            leaveTypeId: currentAllocation.leaveTypeId, // Usually not editable
            numberOFdayes: parseInt(formData.get('numberOFdayes')),
            period: parseInt(formData.get('period')),
            employeeId: currentAllocation.employeeId
        };

        try {
            await LeaveAllocationService.updateAllocation(payload);
            showNotification('Allocation updated successfully');

            const updatedAllocations = await LeaveAllocationService.getAllAllocations();
            setAllocations(updatedAllocations);

            closeModal();
        } catch (error) {
            console.error(error);
            showNotification('Failed to update allocation', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await LeaveAllocationService.deleteAllocation(id);
            setAllocations(prev => prev.filter(a => a.id !== id));
            setIsDeleting(null);
            showNotification('Allocation deleted');
        } catch (error) {
            console.error(error);
            showNotification('Failed to delete allocation', 'error');
        }
    };

    const openAllocateModal = () => {
        setIsAllocating(true);
        setCurrentAllocation(null);
        setAllocateToAll(true);
        setIsModalOpen(true);
    };

    const openEditModal = (allocation) => {
        setIsAllocating(false);
        setCurrentAllocation(allocation);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentAllocation(null);
        setIsAllocating(false);
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
                <SidebarItem icon={<Clock size={20} />} label="Allocations" active onClick={() => navigate('/leave-allocation')} />
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
                        <h2 className="text-lg font-semibold text-slate-800 truncate hidden sm:block">Leave Allocations</h2>
                        <h2 className="text-lg font-semibold text-slate-800 truncate sm:hidden">Allocations</h2>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search allocations..."
                                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-48 md:w-64 outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
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
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 hidden sm:block">Allocations</h1>
                                <p className="text-slate-500 mt-1 hidden sm:block">Manage employee leave credits and balances.</p>
                            </div>
                            <button
                                onClick={openAllocateModal}
                                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all active:scale-95 w-full sm:w-auto"
                            >
                                <Plus size={20} />
                                Allocate Leave
                            </button>
                        </div>

                        {/* Data Table */}
                        {/* Data Table & Mobile Cards */}
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
                                                    <Users size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800">{getEmployeeName(item.employeeId)}</h3>
                                                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium border border-slate-200">
                                                        {item.leaveType ? item.leaveType.name : 'Unknown Type'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setIsDeleting(item.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Allocated</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-xl font-bold text-slate-900">{item.numberOFdayes}</span>
                                                    <span className="text-xs text-slate-500 font-medium uppercase">Days</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Period</p>
                                                <span className="text-sm font-mono text-slate-600 font-medium bg-slate-50 px-2 py-1 rounded">
                                                    {item.period}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    No allocations found matching "{searchQuery}"
                                </div>
                            )}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:flex bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-col h-[calc(100vh-320px)] min-h-[400px]">
                            <div className="flex-1 overflow-y-auto overflow-x-auto relative custom-scrollbar">
                                <table className="w-full text-left min-w-[800px]">
                                    <thead>
                                        <tr className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-sm">
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider backdrop-blur-sm bg-slate-50/90">Employee</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider backdrop-blur-sm bg-slate-50/90">Leave Type</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider backdrop-blur-sm bg-slate-50/90">Allocated Days</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider backdrop-blur-sm bg-slate-50/90">Period</th>
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
                                                                <Users size={20} />
                                                            </div>
                                                            <span className="font-semibold text-slate-800">{getEmployeeName(item.employeeId)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">
                                                            {item.leaveType ? item.leaveType.name : 'Unknown Type'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-2xl font-bold text-slate-900 tracking-tight">{item.numberOFdayes}</span>
                                                        <span className="text-xs text-slate-500 ml-1 font-medium uppercase">Days</span>
                                                    </td>
                                                    <td className="px-6 py-5 text-sm font-mono text-slate-500">
                                                        {item.period}
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => openEditModal(item)}
                                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            >
                                                                <Edit2 size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => setIsDeleting(item.id)}
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
                                                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                                    No allocations found matching "{searchQuery}"
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
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="px-8 pt-8 pb-4 flex justify-between items-center">
                                <h3 className="text-2xl font-bold text-slate-800">
                                    {isAllocating ? 'New Allocation' : 'Edit Allocation'}
                                </h3>
                                <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={isAllocating ? handleAllocate : handleUpdate} className="p-8 pt-2 space-y-6">
                                {/* Leave Type (Read-only in Edit) */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Leave Type</label>
                                    <div className="relative">
                                        <select
                                            name="leaveTypeId"
                                            defaultValue={currentAllocation?.leaveTypeId || ""}
                                            disabled={!isAllocating}
                                            required
                                            className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium appearance-none 
                                            ${!isAllocating ? 'bg-slate-100 text-slate-500' : 'bg-white'}`}
                                        >
                                            <option value="">-- Choose Type --</option>
                                            {leaveTypes.map(type => (
                                                <option key={type.id} value={type.id}>{type.name}</option>
                                            ))}
                                        </select>
                                        {isAllocating && <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={18} />}
                                    </div>
                                </div>

                                {/* Create Mode: Employee Selection */}
                                {isAllocating ? (
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={allocateToAll}
                                                onChange={(e) => setAllocateToAll(e.target.checked)}
                                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                            />
                                            <span className="text-sm font-medium text-slate-700">Allocate to all employees</span>
                                        </label>

                                        {!allocateToAll && (
                                            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Select Employee</label>
                                                <div className="relative">
                                                    <select
                                                        name="employeeId"
                                                        required={!allocateToAll}
                                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium appearance-none bg-white"
                                                    >
                                                        <option value="">-- Choose Employee --</option>
                                                        {employees.map(emp => (
                                                            <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={18} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Edit Mode: Days and Period
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Days</label>
                                            <input
                                                name="numberOFdayes"
                                                type="number"
                                                defaultValue={currentAllocation?.numberOFdayes}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Period</label>
                                            <input
                                                name="period"
                                                type="number"
                                                defaultValue={currentAllocation?.period}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                )}

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
                                        {isAllocating ? 'Allocate' : 'Save Changes'}
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
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Allocation?</h3>
                                <p className="text-slate-500 mb-8 leading-relaxed">
                                    Are you sure you want to delete this allocation? This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsDeleting(null)}
                                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleDelete(isDeleting)}
                                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-100 transition-all active:scale-95"
                                    >
                                        Delete
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

/* Sub-components */

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

const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
                <div className="w-24 h-4 bg-slate-100 rounded"></div>
            </div>
        </td>
        <td className="px-6 py-5"><div className="w-20 h-4 bg-slate-100 rounded"></div></td>
        <td className="px-6 py-5"><div className="w-24 h-4 bg-slate-100 rounded"></div></td>
        <td className="px-6 py-5"><div className="w-24 h-4 bg-slate-100 rounded"></div></td>
        <td className="px-6 py-5"><div className="w-16 h-4 bg-slate-100 rounded ml-auto"></div></td>
    </tr>
);

export default LeaveAllocation;
