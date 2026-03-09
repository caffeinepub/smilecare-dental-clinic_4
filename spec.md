# VENUS Oral Dental Care Clinic

## Current State
- App is named SmileCare Dental Clinic throughout all pages and components
- Contact number is placeholder +91 98765 43210
- Footer has "Built with caffeine.ai" credit
- No admin dashboard exists
- Layout.tsx has NavBar and Footer with old clinic name
- ContactPage.tsx has address block with old clinic name and phone
- HomePage.tsx has old clinic name in hero and sections
- Backend exposes `getAllAppointments()` for fetching all appointment submissions
- Logo image uploaded: /assets/uploads/IMG_5920-2.PNG (VENUS logo)
- Clinic photo uploaded: /assets/uploads/image-1.png (waiting area)

## Requested Changes (Diff)

### Add
- Admin dashboard page (/admin) accessible only to logged-in admin users — shows table of all appointment submissions from `getAllAppointments()` backend call
- "Chat on WhatsApp" button linking to `https://wa.me/919616604805` in the contact page and footer
- VENUS logo image in navbar (use /assets/uploads/IMG_5920-2.PNG)
- Clinic photo (waiting area) on the homepage hero or about section

### Modify
- Clinic name everywhere: "SmileCare Dental Clinic" → "VENUS Oral Dental Care Clinic"
- Phone number everywhere: placeholder → 09616604805 (formatted as +91 96166 04805)
- Phone href: tel:+919616604805
- Remove "Built with caffeine.ai" footer credit entirely
- Navbar logo: replace text-only logo with VENUS logo image (/assets/uploads/IMG_5920-2.PNG)
- Add Admin link in navbar for admin users (role check via `isCallerAdmin()`)

### Remove
- "Built with caffeine.ai" branding from footer
- Old placeholder phone number +91 98765 43210

## Implementation Plan
1. Update Layout.tsx: replace clinic name with VENUS branding, use logo image in navbar, update phone to 09616604805, add WhatsApp button in footer, remove caffeine.ai footer credit, add Admin nav link for admins
2. Update ContactPage.tsx: clinic name, phone number, add WhatsApp button
3. Update HomePage.tsx: clinic name in hero, sections, doctor teaser
4. Update AboutPage.tsx: clinic name in story paragraphs, add waiting area clinic photo
5. Create AdminDashboard.tsx: protected page showing appointments table (uses `getAllAppointments()`, `isCallerAdmin()`), redirect non-admins
6. Add /admin route to App.tsx
