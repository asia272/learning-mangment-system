import { z } from "zod";

export const applicationSchema = z.object({
    headline: z.string().trim().min(5, "Headline must be at least 5 characters").max(80),
    expertise: z.string().trim().min(2, "Please add your area of expertise").max(120),
    bio: z
        .string()
        .trim()
        .min(50, "Tell us a bit more about yourself (at least 50 characters)")
        .max(1000),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;