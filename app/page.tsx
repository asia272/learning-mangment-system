import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-10">
      <h1 className="text-3xl font-semibold">LMS</h1>

      {userId ? (
        <>
          <UserButton />
          <Link href="/instructor" className="rounded bg-black px-6 py-3 text-white">
            Instructor dashboard
          </Link>
        </>
      ) : (
        <SignInButton>
          <button className="rounded bg-black px-6 py-3 text-white">Sign in</button>
        </SignInButton>
      )}
    </main>
  );
}