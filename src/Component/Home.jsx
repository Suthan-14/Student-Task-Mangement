import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const uid = user?.studentId;

  const [task, settask] = useState([]);
  const [finaltask, setfinaltask] = useState([]);

  const navigate = useNavigate();

  // Fetch latest data
  const refreshTasks = () => {
    fetch("https://api-student-data-1.onrender.com/details")
      .then((res) => res.json())
      .then((data) => {
        settask(data);

        const student = data.find(
          (s) => String(s.studentId) === String(uid)
        );

        setfinaltask(student?.tasks || []);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    refreshTasks();
  }, [uid]);

  // Update page
  const hupd = (id) => {
    navigate("/updatetask", {
      state: {
        tid: id,
        uid: uid,
      },
    });
  };

  // Delete task
  const handleDelete = async (taskId) => {
    try {
      const student = task.find(
        (s) => String(s.studentId) === String(uid)
      );

      if (!student) {
        alert("Student not found");
        return;
      }

      const updatedTasks = student.tasks.filter(
        (t) => t.taskId !== taskId
      );

      const response = await fetch(
        `https://api-student-data-1.onrender.com/details/${student.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tasks: updatedTasks,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      refreshTasks();
      alert("Task Deleted Successfully");
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  // Complete task
  const handlecomp = async (taskId) => {
    try {
      const student = task.find(
        (s) => String(s.studentId) === String(uid)
      );

      if (!student) {
        alert("Student not found");
        return;
      }

      const updatedTasks = student.tasks.map((t) =>
        t.taskId === taskId
          ? { ...t, status: "Completed" }
          : t
      );

      const response = await fetch(
        `https://api-student-data-1.onrender.com/details/${student.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tasks: updatedTasks,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Update failed");
      }

      refreshTasks();
      alert("Task Marked as Completed");
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  return (
    <div>
      <nav>
        <h1>Student Task Management</h1>

        <ul>
          <Link to="/home">Home</Link>
          <Link to={`/addtask/${uid}`}>Add Task</Link>
        </ul>
      </nav>

      <div id="tskcon">
        {finaltask.length === 0 ? (
          <div className="empty">
            <h2>No Tasks Yet 😴</h2>
            <p>Add your first task</p>

            <button
              onClick={() => navigate(`/addtask/${uid}`)}
            >
              Add Task
            </button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {finaltask.map((t) => (
                <tr key={t.taskId}>
                  <td>{t.taskId}</td>
                  <td>{t.taskName}</td>
                  <td>{t.taskDescription}</td>

                  <td>
                    <span
                      className={
                        t.status === "Completed"
                          ? "completed"
                          : "pending"
                      }
                    >
                      {t.status}
                    </span>
                  </td>

                  <td>
                    <center>
                      <button
                        className="update"
                        onClick={() => hupd(t.taskId)}
                      >
                        Update
                      </button>

                      <button
                        className="complete"
                        onClick={() => handlecomp(t.taskId)}
                      >
                        Complete
                      </button>

                      <button
                        className="delete"
                        onClick={() =>
                          handleDelete(t.taskId)
                        }
                      >
                        Delete
                      </button>
                    </center>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Home;