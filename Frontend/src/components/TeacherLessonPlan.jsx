import React, { useState, useEffect } from "react";
import { Plus, Book, Calendar, Clock, Edit, Trash2, AlertCircle } from "lucide-react";
import axios from "axios";
import CreateLessonPlan from "./CreateLessonPlan";
import ExpandableLessonPlan from "./ExpandableLessonPlan";

const TeacherLessonPlan = () => {
  const [lessonPlans, setLessonPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filters, setFilters] = useState({
    subject: "",
    grade: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  const fetchLessonPlans = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      }).toString();

      const response = await axiosInstance.get(`/lessonPlans/list?${queryParams}`);
      setLessonPlans(response.data.data.lessonPlans);
      setPagination({
        ...pagination,
        total: response.data.data.pagination.total,
        pages: response.data.data.pagination.pages
      });
      setError(null);
    } catch (err) {
      setError("Failed to fetch lesson plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonPlans();
  }, [filters, pagination.page]);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/lessonPlans/${id}`);
      setLessonPlans(lessonPlans.filter(plan => plan._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError("Failed to delete lesson plan. Please try again.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await axiosInstance.patch(`/lessonPlans/${id}/status`, {
        status: newStatus
      });
      setLessonPlans(lessonPlans.map(plan => 
        plan._id === id ? response.data.data : plan
      ));
    } catch (err) {
      setError("Failed to update status. Please try again.");
    }
  };

  const handleCreateSuccess = (newLessonPlan) => {
    setLessonPlans([newLessonPlan, ...lessonPlans]);
    setShowCreateModal(false);
  };

  const handleEditSuccess = (updatedPlan) => {
    setLessonPlans(lessonPlans.map(plan => 
      plan._id === updatedPlan._id ? updatedPlan : plan
    ));
    setShowEditModal(false);
    setSelectedPlan(null);
  };

  const getStatusColor = (status) => {
    const colors = {
      Draft: "bg-gray-200",
      Pending: "bg-yellow-200",
      Approved: "bg-green-200",
      Completed: "bg-blue-200",
      Cancelled: "bg-red-200",
    };
    return colors[status] || "bg-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lesson Plans</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and organize your teaching curriculum</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus size={18} />
          Create New Plan
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button 
            className="text-sm text-blue-600 hover:text-blue-700"
            onClick={() => setFilters({
              subject: "",
              grade: "",
              status: "",
              startDate: "",
              endDate: "",
            })}
          >
            Clear all
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Subject"
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.subject}
              onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Grade"
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.grade}
              onChange={(e) => setFilters(prev => ({ ...prev, grade: e.target.value }))}
            />
          </div>
          <select
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <input
            type="date"
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={filters.startDate}
            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
          />
          <input
            type="date"
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={filters.endDate}
            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Lesson Plans List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {lessonPlans.map((plan) => (
            <ExpandableLessonPlan
              key={plan._id}
              plan={plan}
              onUpdate={(updatedPlan) => {
                setLessonPlans(lessonPlans.map(p => 
                  p._id === updatedPlan._id ? updatedPlan : p
                ));
              }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {[...Array(pagination.pages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPagination({ ...pagination, page: i + 1 })}
              className={`h-8 min-w-[2rem] rounded px-3 text-sm transition-colors ${
                pagination.page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateLessonPlan
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showEditModal && selectedPlan && (
        <EditLessonPlan
          plan={selectedPlan}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPlan(null);
          }}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}; 

export default TeacherLessonPlan;