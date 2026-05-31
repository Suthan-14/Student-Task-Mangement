import React, { useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
  Paper
} from "@mui/material";

import {
  Visibility,
  VisibilityOff
} from "@mui/icons-material";

import { Link, useNavigate } from "react-router-dom";



function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  // Handle Input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Handle Submit
  const handleSubmit = (e) => {

    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill all fields ❌");
      return;
    }

    // Fetch users
    fetch("https://api-student-data-1.onrender.com/details")
      .then((res) => res.json())
      .then((data) => {

        // Find matching user
        const user = data.find(
          (u) =>
            u.email === form.email &&
            u.password === form.password
        );

        if (user) {

          // Save user
          localStorage.setItem(
            "user",
            JSON.stringify(user)
          );

          // Navigate
          navigate("/home");

        } else {

          alert("Invalid Email or Password ❌");

        }

      });

  };

  return (

    <div className="login-container">

      <Paper
        elevation={5}
        className="login-card"
      >

        <Typography
          variant="h5"
          align="center"
          gutterBottom
          className="login-title"
        >
          Login
        </Typography>

        <form onSubmit={handleSubmit}>

          {/* Email */}

          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />

          {/* Password */}

          <TextField
            fullWidth
            label="Password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            name="password"
            margin="normal"
            value={form.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (

                <InputAdornment position="end">

                  <IconButton
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >

                    {
                      showPassword
                        ? <VisibilityOff />
                        : <Visibility />
                    }

                  </IconButton>

                </InputAdornment>

              )
            }}
          />

          {/* Button */}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="login-btn"
          >
            Login
          </Button>

        </form>

        {/* Forgot Password */}

        <Typography
          align="center"
          className="login-links"
        >
          <a href="#">
            Forgot Password?
          </a>
        </Typography>

        {/* Signup Link */}

        <Typography
          align="center"
          className="login-links"
        >
          Don't have an account?
          {" "}

          <Link to="/">
            Sign Up
          </Link>

        </Typography>

      </Paper>

    </div>
  );
}

export default Login;