// SignUp.jsx

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
  MenuItem,
  Select,
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";
import StoreIcon from "@mui/icons-material/Store";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import MazehImage from "../../assets/imgs/icon.png";

function SignUp() {
  // Form state
  const [businessType, setBusinessType] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setErrors] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Navigation to login page (for other uses if needed)
  const handleLoginClick = () => {
    navigate("/login");
  };

  // Submit handler with validation and API call
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !businessType ||
      !provinceName ||
      !storeName ||
      !phoneNumber ||
      !password ||
      !confirmPassword
    ) {
      setErrors("لطفاً همه فیلدها را پر کنید");
      return;
    }

    if (
      !/^\d+$/.test(phoneNumber) ||
      !phoneNumber.startsWith("09") ||
      phoneNumber.length !== 11
    ) {
      setErrors("شماره موبایل وارد شده صحیح نیست");
      return;
    }

    let formattedPhoneNumber = phoneNumber.trim();
    if (formattedPhoneNumber.startsWith("0")) {
      formattedPhoneNumber = `98${formattedPhoneNumber.slice(1)}`;
    } else if (!formattedPhoneNumber.startsWith("98")) {
      setErrors("لطفاً شماره موبایل را به‌درستی وارد کنید");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrors(
        "رمز عبور باید شامل حروف کوچک، حروف بزرگ انگلیسی و عدد باشد و حداقل 8 کاراکتر داشته باشد"
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrors("رمز عبور و تکرار آن همخوانی ندارند");
      return;
    }

    const RestaurantData = {
      name: storeName,
      city_name: provinceName,
      phone_number: formattedPhoneNumber,
      password: password,
      business_type: businessType,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/signup/restaurant",
        RestaurantData
      );

      if (response.status === 201) {
        alert("ثبت نام با موفقیت انجام شد. اکنون وارد شوید!");
        handleLoginClick();
      }
    } catch (error) {
      if (error.response?.status === 400) {
        setErrors("این شماره قبلاً ثبت‌نام کرده است.");
      } else {
        setErrors(
          error.response?.data?.message ||
            "مشکلی پیش آمده، لطفاً دوباره تلاش کنید."
        );
      }
    }
  };

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Common style for grey rounded inputs
  const commonInputSx = {
    bgcolor: "#f3f3f3",
    borderRadius: 1,
    "& fieldset": { border: "none" },
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
      {/* Card container */}
      <Box
        sx={{
          width: 380,
          bgcolor: "#ffffff",
          borderRadius: 2,
          boxShadow: 3,
          px: 4,
          py: 5,
        }}
      >
        {/* Logo */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <img
            src={MazehImage}
            alt="Mazeh Logo"
            style={{
              width: "160px",
              marginTop: "10px",
              marginBottom: "10px",
              objectFit: "contain",
            }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Form (only fields + submit) */}
        <Box component="form" onSubmit={handleSubmit}>
          {/* Business type */}
          <Typography sx={{ fontSize: 14, mb: 0.5 }}>نوع کسب و کار</Typography>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <Select
              value={businessType}
              name="businessType"
              onChange={(e) => setBusinessType(e.target.value)}
              displayEmpty
              sx={commonInputSx}
            >
              <MenuItem value="" disabled>
                نوع کسب و کار را انتخاب کنید
              </MenuItem>
              <MenuItem value={"cafe"}>کافه</MenuItem>
              <MenuItem value={"restaurant"}>رستوران</MenuItem>
              <MenuItem value={"bakery"}>نانوایی</MenuItem>
              <MenuItem value={"sweets"}>شیرینی</MenuItem>
              <MenuItem value={"ice_cream"}>آبمیوه و بستنی</MenuItem>
            </Select>
          </FormControl>

          {/* Province */}
          <Typography sx={{ fontSize: 14, mb: 0.5 }}>نام استان</Typography>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <Select
              value={provinceName}
              name="provinceName"
              onChange={(e) => setProvinceName(e.target.value)}
              displayEmpty
              sx={commonInputSx}
            >
              <MenuItem value="" disabled>
                نام استان را انتخاب کنید
              </MenuItem>
              <MenuItem value={"آذربایجان شرقی"}>آذربایجان شرقی</MenuItem>
              <MenuItem value={"آذربایجان غربی"}>آذربایجان غربی</MenuItem>
              <MenuItem value={"اردبیل"}>اردبیل</MenuItem>
              <MenuItem value={"اصفهان"}>اصفهان</MenuItem>
              <MenuItem value={"البرز"}>البرز</MenuItem>
              <MenuItem value={"ایلام"}>ایلام</MenuItem>
              <MenuItem value={"بوشهر"}>بوشهر</MenuItem>
              <MenuItem value={"تهران"}>تهران</MenuItem>
              <MenuItem value={"چهارمحال و بختیاری"}>چهارمحال و بختیاری</MenuItem>
              <MenuItem value={"خراسان جنوبی"}>خراسان جنوبی</MenuItem>
              <MenuItem value={"خراسان شمالی"}>خراسان شمالی</MenuItem>
              <MenuItem value={"خراسان رضوی"}>خراسان رضوی</MenuItem>
              <MenuItem value={"خوزستان"}>خوزستان</MenuItem>
              <MenuItem value={"زنجان"}>زنجان</MenuItem>
              <MenuItem value={"سمنان"}>سمنان</MenuItem>
              <MenuItem value={"سیستان و بلوچستان"}>سیستان و بلوچستان</MenuItem>
              <MenuItem value={"شیراز"}>شیراز</MenuItem>
              <MenuItem value={"قزوین"}>قزوین</MenuItem>
              <MenuItem value={"قم"}>قم</MenuItem>
              <MenuItem value={"کردستان"}>کردستان</MenuItem>
              <MenuItem value={"کرمان"}>کرمان</MenuItem>
              <MenuItem value={"کرمانشاه"}>کرمانشاه</MenuItem>
              <MenuItem value={"کهگیلویه و بویراحمد"}>
                کهگیلویه و بویراحمد
              </MenuItem>
              <MenuItem value={"گلستان"}>گلستان</MenuItem>
              <MenuItem value={"گیلان"}>گیلان</MenuItem>
              <MenuItem value={"لرستان"}>لرستان</MenuItem>
              <MenuItem value={"مازندران"}>مازندران</MenuItem>
              <MenuItem value={"مرکزی"}>مرکزی</MenuItem>
              <MenuItem value={"هرمزگان"}>هرمزگان</MenuItem>
              <MenuItem value={"همدان"}>همدان</MenuItem>
              <MenuItem value={"یزد"}>یزد</MenuItem>
            </Select>
          </FormControl>

          {/* Store name */}
          <Typography sx={{ fontSize: 14, mb: 0.5 }}>نام فروشگاه</Typography>
          <TextField
            fullWidth
            placeholder="نام فروشگاه"
            variant="outlined"
            margin="dense"
            name="storeName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            InputProps={{
              sx: commonInputSx,
              startAdornment: (
                <InputAdornment position="start">
                  <StoreIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Phone number */}
          <Typography sx={{ fontSize: 14, mb: 0.5 }}>شماره موبایل</Typography>
          <TextField
            fullWidth
            type="tel"
            placeholder="0912xxxxxxx"
            variant="outlined"
            margin="dense"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
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
            <Typography
              sx={{ color: "red", fontSize: 13, mb: 2, textAlign: "center" }}
            >
              {error}
            </Typography>
          )}

          {/* Submit button (forced red) */}
          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{
              mt: 1,
              mb: 2,
              bgcolor: "#c62828 !important",
              "&:hover": { bgcolor: "#b71c1c !important" },
              py: 1.2,
              borderRadius: 1,
              fontWeight: 600,
            }}
          >
            ثبت نام
          </Button>
        </Box>

        {/* Login link (outside form, uses react-router Link) */}
        <Box sx={{ textAlign: "center", mt: 1 }}>
          <Typography
            variant="body2"
            component="span"
            sx={{ color: "#616161" }}
          >
            حساب کاربری دارید؟
          </Typography>

          <Link
            to="/login"
            style={{ textDecoration: "none" }}
          >
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
