import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Pencil, 
  Save, 
  X, 
  Book, 
  Calendar, 
  Clock,
  Check,
  MoreVertical,
  Trash2,
  Copy,
  Download,
  Plus
} from 'lucide-react';
import axios from 'axios';
const baseurl1 = import.meta.env.VITE_BASE_URL;

const ExpandableLessonPlan = ({ plan, onStatusChange, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [formData, setFormData] = useState(plan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: baseurl1,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  const statusOptions = [
    { value: 'Draft', color: 'bg-gray-100 text-gray-700' },
    { value: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'Approved', color: 'bg-green-100 text-green-700' },
    { value: 'Completed', color: 'bg-blue-100 text-blue-700' },
    { value: 'Cancelled', color: 'bg-red-100 text-red-700' }
  ];

  const handleExpandClick = (e) => {
    if (e.target.closest('.action-button') || e.target.closest('.status-dropdown')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
      const response = await axiosInstance.patch(`/lessonPlans/${plan._id}/status`, {
        status: newStatus
      });
      
      if (response.data.statusCode === 200) {
        onStatusChange(plan._id, newStatus);
        setShowStatusDropdown(false);
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleBasicFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.patch(
        `/lessonPlans/${plan._id}`,
        formData
      );
      
      if (response.data.statusCode === 200) {
        onEdit(response.data.data);
        setIsEditing(false);
      } else {
        throw new Error(response.data.message || 'Failed to update lesson plan');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update lesson plan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this lesson plan?')) {
      try {
        setLoading(true);
        const response = await axiosInstance.delete(`/lessonPlans/${plan._id}`);
        
        if (response.data.statusCode === 200) {
          onDelete(plan._id);
        } else {
          throw new Error(response.data.message || 'Failed to delete lesson plan');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete lesson plan');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDuplicate = async () => {
    try {
      setLoading(true);
      const duplicateData = {
        ...formData,
        title: `${formData.title} (Copy)`,
        status: 'Draft'
      };
      delete duplicateData._id;
      delete duplicateData.createdAt;
      delete duplicateData.updatedAt;

      const response = await axiosInstance.post('/lessonPlans/create', duplicateData);
      
      if (response.data.statusCode === 201) {
        window.location.reload();
      } else {
        throw new Error(response.data.message || 'Failed to duplicate lesson plan');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to duplicate lesson plan');
    } finally {
      setLoading(false);
      setShowActions(false);
    }
  };

  const handleExport = () => {
    const content = `
      Title: ${plan.title}
      Subject: ${plan.subject}
      Grade: ${plan.grade}
      Section: ${plan.section}
      Date: ${new Date(plan.date).toLocaleDateString()}
      Duration: ${plan.duration}
      Status: ${plan.status}

      Learning Objectives:
      ${plan.learningObjectives?.join('\n')}

      Lesson Structure:
      
      Introduction:
      ${plan.lessonStructure?.introduction}

      Main Content:
      ${plan.lessonStructure?.mainContent}

      Conclusion:
      ${plan.lessonStructure?.conclusion}

      Assessment:
      ${plan.lessonStructure?.assessment}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plan.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowActions(false);
  };

  return (
    <div className="overflow-visible rounded-xl bg-white shadow-sm transition-all hover:shadow-md relative">
      <div 
        className="cursor-pointer p-6"
        onClick={handleExpandClick}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold text-gray-900">{plan.title}</h3>
              
              {/* Status Dropdown */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusDropdown(!showStatusDropdown);
                    setShowActions(false);
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                    statusOptions.find(opt => opt.value === plan.status)?.color
                  }`}
                >
                  {plan.status}
                  <ChevronDown size={14} />
                </button>
                
                {showStatusDropdown && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg"
                    style={{ position: 'absolute', zIndex: 50 }}
                  >
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(option.value);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          plan.status === option.value ? 'bg-gray-50' : ''
                        }`}
                      >
                        <span className={`inline-block h-2 w-2 rounded-full mr-2 ${option.color}`}></span>
                        {option.value}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Menu */}
              <div className="relative ml-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(!showActions);
                    setShowStatusDropdown(false);
                  }}
                  className="action-button rounded-full p-2 hover:bg-gray-100"
                >
                  <MoreVertical size={20} />
                </button>

                {showActions && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg"
                    style={{ position: 'absolute', zIndex: 50 }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Pencil size={16} />
                      Edit Plan
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate();
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Copy size={16} />
                      Duplicate
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExport();
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Download size={16} />
                      Export
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">Grade {plan.grade} | Section {plan.section}</p>
          </div>
          <div className={`ml-4 rounded-full p-2 transition-colors ${isExpanded ? 'bg-gray-100' : 'hover:bg-gray-100'}`}>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="rounded-lg bg-blue-50 p-2">
              <Book size={18} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium">{plan.subject}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <div className="rounded-lg bg-green-50 p-2">
              <Calendar size={18} className="text-green-600" />
            </div>
            <span className="text-sm font-medium">
              {new Date(plan.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <div className="rounded-lg bg-purple-50 p-2">
              <Clock size={18} className="text-purple-600" />
            </div>
            <span className="text-sm font-medium">{plan.duration}</span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-medium text-gray-900">Edit Lesson Plan</h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(plan);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save size={16} />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {['title', 'subject', 'grade', 'section', 'date', 'duration'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                      {field}
                    </label>
                    <input
                      type={field === 'date' ? 'date' : 'text'}
                      name={field}
                      value={field === 'date' ? formData[field]?.split('T')[0] : formData[field] || ''}
                      onChange={handleBasicFieldChange}
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Learning Objectives */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Learning Objectives</h4>
                <div className="space-y-3">
                  {formData.learningObjectives?.map((objective, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => handleArrayInputChange('learningObjectives', index, e.target.value)}
                        className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder={`Objective ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
                          }));
                        }}
                        className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        learningObjectives: [...(prev.learningObjectives || []), '']
                      }));
                    }}
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus size={16} />
                    Add Objective
                  </button>
                </div>
              </div>

              {/* Lesson Structure */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Lesson Structure</h4>
                <div className="space-y-4">
                  {['introduction', 'mainContent', 'conclusion', 'assessment'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <textarea
                        value={formData.lessonStructure?.[field] || ''}
                        onChange={(e) => handleNestedInputChange('lessonStructure', field, e.target.value)}
                        className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        rows={4}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources and Materials */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Resources and Materials</h4>
                <div className="space-y-3">
                  {formData.resources?.map((resource, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={resource}
                        onChange={(e) => handleArrayInputChange('resources', index, e.target.value)}
                        className="w-full rounded-lg border border-gray-200 p-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder={`Resource ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            resources: prev.resources.filter((_, i) => i !== index)
                          }));
                        }}
                        className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        resources: [...(prev.resources || []), '']
                      }));
                    }}
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus size={16} />
                    Add Resource
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Learning Objectives */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Learning Objectives</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {plan.learningObjectives?.map((objective, index) => (
                    <li key={index} className="text-gray-600">{objective}</li>
                  ))}
                </ul>
              </div>

              {/* Lesson Structure */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Lesson Structure</h4>
                <div className="space-y-4">
                  {['introduction', 'mainContent', 'conclusion', 'assessment'].map((field) => (
                    <div key={field}>
                      <h5 className="text-sm font-medium text-gray-700 capitalize mb-1">
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </h5>
                      <p className="text-gray-600 whitespace-pre-wrap">
                        {plan.lessonStructure?.[field]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resources and Materials */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Resources and Materials</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {plan.resources?.map((resource, index) => (
                    <li key={index} className="text-gray-600">{resource}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpandableLessonPlan;