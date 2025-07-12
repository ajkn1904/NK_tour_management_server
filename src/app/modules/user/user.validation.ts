import z from "zod";
import { IsActive, Role } from "./user.interface";


//zod schema for create user validation
export const createZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(2, { message: "Name required minimum 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" })
    .trim(),

  email: z
    .string({ invalid_type_error: "Email must be a string" })
    .email({ message: "Invalid email format" })
    .max(100, { message: "Email cannot exceed 100 characters" })
    .trim(),

  password: z
    .string({ invalid_type_error: "Password must be a string" })
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    }),

  phone: z
    .string({ invalid_type_error: "Phone must be a string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),

  address: z
    .string({ invalid_type_error: "Address must be a string" })
    .max(200, { message: "Address cannot exceed 200 characters" })
    .optional(),
});




//zod schema for update user validation
export const updateZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be a string" })
    .min(2, { message: "Name required minimum 2 characters" })
    .max(50, { message: "Name must be less than 50 characters" })
    .trim()
    .optional(),

  email: z
    .string({ invalid_type_error: "Email must be a string" })
    .email({ message: "Invalid email format" })
    .max(100, { message: "Email cannot exceed 100 characters" })
    .trim()
    .optional(),

  password: z
    .string({ invalid_type_error: "Password must be a string" })
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least 1 uppercase letter.",
    })
    .regex(/^(?=.*[!@#$%^&*])/, {
      message: "Password must contain at least 1 special character.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least 1 number.",
    })
    .optional(),

  phone: z
    .string({ invalid_type_error: "Phone must be a string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),

  address: z
    .string({ invalid_type_error: "Address must be a string" })
    .max(200, { message: "Address cannot exceed 200 characters" })
    .optional(),

  role: z.enum(Object.values(Role) as [string]).optional(),

  IsActive: z.enum(Object.values(IsActive) as [string]).optional(),

  isDeleted: z
    .boolean({ invalid_type_error: "isDeleted must be true or false" })
    .optional(),
  isVerified: z
    .boolean({ invalid_type_error: "isVerified must be true or false" })
    .optional(),
});
