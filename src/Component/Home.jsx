import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {

  let user = JSON.parse(localStorage.getItem("user"))
  let uid = user?.studentId

  let [task, settask] = useState([])
  let [finaltask, setfinaltask] = useState([])

  const navigate = useNavigate()

  // Fetch data
  useEffect(() => {
    fetch("http://localhost:4000/details")
      .then((res) => res.json())
      .then((data) => settask(data))
  }, [])

  // Filter user tasks
  useEffect(() => {
    const student = task.find((s) => s.studentId === uid)
    setfinaltask(student ? student.tasks : [])
  }, [task, uid])

  // Update navigation
  const hupd = (id) => {
    navigate("/updatetask", { state: { tid: id, uid: uid } })
  }

  // Delete
  const handleDelete = (taskId) => {
    const student = task.find((s) => s.studentId === uid)

    const updatedTasks = student.tasks.filter(
      (t) => t.taskId !== taskId
    )

    fetch(`http://localhost:4000/details/${student.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks: updatedTasks })
    }).then(() => setfinaltask(updatedTasks))
  }

  // Complete
  const handlecomp = (taskId) => {
    const student = task.find((s) => s.studentId === uid)

    const updatedTasks = student.tasks.map((t) =>
      t.taskId === taskId ? { ...t, status: "Completed" } : t
    )

    fetch(`http://localhost:4000/details/${student.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks: updatedTasks })
    }).then(() => setfinaltask(updatedTasks))
  }

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

      {/* TABLE */}
      <div id="tskcon">

        {
          finaltask.length === 0 ? (
            <div className="empty">
              <h2>No Tasks Yet 😴</h2>
              <p>Add your first task</p>
              <button onClick={() => navigate(`/addtask/${uid}`)}>
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
                {
                  finaltask.map((t) => (
                    <tr key={t.taskId}>
                      <td>{t.taskId}</td>
                      <td>{t.taskName}</td>
                      <td>{t.taskDescription}</td>

                      <td>
                        <span className={t.status === "Completed" ? "completed" : "pending"}>
                          {t.status}
                        </span>
                      </td>

                     

                      <td><center>

                        <button className="update" onClick={() => hupd(t.taskId)}>Update</button>
                        <button className="complete" onClick={() => handlecomp(t.taskId)}>Complete</button>
                        <button className="delete" onClick={() => handleDelete(t.taskId)}>Delete</button>
                      </center>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>

          )
        }

      </div>

    </div>
  )
}

export default Home