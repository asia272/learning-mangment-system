import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { getPlayerData } from "@/lib/queries/player";
import { PlayerView } from "@/components/player/player-view";

export default async function PlayerPage({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;

    const user = await getCurrentUser();
    if (!user) redirect(`/sign-in?redirect_url=${encodeURIComponent(`/player/${courseId}`)}`);

    const data = await getPlayerData(user.id, courseId);
    if (!data) {
        // not enrolled: send them to the course page where they can enroll
        redirect(`/courses/${courseId}`);
    }
    if (data.course.chapters.length === 0) notFound();

    return (
        <PlayerView course={data.course} completedIds={data.completedIds} myRating={data.myRating} />
    );
}