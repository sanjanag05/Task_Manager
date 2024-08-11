import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from '../components/utils/Input';
import Loader from '../components/utils/Loader';
import useFetch from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import validateManyFields from '../validations';
import Input from '../components/utils/Input';

const Task = () => {
  const authState = useSelector(state => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();

  const mode = taskId === undefined ? "add" : "update";
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = mode === "add" ? "Add task" : "Update Task";
  }, [mode]);

  useEffect(() => {
    if (mode === "update" && taskId) {
      const config = { url: `/task/update/${taskId}`, method: "get", headers: { Authorization: `Bearer ${authState.token}` } };
      fetchData(config, { showSuccessToast: false }).then((data) => {
        setTask(data.task);
        setFormData({ title: data.task.title, description: data.task.description });
      }).catch(error => {
        console.error("Error fetching task:", error);
      });
    }
  }, [mode, authState.token, taskId, fetchData]);

  const handleChange = e => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  };

  const handleReset = e => {
    e.preventDefault();
    if (task) {
      setFormData({
        title: task.title,
        description: task.description
      });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log("Submit button clicked");
    const errors = validateManyFields("task", formData);
    setFormErrors({});

    if (errors.length > 0) {
      console.log("Validation errors:", errors);
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    const config = {
      url: mode === "add" ? "/task/create" : `/task/update/${taskId}`,
      method: mode === "add" ? "post" : "post",
      data: formData,
      headers: { Authorization: `Bearer ${authState.token}` }
    };

    console.log("API request config:", config);

    fetchData(config).then(() => {
      console.log("Form submitted successfully");
      navigate("/");
    }).catch(error => {
      console.error("Error submitting form:", error);
    });
  };

  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className='mr-2 fa-solid fa-circle-exclamation'></i>
      {formErrors[field]}
    </p>
  );

  return (
    <MainLayout>
      <form className='m-auto my-16 max-w-[1000px] bg-white p-8 border-2 shadow-md rounded-md' onSubmit={handleSubmit}>
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className='text-center mb-4'>{mode === "add" ? "Add New Task" : "Edit Task"}</h2>
            <div className="mb-4">
              <label htmlFor="title">Title</label>
              <Input type="text" name="title" id="title" value={formData.title} placeholder="Write here.." onChange={handleChange} />
              {fieldError("title")}
            </div>
            <div className="mb-4">
              <label htmlFor="description">Description</label>
              <Textarea name="description" id="description" value={formData.description} placeholder="Write here.." onChange={handleChange} />
              {fieldError("description")}
            </div>

            <button className='bg-primary text-black px-4 py-2 font-medium hover:bg-primary-dark' onClick={handleSubmit}>
              {mode === "add" ? "Add Task" : "Update Task"}
            </button>
            <button type="button" className='ml-4 bg-red-500 text-white px-4 py-2 font-medium' onClick={() => navigate("/")}>Cancel</button>
            {mode === "update" && (
              <button type="button" className='ml-4 bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600' onClick={handleReset}>
                Reset
              </button>
            )}
          </>
        )}
      </form>
    </MainLayout>
  );
};

export default Task;
