# fhflandingpage

Next.js (App Router) project for the Find-a-Home FUTA experience.

## App routes

Routes are derived from `src/app/**/page.{js,jsx}` (April 2026). Segments in square brackets are **dynamic**; replace them with real values in the browser.

### Core & marketing

| Route | Notes |
| --- | --- |
| `/` | Home |
| `/about` | About |
| `/contact` | Contact |

### Properties & marketplace

| Route | Notes |
| --- | --- |
| `/apartments` | Apartments landing |
| `/apartments/all` | All apartments |
| `/sp/[id]` | Single property |
| `/decluttering` | Marketplace landing |
| `/decluttering/all` | All marketplace items |
| `/decluttering/[id]` | Single item |

### Services

| Route | Notes |
| --- | --- |
| `/service` | Service providers landing |
| `/service/all` | All providers |
| `/service/[id]` | Single provider |

### Blog

| Route | Notes |
| --- | --- |
| `/blog` | Blog index |
| `/blog/[slug]` | Post by slug |
| `/blog/category/[category]` | Posts by category |

### Authentication

| Route | Notes |
| --- | --- |
| `/auth` | Auth hub |
| `/auth/signup` | Sign up |
| `/auth/student-auth` | Student auth |
| `/auth/agent-auth` | Agent auth |
| `/auth/artisan-auth` | Artisan auth |
| `/auth/reset-password` | Password reset |
| `/auth/verify-email` | Email verification |
| `/auth/verify-email/success` | Email verified |
| `/auth/verify-otp` | OTP verification |

### Student

| Route | Notes |
| --- | --- |
| `/student` | Student dashboard |
| `/student/profile` | Profile |
| `/student/payments` | Payments |
| `/student/properties` | Properties |
| `/student/properties/add` | Add property |
| `/student/decluttering` | Decluttering (student) |
| `/student/decluttering/add` | List item |
| `/student/decluttering/edit/[id]` | Edit listing |
| `/student/roommate-finder` | Roommate finder |
| `/student/bookings` | Service bookings |
| `/student/analytics/property/[id]` | Analytics for a listed property |
| `/student/analytics/item/[id]` | Analytics for a declutter listing |

### Agent

| Route | Notes |
| --- | --- |
| `/agent` | Agent dashboard |
| `/agent/profile` | Profile |
| `/agent/payments` | Payments |
| `/agent/properties` | Properties |
| `/agent/properties/add` | Add property |
| `/agent/properties/[id]` | Property detail |
| `/agent/properties/edit/[id]` | Edit property |
| `/agent/items` | Items |
| `/agent/items/add` | Add item |
| `/agent/bookings` | Service bookings |
| `/agent/analytics/property/[id]` | Analytics for a listed property |
| `/agent/analytics/item/[id]` | Analytics for a declutter listing |

### Artisan

| Route | Notes |
| --- | --- |
| `/artisan` | Artisan dashboard |
| `/artisan/profile` | Profile |
| `/artisan/payments` | Payments |
| `/artisan/services` | Services |
| `/artisan/services/add` | Add service |
| `/artisan/services/[id]` | Service detail |
| `/artisan/bookings` | Service bookings |
| `/artisan/analytics/service/[id]` | Analytics for a listed service |

### Admin

| Route | Notes |
| --- | --- |
| `/admin` | Admin home |
| `/admin/analytics` | Analytics |
| `/admin/settings` | Settings |
| `/admin/reports` | Reports |
| `/admin/subadmins` | Sub-admins |
| `/admin/subadmins/add` | Add sub-admin |
| `/admin/users` | Users |
| `/admin/users/[id]` | User detail |
| `/admin/users/approval/[id]` | User approval |
| `/admin/approval/[id]` | Generic approval |
| `/admin/properties` | Properties |
| `/admin/properties/add` | Add property |
| `/admin/properties/[id]` | Property detail |
| `/admin/properties/edit/[id]` | Edit property |
| `/admin/items` | Items |
| `/admin/items/add` | Add item |
| `/admin/items/[id]` | Item detail |
| `/admin/items/approval/[id]` | Item approval |
| `/admin/items/edit/[id]` | Edit item |
| `/admin/services` | Services |
| `/admin/services/[id]` | Service detail |
| `/admin/services/approval/[id]` | Service approval |
| `/admin/transactions` | Transactions |
| `/admin/transactions/[id]` | Transaction detail |

### Account, commerce & utilities

| Route | Notes |
| --- | --- |
| `/wishlist` | Wishlist |
| `/cart` | Cart |
| `/checkout` | Checkout |
| `/checkout/review` | Review order |
| `/checkout/payment` | Payment |
| `/checkout/success` | Order success |
| `/messages` | Messages |
| `/saved-searches` | Saved searches |
| `/review/[type]/[id]` | Leave / view review |
| `/rewards` | Rewards |
| `/referral` | Referral |

### Programs

| Route | Notes |
| --- | --- |
| `/ambassador` | Ambassador |
| `/ambassador/apply` | Apply |

---

**Total:** 93 routes (including `/`). Re-run discovery anytime:

```bash
find src/app \( -name 'page.js' -o -name 'page.jsx' \) | sed 's|src/app||' | sed 's|/page\.[^/]*$||' | sort | sed 's|^|/|' | sed 's|^//|/|'
```
