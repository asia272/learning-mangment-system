import { getPublishedCourses } from "@/lib/queries/courses";
import { HeroSection } from "@/components/home/hero-section";
import { CompaniesSection } from "@/components/home/companies-section";
import { CoursesSection } from "@/components/home/courses-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CtaSection } from "@/components/home/cta-section";

export default async function HomePage() {
    const { courses } = await getPublishedCourses({ limit: 4 });

    return (
        <main>
            <HeroSection />
            <CompaniesSection />
            <CoursesSection courses={courses} />
            <TestimonialsSection />
            <CtaSection />
        </main>
    );
}