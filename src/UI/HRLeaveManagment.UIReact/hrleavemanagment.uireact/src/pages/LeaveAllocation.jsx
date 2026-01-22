import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    X,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

import LeaveAllocationService from '../services/LeaveAllocationService';
import LeaveTypeService from '../services/LeaveTypeService';
import EmployeeService from '../services/EmployeeService';
import AuthContext from '../context/AuthContext';

const LeaveAllocation = () => {
    const { user } = useContext(AuthContext);
    const [allocations, setAllocations] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState(null);

    // Check if user is admin
    const isAdmin = useMemo(() => {
        return user?.role === 'Administrator';
    }, [user]);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [allocationToDelete, setAllocationToDelete] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        id: null,
        employeeId: '',
        leaveTypeId: '',
        numberOfDays: '',
        period: ''
    });

    const navigate = useNavigate();

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

    // Derived State
    const filteredAllocations = useMemo(() => {
        return allocations.filter(alloc => {
            const empName = alloc.employeeName?.toLowerCase() || '';
            const typeName = alloc.leaveType?.name?.toLowerCase() || '';
            const query = searchQuery.toLowerCase();
            return empName.includes(query) || typeName.includes(query);
        });
    }, [allocations, searchQuery]);

    // Handlers
    const resetForm = () => {
        setFormData({
            id: null,
            employeeId: '',
            leaveTypeId: '',
            numberOfDays: '',
            period: ''
        });
        setIsEditMode(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            id: formData.id,
            leaveTypeId: parseInt(formData.leaveTypeId),
            numberOFdayes: parseInt(formData.numberOfDays),
            period: parseInt(formData.period)
        };

        // Only include employeeId for creation, not for updates
        if (!isEditMode) {
            payload.employeeId = parseInt(formData.employeeId);
        }

        try {
            if (isEditMode) {
                await LeaveAllocationService.updateAllocation(payload.id, payload);
                showNotification('Allocation updated successfully');
            } else {
                await LeaveAllocationService.createAllocation(payload);
                showNotification('Allocation created successfully');
            }
            const updatedAllocations = await LeaveAllocationService.getAllAllocations();
            setAllocations(updatedAllocations);
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            console.error(error);
            showNotification(`Failed to ${isEditMode ? 'update' : 'create'} allocation`, 'error');
        }
    };

    const handleEdit = (allocation) => {
        setFormData({
            id: allocation.id,
            employeeId: allocation.employeeId,
            leaveTypeId: allocation.leaveTypeId,
            numberOfDays: allocation.numberOFdayes,
            period: allocation.period
        });
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    const confirmDelete = (allocation) => {
        setAllocationToDelete(allocation);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!allocationToDelete) return;
        try {
            await LeaveAllocationService.deleteAllocation(allocationToDelete.id);
            setAllocations(prev => prev.filter(a => a.id !== allocationToDelete.id));
            showNotification('Allocation deleted successfully');
            setIsDeleteModalOpen(false);
            setAllocationToDelete(null);
        } catch (error) {
            console.error(error);
            showNotification('Failed to delete allocation', 'error');
        }
    };

    const openCreateModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (allocation) => {
        setFormData({
            id: allocation.id,
            employeeId: allocation.employeeId,
            leaveTypeId: allocation.leaveTypeId,
            numberOfDays: allocation.numberOFdayes,
            period: allocation.period
        });
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    return (
        <div className="w-full h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900">Leave Allocations</h1>
                {isAdmin && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-3 py-2 md:px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm text-sm"
                    >
                        <Plus size={18} className="md:w-5 md:h-5" />
                        <span className="hidden md:inline">Allocate Leave</span>
                        <span className="md:hidden">New</span>
                    </button>
                )}
            </div>

            <div className="mb-6 relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search allocations..."
                    className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 animate-pulse">
                            <div className="h-4 bg-slate-100 rounded w-1/2 mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-slate-100 rounded w-full"></div>
                                <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                            </div>
                        </div>
                    ))
                ) : filteredAllocations.length > 0 ? (
                    filteredAllocations.map(alloc => (
                        <div key={alloc.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-slate-800">{alloc.employeeName}</h3>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                                        {alloc.leaveType?.name}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    {isAdmin && (
                                        <>
                                            <button onClick={() => handleEdit(alloc)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => confirmDelete(alloc)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Days</p>
                                    <p className="font-semibold text-slate-700">{alloc.numberOFdayes}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Balance</p>
                                    <p className={`font-semibold ${alloc.balance > 0 ? 'text-green-600' :
                                        alloc.balance === 0 ? 'text-orange-600' :
                                            'text-red-600'
                                        }`}>{alloc.balance}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Period</p>
                                    <p className="font-semibold text-slate-700">{alloc.period}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-slate-500">No allocations found.</div>
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-col h-[calc(100vh-240px)] min-h-[400px]">
                <div className="flex-1 overflow-y-auto overflow-x-auto relative custom-scrollbar">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-sm">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase backdrop-blur-sm bg-slate-50/90">Employee</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase backdrop-blur-sm bg-slate-50/90">Leave Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase backdrop-blur-sm bg-slate-50/90">Days</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase backdrop-blur-sm bg-slate-50/90">Balance</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase backdrop-blur-sm bg-slate-50/90">Period</th>
                                {isAdmin && <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right tracking-wider backdrop-blur-sm bg-slate-50/90">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={isAdmin ? "6" : "5"} className="p-6 text-center text-slate-500">Loading...</td></tr>
                            ) : filteredAllocations.length > 0 ? (
                                filteredAllocations.map(alloc => (
                                    <tr key={alloc.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-slate-900">{alloc.employeeName}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {alloc.leaveType?.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{alloc.numberOFdayes}</td>
                                        <td className="px-6 py-4">
                                            <span className={`font-semibold ${alloc.balance > 0 ? 'text-green-600' :
                                                alloc.balance === 0 ? 'text-orange-600' :
                                                    'text-red-600'
                                                }`}>
                                                {alloc.balance}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{alloc.period}</td>
                                        {isAdmin && (
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleEdit(alloc)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button onClick={() => confirmDelete(alloc)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={isAdmin ? "6" : "5"} className="px-6 py-12 text-center text-slate-500">
                                        No allocations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notification */}
            {
                notification && (
                    <div className={`fixed bottom-8 right-8 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-10 duration-300 z-[100] ${notification.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}`}>
                        {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} className="text-emerald-400" />}
                        <span className="font-medium">{notification.message}</span>
                    </div>
                )
            }

            {/* Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-slate-800">{isEditMode ? 'Edit Allocation' : 'New Allocation'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Employee</label>
                                    <select
                                        name="employeeId"
                                        value={formData.employeeId}
                                        onChange={handleInputChange}
                                        disabled={isEditMode}
                                        required
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Leave Type</label>
                                    <select
                                        name="leaveTypeId"
                                        value={formData.leaveTypeId}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Select Leave Type</option>
                                        {leaveTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Number of Days</label>
                                        <input
                                            type="number"
                                            name="numberOfDays"
                                            value={formData.numberOfDays}
                                            onChange={handleInputChange}
                                            required
                                            min="1"
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Period</label>
                                        <input
                                            type="number"
                                            name="period"
                                            value={formData.period}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg mt-4">
                                    {isEditMode ? 'Update Allocation' : 'Create Allocation'}
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Delete Modal */}
            {
                isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Allocation?</h3>
                            <p className="text-slate-500 mb-6">Are you sure you want to delete this allocation? This action cannot be undone.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl">Cancel</button>
                                <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-100">Delete</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default LeaveAllocation;
