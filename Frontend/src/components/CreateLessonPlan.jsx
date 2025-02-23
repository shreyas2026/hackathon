import React, { useState } from "react";
import { X, Save, ArrowLeft } from "lucide-react";
import axios from "axios";


const baseurl1 = import.meta.env.VITE_BASE_URL;

const CreateLessonPlan = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    grade: "",
    section: "",
    date: "",
    duration: "",
    learningObjectives: [""],
    prerequisiteKnowledge: "",
    teachingMethods: [""],
    materials: [""],
    lessonStructure: {
      introduction: "",
      mainContent: "",
      conclusion: "",
      assessment: "",
    },
    homework: "",
    differentiation: {
      struggling: "",
      advanced: "",
    },
    reflection: "",
    status: "Draft",
  });

  const axiosInstance = axios.create({
    baseURL: baseurl1,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  // Handle array fields (learning objectives, teaching methods, materials)
  const handleArrayFieldAdd = (field) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    });
  };

  const handleArrayFieldRemove = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index),
    });
  };

  const handleArrayFieldChange = (field, index, value) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/lessonPlans/create", formData);
      onSuccess(response.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create lesson plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 mt-20 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="hover:text-gray-600">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold">Create New Lesson Plan</h2>
          </div>
          <button onClick={onClose} className="hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg p-2"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg p-2"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Grade</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg p-2"
                value={formData.grade}
                onChange={(e) =>
                  setFormData({ ...formData, grade: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Section</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg p-2"
                value={formData.section}
                onChange={(e) =>
                  setFormData({ ...formData, section: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                required
                className="w-full border rounded-lg p-2"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <input
                type="text"
                required
                placeholder="e.g., 45 minutes"
                className="w-full border rounded-lg p-2"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
            </div>
          </div>

          {/* Learning Objectives */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Learning Objectives</label>
              <button
                type="button"
                className="text-blue-500 text-sm"
                onClick={() => handleArrayFieldAdd("learningObjectives")}
              >
                Add Objective
              </button>
            </div>
            {formData.learningObjectives.map((objective, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={objective}
                  onChange={(e) =>
                    handleArrayFieldChange(
                      "learningObjectives",
                      index,
                      e.target.value
                    )
                  }
                />
                {formData.learningObjectives.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      handleArrayFieldRemove("learningObjectives", index)
                    }
                    className="text-red-500"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Prerequisite Knowledge */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Prerequisite Knowledge
            </label>
            <textarea
              className="w-full border rounded-lg p-2"
              rows="3"
              value={formData.prerequisiteKnowledge}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  prerequisiteKnowledge: e.target.value,
                })
              }
            />
          </div>

          {/* Teaching Methods */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Teaching Methods</label>
              <button
                type="button"
                className="text-blue-500 text-sm"
                onClick={() => handleArrayFieldAdd("teachingMethods")}
              >
                Add Method
              </button>
            </div>
            {formData.teachingMethods.map((method, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="w-full border rounded-lg p-2"
                  value={method}
                  onChange={(e) =>
                    handleArrayFieldChange(
                      "teachingMethods",
                      index,
                      e.target.value
                    )
                  }
                />
                {formData.teachingMethods.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleArrayFieldRemove("teachingMethods", index)}
                    className="text-red-500"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Lesson Structure */}
          <div className="space-y-4">
            <h3 className="font-medium">Lesson Structure</h3>
            <div>
              <label className="block text-sm font-medium mb-1">
                Introduction
              </label>
              <textarea
                className="w-full border rounded-lg p-2"
                rows="3"
                required
                value={formData.lessonStructure.introduction}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lessonStructure: {
                      ...formData.lessonStructure,
                      introduction: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Main Content
              </label>
              <textarea
                className="w-full border rounded-lg p-2"
                rows="4"
                required
                value={formData.lessonStructure.mainContent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lessonStructure: {
                      ...formData.lessonStructure,
                      mainContent: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Conclusion</label>
              <textarea
                className="w-full border rounded-lg p-2"
                rows="3"
                required
                value={formData.lessonStructure.conclusion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lessonStructure: {
                      ...formData.lessonStructure,
                      conclusion: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Assessment</label>
              <textarea
                className="w-full border rounded-lg p-2"
                rows="3"
                value={formData.lessonStructure.assessment}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    lessonStructure: {
                      ...formData.lessonStructure,
                      assessment: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>

          {/* Differentiation */}
          <div className="space-y-4">
            <h3 className="font-medium">Differentiation</h3>
            <div>
              <label className="block text-sm font-medium mb-1">
                For Struggling Students
              </label>
              <textarea
                className="w-full border rounded-lg p-2"
                rows="3"
                value={formData.differentiation.struggling}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    differentiation: {
                      ...formData.differentiation,
                      struggling: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                For Advanced Students
              </label>
              <textarea
                className="w-full border rounded-lg p-2"
                rows="3"
                value={formData.differentiation.advanced}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    differentiation: {
                      ...formData.differentiation,
                      advanced: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Save size={20} />
              {loading ? "Creating..." : "Create Lesson Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLessonPlan;