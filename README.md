<div align="center">

# 🎓 Edemy — Learning Management System

A full-stack LMS where instructors publish video courses and students enroll, pay securely, and learn at their own pace.

[**🌐 Live Demo**](https://learning-mangment-system-one.vercel.app/) · [Report a Bug](https://github.com/your-username/your-repo/issues) · [Request a Feature](https://github.com/your-username/your-repo/issues)

![Edemy Preview](./public/preview.png)

</div>

---

## 📖 About

**Edemy** is a modern Learning Management System built with **Next.js 16**. It has two roles. **Instructors** build and manage courses, and **students** discover, buy, and complete them. Payments run through Stripe Checkout, videos and images are uploaded straight to Cloudinary, and authentication is handled by Clerk.

## ✨ Features

### 👩‍🏫 Instructor
- Dashboard with total enrolments, courses, and earnings
- Create courses with a rich-text description, thumbnail, price, and discount
- Build chapters and lectures with direct video uploads and free-preview lectures
- Publish or unpublish courses from **My Courses**
- View every enrolled student and the course they bought

### 🧑‍🎓 Student
- Browse and search the course catalog
- Course detail page with structure, ratings, discounts, and a countdown for time-limited offers
- Secure one-time checkout with Stripe (free courses enroll instantly)
- **My Enrollments** with progress tracking
- Built-in video player with mark-as-complete and 5-star course ratings

### 🔐 Platform
- Role-based access: instructor accounts are set by email allowlist and verified through Clerk
- Idempotent Stripe webhook that enrolls students after payment
- Server-side price calculation, so prices can't be tampered with in the browser
- Sanitized HTML descriptions, Zod validation, and responsive UI with toast feedback

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React, TypeScript |
| Styling | Tailwind CSS, Sonner, Lucide Icons |
| Auth | Clerk |
| Database | PostgreSQL (Neon) with Prisma 7 |
| Payments | Stripe Checkout and Webhooks |
| Media | Cloudinary (signed direct uploads) |
| Editor and validation | Tiptap, Zod, sanitize-html |

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A [Neon](https://neon.tech) (or any PostgreSQL) database
- Accounts for [Clerk](https://clerk.com), [Cloudinary](https://cloudinary.com), and [Stripe](https://stripe.com)
- [ngrok](https://ngrok.com) for testing webhooks locally

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/your-repo.git
cd your-repo

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env     # then fill in the values below

# 4. Generate the Prisma client and run migrations
npx prisma generate
npx prisma migrate dev

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# Database (Neon pooled connection)
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=verify-full"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxx"
CLERK_SECRET_KEY="sk_test_xxxxxxxxxxxx"
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Emails that become instructors
INSTRUCTOR_EMAILS="you@example.com"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_xxxxxxxxxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxxxxxxxxx"

# Public URL of the app (http://localhost:3000 locally, your domain in production)
APP_URL="http://localhost:3000"
```

> ⚠️ Never commit your `.env` file or share real secrets.

## 💳 Stripe Webhook Setup

Stripe must be able to reach your app to confirm payments and create enrollments.

**Local development (ngrok):**

```bash
ngrok http 3000
```

1. Copy the HTTPS forwarding URL (for example `https://abcd-1234.ngrok-free.app`).
2. In the Stripe Dashboard, go to **Developers → Webhooks → Add endpoint**.
3. Set the endpoint URL to `https://abcd-1234.ngrok-free.app/api/webhooks/stripe` and select the `checkout.session.completed` event.
4. Copy the **Signing secret** into `STRIPE_WEBHOOK_SECRET`.

**Production:** replace the ngrok URL with your real domain (`https://your-domain.com/api/webhooks/stripe`), switch to live Stripe keys, and update `APP_URL`.

> 💡 Test card: `4242 4242 4242 4242`, any future expiry, any CVC. Stripe requires a minimum charge of $0.50, so price courses at $0 (free) or at least $0.50.

## 👤 Roles

- Emails listed in `INSTRUCTOR_EMAILS` become **instructors** after Clerk verifies the email, and land on `/instructor`.
- Everyone else is a **student**.

## 🌍 Deployment

1. Push the repository to GitHub and import it into [Vercel](https://vercel.com).
2. Add all environment variables above (use production values).
3. Run `npx prisma migrate deploy` against your production database.
4. Add the production webhook endpoint in Stripe and update `STRIPE_WEBHOOK_SECRET`.
5. Replace the **Live Demo** link at the top of this README with your real domain.

## 📄 License

Distributed under the MIT License.

---

<div align="center">
Built with ❤️ using Next.js, Clerk, Prisma, Stripe, and Cloudinary
</div>