"use client";

import {
  Button,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Define validation schema using Yup
  // This schema will validate the form fields
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required")
      .oneOf(["sejahteraabadi@gmail.com"], "Email salah"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .oneOf(["11223344"], "Password salah")
      .required("Password is required"),
  });

  // Initialize formik for form handling
  // This will manage form state and handle submission
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: () => {
      router.replace("/dashboard");
    },
  });

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Stack
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ height: "50vh", border: "1px solid #000", width: "100%" }}
      >
        <Typography variant="h4" gutterBottom>
          Sign in
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Welcome user, please sign in to continue
        </Typography>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-4 w-full justify-center items-center"
        >
          <TextField
            label="Email"
            variant="outlined"
            sx={{ width: "60%" }}
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            sx={{ width: "60%" }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={() =>
                        setShowPassword((prevShowPassword) => !prevShowPassword)
                      }
                      onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
                        e.preventDefault()
                      }
                      onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) =>
                        e.preventDefault()
                      }
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Button variant="contained" type="submit">
            Sign In
          </Button>
        </form>
      </Stack>
    </Container>
  );
}
