export type Testimonial = {
    id: string;
    name: string;
    role: string;
    avatar: string; // file inside public/assets
    rating: number;
    text: string;
};

export const testimonials: Testimonial[] = [
    {
        id: "1",
        name: "Donald Jackman",
        role: "SWE 1 @ Amazon",
        avatar: "profile_img_1.png",
        rating: 5,
        text: "I've been using imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
    },
    {
        id: "2",
        name: "Richard Nelson",
        role: "SWE 2 @ Samsung",
        avatar: "profile_img_2.png",
        rating: 5,
        text: "I've been using imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
    },
    {
        id: "3",
        name: "James Washington",
        role: "SWE 2 @ Google",
        avatar: "profile_img_3.png",
        rating: 5,
        text: "I've been using imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
    },
];