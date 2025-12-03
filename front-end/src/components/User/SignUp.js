// CustomerSignUp.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  FormControl,
  Input,
  Divider,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MazehImage from "../../assets/imgs/icon.png";

function SignUp() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const commonInputSx = {
    bgcolor: "#f3f3f3",
    borderRadius: 1,
    "& fieldset": { border: "none" },
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !lastName || !phoneNumber || !password || !confirmPassword) {
      setErrorMessage("لطفاً همه فیلدها را پر کنید");
      return;
    }

    if (
      !/^\d+$/.test(phoneNumber) ||
      !phoneNumber.startsWith("09") ||
      phoneNumber.length !== 11
    ) {
      setErrorMessage("شماره موبایل وارد شده صحیح نیست");
      return;
    }

    let formattedPhoneNumber = phoneNumber.trim();
    if (formattedPhoneNumber.startsWith("0")) {
      formattedPhoneNumber = `98${formattedPhoneNumber.slice(1)}`;
    } else if (!formattedPhoneNumber.startsWith("98")) {
      setErrorMessage("لطفاً شماره موبایل را به‌درستی وارد کنید");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "رمز عبور باید شامل حروف کوچک، حروف بزرگ انگلیسی و عدد باشد و حداقل 8 کاراکتر داشته باشد"
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("رمز عبور و تکرار آن همخوانی ندارند");
      return;
    }

    const userData = {
      first_name: name,
      last_name: lastName,
      phone_number: formattedPhoneNumber,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/signup/customer",
        userData
      );

      if (response.status === 201) {
        alert("ثبت نام با موفقیت انجام شد. اکنون وارد شوید!");
        handleLoginClick();
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setErrorMessage("این شماره قبلاً ثبت‌نام کرده است.");
      } else {
        setErrorMessage(
          error.response?.data?.message ||
            "مشکلی پیش آمده، لطفاً دوباره تلاش کنید."
        );
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
        className="signup-container"
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
        {/* Logo */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <img
            src={MazehImage}
            alt="Mazeh Logo"
            style={{
              width: "150px",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          {/* Name */}
          <Typography sx={{ fontSize: 14, mb: 0.5 }}>نام</Typography>
          <TextField
            fullWidth
            variant="outlined"
            margin="dense"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="نام"
            InputProps={{
              sx: commonInputSx,
              startAdornment: (
                <InputAdornment position="start">
                  <PermIdentityIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Last name */}
          <Typography sx={{ fontSize: 14, mb: 0.5 }}>نام خانوادگی</Typography>
          <TextField
            fullWidth
            variant="outlined"
            margin="dense"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="نام خانوادگی"
            InputProps={{
              sx: commonInputSx,
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Phone */}
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

          {/* Password */}
          <Typography sx={{ fontSize: 14, mb: 0.5 }}>رمز عبور</Typography>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <Input
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
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          {/* Confirm password */}
          <Typography sx={{ fontSize: 14, mb: 0.5 }}>
            تکرار رمز عبور
          </Typography>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <Input
              fullWidth
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={commonInputSx}
              startAdornment={
                <InputAdornment position="start">
                  <KeyIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          {errorMessage && (
            <Typography sx={{ color: "red", mb: 2 }}>{errorMessage}</Typography>
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
            ثبت نام
          </Button>
        </Box>

        {/* Login link (using Link so it always works) */}
        <Box sx={{ textAlign: "center", mt: 1 }}>
          <Typography
            variant="body2"
            component="span"
            sx={{ color: "#616161" }}
          >
            حساب کاربری دارید؟
          </Typography>

          <Link to="/login" style={{ textDecoration: "none" }}>
            <Typography
              variant="body2"
              component="span"
              sx={{
                mr: 1,
                color: "#c62828",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              ورود
            </Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

export default SignUp;
