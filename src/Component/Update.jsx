import React, { useEffect, useState } from 'react'
import { MdBrowserUpdated } from "react-icons/md";
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Update = () => {

  const { state } = useLocation();
  const navigate = useNavigate();

  const id = state?.tid;
  const uid = state?.uid;

  const [task, setTask] = useState([]);
  const [form, setForm] = useState({
    name: "",
    desc: "",
    status: ""
  });

  // 🔹 Fetch data
  useEffect(() => {
    fetch("http://localhost:4000/details")
      .then(res => res.json())
      .then(data => setTask(data))
      .catch(() => alert("Error fetching data"))
  }, []);

  // 🔹 Fill form automatically
  useEffect(() => {
    if (!task.length || !uid || !id) return;

    const student = task.find(s => s.studentId === uid);
    const currentTask = student?.tasks?.find(t => t.taskId === id);

    if (currentTask) {
      setForm({
        name: currentTask.taskName,
        desc: currentTask.taskDescription,
        status: currentTask.status
      });
    }
  }, [task, uid, id]);

  // 🔹 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Update task
  const handleUpdate = () => {

    if (!form.name || !form.desc || !form.status) {
      alert("All fields are required!");
      return;
    }

    const student = task.find(s => s.studentId === uid);

    if (!student) {
      alert("User not found!");
      return;
    }

    const updatedTasks = student.tasks.map(t =>
      t.taskId === id
        ? {
            ...t,
            taskName: form.name,
            taskDescription: form.desc,
            status: form.status
          }
        : t
    );

    fetch(`http://localhost:4000/details/${student.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks: updatedTasks })
    })
      .then(() => {
        alert("Task Updated Successfully ✅");
        navigate("/home");
      })
      .catch(() => alert("Update failed ❌"));
  };

  return (
    <div>

      {/* NAVBAR */}
      <nav>
        <h1>Student Task Management</h1>
        <ul>
          <Link to="/home">Home</Link>
          <Link to={`/addtask/${uid}`}>Add Task</Link>
        </ul>
      </nav>

      <h1 id="ut">Update Task</h1>

      <div className="form-container">

        <h2>Update Form</h2>

        <input
          type="text"
          name="name"
          placeholder="Task Name"
          value={form.name}
          onChange={handleChange}
        />

        <textarea
          name="desc"
          placeholder="Task Description"
          value={form.desc}
          onChange={handleChange}
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="">Select Status</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button onClick={handleUpdate}>
          Update <MdBrowserUpdated size={20} />
        </button>

      </div>

    </div>
  )
}

export default Update