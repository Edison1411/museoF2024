import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function Admin() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [newArticle, setNewArticle] = useState({
    title: '',
    description: '',
    imageUrl: '',
    details: '',
  });

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    } else if (user.role !== 'ADMIN') {
      router.replace('/unauthorized');
    } else {
      fetchArticles();
    }
  }, [user, router]);

  useEffect(() => {
    const handleThemeChange = () => {
      setDarkMode(document.body.classList.contains('dark-mode'));
    };

    window.addEventListener('themeChange', handleThemeChange);

    return () => {
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/catalogue');
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (error) {
      setArticles([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle((prevArticle) => ({
      ...prevArticle,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setNewArticle((prevArticle) => ({
        ...prevArticle,
        imageUrl,
      }));
    }
  };

  const validateArticle = (article) => {
    const { title, description, imageUrl, details } = article;
    return title && description && imageUrl && details;
  };

  const addArticle = async () => {
    if (!validateArticle(newArticle)) {
      alert("Please fill in all the fields.");
      return;
    }

    const res = await fetch('/api/catalogue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newArticle),
    });
    const createdArticle = await res.json();
    setArticles([...articles, createdArticle]);
    setIsModalOpen(false);
    resetNewArticle();
  };

  const resetNewArticle = () => {
    setNewArticle({
      title: '',
      description: '',
      imageUrl: '',
      details: '',
    });
  };

  const editArticle = (article) => {
    setCurrentArticle(article);
    setNewArticle(article);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const updateArticle = async () => {
    if (!validateArticle(newArticle)) {
      alert("Please fill in all the fields.");
      return;
    }

    const res = await fetch(`/api/catalogue/${currentArticle.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newArticle),
    });
    const updatedArticleFromServer = await res.json();
    setArticles(articles.map((a) => (a.id === currentArticle.id ? updatedArticleFromServer : a)));
    setIsModalOpen(false);
    resetNewArticle();
    setCurrentArticle(null);
  };

  const removeArticle = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    await fetch(`/api/catalogue/${id}`, { method: 'DELETE' });
    setArticles(articles.filter((a) => a.id !== id));
  };

  if (!user) return <div>Loading...</div>;
  if (user.role !== 'ADMIN') return <div>Unauthorized access</div>;

  return (
    <div>
      <Navbar />
      <div className={`admin-page ${darkMode ? 'dark-mode' : ''}`}>
        <div className="admin-container">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p>Welcome, {user.name}!</p>
          <button className="logout-button" onClick={logout}>Logout</button>

          <h2>Articles</h2>
          <button className="add-button" onClick={() => { setEditMode(false); setIsModalOpen(true); }}>Add New Article</button>

          <ul className="article-list">
            {articles.length > 0 ? (
              articles.map((article) => (
                <li key={article.id} className="article-item">
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <img src={article.imageUrl} alt={article.title} className="article-image" />
                  <p><strong>Details:</strong> {article.details}</p>
                  <div className="article-actions">
                    <button className="edit-button" onClick={() => editArticle(article)}>Edit</button>
                    <button className="delete-button" onClick={() => removeArticle(article.id)}>Delete</button>
                  </div>
                </li>
              ))
            ) : (
              <p>No articles available.</p>
            )}
          </ul>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editMode ? 'Edit Article' : 'Add New Article'}</h2>
            <label>
              Title:
              <input type="text" name="title" value={newArticle.title} onChange={handleInputChange} />
            </label>
            <label>
              Description:
              <input type="text" name="description" value={newArticle.description} onChange={handleInputChange} />
            </label>
            <label>
              Principal Image:
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
            <label>
              Details:
              <input type="text" name="details" value={newArticle.details} onChange={handleInputChange} />
            </label>
            <button className="confirm-button" onClick={editMode ? updateArticle : addArticle}>{editMode ? 'Update Article' : 'Add Article'}</button>
            <button className="cancel-button" onClick={() => { setIsModalOpen(false); setEditMode(false); setCurrentArticle(null); }}>Cancel</button>
          </div>
        </div>
      )}
      <Footer />
      <style jsx>{`
        .admin-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f0f4f8;
          transition: background-color 0.3s ease;
        }

        .admin-container {
          background: #ffffff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-width: 900px;
          width: 100%;
          text-align: center;
        }

        .admin-title {
          font-size: 2rem;
          color: #333;
          margin-bottom: 1.5rem;
        }

        h2 {
          font-size: 1.5rem;
          color: #444;
          margin: 1rem 0;
        }

        .logout-button, .add-button, .edit-button, .delete-button {
          margin: 1rem 0.5rem;
          padding: 0.5rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }

        .logout-button {
          background-color: #ff4d4d;
          color: white;
        }

        .add-button {
          background-color: #4caf50;
          color: white;
        }

        .edit-button {
          background-color: #007bff;
          color: white;
        }

        .delete-button {
          background-color: #dc3545;
          color: white;
        }

        .article-item {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
          text-align: left;
        }

        .article-image {
          max-width: 100%;
          margin-bottom: 1rem;
          border-radius: 8px;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          max-width: 600px;
          width: 100%;
        }

        label {
          display: block;
          margin-bottom: 1rem;
          font-weight: bold;
        }

        input {
          width: 100%;
          padding: 0.5rem;
          margin-top: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .confirm-button {
          background-color: #4caf50;
          color: white;
          padding: 0.5rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 1rem;
        }

        .cancel-button {
          background-color: #f44336;
          color: white;
          padding: 0.5rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .article-actions button {
          margin-right: 0.5rem;
        }
      `}</style>
    </div>
  );
}
