import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "../components/ui/field";
import { Loader2 } from "lucide-react";

// Validation schema
const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must not exceed 50 characters"),
    email: z.email("Invalid email format").min(1, "Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must not exceed 100 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    role: z.enum(["user", "author"], {
      required_error: "Please select a role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "user",
    },
  });

  const password = watch("password", "");

  // Password strength indicator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, text: "", color: "" };

    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 10) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    if (strength <= 2) return { strength, text: "Weak", color: "text-red-500" };
    if (strength <= 3)
      return { strength, text: "Medium", color: "text-yellow-500" };
    return { strength, text: "Strong", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setServerError("");
    setSuccessMessage("");

    try {
      const result = await registerUser(
        data.name,
        data.email,
        data.password,
        data.role,
      );

      setSuccessMessage(result.message);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Sign Up to start creating and sharing articles
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Success Message */}
            {successMessage && (
              <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-md">
                {successMessage}
              </div>
            )}

            {/* Server Error Message */}
            {serverError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md">
                {serverError}
              </div>
            )}

            {/* Name Field */}
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name")}
                disabled={isLoading}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            {/* Email Field */}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                disabled={isLoading}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            {/* Password Field */}
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                disabled={isLoading}
                className={errors.password ? "border-red-500" : ""}
              />
              {password && !errors.password && (
                <FieldDescription>
                  Password strength:{" "}
                  <span className={passwordStrength.color}>
                    {passwordStrength.text}
                  </span>
                </FieldDescription>
              )}
              {errors.password && (
                <FieldError>{errors.password.message}</FieldError>
              )}
            </Field>

            {/* Confirm Password Field */}
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                disabled={isLoading}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <FieldError>{errors.confirmPassword.message}</FieldError>
              )}
            </Field>

            {/* Role Selection */}
            <Field>
              <FieldLabel htmlFor="role">Account Type</FieldLabel>
              <select
                id="role"
                {...register("role")}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-md bg-background ${
                  errors.role ? "border-red-500" : "border-input"
                }`}
              >
                <option value="user">User (Read articles)</option>
                <option value="author">Author (Write articles)</option>
              </select>
              <FieldDescription className="mt-2">
                Users can upgrade to authors later. Authors can create and
                publish articles.
              </FieldDescription>
              {errors.role && <FieldError>{errors.role.message}</FieldError>}
            </Field>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-4"
              disabled={isLoading || !!successMessage}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : successMessage ? (
                "Redirecting to Sign In..."
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Login Link */}
            <p className="text-sm text-center text-muted-foreground mt-2">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="text-primary hover:underline font-medium"
              >
                Sign In here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
