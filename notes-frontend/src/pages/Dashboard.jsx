import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [trashNotes, setTrashNotes] = useState([]);
  const [viewingTrash, setViewingTrash] = useState(false);

  // --- Create Form State ---
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");

  // --- Modal Update Form State ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editTags, setEditTags] = useState("");

  // --- Notification Toast State ---
  const [notification, setNotification] = useState({ message: "", type: "" });

  const showToast = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 4000);
  };

  const getUserEmail = () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return "meenu@gmail.com";
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload).sub || "meenu@gmail.com";
    } catch (e) {
      return "meenu@gmail.com";
    }
  };

  // Search states
  const [searchTitle, setSearchTitle] = useState("");
  const [searchTag, setSearchTag] = useState("");

  // Fetch All Active Notes
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await API.get("/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
      }
    }
};

  // Fetch Trashed Notes
  const fetchTrashNotes = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await API.get("/notes/trash", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrashNotes(response.data);
    } catch (error) {
      console.error("Error fetching trash:", error);
    }
  };

  // Search effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (viewingTrash) return;
      if (searchTitle.trim() !== "") {
        searchByTitle(searchTitle);
      } else if (searchTag.trim() !== "") {
        searchByTag(searchTag);
      } else {
        fetchNotes();
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTitle, searchTag, viewingTrash]);

  const searchByTitle = async (query) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await API.get(`/notes/search/title?title=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const searchByTag = async (query) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await API.get(`/notes/search/tag?tag=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Create Active Note Action
  const createNote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      await API.post(
        "/notes",
        { title, body, tags },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("📥 Note created successfully!", "success");
      setTitle("");
      setBody("");
      setTags("");
      fetchNotes();
    } catch (error) {
      console.error(error);
      showToast("❌ Something went wrong creating the note.", "error");
    }
  };

  // Open Edit Box Overlay
  const openEditModal = (note) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditBody(note.body);
    setEditTags(note.tags || "");
    setIsEditModalOpen(true);
  };

  // Submit Update Box Request Only
  const handleUpdateNote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      await API.put(
        `/notes/${editingId}`,
        { title: editTitle, body: editBody, tags: editTags },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("✨ Note updated successfully!", "info");
      setIsEditModalOpen(false); // Close box overlay
      setEditingId(null);
      fetchNotes();
    } catch (error) {
      console.error(error);
      showToast("❌ Error updating note.", "error");
    }
  };

  // Move Note to Trash
  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await API.delete(`/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("♻️ Note successfully moved to trash Bin.");
      fetchNotes();
    } catch (error) {
      console.error(error);
    }
  };

  // Restore Note
  const restoreNote = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await API.put(`/notes/restore/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("🔄 Note completely restored to Active Notes!", "success");
      fetchTrashNotes();
      fetchNotes();
    } catch (error) {
      console.error(error);
    }
  };

  // Permanent Delete
  const permanentDeleteNote = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this note? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("accessToken");
        const email = getUserEmail();
        await API.delete(`/notes/permanent/${id}?email=${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showToast("💥 Note has been permanently erased.", "error");
        fetchTrashNotes();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  };

  useEffect(() => {
    fetchNotes();
    fetchTrashNotes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Notes Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Status Alerts */}
        {notification.message && (
          <div
            className={`mb-6 p-4 rounded-xl font-medium shadow-md border ${
              notification.type === "error"
                ? "bg-rose-950/40 text-rose-300 border-rose-800"
                : notification.type === "info"
                ? "bg-yellow-950/40 text-yellow-300 border-yellow-800"
                : "bg-emerald-950/40 text-emerald-300 border-emerald-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{notification.message}</span>
              <button
                onClick={() => setNotification({ message: "", type: "" })}
                className="text-xs opacity-60 hover:opacity-100"
              >
                ✕ Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Note Form Section (Always handles standard creations now) */}
        {!viewingTrash && (
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Create Note</h2>
            <form onSubmit={createNote}>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                required
              />
              <textarea
                placeholder="Body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                rows="4"
                required
              />
              <input
                type="text"
                placeholder="Tags (comma separated e.g. java,react,spring)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <button
                type="submit"
                className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Create Note
              </button>
            </form>
          </div>
        )}

        {/* Sub Navigation Bar - Search Filters & Trash Toggles */}
        <div className="bg-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 mb-8 shadow-md">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="🔍 Search By Title..."
              value={searchTitle}
              disabled={viewingTrash}
              onChange={(e) => {
                setSearchTag("");
                setSearchTitle(e.target.value);
              }}
              className="p-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none text-sm placeholder-gray-400 w-full sm:w-56 disabled:opacity-50"
            />
            <input
              type="text"
              placeholder="🔍 Search By Tag..."
              value={searchTag}
              disabled={viewingTrash}
              onChange={(e) => {
                setSearchTitle("");
                setSearchTag(e.target.value);
              }}
              className="p-2 rounded-lg bg-slate-700 border border-slate-600 focus:outline-none text-sm placeholder-gray-400 w-full sm:w-56 disabled:opacity-50"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700 w-full sm:w-auto justify-center">
            <button
              onClick={() => {
                setViewingTrash(false);
                fetchNotes();
              }}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${
                !viewingTrash ? "bg-blue-500 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Active Notes ({notes.length})
            </button>
            <button
              onClick={() => {
                setViewingTrash(true);
                fetchTrashNotes();
              }}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${
                viewingTrash ? "bg-red-500 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              ♻️ Trash Page ({trashNotes.length})
            </button>
          </div>
        </div>

        {/* Dynamic List Section Title */}
        <h2 className="text-2xl font-semibold mb-4 text-slate-100">
          {viewingTrash ? "Deleted items (Trash Bin)" : "My Notes"}
        </h2>

        {/* Content Lists */}
        {!viewingTrash ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.length === 0 ? (
              <p className="text-slate-400 col-span-full py-4 text-center">No active notes found.</p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-slate-800 p-5 rounded-xl shadow-lg hover:scale-105 transition duration-300 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold text-blue-400 mb-2 truncate">{note.title}</h3>
                    <p className="mb-3 text-slate-300 whitespace-pre-wrap break-words line-clamp-4">{note.body}</p>
                  </div>
                  <div>
                    {note.tags && (
                      <p className="text-xs bg-slate-700 inline-block px-3 py-1 rounded-full text-cyan-300 mb-4">{note.tags}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(note)}
                        className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 text-sm font-medium text-slate-900 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="bg-red-500 hover:bg-red-600 px-3 py-1 text-sm font-medium rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trashNotes.length === 0 ? (
              <p className="text-slate-400 col-span-full py-4 text-center">Your Trash Bin is clean!</p>
            ) : (
              trashNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-slate-800 p-5 rounded-xl border border-red-900/30 shadow-lg flex flex-col justify-between opacity-85"
                >
                  <div>
                    <h3 className="text-xl font-bold text-slate-400 mb-2 line-through truncate">{note.title}</h3>
                    <p className="mb-3 text-slate-400 line-clamp-3">{note.body}</p>
                  </div>
                  <div>
                    {note.tags && (
                      <p className="text-xs bg-slate-700 inline-block px-3 py-1 rounded-full text-slate-400 mb-4">{note.tags}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => restoreNote(note.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm font-medium rounded transition flex items-center gap-1"
                      >
                        🔄 Restore
                      </button>
                      <button
                        onClick={() => permanentDeleteNote(note.id)}
                        className="bg-rose-700 hover:bg-rose-800 text-white px-3 py-1 text-sm font-medium rounded transition flex items-center gap-1"
                      >
                        ❌ Permanent Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* --- SMALL BOX POPUP TYPE (Inline Edit Modal Overlaid Backdrop) --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-2xl w-full max-w-md relative scale-100 transition-all">
            
            {/* Close Cross Header Accent */}
            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
              <h3 className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
                📝 Quick Edit Note
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white transition text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Box Form */}
            <form onSubmit={handleUpdateNote}>
              <div className="mb-3">
                <label className="block text-xs text-slate-400 mb-1 font-medium">Note Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-xs text-slate-400 mb-1 font-medium">Note Body Description</label>
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                  rows="4"
                  required
                />
              </div>

              <div className="mb-5">
                <label className="block text-xs text-slate-400 mb-1 font-medium">Associated Search Tags</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                />
              </div>

              {/* Box Trigger Action Row */}
              <div className="flex justify-end gap-2 border-t border-slate-700 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-semibold rounded-lg transition shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;