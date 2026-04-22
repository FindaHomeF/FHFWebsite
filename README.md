<<<<<<< HEAD
# Find-a-Home FUTA Frontend

This document tracks the current frontend feature coverage, backend integration status, and key architecture observations.

## Integration Status Legend

- `API Connected`: Feature is wired to backend endpoints.
- `Partial`: Some key flows are backend-connected, but other parts still use fallback/local mock behavior.
- `No Backend Connection`: Feature is currently mock/local only.

## Critical Observation: Decluttering `category` and `inventory`

The decluttering item backend contract currently does not include finalized support for `category` and `inventory` in the primary listing payloads used by create/update flows.

Current frontend behavior:

- The UI still captures and displays `category` and `inventory`.
- Decluttering create/edit requests send fields that are currently supported by backend contract.
- `category` and `inventory` are preserved in local fallback state where possible.
- The frontend intentionally avoids hard-depending on backend persistence for these two fields until backend support is finalized.

Impact:

- Cross-device consistency for `category` and `inventory` can be incomplete.
- API-first views may show partial metadata compared to local fallback views.

Recommended backend alignment:

- Add `category` and `inventory` to `POST/PUT/PATCH /api/listings/properties/` for `property_type=ITEM`.
- Return both fields in `GET /api/listings/properties/`, `GET /api/listings/properties/{id}/`, and `GET /api/listings/properties/my_properties/`.
- Add serializer validation rules (min/max) so the frontend can mirror exact constraints.

## Feature Inventory (Application-Wide)

## Public and Marketing

- `/blog`, `/blog/[slug]`, `/blog/category/[category]`: `No Backend Connection`

## Authentication and Account Security

- `/auth`, `/auth/signup`, role auth pages (`/auth/student-auth`, `/auth/agent-auth`, `/auth/artisan-auth`): `API Connected`
- `/auth/verify-otp`, `/auth/verify-email`, `/auth/verify-email/success`: `API Connected` (OTP verification/resend flow)
- `/auth/reset-password`: `API Connected` (request/reset password)
- Login/logout/token refresh/session invalidation handling: `API Connected`
- Security settings (`/settings/security`) including change password and session revoke UI: `Partial` (UI connected for core actions; some security controls remain UI-level)

## User Profiles and Verification

- Student profile (`/student/profile`): `API Connected` (profile retrieve/update, student ID upload/status)
- Agent profile (`/agent/profile`): `Partial` (mixed local UI and backend profile patterns)
- Artisan profile (`/artisan/profile`): `Partial` (mixed local UI and backend profile patterns)

## Decluttering Marketplace (Items)

- Public item list/detail (`/decluttering`, `/decluttering/all`, `/decluttering/[id]`): `Partial`
  - API-backed list/detail with fallback.
  - Some UX still supports fallback/demo presentation.
- Student item management (`/student/decluttering`, `/student/decluttering/add`, `/student/decluttering/edit/[id]`): `API Connected` with fallback
  - Uses my-properties query route and item CRUD flows.
- Agent item management (`/agent/items`, `/agent/items/add`): `API Connected` with fallback
  - Uses my-properties query route and item CRUD flows.
- Item image manager in edit flow:
  - `GET/POST/PUT/PATCH/DELETE /properties/{property}/images/...`
  - `POST /set_featured/`
  - `POST /reorder_images/`
  - Status: `API Connected`
- Soft delete/restore:
  - `POST /soft_delete/`
  - `POST /restore/`
  - Status: `API Connected`
- View statistics:
  - `GET /properties/{id}/view_stats/`
  - surfaced in item detail and item analytics
  - Status: `API Connected`

## Housing / Apartments / Properties

- Public apartment/property pages (`/apartments`, `/apartments/all`, property detail experiences): `No Backend Connection` (currently local/mock query options)
- Student property management (`/student/properties`, `/student/properties/add`): `No Backend Connection`
- Agent property management (`/agent/properties`, `/agent/properties/add`, `/agent/properties/edit/[id]`, `/agent/properties/[id]`): `No Backend Connection`

## Services Marketplace

- Public services pages (`/service`, `/service/all`, `/service/[id]`, `/sp/[id]`): `No Backend Connection` (currently local/mock query options)
- Artisan services (`/artisan/services`, `/artisan/services/add`, `/artisan/services/[id]`): `No Backend Connection`

## Admin Dashboard and Moderation

- Admin shell and dashboards (`/admin`, `/admin/analytics`, `/admin/reports`, `/admin/settings`): `No Backend Connection` (mostly mock/local)
- Admin items/properties/services/users/transactions/subadmins route families: `No Backend Connection`
- Some admin edit/detail flows now call connected item endpoints, but the broader admin suite is still predominantly local/mock: `Partial` overall.

## Commerce and Transactions

- Cart (`/cart`) and checkout (`/checkout`, `/checkout/review`, `/checkout/payment`, `/checkout/success`): `No Backend Connection`
- Bookings (`/bookings`), rewards (`/rewards`), payments pages (`/student/payments`, `/agent/payments`, `/artisan/payments`): `No Backend Connection`

## Messaging, Reviews, and User Engagement

- Messages/chat (`/messages`, `/chat`): `No Backend Connection`
- Reviews (`/my-reviews`, `/review/[type]/[id]`): `No Backend Connection`
- Wishlist (`/wishlist`) and saved searches (`/saved-searches`): `No Backend Connection`
- Referral and ambassador pages (`/referral`, `/ambassador`, `/ambassador/apply`): `No Backend Connection`
- Roommate finder (`/student/roommate-finder`): `No Backend Connection`

## Analytics Pages

- Item analytics (`/my-listings/[id]/analytics`): `Partial`
  - view-stat cards are API-connected
  - chart datasets still use placeholders/mock values
- Property analytics (`/property-analytics`): `No Backend Connection`

## Current Data-Layer Summary

- `auth-api.js`: strong backend integration for auth + decluttering + nested image APIs.
- `query-options-decluttering.js`: API-first with fallback for item list/detail and view stats.
- `query-options-housing.js`: local/mock only.
- `query-options-service-providers.js`: local/mock only.
- `query-options.js`: general helpers + auth profile/status queries.

## Scalability Priorities (Recommended)

1. Standardize all role dashboards on API-first query hooks (remove localStorage as primary source).
2. Finalize backend schema for decluttering `category` + `inventory`.
3. Add E2E test coverage for:
   - auth + token refresh
   - decluttering create/edit/images/archive/restore
   - profile + student verification.
4. Move remaining domain modules (housing, services, admin, checkout) to backend query/mutation contracts.
5. Add CI quality gates: build, lint, and automated tests on every PR.

## Last Updated

- Date: 2026-04-20
- Scope: frontend integration mapping and backend connection audit.
=======
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
>>>>>>> master
