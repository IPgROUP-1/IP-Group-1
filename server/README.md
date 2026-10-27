# TeamFlow: Signup Backend (branch `Cabrel`)

Express + MongoDB signup API. Email signup and Google signup work now; Facebook signup is wired and needs its keys.

## 1. Run it locally
```bash
git checkout Cabrel
cd server
npm install
cp .env.with false values     # The true values are in `.env` file which i did not push 
npm run dev
```
To have the `.env` (ask Cabrel privately for the true values, not present in the .env.with false values)
Expected output: `MongoDB connected` and `Server running on port 5000`.

API base URL: `http://localhost:5000`

## 2. Frontend address
The React app must run at `http://localhost:5173` (the Vite default). The API only accepts requests from `CLIENT_URL` in `.env`. If you use another port, tell Cabrel.

## 3. Email signup
`POST /api/auth/register`

Body (JSON):
```json
{ "name": "Cabrel", "email": "cabrel@test.com", "password": "Password123" }
```

Server validation:
- `name`: at least 2 characters
- `email`: valid email
- `password`: at least 8 characters

| Status | Body | Meaning |
| --- | --- | --- |
| 201 | `{ "user": { "id", "name", "email", "role" } }` | Signup worked, user is logged in |
| 400 | `{ "message": "Password must be at least 8 characters" }` | Validation error, show `message` |
| 409 | `{ "message": "Email already registered" }` | Email already used |
| 500 | `{ "message": "Server error" }` | Unexpected error |

## 4. Cookies (important)
On success the server sets two HTTP-only cookies: `accessToken` (15 min) and `refreshToken` (7 days). JavaScript cannot read them, so the frontend never stores tokens.

Every API call must send cookies:

```js
// fetch
const res = await fetch("http://localhost:5000/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ name, email, password }),
});
const data = await res.json();
if (res.ok) {
  // signup done: go to the next page
} else {
  // show data.message
}
```

```js
// axios
axios.post("http://localhost:5000/api/auth/register", { name, email, password }, { withCredentials: true });
```

## 5. Google and Facebook signup
These are plain links, not fetch calls:

```html
<a href="http://localhost:5000/api/auth/google">Continue with Google</a>
<a href="http://localhost:5000/api/auth/facebook">Continue with Facebook</a>
```

Flow: provider login page, back to the server, cookies set, the browser lands on `CLIENT_URL` (the root page `/`).
On failure the user returns to `/signup?error=google` (or `facebook`): show an error when this query is present.

## 6. Not available yet
- Login, logout, forgot password: Faith's login backend.
- No "who am I?" endpoint yet. For now, redirect after a 201 response.

## 7. Colour palette (proposal)
| Use | Colour |
| --- | --- |
| Primary (buttons, links) | `#1F8A70` |
| Titles and text | `#0E3B36` |
| Accent | `#F2A33A` |
| Background | `#E9F3EF` |
| Error | `#C4533A` |

## 8. Environment variables (see `.env.with false value`)
`PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL`, `SERVER_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`