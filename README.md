<div align="center">

# 🎓 Edemy — Learning Management System

A production-ready, role-based LMS where instructors publish video courses, students enroll and learn, and admins keep the platform in check.

[🌐 Live Demo](https://learning-mangment-system-one.vercel.app/) · [🐛 Report a Bug](https://github.com/asia272/learning-mangment-system/issues) · [💡 Request a Feature](https://github.com/asia272/learning-mangment-system/issues)

### 🎨 Explore the UI Design

[**View Edemy on Figma →**](https://www.figma.com/design/9wQjNWtbhtib4DcHJThelX/GreatStack-LMS-UI?node-id=0-1&p=f)

![Edemy Preview](./public/preview.png)

</div>

---

## 📖 About

**Edemy** is a full-stack Learning Management System built with **Next.js 16**. It has three levels of access: **students** discover, buy, and complete courses; **instructors** build and sell them; and **admins** approve instructors and moderate the platform. Payments run through Stripe Checkout, media is uploaded straight to Cloudinary, and authentication is handled by Clerk.

## ✨ Features

### 🧑‍🎓 Student
- Browse and search the course catalog
- Course page with structure, ratings, discounts, and a countdown for time-limited offers
- Secure one-time checkout with Stripe (free courses enroll instantly)
- **My Enrollments** with lecture-by-lecture progress tracking
- Built-in video player with mark-as-complete and 5-star course ratings
- **Apply to become an instructor**, with a live "request pending" status in the navbar

### 👩‍🏫 Instructor
- Dashboard with total enrolments, courses, and earnings
- Create courses with a rich-text description, thumbnail, price, and discount
- Build chapters and lectures with direct video uploads and free-preview lectures
- Publish or unpublish courses, and see every enrolled student

### 🛡️ Admin
- Dedicated dashboard with a fixed sidebar and platform-wide stats (users, instructors, courses, enrolments, revenue)
- **Instructor approval workflow**: review applications, approve or reject with a note, and see history
- User management: search, filter by role, and revoke instructor access
- Course moderation: publish or unpublish any course
- Live pending-request badge, with data auto-refreshing in the background

### 🔐 Platform
- Role-based access control enforced on the server for pages, actions, and APIs
- Idempotent Stripe webhook that enrolls students after payment
- Server-side price calculation, so prices can't be tampered with in the browser
- Sanitized HTML descriptions, Zod validation, and a responsive UI with toast feedback

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
git clone https://github.com/asia272/learning-mangment-system.git
cd learning-mangment-system

# 2. Install dependencies
npm install

# 3. Create your environment file and fill in the values below
touch .env

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

# Comma-separated emails that get admin access (verified by Clerk)
ADMIN_EMAILS="you@example.com"

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

## 👥 Roles and Access

| Role | How you get it | What you can do |
| --- | --- | --- |
| **Student** | Default for every new account | Browse, buy, and learn |
| **Instructor** | Apply from the navbar, then an admin approves | Create and manage courses |
| **Admin** | Your email is listed in `ADMIN_EMAILS` | Approve instructors, manage users and courses |

Admin access is granted only when Clerk has verified the email. Instructor and student roles are stored in the database and managed from the admin dashboard, so adding or removing an instructor never needs a redeploy.

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

**Production:** use `https://your-domain.com/api/webhooks/stripe`, switch to live Stripe keys, and update `APP_URL`.

> 💡 Test card: `4242 4242 4242 4242`, any future expiry, any CVC. Stripe requires a minimum charge of $0.50, so price courses at $0 (free) or at least $0.50.

## 🌍 Deployment

1. Push the repository to GitHub and import it into [Vercel](https://vercel.com).
2. Add all environment variables above (use production values and set `APP_URL` to your domain).
3. Run `npx prisma migrate deploy` against your production database.
4. Add your production domain in Clerk and the production webhook endpoint in Stripe, then update `STRIPE_WEBHOOK_SECRET`.

## 📄 License

Distributed under the MIT License.

---

<div align="center">
Built with ❤️ using Next.js, Clerk, Prisma, Stripe, and Cloudinary
</div>