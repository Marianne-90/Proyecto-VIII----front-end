export function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie =
    encodeURIComponent(name) +
    "=" +
    encodeURIComponent(value) +
    "; expires=" +
    expires +
    "; path=/; SameSite=Lax";
}

export function getCookie(name) {
  const key = encodeURIComponent(name) + "=";
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    if (part.startsWith(key)) {
      return decodeURIComponent(part.slice(key.length));
    }
  }
  return null;
}

export function deleteCookie(name) {
  document.cookie =
    encodeURIComponent(name) +
    "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";
}