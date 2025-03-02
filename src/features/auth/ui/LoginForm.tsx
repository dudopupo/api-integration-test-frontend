'use client'
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/auth";
import {apiClient} from "@/shared/api/api-client";
import { createSignature } from "@/shared/lib";
import { useRouter } from "next/navigation";

const schema = z.object({
  userId: z
    .number()
    .min(1, "User ID обязателен")
    .max(999999999, "User ID не может превышать 999999999")
    .refine(value => !isNaN(value), { message: "User ID должен быть числом" }),
});

type LoginFormInputs = z.infer<typeof schema>;

 export const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(schema),
  });

  const { login } = useAuthStore();
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (formData: LoginFormInputs) => {
      const userId = formData.userId;

      if (!userId) throw new Error("User ID is required");

      const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || "";
      const requestBody = {};
      const signature = createSignature({}, secretKey);

      const response = await apiClient.post("/auth", requestBody, {
        headers: {
          "Content-Type": "application/json",
          "x-signature": signature,
          "user-id": userId,
        },
      });

      const userName = response.data.username;
      if ( userName && userId && signature) {
        const isLogin = true
        login(userId, userName, signature, isLogin);
      }

      return response.data;
    },
  });

const onSubmit = async (data: LoginFormInputs) => {
  try {
    await mutation.mutateAsync(data);
    setTimeout(() => {
      router.push("/main");
    }, 100);
  } catch (error) {
    console.error("Ошибка авторизации:", error);
  }
};

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 340,
        margin: "auto",
        padding: 2,
        borderRadius: 1,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Вход
      </Typography>
      <TextField
        label="User ID"
        variant="outlined"
        margin="normal"
        {...register("userId", { valueAsNumber: true })}
        error={!!errors.userId}
        helperText={errors.userId ? errors.userId.message : ""}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
      >
        Войти
      </Button>
      {mutation.isError && (
        <Typography color="error">
          Ошибка авторизации:{" "}
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Неизвестная ошибка"}
        </Typography>
      )}
      {mutation.isSuccess && (
        <Typography color="success.main">Успешная авторизация!</Typography>
      )}
    </Box>
  );
};