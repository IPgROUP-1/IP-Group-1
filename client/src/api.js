export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function registerUser({ name, email, password }) {
  let res;
  try {
    res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });
  } catch {
    throw new Error("Cannot reach the server. Is the backend running on port 5000?");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data.user;
}