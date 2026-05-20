import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
});

export const agentConfigSchema = z.object({
  displayName: z.string().min(2).max(80),
  systemPrompt: z.string().max(8000).optional(),
  aiProvider: z.enum(["gigachat", "grok", "claude"]),
  scenarioConfig: z.record(z.string(), z.unknown()).optional(),
});

export const knowledgeSchema = z.object({
  title: z.string().max(200).optional(),
  content: z.string().min(10).max(50000),
});

export const checkoutSchema = z.object({
  currency: z.enum(["RUB", "USD"]).default("RUB"),
  provider: z.enum(["YOOKASSA", "STRIPE"]),
});
