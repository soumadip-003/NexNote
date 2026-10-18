
import { useState } from "react";
import "./AuthPage.css";

const AUTH_URL = "http://localhost:3100/api/auth";

function AuthPage({ mode, onBack, onAuthSuccess }) {
    const isSignup = mode === "signup";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (isSignup && !cleanName) {
            setError("Please enter your full name.");
            return;
        }

        if (!cleanEmail) {
            setError("Please enter your email address.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        setLoading(true);

        try {
            const endpoint = isSignup ? "signup" : "login";

            const response = await fetch(`${AUTH_URL}/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    isSignup
                        ? {
                              name: cleanName,
                              email: cleanEmail,
                              password,
                          }
                        : {
                              email: cleanEmail,
                              password,
                          }
                ),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    (isSignup
                        ? "Unable to create your account."
                        : "Invalid email or password.")
                );
            }

            if (!data.token || !data.user) {
                throw new Error(
                    "The server response is incomplete. Please check the backend authentication API."
                );
            }

            // Pass the authenticated user and token to App.jsx.
            onAuthSuccess(data);
        } catch (err) {
            if (err instanceof TypeError) {
                setError(
                    "Cannot connect to the server. Please make sure the NexNote backend is running on port 3000."
                );
            } else {
                setError(
                    err.message || "Something went wrong. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    function switchMode() {
        setError("");

        window.dispatchEvent(
            new CustomEvent("nexnote-auth-switch", {
                detail: isSignup ? "login" : "signup",
            })
        );
    }

    return (
        <main className="auth-page">
            <button
                type="button"
                className="auth-back-button"
                onClick={onBack}
                disabled={loading}
            >
                ← Back to home
            </button>

            <section className="auth-card">
                <a className="auth-brand" href="/">
                    <span>✦</span> NexNote
                    <span className="auth-brand-period">.</span>
                </a>

                <div className="auth-heading">
                    <h1>
                        {isSignup
                            ? "Create your account"
                            : "Welcome back"}
                    </h1>

                    <p>
                        {isSignup
                            ? "Start collecting your thoughts in one place."
                            : "Log in to continue to your personal space."}
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {isSignup && (
                        <label>
                            Full name
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                autoComplete="name"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                maxLength={100}
                                required
                                disabled={loading}
                            />
                        </label>
                    )}

                    <label>
                        Email address
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            maxLength={254}
                            required
                            disabled={loading}
                        />
                    </label>

                    <label>
                        Password
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            autoComplete={
                                isSignup
                                    ? "new-password"
                                    : "current-password"
                            }
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            minLength={8}
                            maxLength={128}
                            required
                            disabled={loading}
                        />
                    </label>

                    {error && (
                        <p
                            className="auth-error"
                            role="alert"
                            aria-live="polite"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="auth-submit-button"
                        disabled={loading}
                    >
                        <span>
                            {loading
                                ? "Please wait..."
                                : isSignup
                                  ? "Create Account"
                                  : "Log In"}
                        </span>

                        {!loading && <span aria-hidden="true">→</span>}
                    </button>
                </form>

                <p className="auth-switch-text">
                    {isSignup
                        ? "Already have an account?"
                        : "Don't have an account?"}{" "}

                    <button
                        type="button"
                        className="auth-switch-button"
                        onClick={switchMode}
                        disabled={loading}
                    >
                        {isSignup ? "Log In" : "Sign Up"}
                    </button>
                </p>

                <p className="auth-security-note">
                    ✦ Your personal space for ideas and notes.
                </p>
            </section>
        </main>
    );
}

export default AuthPage;
