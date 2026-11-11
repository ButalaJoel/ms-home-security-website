# MS Home Security Solutions: public website

The public shop and information website. It is a separate app from the staff POS (`ms-home-security-pos`) and reads products, prices, stock labels and business details from the POS server's public API.

## Run it
```
npm install
npm run dev
```
Then open http://localhost:5173.

## Connect to the POS
Copy `.env.example` to `.env.local` and set `VITE_POS_API_URL`, for example the POS server address. While it is empty, the site shows the **sample products** in `src/data/` and a "Preview" strip at the top.

## Folders (same layout as the Peacock site)
- `src/components/layout`: announcement bar, header and menus, search, cart drawer, footer
- `src/components/home`: home page sections
- `src/components/product`: product card, photo and stock label
- `src/pages`: one file per page
- `src/config`: categories and menu
- `src/context`: shop data and cart
- `src/lib`: API calls, formatting, shared types

Feature list and decisions: see `website-feature-map.md` in the claude.ai Project "MS PUBLIC WEBSITE".
