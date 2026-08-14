# Experiment 1.3.1 — JWT Authentication (standalone)

## Run

    npm install
    npm run dev

Always opens on **http://localhost:5173**

## Test accounts

| Email          | Password  |
|----------------|-----------|
| admin@app.com  | admin123  |
| editor@app.com | editor123 |
| viewer@app.com | viewer123 |

All three behave identically here. Roles only start mattering in Experiment 1.3.2.

## Files

| File                        | Purpose                              |
|-----------------------------|--------------------------------------|
| src/utils/jwt.js            | create / decode / verify the token    |
| src/context/AuthContext.jsx | login, logout, session state          |
| src/utils/api.js            | attaches Authorization: Bearer header |
| src/pages/Login.jsx         | login form                            |
| src/pages/Dashboard.jsx     | shows header, payload and raw token   |

No React Router in this project — the whole screen is decided by one question:
is there a valid token or not?

## Screenshots for the report

1. Login page
2. Dashboard — header and payload decoded
3. Raw token + expiry time
4. Chrome DevTools > Application > Local Storage > key `jwt_auth_token`
5. Click "Call protected API" — the Authorization: Bearer header
6. The token pasted into jwt.io

## Tamper demo

Open Chrome DevTools > Console and paste:

    const t = localStorage.getItem('jwt_auth_token');
    const [h, p, s] = t.split('.');
    const c = JSON.parse(atob(p.replace(/-/g,'+').replace(/_/g,'/')));
    c.name = 'Hacked User';
    const forged = btoa(JSON.stringify(c))
      .replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    localStorage.setItem('jwt_auth_token', h + '.' + forged + '.' + s);
    location.reload();

You are logged out instead of renamed — the signature no longer matches.
