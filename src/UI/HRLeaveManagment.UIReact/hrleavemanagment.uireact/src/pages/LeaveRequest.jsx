import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit2,
    Calendar,
    Users,
    Settings,
    Clock,
    X,
    AlertCircle,
    CheckCircle2,
    Eye,
    XCircle,
    ChevronRight,
    Filter,
    Trash2
} from 'lucide-react';

import LeaveRequestService from '../services/LeaveRequestService';
import LeaveTypeService from '../services/LeaveTypeService';
import AuthContext from '../context/AuthContext';

const LeaveRequest = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState(null);

    // Check if user is admin
    const isAdmin = useMemo(() => {
        return user?.role === 'Administrator';
    }, [user]);

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRequest, setCurrentRequest] = useState(null); // For viewing/editing
    const [isCanceling, setIsCanceling] = useState(null); // ID of request being canceled
    const [isDeleting, setIsDeleting] = useState(null); // ID of request being deleted
    const [isCreating, setIsCreating] = useState(false); // Mode: true = Create New, false = View/Edit
    const [selectedRequests, setSelectedRequests] = useState([]); // For bulk delete
    const [isDeletetingBulk, setIsDeletingBulk] = useState(false); // Bulk delete confirmation

    // Initialize Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Leave Types (Critical for creating requests)
                try {
                    const typeData = await LeaveTypeService.getAllLeaveTypes();
                    setLeaveTypes(typeData);
                } catch (err) {
                    console.error("Failed to fetch leave types:", err);
                    showNotification('Error loading leave types', 'error');
                }

                // Fetch Leave Requests (History)
                try {
                    const requestData = await LeaveRequestService.getAllLeaveRequests();
                    setRequests(requestData);
                } catch (err) {
                    console.error("Failed to fetch leave requests:", err);
                    // Don't show notification if it's just 401 (auth will handle redirect usually)
                    // But for now, let's log it.
                    if (err.response?.status !== 401) {
                        showNotification('Error loading requests', 'error');
                    }
                }
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
        return requests.filter(item =>
            (item.employeeName && item.employeeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.leaveType?.name && item.leaveType.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [requests, searchQuery]);

    const handleCreate = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const payload = {
            leaveTypeId: parseInt(formData.get('leaveTypeId')),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            requestComments: formData.get('requestComments')
        };

        try {
            await LeaveRequestService.createLeaveRequest(payload);
            showNotification('Leave request submitted successfully');

            // Refresh requests
            const updatedRequests = await LeaveRequestService.getAllLeaveRequests();
            setRequests(updatedRequests);

            closeModal();
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.detail || error.response?.data?.title || error.message || 'Failed to submit request';
            showNotification(errorMessage, 'error');
        }
    };

    const handleCancel = async (id) => {
        try {
            await LeaveRequestService.cancelLeaveRequest(id);
            setRequests(prev => prev.filter(r => r.id !== id));
            setIsCanceling(null);
            showNotification('Request cancelled');

            // Refresh requests to allow backend to update status if it's soft delete/status change
            const updatedRequests = await LeaveRequestService.getAllLeaveRequests();
            setRequests(updatedRequests);

        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.detail || error.response?.data?.title || error.message || 'Failed to cancel request';
            showNotification(errorMessage, 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await LeaveRequestService.deleteLeaveRequest(id);
            setRequests(prev => prev.filter(r => r.id !== id));
            setIsDeleting(null);
            showNotification('Request deleted successfully');
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.detail || error.response?.data?.title || error.message || 'Failed to delete request';
            showNotification(errorMessage, 'error');
        }
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectedRequests.map(id => LeaveRequestService.deleteLeaveRequest(id)));
            setRequests(prev => prev.filter(r => !selectedRequests.includes(r.id)));
            setSelectedRequests([]);
            setIsDeletingBulk(false);
            showNotification(`Successfully deleted ${selectedRequests.length} request(s)`);
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.detail || error.response?.data?.title || error.message || 'Failed to delete requests';
            showNotification(errorMessage, 'error');
        }
    };

    const toggleSelectRequest = (id) => {
        setSelectedRequests(prev =>
            prev.includes(id) ? prev.filter(reqId => reqId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedRequests.length === filteredData.length) {
            setSelectedRequests([]);
        } else {
            setSelectedRequests(filteredData.map(r => r.id));
        }
    };

    const handleApproval = async (id, approved) => {
        try {
            await LeaveRequestService.changeApprovalStatus(id, approved);
            showNotification(`Request ${approved ? 'approved' : 'rejected'}`);

            // Refresh requests
            const updatedRequests = await LeaveRequestService.getAllLeaveRequests();
            setRequests(updatedRequests);
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.detail || error.response?.data?.title || error.message || 'Failed to update status';
            showNotification(errorMessage, 'error');
        }
    };

    const openCreateModal = () => {
        setIsCreating(true);
        setCurrentRequest(null);
        setIsModalOpen(true);
    };

    const openViewModal = (request) => {
        setIsCreating(false);
        setCurrentRequest(request);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentRequest(null);
        setIsCreating(false);
    };

    const getStatusBadge = (approved) => {
        if (approved === true) {
            return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12} /> Approved</span>;
        } else if (approved === false) {
            return <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={12} /> Rejected</span>;
        } else {
            return <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12} /> Pending</span>;
        }
    };

    return (
        <div className="w-full h-full"> {/* Container for page content */}

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Leave Requests</h1>
                    <p className="text-slate-500 mt-1">Manage and track employee leave requests.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    {isAdmin && selectedRequests.length > 0 && (
                        <button
                            onClick={() => setIsDeletingBulk(true)}
                            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-red-100 transition-all active:scale-95 flex-1 sm:flex-initial"
                        >
                            <Trash2 size={20} />
                            Delete All ({selectedRequests.length})
                        </button>
                    )}
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all active:scale-95 flex-1 sm:flex-initial"
                    >
                        <Plus size={20} />
                        Create Request
                    </button>
                </div>
            </div>

            <div className="mb-6 relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search requests..."
                    className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                <StatCard label="Total Requests" value={requests.length} subValue="All time" />
                <StatCard label="Pending" value={requests.filter(r => r.approved === null).length} subValue="Needs Action" />
                <StatCard label="Approved" value={requests.filter(r => r.approved === true).length} subValue="This Year" />
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
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{item.employeeName || 'Unknown'}</h3>
                                        <div className="mt-1">{getStatusBadge(item.approved)}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openViewModal(item)}
                                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    {isAdmin && item.approved === null && (
                                        <>
                                            <button
                                                onClick={() => handleApproval(item.id, true)}
                                                className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                            >
                                                <CheckCircle2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleApproval(item.id, false)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                        </>
                                    )}
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
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Leave Type</p>
                                    <span className="font-medium text-slate-700">{item.leaveType ? item.leaveType.name : 'Unknown'}</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</p>
                                    <span className="text-sm font-medium text-slate-600">
                                        {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-slate-500">
                        No leave requests found matching "{searchQuery}"
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:flex bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex-col h-[calc(100vh-320px)] min-h-[400px]">
                <div className="flex-1 overflow-y-auto overflow-x-auto relative custom-scrollbar">
                    <table className="w-full text-left min-w-[900px]">
                        <thead>
                            <tr className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 shadow-sm">
                                {isAdmin && (
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider backdrop-blur-sm bg-slate-50/90">
                                        <input
                                            type="checkbox"
                                            checked={selectedRequests.length === filteredData.length && filteredData.length > 0}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                        />
                                    </th>
                                )}
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider backdrop-blur-sm bg-slate-50/90">Employee</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider backdrop-blur-sm bg-slate-50/90">Leave Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider backdrop-blur-sm bg-slate-50/90">Start Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider backdrop-blur-sm bg-slate-50/90">End Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider backdrop-blur-sm bg-slate-50/90">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right backdrop-blur-sm bg-slate-50/90">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                [...Array(3)].map((_, i) => <SkeletonRow key={i} />)
                            ) : filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                        {isAdmin && (
                                            <td className="px-6 py-5">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRequests.includes(item.id)}
                                                    onChange={() => toggleSelectRequest(item.id)}
                                                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                                />
                                            </td>
                                        )}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                    <Users size={20} />
                                                </div>
                                                <span className="font-semibold text-slate-800">{item.employeeName || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-medium text-slate-700">{item.leaveType ? item.leaveType.name : 'Unknown'}</span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-600">
                                            {new Date(item.startDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-600">
                                            {new Date(item.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5">
                                            {getStatusBadge(item.approved)}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openViewModal(item)}
                                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {isAdmin && item.approved === null && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApproval(item.id, true)}
                                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                            title="Approve Request"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleApproval(item.id, false)}
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Reject Request"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => setIsDeleting(item)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Request"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={isAdmin ? "7" : "6"} className="px-6 py-12 text-center text-slate-500">
                                        No leave requests found matching "{searchQuery}"
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

            {/* MODAL: CREATE / VIEW */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-8 pt-8 pb-4 flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-slate-800">
                                {isCreating ? 'Submit Leave Request' : 'Request Details'}
                            </h3>
                            <button onClick={closeModal} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={isCreating ? handleCreate : (e) => e.preventDefault()} className="p-8 pt-2 space-y-6">
                            {isCreating ? (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Leave Type</label>
                                        <div className="relative">
                                            <select
                                                name="leaveTypeId"
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium appearance-none bg-white"
                                            >
                                                <option value="">-- Choose Type --</option>
                                                {leaveTypes.map(type => (
                                                    <option key={type.id} value={type.id}>{type.name}</option>
                                                ))}
                                            </select>
                                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={18} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Start Date</label>
                                            <input
                                                name="startDate"
                                                type="date"
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">End Date</label>
                                            <input
                                                name="endDate"
                                                type="date"
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Reason / Comments</label>
                                        <textarea
                                            name="requestComments"
                                            rows="3"
                                            placeholder="Please briefly explain the reason for your leave..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-medium resize-none"
                                        ></textarea>
                                    </div>
                                </>
                            ) : (
                                // View Mode
                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                                            <div className="mt-1">{getStatusBadge(currentRequest.approved)}</div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-slate-500 uppercase">Requested On</p>
                                            <p className="font-semibold text-slate-800">{new Date(currentRequest.dateRequested || Date.now()).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase px-1">Start Date</p>
                                            <p className="p-3 bg-slate-50 rounded-lg font-medium text-slate-800 mt-1">{new Date(currentRequest.startDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase px-1">End Date</p>
                                            <p className="p-3 bg-slate-50 rounded-lg font-medium text-slate-800 mt-1">{new Date(currentRequest.endDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase px-1">Leave Type</p>
                                        <p className="p-3 bg-slate-50 rounded-lg font-medium text-slate-800 mt-1">{currentRequest.leaveType?.name}</p>
                                    </div>

                                    {currentRequest.requestComments && (
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase px-1">Comments</p>
                                            <p className="p-3 bg-slate-50 rounded-lg text-slate-600 mt-1 text-sm leading-relaxed">{currentRequest.requestComments}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                                >
                                    {isCreating ? 'Cancel' : 'Close'}
                                </button>
                                {isCreating && (
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95"
                                    >
                                        Submit Request
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: CANCEL CONFIRMATION */}
            {isCanceling && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Cancel Request?</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Are you sure you want to cancel this leave request? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsCanceling(null)}
                                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                                >
                                    Keep it
                                </button>
                                <button
                                    onClick={() => handleCancel(isCanceling.id)}
                                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-100 transition-all active:scale-95"
                                >
                                    Yes, Cancel
                                </button>
                            </div>
                        </div>
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
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Request?</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Are you sure you want to permanently delete this leave request from <span className="font-semibold text-slate-900">{isDeleting.employeeName || 'Unknown'}</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsDeleting(null)}
                                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(isDeleting.id)}
                                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-100 transition-all active:scale-95"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: BULK DELETE CONFIRMATION */}
            {isDeletetingBulk && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete {selectedRequests.length} Request(s)?</h3>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                Are you sure you want to permanently delete {selectedRequests.length} selected leave request(s)? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsDeletingBulk(false)}
                                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-100 transition-all active:scale-95"
                                >
                                    Delete All
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
        <td className="px-6 py-5"><div className="w-20 h-4 bg-slate-100 rounded"></div></td>
        <td className="px-6 py-5"><div className="w-24 h-4 bg-slate-100 rounded"></div></td>
        <td className="px-6 py-5"><div className="w-24 h-4 bg-slate-100 rounded"></div></td>
        <td className="px-6 py-5"><div className="w-16 h-4 bg-slate-100 rounded"></div></td>
        <td className="px-6 py-5"><div className="w-16 h-4 bg-slate-100 rounded ml-auto"></div></td>
    </tr>
);

export default LeaveRequest;
