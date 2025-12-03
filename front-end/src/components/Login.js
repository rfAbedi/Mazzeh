// Login.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Input,
  Divider,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import LoginImg from "../assets/imgs/login.png";
import axios from "../utills/axiosInstance.js";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const commonInputSx = {
    bgcolor: "#f3f3f3",
    borderRadius: 1,
    "& fieldset": { border: "none" },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!phoneNumber) {
      setError("لطفاً شماره تلفن خود را وارد کنید");
      return;
    }

    if (
      !/^\d+$/.test(phoneNumber) ||
      !phoneNumber.startsWith("09") ||
      phoneNumber.length !== 11
    ) {
      setError("شماره موبایل وارد شده صحیح نیست");
      return;
    }

    if (!password) {
      setError("لطفاً رمز عبور خود را وارد کنید");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "رمز عبور باید شامل حروف کوچک، حروف بزرگ انگلیسی و عدد باشد و حداقل 8 کاراکتر داشته باشد"
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/token",
        {
          phone_number: `98${phoneNumber.slice(1)}`,
          password: password,
        }
      );

      console.log(response.data);
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("res_id", response.data.restaurant_id);
      localStorage.setItem("phone", phoneNumber);

      if (response.data.restaurant_id) {
        if (response.data.state === "approved") {
          navigate(`/restaurant/${response.data.restaurant_id}/profile`);
        } else if (response.data.state === "pending") {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("res_id");
          localStorage.removeItem("phone");
          alert("فروشگاه شما در انتظار تایید ادمین است");
        } else if (response.data.state === "rejected") {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("res_id");
          localStorage.removeItem("phone");
          alert("فروشگاه شما توسط ادمین رد شده است");
        }
      } else {
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError("اطلاعات ورود صحیح نیست.");
      } else {
        setError("مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.");
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f0f0f0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        direction: "rtl",
      }}
    >
      <Box
        className="login-container"
        sx={{
          width: 380,
          bgcolor: "#ffffff",
          borderRadius: 3,
          boxShadow: 4,
          px: 4,
          py: 5,
          textAlign: "center",
        }}
      >
        {/* Logo / Illustration */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <img
            src={LoginImg}
            alt="Login Illustration"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/100";
            }}
            style={{ width: "80%", marginBottom: "10px" }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          {/* Phone field */}
          <Typography sx={{ fontSize: 14, mb: 0.5 }}>شماره موبایل</Typography>
          <TextField
            fullWidth
            type="tel"
            variant="outlined"
            margin="dense"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="0912xxxxxxx"
            InputProps={{
              sx: commonInputSx,
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneEnabledIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Password field */}
          <Typography sx={{ fontSize: 14, mb: 0.5 }}>رمز عبور</Typography>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel htmlFor="password-input">رمز عبور</InputLabel>
            <Input
              id="password-input"
              fullWidth
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={commonInputSx}
              startAdornment={
                <InputAdornment position="start">
                  <KeyIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? "hide the password" : "display the password"
                    }
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          {/* Error message */}
          {error && (
            <Typography sx={{ color: "red", mb: 2 }}>{error}</Typography>
          )}

          {/* Submit button */}
          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{
              bgcolor: "#c62828 !important",
              "&:hover": { bgcolor: "#b71c1c !important" },
              py: 1.2,
              borderRadius: 1,
              fontWeight: 600,
              mt: 1,
              mb: 2,
            }}
          >
            ورود
          </Button>
        </Box>

        {/* Links under form */}
        <Box sx={{ textAlign: "center", mt: 1 }}>
          <Typography
            display="inline"
            variant="body2"
            sx={{ color: "#616161" }}
          >
            حساب کاربری ندارید؟
          </Typography>

          <Link to="/customer/signup" style={{ textDecoration: "none" }}>
            <Typography
              display="inline"
              variant="body2"
              sx={{
                mr: 1,
                color: "#c62828",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              ثبت‌نام
            </Typography>
          </Link>

          <Box sx={{ mt: 1 }}>
            <Link to="/restuarant/signup" style={{ textDecoration: "none" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#c62828",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                ثبت نام فروشندگان
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
