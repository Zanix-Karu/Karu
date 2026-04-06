# Landing Page — Requirements

## Overview

The Zanix pre-launch landing page is a fully interactive, conversion-optimised page for Douala and Yaoundé audiences. Its single purpose: collect waitlist signups from prospective customers and vendors before the platform launches.

## User Stories

- As a **diaspora traveller**, I want to pre-register so I am notified the moment I can book a car before my next trip to Cameroon.
- As a **car rental vendor**, I want to register my interest so Zanix contacts me about listing my vehicles on the platform.
- As a **local professional in Douala**, I want to understand how the platform works so I can decide whether to trust it with my rental needs.
- As a **mobile user on a slow connection**, I want the page to load quickly and work smoothly so I don't give up before signing up.

---

## Functional Requirements

### FR-1: Navigation

WHEN a user scrolls past 80px from the top  
THE SYSTEM SHALL apply a sticky navigation style with blurred dark background and border

WHEN a user clicks a navigation link (About, How it works, Features, Cities)  
THE SYSTEM SHALL smoothly scroll to the corresponding section

WHEN a user clicks the "Pre-Register" nav CTA  
THE SYSTEM SHALL smoothly scroll to the waitlist form section and focus the email input

WHEN a user is on a mobile viewport (< 900px)  
THE SYSTEM SHALL hide the nav link list and show only the logo and CTA button

### FR-2: Hero Section

WHEN the page loads  
THE SYSTEM SHALL sequentially animate in: pill badge → headline → eyebrow → description → CTA buttons (staggered 120ms apart, starting 100ms after page load)

WHEN a user moves their mouse across the hero  
THE SYSTEM SHALL apply a subtle parallax shift to the background grid (max ±20px, 0.4× damping)

WHEN a user clicks "Pre-Register Now"  
THE SYSTEM SHALL scroll to the waitlist form section

WHEN a user clicks "List Your Car →"  
THE SYSTEM SHALL scroll to the waitlist form section with the "Vendor" type pre-selected

WHEN `prefers-reduced-motion` is set  
THE SYSTEM SHALL skip all hero animations and display the final state immediately

### FR-3: Ticker

WHEN the page loads  
THE SYSTEM SHALL display an infinite horizontal marquee of key brand phrases at a consistent speed (22s loop)

WHEN a user hovers over the ticker  
THE SYSTEM SHALL pause the animation

### FR-4: Stats Row

WHEN a stat cell enters the viewport for the first time  
THE SYSTEM SHALL animate the number from 0 to its target value over 1.8 seconds with quartic ease-out

WHEN all four cells are visible  
THE SYSTEM SHALL trigger them sequentially with 100ms stagger between each

### FR-5: Scroll Reveal Animations

WHEN any section or card enters the viewport (margin: -80px from bottom)  
THE SYSTEM SHALL reveal it with the appropriate direction animation (up, left, or right) at 0.7s duration

WHEN a section has already been revealed  
THE SYSTEM SHALL NOT re-animate it on scroll-back (once: true)

### FR-6: Waitlist Form

WHEN a user submits the waitlist form with a valid email  
THE SYSTEM SHALL:
1. Disable the form and show a loading state
2. POST to `/api/waitlist` with `{ email, type, city }`
3. On 201 response: replace form with a success state personalised to their city
4. On error: show a human-readable error message and re-enable the form

WHEN a user submits the form with an invalid email  
THE SYSTEM SHALL display an inline validation error without making a network request

WHEN a user submits an email already on the waitlist  
THE SYSTEM SHALL display the same success message as a new signup (do not reveal duplicate status)

WHEN the "List Your Car →" button in the hero is clicked  
THE SYSTEM SHALL pre-select the "Vendor" option in the waitlist form type toggle

WHEN the form is in a success state  
THE SYSTEM SHALL animate the transition: form fades out → success state fades in (300ms each, 150ms gap)

WHEN the page loads  
THE SYSTEM SHALL fetch the current waitlist count from `/api/waitlist/count` and display it below the form (e.g., "Join 847 others on the waitlist")

### FR-7: Custom Cursor

WHEN the user's pointer device is a mouse (not touch)  
THE SYSTEM SHALL display a custom amber cursor: small dot tracking exact position + larger lagging circle

WHEN the cursor hovers over any interactive element (link, button)  
THE SYSTEM SHALL expand the cursor circle from 44px to 64px

WHEN `prefers-reduced-motion` is set  
THE SYSTEM SHALL disable the custom cursor entirely

### FR-8: Locale Switching

WHEN a user clicks the language switcher  
THE SYSTEM SHALL switch all page copy between English and French without a full page reload

WHEN a user has a French browser locale  
THE SYSTEM SHALL default to French on first visit

WHEN locale switches  
THE SYSTEM SHALL preserve the user's scroll position

### FR-9: City Cards

WHEN a user hovers over a city card  
THE SYSTEM SHALL animate in an amber radial glow at the card's bottom-right and lift the card 8px upward

WHEN a city card is visible in the viewport  
THE SYSTEM SHALL reveal it with a horizontal slide animation (Douala from left, Yaoundé from right)

### FR-10: Feature Cards

WHEN a user hovers over a feature card  
THE SYSTEM SHALL animate an amber top-border bar across the card width (scaleX: 0 → 1, 450ms ease)

WHEN a feature card enters the viewport  
THE SYSTEM SHALL reveal it with a fade-up animation, staggered 70ms after the previous card

### FR-11: How It Works Steps

WHEN step items enter the viewport  
THE SYSTEM SHALL reveal them with staggered fade-up animations

WHEN a user hovers over a step  
THE SYSTEM SHALL animate the diamond border to rotate 45° and the card to lift 8px

---

## Non-Functional Requirements

### NFR-1: Performance

WHEN the page is loaded over a simulated 3G connection  
THE SYSTEM SHALL achieve a Largest Contentful Paint (LCP) of under 2.5 seconds

WHEN Lighthouse is run on the production URL  
THE SYSTEM SHALL score 90 or above on Performance, Accessibility, Best Practices, and SEO

### NFR-2: Accessibility

WHEN a user navigates using only a keyboard  
THE SYSTEM SHALL provide visible focus indicators on all interactive elements and a logical tab order

WHEN a screen reader reads the page  
THE SYSTEM SHALL convey the correct heading hierarchy (one `h1`, logical `h2`–`h6` structure)

WHEN `prefers-reduced-motion: reduce` is set  
THE SYSTEM SHALL disable all decorative animations and the custom cursor

### NFR-3: Responsiveness

WHEN the viewport width is below 900px  
THE SYSTEM SHALL adapt to a single-column layout for all grid sections

WHEN the viewport width is below 640px  
THE SYSTEM SHALL stack the waitlist form fields vertically

### NFR-4: Internationalisation

WHEN a page renders  
THE SYSTEM SHALL display all copy in the user's selected locale (English or French)

WHEN a translation key is missing  
THE SYSTEM SHALL fall back to English and log a warning — never display a raw key

### NFR-5: Privacy

WHEN a user visits the page  
THE SYSTEM SHALL NOT set any analytics cookies or require a consent banner (Plausible is cookieless)

WHEN a user submits the waitlist form  
THE SYSTEM SHALL store only email, type, city, and a hashed IP — no other personal data
