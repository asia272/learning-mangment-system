import { z } from "zod";

const lectureSchema = z.object({
    title: z.string().trim().min(1, "Every lecture needs a title").max(150),
    duration: z.number().int().min(1, "Upload a video for every lecture"),
    videoUrl: z.string().url("Upload a video for every lecture"),
    videoPublicId: z.string().optional(),
    isPreviewFree: z.boolean(),
});

const chapterSchema = z.object({
    title: z.string().trim().min(1, "Every chapter needs a title").max(150),
    lectures: z.array(lectureSchema).min(1, "Every chapter needs at least one lecture"),
});

export const courseSchema = z.object({
    title: z.string().trim().min(3, "Title is too short").max(150),
    description: z
        .string()
        .refine((v) => v.replace(/<[^>]*>/g, "").trim().length > 0, "Description is required"),
    price: z.number().int().min(0, "Price cannot be negative"),
    discountPercent: z.number().int().min(0).max(100, "Discount must be 0 to 100"),
    thumbnailUrl: z.string().url("Please upload a thumbnail"),
    thumbnailPublicId: z.string().optional(),
    chapters: z.array(chapterSchema).min(1, "Add at least one chapter"),
}).refine(
    (c) => {
        const final = Math.round((c.price * (100 - c.discountPercent)) / 100);
        return final === 0 || final >= 50; // Stripe's minimum charge is $0.50
    },
    {
        message: "After the discount the price must be $0 (free) or at least $0.50",
        path: ["price"],
    }
);;

export type CourseInput = z.infer<typeof courseSchema>;