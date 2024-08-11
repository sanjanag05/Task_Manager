import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip'; // Ensure this is correctly implemented

const Tasks = () => {
  const authState = useSelector(state => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [fetchData, { loading }] = useFetch();

  const fetchTasks = useCallback(() => {
    const config = {
      url: "/task",
      method: "get",
      headers: { Authorization: `Bearer ${authState.token}` },
    };
    fetchData(config, { showSuccessToast: false })
      .then(data => setTasks(data.tasks))
      .catch(err => {
        console.error("Error fetching tasks:", err.response || err.message || err);
        setError("Failed to fetch tasks. Please try again later.");
      });
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const handleDelete = (id) => {
    const config = {
      url: `/task/delete/${id}`,
      method: "post",
      headers: { Authorization: `Bearer ${authState.token}` },

    };
    console.log(config);
    fetchData(config)
      .then(() => fetchTasks())
      .catch(err => {
        console.error("Error deleting task:", err.response || err.message || err);
        setError("Failed to delete task. Please try again later.");
      });
  };

  return (
    <div className="my-2 mx-auto max-w-[700px] py-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {tasks.length !== 0 && <h2 className='my-2 ml-2 md:ml-0 text-xl'>Your tasks ({tasks.length})</h2>}
      {loading ? (
        <Loader />
      ) : (
        <div>
          {tasks.length === 0 ? (
            <div className='w-[600px] h-[300px] flex items-center justify-center gap-4'>
              <span>No tasks found</span>
              <Link to="/tasks/add" className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2">+ Add new task </Link>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div key={task._id} className='bg-white my-4 p-4 text-gray-600 rounded-md shadow-md'>
                <div className='flex items-center'>
                  <span className='font-medium'>Task #{index + 1}</span>
                  <Tooltip text={"Edit this task"} position={"top"}>
                    <Link to={`/tasks/${task._id}`} className='ml-auto mr-2 text-green-600 cursor-pointer'>
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clip-rule="evenodd"/>
                    </svg>

                    </Link>
                  </Tooltip>
                  <Tooltip text={"Delete this task"} position={"top"}>
                    <span className='text-red-500 cursor-pointer' onClick={() => handleDelete(task._id)}>
                      <svg className="w-6 h-6 text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z" clipRule="evenodd"/>
                      </svg>
                    </span>
                  </Tooltip>
                </div>
                <div className='whitespace-pre'>{task.description}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
