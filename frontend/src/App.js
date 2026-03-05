import { useMemo, useState } from 'react';
import { login } from './api';
import './App.css';

const REMEMBERED_USERNAME_KEY = 'remembered_username';

const welcomeHighlights = [
  {
    title: 'Performance',
    description: 'Track response times and optimize login request paths.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Security',
    description: 'Credential validation with clean API boundaries and robust UX.',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Scalability',
    description: 'Ready-to-extend frontend and backend structure for larger apps.',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
  },
];

const welcomeTitleStyles = ['aurora', 'stroke-glow', 'shine'];

function getRememberedUsername() {
  return localStorage.getItem(REMEMBERED_USERNAME_KEY) || '';
}

function rememberUsername(username) {
  localStorage.setItem(REMEMBERED_USERNAME_KEY, username);
}

function validateUsername(value) {
  if (!value.trim()) {
    return 'Username is required.';
  }

  if (value.trim().length < 3) {
    return 'Username must be at least 3 characters.';
  }

  return '';
}

function validatePassword(value) {
  if (!value.trim()) {
    return 'Password is required.';
  }

  if (value.trim().length < 4) {
    return 'Password must be at least 4 characters.';
  }

  return '';
}

function App() {
  const rememberedUsername = useMemo(() => getRememberedUsername(), []);
  const welcomeTitleVariant = useMemo(
    () => welcomeTitleStyles[Math.floor(Math.random() * welcomeTitleStyles.length)],
    []
  );

  const [username, setUsername] = useState(rememberedUsername);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [user, setUser] = useState(null);
  const [touched, setTouched] = useState({ username: false, password: false });

  const usernameError = validateUsername(username);
  const passwordError = validatePassword(password);
  const hasValidationErrors = Boolean(usernameError || passwordError);

  const canSubmit = !hasValidationErrors && !isSubmitting;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');
    setTouched({ username: true, password: true });

    if (hasValidationErrors) {
      return;
    }

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();
    setIsSubmitting(true);

    try {
      const data = await login({ username: cleanUsername, password: cleanPassword });
      const loggedInUsername = data.username || cleanUsername;

      rememberUsername(loggedInUsername);
      setUsername(loggedInUsername);

      setUser({
        username: loggedInUsername,
      });

      setPassword('');
      setShowPassword(false);
    } catch (requestError) {
      if (!requestError.response) {
        setApiError('Cannot reach backend. Start backend server on port 5000.');
      } else {
        const message = requestError.response.data?.message || 'Unable to login. Please try again.';
        setApiError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPassword('');
    setShowPassword(false);
    setUsername(getRememberedUsername());
  };

  if (user) {
    return (
      <main className="welcome-page">
        <header className="welcome-header fade-in">
          <div>
            <p className="eyebrow">Control Center</p>
            <h1 className={`welcome-title welcome-title--${welcomeTitleVariant}`}>
              Welcome back, {user.username}
            </h1>
          </div>
          <button type="button" className="welcome-logout" onClick={handleLogout} aria-label="Logout">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1828/1828479.png"
              alt=""
              loading="lazy"
            />
          </button>
        </header>

        <section className="hero-banner slide-up">
          <div className="hero-overlay">
            <h2>System Overview</h2>
            <p>Monitor authentication workflows, user engagement, and platform stability in one place.</p>
          </div>
        </section>

        <section className="highlight-grid">
          {welcomeHighlights.map((item) => (
            <article className="highlight-card fade-in" key={item.title}>
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="highlight-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="card slide-up">
        <p className="eyebrow">Secure Access</p>
        <h1>Admin Login</h1>
        <p className="subtext">Use <strong>admin/admin</strong> to access the dashboard.</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, username: true }));
              setUsername((prev) => prev.trimStart());
            }}
            autoComplete="username"
            placeholder="Enter username"
            aria-invalid={touched.username && Boolean(usernameError)}
          />
          {touched.username && usernameError ? <p className="field-error">{usernameError}</p> : null}

          <label htmlFor="password">Password</label>
          <div className="password-wrap">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
              autoComplete="current-password"
              placeholder="Enter password"
              aria-invalid={touched.password && Boolean(passwordError)}
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M2 4.27 3.28 3 21 20.72 19.73 22l-2.84-2.84A11.55 11.55 0 0 1 12 20C6.55 20 2 16.36.5 12c.69-2 2.02-3.76 3.8-5.17L2 4.27Zm5.42 5.42A4.99 4.99 0 0 0 7 12a5 5 0 0 0 7.31 4.41l-1.57-1.56A3 3 0 0 1 9.15 11.3L7.42 9.69ZM12 4c5.45 0 10 3.64 11.5 8a12.5 12.5 0 0 1-4.34 5.67l-1.45-1.45A10.42 10.42 0 0 0 21.35 12C19.83 8.76 16.25 6 12 6c-1.5 0-2.93.35-4.2.97L6.33 5.5A12.04 12.04 0 0 1 12 4Z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M12 4c5.45 0 10 3.64 11.5 8-1.5 4.36-6.05 8-11.5 8S2 16.36.5 12C2 7.64 6.55 4 12 4Zm0 2c-4.25 0-7.83 2.76-9.35 6 1.52 3.24 5.1 6 9.35 6s7.83-2.76 9.35-6C19.83 8.76 16.25 6 12 6Zm0 2.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5Zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5Z" />
                </svg>
              )}
            </button>
          </div>
          {touched.password && passwordError ? <p className="field-error">{passwordError}</p> : null}

          {apiError ? <p className="error" aria-live="polite">{apiError}</p> : null}

          <button type="submit" className="btn" disabled={!canSubmit}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default App;
