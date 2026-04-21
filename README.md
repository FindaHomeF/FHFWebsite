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
