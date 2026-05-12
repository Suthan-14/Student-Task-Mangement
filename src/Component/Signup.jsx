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



function SignUp() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword
  ] = useState(false);

  // Handle Change

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  // Submit

  const handleSubmit = (e) => {

    e.preventDefault();

    // Validation

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {

      setError("All fields are required ❌");
      return;

    }

    if (
      form.password !==
      form.confirmPassword
    ) {

      setError(
        "Passwords do not match ❌"
      );

      return;

    }

    setError("");

    // New User

    const newUser = {

      studentId:
        "STU" +
        Math.floor(
          100 + Math.random() * 900
        ),

      name: form.name,

      email: form.email,

      password: form.password,

      tasks: []

    };

    // Save User

    fetch(
      "https://data-mt2k.onrender.com/details",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify(newUser)
      }
    )

      .then(() => {

        // Save localStorage

        localStorage.setItem(
          "user",
          JSON.stringify(newUser)
        );

        // Navigate

        navigate("/home");

      });

  };

  return (

    <div className="signup-container">

      <Paper
        elevation={5}
        className="signup-card"
      >

        <Typography
          variant="h5"
          align="center"
          gutterBottom
          className="signup-title"
        >

          Sign Up

        </Typography>

        <form onSubmit={handleSubmit}>

          {/* Name */}

          <TextField
            fullWidth
            label="Name"
            name="name"
            margin="normal"
            value={form.name}
            onChange={handleChange}
          />

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

          {/* Confirm Password */}

          <TextField
            fullWidth
            label="Confirm Password"

            type={
              showConfirmPassword
                ? "text"
                : "password"
            }

            name="confirmPassword"

            margin="normal"

            value={form.confirmPassword}

            onChange={handleChange}

            error={
              form.confirmPassword &&
              form.password !==
              form.confirmPassword
            }

            helperText={
              form.confirmPassword &&
              form.password !==
              form.confirmPassword
                ? "Passwords do not match"
                : ""
            }

            InputProps={{

              endAdornment: (

                <InputAdornment position="end">

                  <IconButton
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >

                    {
                      showConfirmPassword
                        ? <VisibilityOff />
                        : <Visibility />
                    }

                  </IconButton>

                </InputAdornment>

              )

            }}
          />

          {/* Error */}

          {
            error && (

              <Typography
                color="error"
                align="center"
                className="login-links"
              >

                {error}

              </Typography>

            )
          }

          {/* Button */}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="signup-btn"
          >

            Sign Up

          </Button>

        </form>

        {/* Login Link */}

        <Typography
          align="center"
          className="login-links"
        >

          Already have an account?
          {" "}

          <Link to="/login">

            Login

          </Link>

        </Typography>

      </Paper>

    </div>
  );
}

export default SignUp;