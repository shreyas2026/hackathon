import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Pencil, Save, X, Book, Calendar, Clock } from 'lucide-react';
import axios from "axios";

const ExpandableLessonPlan = ({ plan, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(plan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExpandClick = (e) => {
    // Prevent expansion when clicking on form elements
    if (e.target.tagName.toLowerCase() !== 'input' && 
        e.target.tagName.toLowerCase() !== 'textarea') {
      setIsExpanded(!isExpanded);
      if (!isExpanded) {
        setFormData(plan);
      }
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setFormData(plan);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setFormData(plan);
    setError(null);
  };

  // Single change handler for all basic form fields
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

  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

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
        onUpdate(response.data.data);
        setIsEditing(false);
      } else {
        throw new Error(response.data.message || 'Failed to update lesson plan');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update lesson plan');
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
      <div 
        className={`cursor-pointer p-6 ${isExpanded ? 'border-b border-gray-200' : ''}`}
        onClick={handleExpandClick}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">{plan.title}</h3>
              <span className={`ml-4 rounded-full px-3 py-1 text-xs font-medium ${
                plan.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                plan.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                plan.status === 'Approved' ? 'bg-green-100 text-green-700' :
                plan.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                'bg-red-100 text-red-700'
              }`}>
                {plan.status}
              </span>
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
            <span className="text-sm font-medium">{new Date(plan.date).toLocaleDateString()}</span>
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
        <div className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-blue-600"></div>
              <h4 className="font-medium text-blue-600">Lesson Details</h4>
            </div>
            {!isEditing ? (
              <button
                onClick={startEditing}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Pencil size={16} />
                Edit Plan
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={cancelEditing}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save size={16} />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
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
                    className="w-full rounded-lg border border-gray-200 p-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
                    value={field === 'date' ? formData[field]?.split('T')[0] : formData[field] || ''}
                    onChange={handleBasicFieldChange}
                    disabled={!isEditing}
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
                    <div className="flex-grow">
                      <input
                        type="text"
                        className="w-full rounded-lg border border-gray-200 p-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
                        value={objective}
                        onChange={(e) => handleArrayInputChange('learningObjectives', index, e.target.value)}
                        disabled={!isEditing}
                        placeholder={`Objective ${index + 1}`}
                      />
                    </div>
                  </div>
                ))}
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
                      className="w-full rounded-lg border border-gray-200 p-2.5 text-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
                      value={formData.lessonStructure?.[field] || ''}
                      onChange={(e) => handleNestedInputChange('lessonStructure', field, e.target.value)}
                      rows={3}
                      disabled={!isEditing}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

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