import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api.js';
// import './login.css';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPTY_FORM = { email: '', password: '' };

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Wipe everything if the browser restores this page from its back/forward cache
  useEffect(() => {
    const reset = (e) => {
      if (e.persisted) {
        setForm(EMPTY_FORM);
        setErrors({});
        setShowPw(false);
        setServerError('');
      }
    };
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setServerError('');

    const email = form.email.trim();
    const nextErrors = {};
    if (!EMAIL_RE.test(email)) nextErrors.email = 'Enter a valid email address.';
    if (!form.password) nextErrors.password = 'Password is required.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payload = { email, password: form.password };
    setForm((prev) => ({ ...prev, password: '' })); // password leaves memory right away
    setShowPw(false);
    setLoading(true);

    try {
      await loginUser(payload);
      setForm(EMPTY_FORM);
      navigate('/dashboard', { replace: true }); // Back can't return to the login form
    } catch (err) {
      setServerError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="card" aria-labelledby="login-title">
        <h1 id="login-title">Log in</h1>
        <p className="sub">Welcome back! Please sign in to continue.</p>

        {serverError && <div className="alert" role="alert">{serverError}</div>}

        {/* Social login is parked until the local flow is finished.
        <a className="google" href={`${API_URL}/api/auth/google`}>...</a>
        <div className="divider"><span>or continue with email</span></div>
        */}

        <form onSubmit={onSubmit} noValidate autoComplete="off">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="off"
            value={form.email}
            onChange={onChange}
            className={errors.email ? 'bad' : ''}
          />
          {errors.email && <small className="err">{errors.email}</small>}

          <label htmlFor="password">Password</label>
          <div className="pw">
            <input
              id="password"
              name="password"
              type={showPw ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.password}
              onChange={onChange}
              className={errors.password ? 'bad' : ''}
            />
            <button type="button" className="eye" onClick={() => setShowPw((prev) => !prev)}>
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>
          {errors.password && <small className="err">{errors.password}</small>}

          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Log in'}
          </button>
        </form>

        <p className="switch">New here? <Link to="/signup">Create an account</Link></p>
        {/* <p className="switch small"><Link to="/forgot-password">Forgot password?</Link></p> */}
      </section>

      <aside className="brand">
        <div className="logo">TeamFlow</div>
        <h2>
          Welcome back <span>to your workflow.</span>
        </h2>
        <p>
          Keep your tasks moving, your team aligned, and your projects on schedule with one clean workspace.
        </p>

        <div className="board" aria-hidden="true">
          <div className="col">
            <h4>Today</h4>
            <div className="task"><i className="tag feat" />Review sprint notes</div>
            <div className="task"><i className="tag bug" />Fix onboarding issue</div>
          </div>
          <div className="col">
            <h4>In progress</h4>
            <div className="task float"><i className="tag feat" />Launch login flow</div>
            <div className="task ai"><i className="tag ai" />AI summary ready</div>
          </div>
          <div className="col">
            <h4>Done</h4>
            <div className="task done"><i className="tag ok" />Team sync</div>
            <div className="task done"><i className="tag ok" />Weekly report</div>
          </div>
        </div>
      </aside>
    </main>
  );
}