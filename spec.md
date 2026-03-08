# SmileCare Dental Clinic

## Current State
New project — no existing pages or backend logic.

## Requested Changes (Diff)

### Add
- Multi-page React app with React Router (6 pages: Home, About, Services, Book Appointment, Testimonials, Contact)
- Sticky navbar with logo, nav links, and olive green CTA button; hamburger menu on mobile
- Home page: hero section with gradient background, clinic intro, doctor teaser card, 3 service snapshot cards, footer
- About page: clinic story, doctor bio (Dr. Priya Sharma, BDS) with initials placeholder, core values (3 cards)
- Services page: 6-card grid with icons, names, and descriptions (Routine Checkups, Implants, Whitening, Orthodontics, Root Canal, Cosmetic)
- Book Appointment page: validated frontend form (name, phone, email, date, time, service, message) with olive submit button and success state
- Testimonials page: 6 patient review cards with star ratings and placeholder quotes
- Contact page: two-column layout — contact form with success state + address block + Google Maps iframe (Gomti Nagar, Lucknow)
- Footer on all pages: address, phone, email, copyright
- Google Fonts: Playfair Display (headings) and Montserrat (body/nav/buttons)

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan
1. No backend needed — purely frontend with React Router, form state, and validation
2. Configure Tailwind with custom colors (navy #001F3F, beige #F5F5DC, olive #556B2F) and Google Fonts
3. Create shared Layout component with sticky Navbar and Footer
4. Build each of the 6 page components with placeholder content labeled in comments
5. Wire React Router routes in App.tsx
6. Ensure full mobile responsiveness (hamburger nav, responsive grids)
7. Add gentle hover transitions on cards; no loud animations
8. Embed Google Maps iframe for Gomti Nagar, Lucknow on Contact page
