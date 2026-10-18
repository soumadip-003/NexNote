
import { useEffect, useState } from "react";
import "./App.css";
import LandingPage from "./LandingPage";
import AuthPage from "./AuthPage";

const API_URL = "http://localhost:3100/api/notes";
const AUTH_URL = "http://localhost:3100/api/auth";

const sparkPrompts = [
  "💡 Think of an app idea that could make everyday life easier.",
  "🌱 What new skill would you like to learn in the next year, and why?",
  "✍️ Turn a small moment from your life into an interesting story.",
  "🚀 Describe a problem you wish someone would find a simple solution to.",
  "🎨 Describe your dream workspace and what makes it inspiring.",
  "🧠 What is something new you learned today that could help you in the future?",
  "📚 Write about the most important lesson you learned from your favorite book.",
  "✨ What is one thing you want to change about yourself in the next five years?",
  "🔍 What is a topic you would love to explore more deeply?",
  "🌍 What is one small thing you could do to make the world a better place?",
];

const translations = {
  en: {
    workspace: "Workspace",
    allNotes: "All notes",
    searchNotes: "Search notes",
    settings: "Settings",
    logout: "Log out",
    myWorkspace: "My workspace",
    personalSpace: "YOUR PERSONAL SPACE",
    thoughtsTitle: "Your thoughts,",
    thoughtsSubtitle: "A quiet place for everything on your mind.",
    ideaSpark: "Idea Spark",
    inspiration: "NEED A LITTLE INSPIRATION?",
    inspireMe: "Inspire me",
    useIdea: "Use this idea",
    inspiredIdea: "Inspired Idea",
    editNote: "Edit your note",
    captureThought: "Capture a thought",
    makeChanges: "Make a few changes and save.",
    dontLoseIdea: "Don't let a good idea slip away.",
    cancel: "Cancel",
    title: "TITLE",
    noteTitlePlaceholder: "Give your thought a name...",
    yourNote: "YOUR NOTE",
    noteContentPlaceholder: "Start writing here... what's on your mind?",
    characters: "characters",
    saving: "Saving...",
    saveChanges: "Save changes",
    saveNote: "Save note",
    ideaUniverse: "Idea Universe",
    exploreThinking: "EXPLORE YOUR THINKING",
    yourIdeaUniverse: "Your Idea Universe",
    connectedIdeas: "Explore your notes as a connected universe of ideas.",
    notes: "notes",
    universeWaiting: "Your universe is waiting. Create a note to get started!",
    emptyThought: "An empty thought...",
    openNote: "Open note",
    yourCollection: "YOUR COLLECTION",
    exportCSV: "Export CSV",
    findNote: "Find a note...",
    loadingNotes: "Loading your notes...",
    noMatchingNotes: "No matching notes",
    storyStarts: "Your story starts here",
    tryAnotherSearch: "Try another search term.",
    firstNote: "Every big idea begins somewhere. Write your first note above.",
    pinNote: "Pin note",
    unpinNote: "Unpin note",
    edit: "Edit",
    delete: "Delete",
    note: "NOTE",
    storedInSQLite: "Your notes are stored in your SQLite database.",
    madeForMind: "Made for your mind.",
    checkingSession: "Checking your session...",
    loginRequired: "Please log in to continue",
    signInToNotes: "Your notes are available after you sign in.",
    login: "Log in",
    personalize: "PERSONALIZE YOUR SPACE",
    manageSettings: "Manage your account, appearance and security.",
    appearance: "Appearance",
    appearanceDescription: "Choose how NexNote looks on your device.",
    theme: "THEME",
    dark: "Dark",
    light: "Light",
    system: "System",
    systemHelp: "System follows your device appearance preference.",
    fontSize: "FONT SIZE",
    small: "Small",
    medium: "Medium",
    large: "Large",
    account: "Account",
    accountDescription: "Update your personal account information.",
    fullName: "FULL NAME",
    email: "EMAIL",
    savingChanges: "Saving...",
    saveAccount: "Save account changes",
    language: "Language",
    languageDescription: "Choose the language used throughout the dashboard.",
    displayLanguage: "DISPLAY LANGUAGE",
    languageHelp: "This changes the dashboard language. Landing and authentication pages may have their own text.",
    security: "Security & Password",
    securityDescription: "Change your password securely.",
    currentPassword: "CURRENT PASSWORD",
    newPassword: "NEW PASSWORD",
    confirmPassword: "CONFIRM NEW PASSWORD",
    passwordHelp: "Use 8–128 characters.",
    updating: "Updating...",
    changePassword: "Change password",
    notesData: "Your notes data",
    exportDescription: "Export your notes to a CSV file.",
    exportNotes: "Export notes to CSV",
    dismiss: "Dismiss notification",
    noNotesExport: "No notes available to export.",
    exportSuccess: "Notes exported successfully!",
    nameValidation: "Name must be between 2 and 80 characters.",
    passwordValidation: "New password must be between 8 and 128 characters.",
    passwordMismatch: "The new passwords do not match.",
    passwordSame: "Choose a password different from your current password.",
    profileUpdated: "Account details updated.",
    passwordUpdated: "Password changed successfully.",
    sessionExpired: "Your session has expired. Please log in again.",
    sessionCheckFailed: "Could not verify your session. Please check that the backend is running.",
    loginFailed: "Login failed because the server response was incomplete.",
    enterTitle: "Please enter a note title.",
    noteUpdated: "Note updated successfully.",
    noteCreated: "Note created successfully.",
    noteDeleted: "Note deleted successfully.",
    confirmDelete: "Are you sure you want to delete this note?",
    saveFailed: "Could not save the note.",
    deleteFailed: "Could not delete the note.",
    loadFailed: "Could not load notes.",
    connectionFailed: "Could not connect to the server.",
    pinFailed: "Could not update pin status.",
    profileFailed: "Could not update your profile.",
    passwordFailed: "Could not change your password.",
    saveChangesButton: "Save changes",
    noSearchResults: "No notes match your search.",
    searchLabel: "Search notes",
    newIdea: "New idea",
  },

  bn: {
    workspace: "কর্মক্ষেত্র",
    allNotes: "সব নোট",
    searchNotes: "নোট খুঁজুন",
    settings: "সেটিংস",
    logout: "লগ আউট",
    myWorkspace: "আমার কর্মক্ষেত্র",
    personalSpace: "আপনার নিজস্ব জায়গা",
    thoughtsTitle: "আপনার ভাবনা,",
    thoughtsSubtitle: "আপনার মনের সব কথা রাখার একটি শান্ত জায়গা।",
    ideaSpark: "আইডিয়া স্পার্ক",
    inspiration: "একটু অনুপ্রেরণা দরকার?",
    inspireMe: "নতুন ভাবনা দিন",
    useIdea: "এই ভাবনাটি ব্যবহার করুন",
    inspiredIdea: "অনুপ্রাণিত ভাবনা",
    editNote: "নোট সম্পাদনা করুন",
    captureThought: "একটি ভাবনা লিখুন",
    makeChanges: "পরিবর্তন করে সংরক্ষণ করুন।",
    dontLoseIdea: "ভালো কোনো ভাবনা হারিয়ে যেতে দেবেন না।",
    cancel: "বাতিল",
    title: "শিরোনাম",
    noteTitlePlaceholder: "আপনার ভাবনার একটি নাম দিন...",
    yourNote: "আপনার নোট",
    noteContentPlaceholder: "এখানে লেখা শুরু করুন... কী ভাবছেন?",
    characters: "অক্ষর",
    saving: "সংরক্ষণ হচ্ছে...",
    saveChanges: "পরিবর্তন সংরক্ষণ",
    saveNote: "নোট সংরক্ষণ",
    ideaUniverse: "আইডিয়া ইউনিভার্স",
    exploreThinking: "আপনার ভাবনা আবিষ্কার করুন",
    yourIdeaUniverse: "আপনার ভাবনার জগৎ",
    connectedIdeas: "আপনার নোটগুলোকে একসঙ্গে যুক্ত ভাবনার জগৎ হিসেবে দেখুন।",
    notes: "টি নোট",
    universeWaiting: "আপনার ভাবনার জগৎ অপেক্ষায় আছে। শুরু করতে একটি নোট তৈরি করুন!",
    emptyThought: "একটি ফাঁকা ভাবনা...",
    openNote: "নোট খুলুন",
    yourCollection: "আপনার সংগ্রহ",
    exportCSV: "CSV এক্সপোর্ট",
    findNote: "নোট খুঁজুন...",
    loadingNotes: "আপনার নোট লোড হচ্ছে...",
    noMatchingNotes: "মিল থাকা কোনো নোট নেই",
    storyStarts: "আপনার গল্প এখানেই শুরু",
    tryAnotherSearch: "অন্য কোনো শব্দ দিয়ে খুঁজুন।",
    firstNote: "প্রতিটি বড় ভাবনার শুরু ছোট থেকে। উপরে আপনার প্রথম নোট লিখুন।",
    pinNote: "নোট পিন করুন",
    unpinNote: "নোট আনপিন করুন",
    edit: "সম্পাদনা",
    delete: "মুছে ফেলুন",
    note: "নোট",
    storedInSQLite: "আপনার নোট SQLite ডেটাবেসে সংরক্ষিত আছে।",
    madeForMind: "আপনার ভাবনার জন্য তৈরি।",
    checkingSession: "আপনার সেশন যাচাই হচ্ছে...",
    loginRequired: "চালিয়ে যেতে লগ ইন করুন",
    signInToNotes: "লগ ইন করার পরে আপনার নোট দেখতে পারবেন।",
    login: "লগ ইন",
    personalize: "নিজের মতো সাজান",
    manageSettings: "আপনার অ্যাকাউন্ট, চেহারা ও নিরাপত্তা নিয়ন্ত্রণ করুন।",
    appearance: "অ্যাপিয়ারেন্স",
    appearanceDescription: "আপনার ডিভাইসে NexNote-এর চেহারা নির্বাচন করুন।",
    theme: "থিম",
    dark: "ডার্ক",
    light: "লাইট",
    system: "সিস্টেম",
    systemHelp: "সিস্টেম নির্বাচন করলে ডিভাইসের থিম অনুসরণ করবে।",
    fontSize: "ফন্টের আকার",
    small: "ছোট",
    medium: "মাঝারি",
    large: "বড়",
    account: "অ্যাকাউন্ট",
    accountDescription: "আপনার ব্যক্তিগত অ্যাকাউন্টের তথ্য আপডেট করুন।",
    fullName: "পুরো নাম",
    email: "ইমেইল",
    savingChanges: "সংরক্ষণ হচ্ছে...",
    saveAccount: "অ্যাকাউন্টের পরিবর্তন সংরক্ষণ",
    language: "ভাষা",
    languageDescription: "পুরো ড্যাশবোর্ডের ভাষা নির্বাচন করুন।",
    displayLanguage: "প্রদর্শনের ভাষা",
    languageHelp: "এতে ড্যাশবোর্ডের ভাষা বদলাবে। ল্যান্ডিং ও লগইন পেজের লেখা আলাদা হতে পারে।",
    security: "নিরাপত্তা ও পাসওয়ার্ড",
    securityDescription: "নিরাপদে আপনার পাসওয়ার্ড পরিবর্তন করুন।",
    currentPassword: "বর্তমান পাসওয়ার্ড",
    newPassword: "নতুন পাসওয়ার্ড",
    confirmPassword: "নতুন পাসওয়ার্ড নিশ্চিত করুন",
    passwordHelp: "৮–১২৮ অক্ষরের মধ্যে রাখুন।",
    updating: "আপডেট হচ্ছে...",
    changePassword: "পাসওয়ার্ড পরিবর্তন",
    notesData: "আপনার নোটের ডেটা",
    exportDescription: "আপনার নোট CSV ফাইলে এক্সপোর্ট করুন।",
    exportNotes: "নোট CSV-তে এক্সপোর্ট করুন",
    dismiss: "বার্তা বন্ধ করুন",
    noNotesExport: "এক্সপোর্ট করার মতো কোনো নোট নেই।",
    exportSuccess: "নোট সফলভাবে এক্সপোর্ট হয়েছে!",
    nameValidation: "নাম ২ থেকে ৮০ অক্ষরের মধ্যে হতে হবে।",
    passwordValidation: "নতুন পাসওয়ার্ড ৮ থেকে ১২৮ অক্ষরের মধ্যে হতে হবে।",
    passwordMismatch: "নতুন পাসওয়ার্ড দুটি মেলেনি।",
    passwordSame: "বর্তমান পাসওয়ার্ডের থেকে আলাদা পাসওয়ার্ড দিন।",
    profileUpdated: "অ্যাকাউন্টের তথ্য আপডেট হয়েছে।",
    passwordUpdated: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।",
    sessionExpired: "আপনার সেশনের মেয়াদ শেষ হয়েছে। আবার লগ ইন করুন।",
    sessionCheckFailed: "সেশন যাচাই করা যায়নি। ব্যাকএন্ড চালু আছে কি না দেখুন।",
    loginFailed: "সার্ভারের উত্তর অসম্পূর্ণ হওয়ায় লগ ইন করা যায়নি।",
    enterTitle: "অনুগ্রহ করে নোটের শিরোনাম লিখুন।",
    noteUpdated: "নোট সফলভাবে আপডেট হয়েছে।",
    noteCreated: "নোট সফলভাবে তৈরি হয়েছে।",
    noteDeleted: "নোট সফলভাবে মুছে ফেলা হয়েছে।",
    confirmDelete: "আপনি কি নিশ্চিত যে এই নোটটি মুছে ফেলতে চান?",
    saveFailed: "নোট সংরক্ষণ করা যায়নি।",
    deleteFailed: "নোট মুছে ফেলা যায়নি।",
    loadFailed: "নোট লোড করা যায়নি।",
    connectionFailed: "সার্ভারের সঙ্গে সংযোগ করা যায়নি।",
    pinFailed: "নোটের পিন স্ট্যাটাস পরিবর্তন করা যায়নি।",
    profileFailed: "আপনার প্রোফাইল আপডেট করা যায়নি।",
    passwordFailed: "পাসওয়ার্ড পরিবর্তন করা যায়নি।",
    saveChangesButton: "পরিবর্তন সংরক্ষণ",
    noSearchResults: "আপনার অনুসন্ধানের সঙ্গে কোনো নোট মেলেনি।",
    searchLabel: "নোট খুঁজুন",
    newIdea: "নতুন ভাবনা",
  },
};

export default function App() {
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState("landing");
  const [authMode, setAuthMode] = useState("login");

  const [authToken, setAuthToken] = useState(
    () => localStorage.getItem("nexnote_token") || ""
  );
  const [authUser, setAuthUser] = useState(null);

  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [sparkIndex, setSparkIndex] = useState(0);
  const [isSparkOpen, setIsSparkOpen] = useState(false);
  const [isUniverseOpen, setIsUniverseOpen] = useState(false);
  const [activeView, setActiveView] = useState("notes");

  const [theme, setTheme] = useState(
    () => localStorage.getItem("nexnote_theme") || "dark"
  );

  const [systemTheme, setSystemTheme] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  const [fontSize, setFontSize] = useState(
    () => localStorage.getItem("nexnote_font_size") || "medium"
  );

  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("nexnote_language");
    return saved === "bn" ? "bn" : "en";
  });

  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);

  const t = (key) => translations[language]?.[key] ?? translations.en[key] ?? key;
  const bn = language === "bn";

  useEffect(() => {
    localStorage.setItem("nexnote_theme", theme);

    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = (event) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    setSystemTheme(mediaQuery.matches ? "dark" : "light");
    mediaQuery.addEventListener?.("change", updateSystemTheme);

    return () => {
      mediaQuery.removeEventListener?.("change", updateSystemTheme);
    };
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    localStorage.setItem("nexnote_font_size", fontSize);
    document.documentElement.dataset.fontSize = fontSize;
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("nexnote_language", language);
    document.documentElement.lang = language === "bn" ? "bn" : "en";
  }, [language]);

  useEffect(() => {
    if (authUser) {
      setProfileName(authUser.name || "");
      setProfileEmail(authUser.email || "");
    }
  }, [authUser]);

  function handleLogin() {
    setAuthMode("login");
    setError("");
    setNotice("");
    setCurrentPage("auth");
  }

  function handleSignup() {
    setAuthMode("signup");
    setError("");
    setNotice("");
    setCurrentPage("auth");
  }

  function handleAuthSuccess(data) {
    if (!data?.token || !data?.user) {
      setError(t("loginFailed"));
      return;
    }

    localStorage.setItem("nexnote_token", data.token);
    setAuthToken(data.token);
    setAuthUser(data.user);
    setNotes([]);
    setSearch("");
    setError("");
    setNotice("");
    setActiveView("notes");
    setCurrentPage("app");
  }

  async function handleLogout() {
    const token = authToken;

    try {
      if (token) {
        await fetch(`${AUTH_URL}/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      localStorage.removeItem("nexnote_token");
      setAuthToken("");
      setAuthUser(null);
      setNotes([]);
      setSearch("");
      setTitle("");
      setContent("");
      setEditingId(null);
      setError("");
      setNotice("");
      setLoading(false);
      setActiveView("notes");
      setCurrentPage("landing");
      setAuthMode("login");
    }
  }

  useEffect(() => {
    function handleAuthSwitch(event) {
      if (event.detail === "login" || event.detail === "signup") {
        setAuthMode(event.detail);
        setError("");
        setCurrentPage("auth");
      }
    }

    window.addEventListener("nexnote-auth-switch", handleAuthSwitch);

    return () => {
      window.removeEventListener("nexnote-auth-switch", handleAuthSwitch);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("nexnote_token");

    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function verifySession() {
      try {
        const response = await fetch(`${AUTH_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok || !data.success || !data.user) {
          throw new Error("SESSION_EXPIRED");
        }

        if (!cancelled) {
          setAuthToken(token);
          setAuthUser(data.user);
          setCurrentPage("app");
        }
      } catch (err) {
        if (!cancelled) {
          localStorage.removeItem("nexnote_token");
          setAuthToken("");
          setAuthUser(null);
          setNotes([]);
          setCurrentPage("landing");

          if (err.message !== "SESSION_EXPIRED") {
            setError(t("sessionCheckFailed"));
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    verifySession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function loadNotes(query = search) {
    if (!authToken) {
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}?search=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        await handleLogout();
        throw new Error(t("sessionExpired"));
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || t("loadFailed"));
      }

      setNotes(Array.isArray(data.notes) ? data.notes : []);
    } catch (err) {
      setError(err.message || t("connectionFailed"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentPage !== "app" || !authToken || activeView !== "notes") {
      return;
    }

    const timer = setTimeout(() => loadNotes(search), 250);
    return () => clearTimeout(timer);
  }, [search, currentPage, authToken, activeView]);

  function resetForm() {
    setTitle("");
    setContent("");
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      setError(t("enterTitle"));
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title: title.trim(),
            content,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        await handleLogout();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || t("saveFailed"));
      }

      const wasEditing = editingId !== null;
      resetForm();
      setNotice(wasEditing ? t("noteUpdated") : t("noteCreated"));
      await loadNotes(search);
    } catch (err) {
      setError(err.message || t("saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  function startEditing(note) {
    setActiveView("notes");
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content || "");
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteNote(id) {
    if (!window.confirm(t("confirmDelete"))) return;

    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await response.json();

      if (response.status === 401) {
        await handleLogout();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || t("deleteFailed"));
      }

      if (editingId === id) resetForm();
      setNotice(t("noteDeleted"));
      await loadNotes(search);
    } catch (err) {
      setError(err.message || t("deleteFailed"));
    }
  }

  async function togglePin(note) {
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/${note.id}/pin`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await response.json();

      if (response.status === 401) {
        await handleLogout();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || t("pinFailed"));
      }

      setNotice(data.message || (bn ? "পিন স্ট্যাটাস আপডেট হয়েছে।" : "Pin status updated."));
      await loadNotes(search);
    } catch (err) {
      setError(err.message || t("pinFailed"));
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(`${dateString.replace(" ", "T")}Z`);
    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString(language === "bn" ? "bn-BD" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function exportNotesToCSV() {
    if (notes.length === 0) {
      setError(t("noNotesExport"));
      return;
    }

    const headers = ["ID", "Title", "Content", "Created At", "Updated At"];

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = notes.map((note) => [
      note.id,
      note.title,
      note.content,
      note.created_at,
      note.updated_at,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "nexnote-notes.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setError("");
    setNotice(t("exportSuccess"));
  }

  async function saveProfile(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (profileName.trim().length < 2 || profileName.trim().length > 80) {
      setError(t("nameValidation"));
      return;
    }

    setProfileSaving(true);

    try {
      const response = await fetch(`${AUTH_URL}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: profileName.trim(),
          email: profileEmail.trim(),
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        await handleLogout();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || t("profileFailed"));
      }

      setAuthUser(data.user);
      setProfileName(data.user.name);
      setProfileEmail(data.user.email);
      setNotice(t("profileUpdated"));
    } catch (err) {
      setError(err.message || t("profileFailed"));
    } finally {
      setProfileSaving(false);
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (newPassword.length < 8 || newPassword.length > 128) {
      setError(t("passwordValidation"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    if (currentPassword === newPassword) {
      setError(t("passwordSame"));
      return;
    }

    setPasswordSaving(true);

    try {
      const response = await fetch(`${AUTH_URL}/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.status === 401) {
        await handleLogout();
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || t("passwordFailed"));
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setNotice(t("passwordUpdated"));
    } catch (err) {
      setError(err.message || t("passwordFailed"));
    } finally {
      setPasswordSaving(false);
    }
  }

  if (currentPage === "landing") {
    if (loading && authToken) {
      return (
        <div className="app-shell">
          <div className="session-loading">
            <div className="loading-spinner" />
            <p>{t("checkingSession")}</p>
          </div>
        </div>
      );
    }

    return <LandingPage onLogin={handleLogin} onSignup={handleSignup} />;
  }

  if (currentPage === "auth") {
    return (
      <AuthPage
        mode={authMode}
        onBack={() => {
          setError("");
          setCurrentPage("landing");
        }}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  if (!authToken) {
    return (
      <div className="app-shell">
        <main className="main-content">
          <section className="page-content">
            <div className="empty-state">
              <h2>{t("loginRequired")}</h2>
              <p>{t("signInToNotes")}</p>
              <button
                type="button"
                className="primary-button"
                onClick={handleLogin}
              >
                {t("login")}
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className={`app-shell theme-${resolvedTheme} font-${fontSize}`}>
      <aside className="sidebar">
        <a
          className="brand"
          href="#home"
          onClick={() => setActiveView("notes")}
        >
          <span className="brand-icon">N</span>
          <span>
            Nex<span className="brand-light">Note</span>
          </span>
        </a>

        <div className="sidebar-label">{t("workspace").toUpperCase()}</div>

        <button
          type="button"
          className={`nav-item ${activeView === "notes" ? "active" : ""}`}
          onClick={() => setActiveView("notes")}
        >
          <span>▤</span> {t("allNotes")}
          <span className="nav-count">{notes.length}</span>
        </button>

        <button
          type="button"
          className="nav-item sidebar-search-button"
          onClick={() => {
            setActiveView("notes");
            setTimeout(() => document.getElementById("note-search")?.focus(), 0);
          }}
        >
          <span>⌕</span> {t("searchNotes")}
        </button>

        <button
          type="button"
          className={`nav-item ${activeView === "settings" ? "active" : ""}`}
          onClick={() => {
            setActiveView("settings");
            setError("");
            setNotice("");
          }}
        >
          <span>⚙</span> {t("settings")}
        </button>

        <div className="sidebar-bottom">
          <div className="sidebar-tip-icon">✦</div>
          <strong>
            {bn ? "আপনার ভাবনা, গুছিয়ে রাখুন।" : "Your mind, organized."}
          </strong>
          <p>
            {bn
              ? "আপনার ভাবনাগুলো নিরাপদে রাখুন এবং প্রয়োজনের সময় খুঁজে নিন।"
              : "Keep your ideas safe and find them whenever inspiration strikes."}
          </p>
          <div className="version-label">NEXNOTE · PERSONAL SPACE</div>
        </div>
      </aside>

      <main className="main-content" id="home">
        <header className="topbar">
          <div className="breadcrumb">
            {t("workspace")} <span>/</span>{" "}
            {activeView === "settings" ? t("settings") : t("allNotes")}
          </div>

          <div className="topbar-status">
            <span className="status-dot" />
            {authUser?.name || t("myWorkspace")}
            <button
              type="button"
              className="spark-use-button"
              onClick={handleLogout}
            >
              {t("logout")}
            </button>
          </div>
        </header>

        <section className="page-content">
          {(error || notice) && (
            <div
              className={`message ${error ? "message-error" : "message-success"}`}
              role="status"
            >
              <span>{error ? "!" : "✓"}</span>
              {error || notice}
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setNotice("");
                }}
                aria-label={t("dismiss")}
                title={t("dismiss")}
              >
                ×
              </button>
            </div>
          )}

          {activeView === "settings" ? (
            <>
              <div className="welcome-row">
                <div>
                  <div className="eyebrow">{t("personalize").toUpperCase()}</div>
                  <h1>
                    {t("settings")}
                    <span className="title-period">.</span>
                  </h1>
                  <p className="page-subtitle">{t("manageSettings")}</p>
                </div>
              </div>

              <section className="settings-card">
                <div className="settings-card-heading">
                  <span className="settings-icon">◐</span>
                  <div>
                    <h2>{t("appearance")}</h2>
                    <p>{t("appearanceDescription")}</p>
                  </div>
                </div>

                <div className="settings-field">
                  <label htmlFor="theme-choice">{t("theme")}</label>
                  <select
                    id="theme-choice"
                    value={theme}
                    onChange={(event) => setTheme(event.target.value)}
                  >
                    <option value="dark">{t("dark")}</option>
                    <option value="light">{t("light")}</option>
                    <option value="system">{t("system")}</option>
                  </select>
                  <p className="settings-help">{t("systemHelp")}</p>
                </div>

                <div className="settings-field">
                  <label htmlFor="font-choice">{t("fontSize")}</label>
                  <select
                    id="font-choice"
                    value={fontSize}
                    onChange={(event) => setFontSize(event.target.value)}
                  >
                    <option value="small">{t("small")}</option>
                    <option value="medium">{t("medium")}</option>
                    <option value="large">{t("large")}</option>
                  </select>
                </div>
              </section>

              <section className="settings-card">
                <div className="settings-card-heading">
                  <span className="settings-icon">◎</span>
                  <div>
                    <h2>{t("account")}</h2>
                    <p>{t("accountDescription")}</p>
                  </div>
                </div>

                <form onSubmit={saveProfile} className="settings-form">
                  <div className="settings-field">
                    <label htmlFor="profile-name">{t("fullName")}</label>
                    <input
                      id="profile-name"
                      value={profileName}
                      onChange={(event) => setProfileName(event.target.value)}
                      minLength={2}
                      maxLength={80}
                      required
                    />
                  </div>

                  <div className="settings-field">
                    <label htmlFor="profile-email">{t("email")}</label>
                    <input
                      id="profile-email"
                      type="email"
                      value={profileEmail}
                      onChange={(event) => setProfileEmail(event.target.value)}
                      maxLength={254}
                      required
                    />
                  </div>

                  <button
                    className="primary-button"
                    type="submit"
                    disabled={profileSaving}
                  >
                    {profileSaving ? t("savingChanges") : t("saveAccount")}
                  </button>
                </form>
              </section>

              <section className="settings-card">
                <div className="settings-card-heading">
                  <span className="settings-icon">文</span>
                  <div>
                    <h2>{t("language")}</h2>
                    <p>{t("languageDescription")}</p>
                  </div>
                </div>

                <div className="settings-field">
                  <label htmlFor="language-choice">{t("displayLanguage")}</label>
                  <select
                    id="language-choice"
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="bn">বাংলা</option>
                  </select>
                  <p className="settings-help">{t("languageHelp")}</p>
                </div>
              </section>

              <section className="settings-card">
                <div className="settings-card-heading">
                  <span className="settings-icon">♙</span>
                  <div>
                    <h2>{t("security")}</h2>
                    <p>{t("securityDescription")}</p>
                  </div>
                </div>

                <form onSubmit={changePassword} className="settings-form">
                  <div className="settings-field">
                    <label htmlFor="current-password">{t("currentPassword")}</label>
                    <input
                      id="current-password"
                      type="password"
                      autoComplete="current-password"
                      value={currentPassword}
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      minLength={8}
                      maxLength={128}
                      required
                    />
                  </div>

                  <div className="settings-field">
                    <label htmlFor="new-password">{t("newPassword")}</label>
                    <input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      minLength={8}
                      maxLength={128}
                      required
                    />
                    <p className="settings-help">{t("passwordHelp")}</p>
                  </div>

                  <div className="settings-field">
                    <label htmlFor="confirm-password">
                      {t("confirmPassword")}
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      minLength={8}
                      maxLength={128}
                      required
                    />
                  </div>

                  <button
                    className="primary-button"
                    type="submit"
                    disabled={passwordSaving}
                  >
                    {passwordSaving ? t("updating") : t("changePassword")}
                  </button>
                </form>
              </section>

              <section className="settings-card">
                <div className="settings-card-heading">
                  <span className="settings-icon">⇩</span>
                  <div>
                    <h2>{t("notesData")}</h2>
                    <p>{t("exportDescription")}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="primary-button"
                  onClick={exportNotesToCSV}
                >
                  {t("exportNotes")} ↓
                </button>
              </section>
            </>
          ) : (
            <>
              <div className="welcome-row">
                <div>
                  <div className="eyebrow">{t("personalSpace").toUpperCase()}</div>
                  <h1>
                    {t("thoughtsTitle")}
                    <br className="mobile-break" />{" "}
                    {bn ? "এক ধাপ এগিয়ে" : "one step ahead"}
                    <span className="title-period">.</span>
                  </h1>
                  <p className="page-subtitle">{t("thoughtsSubtitle")}</p>
                </div>

                <button
                  type="button"
                  className="date-chip spark-toggle-button"
                  onClick={() => setIsSparkOpen((previous) => !previous)}
                  aria-expanded={isSparkOpen}
                >
                  <span>✦</span> {t("ideaSpark")}{" "}
                  <span>{isSparkOpen ? "−" : "+"}</span>
                </button>
              </div>

              {isSparkOpen && (
                <section className="spark-card">
                  <div className="spark-icon">✦</div>
                  <div className="spark-content">
                    <div className="eyebrow">{t("inspiration").toUpperCase()}</div>
                    <h2>{t("ideaSpark")}</h2>
                    <p className="spark-prompt">
                      {sparkPrompts[sparkIndex]}
                    </p>
                    <div className="spark-actions">
                      <button
                        type="button"
                        className="primary-button"
                        onClick={() =>
                          setSparkIndex((index) => (index + 1) % sparkPrompts.length)
                        }
                      >
                        {t("inspireMe")} ↻
                      </button>

                      <button
                        type="button"
                        className="spark-use-button"
                        onClick={() => {
                          setTitle(t("inspiredIdea"));
                          setContent(sparkPrompts[sparkIndex].replace(/^[^\w]+/, ""));
                          document.getElementById("note-title")?.focus();
                        }}
                      >
                        {t("useIdea")} ✎
                      </button>
                    </div>
                  </div>
                </section>
              )}

              <section className="editor-panel">
                <div className="editor-heading">
                  <div className="editor-symbol">{editingId ? "✎" : "+"}</div>
                  <div>
                    <h2>{editingId ? t("editNote") : t("captureThought")}</h2>
                    <p>{editingId ? t("makeChanges") : t("dontLoseIdea")}</p>
                  </div>

                  {editingId && (
                    <button
                      className="cancel-edit"
                      type="button"
                      onClick={resetForm}
                    >
                      {t("cancel")}
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit}>
                  <label htmlFor="note-title">{t("title")}</label>
                  <input
                    id="note-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder={t("noteTitlePlaceholder")}
                    maxLength={200}
                    required
                  />

                  <label htmlFor="note-content">{t("yourNote")}</label>
                  <textarea
                    id="note-content"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    placeholder={t("noteContentPlaceholder")}
                    maxLength={50000}
                    rows={4}
                  />

                  <div className="editor-footer">
                    <span className="character-count">
                      {content.length.toLocaleString(language === "bn" ? "bn-BD" : "en-US")} / 50,000 {t("characters")}
                    </span>
                    <button
                      className="primary-button"
                      type="submit"
                      disabled={saving}
                    >
                      {saving
                        ? t("saving")
                        : editingId
                          ? `${t("saveChanges")} →`
                          : `${t("saveNote")} →`}
                    </button>
                  </div>
                </form>
              </section>

              <div className="universe-toggle-row">
                <button
                  type="button"
                  className="universe-toggle-button"
                  onClick={() => setIsUniverseOpen((previous) => !previous)}
                  aria-expanded={isUniverseOpen}
                >
                  <span>🪐</span>
                  <span>{t("ideaUniverse")}</span>
                  <span className="universe-toggle-icon">
                    {isUniverseOpen ? "−" : "+"}
                  </span>
                </button>
              </div>

              {isUniverseOpen && (
                <section className="universe-panel">
                  <div className="universe-heading">
                    <div>
                      <div className="eyebrow">{t("exploreThinking").toUpperCase()}</div>
                      <h2>
                        {t("yourIdeaUniverse")} ✦
                      </h2>
                      <p>{t("connectedIdeas")}</p>
                    </div>
                    <span className="universe-count">
                      {notes.length} {t("notes")}
                    </span>
                  </div>

                  {notes.length === 0 ? (
                    <div className="universe-empty">
                      <span>🌌</span>
                      <p>{t("universeWaiting")}</p>
                    </div>
                  ) : (
                    <div className="universe-grid">
                      {notes.map((note, index) => (
                        <button
                          type="button"
                          className={`universe-node universe-node-${index % 4}`}
                          key={note.id}
                          onClick={() => startEditing(note)}
                        >
                          <span className="universe-node-icon">
                            {note.pinned ? "📌" : "✦"}
                          </span>
                          <strong>{note.title}</strong>
                          <span className="universe-node-preview">
                            {note.content || t("emptyThought")}
                          </span>
                          <span className="universe-node-link">
                            {t("openNote")} ↗
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              )}

              <section className="notes-section">
                <div className="notes-heading">
                  <div>
                    <div className="eyebrow">{t("yourCollection").toUpperCase()}</div>
                    <h2>
                      {t("allNotes")}{" "}
                      <span className="heading-count">{notes.length}</span>
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={exportNotesToCSV}
                    disabled={loading || notes.length === 0}
                  >
                    {t("exportCSV")} ↓
                  </button>

                  <label className="search-box">
                    <span>⌕</span>
                    <input
                      type="search"
                      id="note-search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder={t("findNote")}
                      aria-label={t("searchLabel")}
                    />
                    <kbd>⌕</kbd>
                  </label>
                </div>

                {loading ? (
                  <div className="empty-state">
                    <div className="loading-spinner" />
                    <p>{t("loadingNotes")}</p>
                  </div>
                ) : notes.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">{search ? "⌕" : "✎"}</div>
                    <h3>
                      {search ? t("noMatchingNotes") : t("storyStarts")}
                    </h3>
                    <p>
                      {search ? t("tryAnotherSearch") : t("firstNote")}
                    </p>
                  </div>
                ) : (
                  <div className="notes-grid">
                    {notes.map((note, index) => (
                      <article
                        className={`note-card note-accent-${index % 4}`}
                        key={note.id}
                      >
                        <div className="note-card-top">
                          <span className="note-type">
                            {t("note").toUpperCase()} ·{" "}
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <div className="note-actions">
                            <button
                              type="button"
                              onClick={() => togglePin(note)}
                              aria-label={note.pinned ? t("unpinNote") : t("pinNote")}
                              title={note.pinned ? t("unpinNote") : t("pinNote")}
                            >
                              {note.pinned ? "📌" : "📍"}
                            </button>

                            <button
                              type="button"
                              onClick={() => startEditing(note)}
                              aria-label={`${t("edit")} ${note.title}`}
                              title={t("edit")}
                            >
                              ✎
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteNote(note.id)}
                              aria-label={`${t("delete")} ${note.title}`}
                              title={t("delete")}
                            >
                              ×
                            </button>
                          </div>
                        </div>

                        <h3>{note.title}</h3>
                        <p className="note-preview">
                          {note.content || t("emptyThought")}
                        </p>

                        <div className="note-card-footer">
                          <span className="note-date">
                            ◷ {formatDate(note.updated_at)}
                          </span>
                          <button
                            className="edit-link"
                            type="button"
                            onClick={() => startEditing(note)}
                          >
                            {t("openNote")} <span>↗</span>
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <footer className="app-footer">
                <span>
                  <span className="footer-dot" /> {t("storedInSQLite")}
                </span>
                <span>{t("madeForMind")} ✦</span>
              </footer>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
