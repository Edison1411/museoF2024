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
    image: '',
    codigoColeccionista: '',
    codigoSipce: '',
    codigoUbicacion: '',
    filiacionCultural: '',
    dimensiones: '',
    details: '',
    relatedImages: [],
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
    const res = await fetch('/api/articles');
    const data = await res.json();
    setArticles(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle((prevArticle) => ({
      ...prevArticle,
      [name]: value,
    }));
  };

  const handleRelatedImagesChange = (e) => {
    const { files } = e.target;
    const relatedImagesArray = Array.from(files).map(file => URL.createObjectURL(file));
    setNewArticle((prevArticle) => ({
      ...prevArticle,
      relatedImages: relatedImagesArray,
    }));
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setNewArticle((prevArticle) => ({
        ...prevArticle,
        image: imageUrl,
      }));
    }
  };

  const validateArticle = (article) => {
    const { title, description, image, codigoColeccionista, codigoSipce, codigoUbicacion, filiacionCultural, dimensiones, details, relatedImages } = article;
    if (!title || !description || !image || !codigoColeccionista || !codigoSipce || !codigoUbicacion || !filiacionCultural || !dimensiones || !details || relatedImages.length === 0) {
      return false;
    }
    return true;
  };

  const addArticle = async () => {
    if (!validateArticle(newArticle)) {
      alert("Please fill in all the fields and upload at least one related image.");
      return;
    }

    const res = await fetch('/api/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newArticle),
    });
    const createdArticle = await res.json();
    setArticles([...articles, createdArticle]);
    setIsModalOpen(false);
    setNewArticle({
      title: '',
      description: '',
      image: '',
      codigoColeccionista: '',
      codigoSipce: '',
      codigoUbicacion: '',
      filiacionCultural: '',
      dimensiones: '',
      details: '',
      relatedImages: [],
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
      alert("Please fill in all the fields and upload at least one related image.");
      return;
    }

    const res = await fetch(`/api/articles/${currentArticle._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newArticle),
    });
    const updatedArticleFromServer = await res.json();
    setArticles(articles.map((a) => (a._id === currentArticle._id ? updatedArticleFromServer : a)));
    setIsModalOpen(false);
    setEditMode(false);
    setNewArticle({
      title: '',
      description: '',
      image: '',
      codigoColeccionista: '',
      codigoSipce: '',
      codigoUbicacion: '',
      filiacionCultural: '',
      dimensiones: '',
      details: '',
      relatedImages: [],
    });
    setCurrentArticle(null);
  };

  const removeArticle = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    await fetch(`/api/articles/${id}`, { method: 'DELETE' });
    setArticles(articles.filter((a) => a._id !== id));
  };

  if (!user) return <div>Loading...</div>;
  if (user.role !== 'ADMIN') return <div>Unauthorized access</div>;

  return (
    <div>
      <Navbar />
      <div className={`admin-page ${darkMode ? 'dark-mode' : ''}`}>
        <div className="admin-container">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user.name}!</p>
          <button className="logout-button" onClick={logout}>Logout</button>

          <h2>Articles</h2>
          <button className="add-button" onClick={() => { setEditMode(false); setIsModalOpen(true); }}>Add New Article</button>

          <ul className="article-list">
            {articles.map((article) => (
              <li key={article._id} className="article-item">
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <img src={article.image} alt={article.title} className="article-image" />
                <p><strong>Código Coleccionista:</strong> {article.codigoColeccionista}</p>
                <p><strong>Código Sipce:</strong> {article.codigoSipce}</p>
                <p><strong>Código Ubicación:</strong> {article.codigoUbicacion}</p>
                <p><strong>Filiación Cultural:</strong> {article.filiacionCultural}</p>
                <p><strong>Dimensiones:</strong> {article.dimensiones}</p>
                <p><strong>Details:</strong> {article.details}</p>
                <div className="related-images">
                  <strong>Related Images:</strong>
                  {article.relatedImages && article.relatedImages.length > 0 ? (
                    article.relatedImages.map((img, index) => (
                      <img key={index} src={img} alt={`Related ${index + 1}`} className="related-image" />
                    ))
                  ) : (
                    <p>No related images available.</p>
                  )}
                </div>
                <div className="article-actions">
                  <button className="edit-button" onClick={() => editArticle(article)}>Edit</button>
                  <button className="delete-button" onClick={() => removeArticle(article._id)}>Delete</button>
                </div>
              </li>
            ))}
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
              Código Coleccionista:
              <input type="text" name="codigoColeccionista" value={newArticle.codigoColeccionista} onChange={handleInputChange} />
            </label>
            <label>
              Código Sipce:
              <input type="text" name="codigoSipce" value={newArticle.codigoSipce} onChange={handleInputChange} />
            </label>
            <label>
              Código Ubicación:
              <input type="text" name="codigoUbicacion" value={newArticle.codigoUbicacion} onChange={handleInputChange} />
            </label>
            <label>
              Filiación Cultural:
              <input type="text" name="filiacionCultural" value={newArticle.filiacionCultural} onChange={handleInputChange} />
            </label>
            <label>
              Dimensiones (alto x ancho x largo)cm:
              <input type="text" name="dimensiones" value={newArticle.dimensiones} onChange={handleInputChange} />
            </label>
            <label>
              Details:
              <input type="text" name="details" value={newArticle.details} onChange={handleInputChange} />
            </label>
            <label>
              Related Images (4 allowed):
              <input type="file" accept="image/*" multiple onChange={handleRelatedImagesChange} />
            </label>
            <button onClick={editMode ? updateArticle : addArticle}>{editMode ? 'Update Article' : 'Add Article'}</button>
            <button onClick={() => { setIsModalOpen(false); setEditMode(false); setCurrentArticle(null); }}>Cancel</button>
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
          background-color: #00000;
          transition: background-color 0.3s ease;
        }

        .admin-container {
          background: skyblue;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          width: 100%;
          text-align: center;
        }

        h1, h2, p, label {
          color: #000000; /* Color de texto negro para todos los elementos */
        }

        .logout-button, .add-button, .edit-button, .delete-button {
          margin: 1rem 0.5rem;
          padding: 0.5rem 1rem;
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
        }

        .related-image {
          max-width: 100px;
          margin-right: 5px;
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
          overflow: auto;
          z-index: 1000; /* Asegúrate de que el modal tenga un z-index alto */
        }

        .modal-content {
          background: silver;
          padding: 2rem;
          border-radius: 8px;
          max-width: 600px;
          width: 100%;
          text-align: center;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content label {
          display: block;
          margin-bottom: 1rem;
        }

        .modal-content input {
          width: 100%;
          padding: 0.5rem;
          margin-top: 0.5rem;
          border: 1px solid #333;
          border-radius: 4px;
        }

        .modal-content button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
        }

        .modal-content button:first-of-type {
          background-color: #4caf50;
          color: black; /* Cambiar el color de fondo del botón sin cambiar el color de texto */
        }

        .modal-content button:last-of-type {
          background-color: #dc3545;
          color: black; /* Cambiar el color de fondo del botón sin cambiar el color de texto */
        }

        /* Asegúrate de que el footer tenga un z-index más bajo que el modal */
        footer {
          z-index: 1;
        }
      `}</style>
    </div>
  );
}