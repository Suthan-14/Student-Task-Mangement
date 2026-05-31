import React, { useState, useEffect } from "react";
import { RiFolderAddLine } from "react-icons/ri";
import { Link, useParams, useNavigate } from "react-router-dom";

const Addtask = () => {
  const { uid } = useParams();
  const navigate = useNavigate();

  const [addtaskname, setaddtaskname] = useState("");
  const [addtaskdesc, setaddtaskdesc] = useState("");
  const [task, settask] = useState([]);

  useEffect(() => {
    fetch("https://api-student-data-1.onrender.com/details")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        settask(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleAdd = () => {
    if (!addtaskname || !addtaskdesc) {
      alert("Please fill all fields");
      return;
    }

    const student = task.find(
      (s) => String(s.studentId) === String(uid)
    );

    if (!student) {
      alert("Student not found");
      return;
    }

    const newTask = {
      taskId: "T" + Date.now(),
      taskName: addtaskname,
      taskDescription: addtaskdesc,
      status: "Pending",
    };

    const updatedTasks = [...(student.tasks || []), newTask];

    fetch(
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
    )
      .then((res) => res.json())
      .then(() => {
        setaddtaskname("");
        setaddtaskdesc("");
        alert("Task Added Successfully");

        navigate("/home");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <nav>
        <h1>Student Task Management</h1>

        <ul>
          <Link
            style={{
              textDecoration: "none",
              color: "white",
              fontSize: "23px",
            }}
            to="/home"
          >
            Home
          </Link>

          <Link
            style={{
              textDecoration: "none",
              color: "white",
              fontSize: "23px",
            }}
            to={`/addtask/${uid}`}
          >
            Add Task
          </Link>
        </ul>
      </nav>

      <h1 id="ut">Add Tasks</h1>

      <center>
        <div id="uform">
          <h1>Add Task Form</h1>

          <input
            type="text"
            placeholder="Task Name"
            value={addtaskname}
            onChange={(e) => setaddtaskname(e.target.value)}
            autoComplete="off"
          />

          <textarea
            placeholder="Task Description"
            value={addtaskdesc}
            onChange={(e) => setaddtaskdesc(e.target.value)}
          />

          <button onClick={handleAdd}>
            Add
            <RiFolderAddLine
              style={{ marginLeft: "7px" }}
              size={25}
            />
          </button>
        </div>
      </center>
    </div>
  );
};

export default Addtask;