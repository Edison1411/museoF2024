import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function Admin() {
  const { user, logout, getToken } = useAuth();
  const router = useRouter();
  const [catalogueItems, setCatalogueItems] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    imageUrl: '',
    isVisible: true,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'ADMIN' && user.role !== 'ADMIN_READ') {
      router.push('/unauthorized');
    } else {
      fetchCatalogueItems();
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

  const fetchCatalogueItems = async () => {
    try {
      const token = getToken();
      const res = await fetch('/api/catalogue', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setCatalogueItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching catalogue items:', error);
      setCatalogueItems([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setNewItem((prevItem) => ({
        ...prevItem,
        imageUrl,
      }));
    }
  };

  const validateItem = (item) => {
    const { title, description, imageUrl } = item;
    return title && description && imageUrl;
  };

  const addItem = async () => {
    if (!validateItem(newItem)) {
      alert("Please fill in all the fields.");
      return;
    }

    const res = await fetch('/api/catalogue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify(newItem),
    });
    const createdItem = await res.json();
    setCatalogueItems([...catalogueItems, createdItem]);
    setIsModalOpen(false);
    resetNewItem();
  };

  const resetNewItem = () => {
    setNewItem({
      title: '',
      description: '',
      imageUrl: '',
      isVisible: true,
    });
  };

  const editItem = (item) => {
    setCurrentItem(item);
    setNewItem(item);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const updateItem = async () => {
    if (!validateItem(newItem)) {
      alert("Please fill in all the fields.");
      return;
    }

    const res = await fetch(`/api/catalogue/${currentItem.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify(newItem),
    });
    const updatedItemFromServer = await res.json();
    setCatalogueItems(catalogueItems.map((item) => (item.id === currentItem.id ? updatedItemFromServer : item)));
    setIsModalOpen(false);
    resetNewItem();
    setCurrentItem(null);
  };

  const removeItem = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    await fetch(`/api/catalogue/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${getToken()}` } });
    setCatalogueItems(catalogueItems.filter((item) => item.id !== id));
  };

  const toggleVisibility = async (id, currentVisibility) => {
    const res = await fetch(`/api/catalogue/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify({ isVisible: !currentVisibility }),
    });
    const updatedItem = await res.json();
    setCatalogueItems(catalogueItems.map((item) => (item.id === id ? updatedItem : item)));
  };

  if (!user) return <div>Loading...</div>;
  if (user.role !== 'ADMIN' && user.role !== 'ADMIN_READ') return <div>Unauthorized access</div>;

  return (
    <div>
      <Navbar />
      <div className={`admin-page ${darkMode ? 'dark-mode' : ''}`}>
        <div className="admin-container">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p>Welcome, {user.username}!</p>
          <button className="logout-button" onClick={logout}>Logout</button>

          <h2>Catalogue Items</h2>
          {user.role === 'ADMIN' && (
            <button className="add-button" onClick={() => { setEditMode(false); setIsModalOpen(true); }}>Add New Item</button>
          )}

          <ul className="item-list">
            {catalogueItems.length > 0 ? (
              catalogueItems.map((item) => (
                <li key={item.id} className="item-item">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <img src={item.imageUrl} alt={item.title} className="item-image" />
                  <div className="item-actions">
                    <button className="visibility-button" onClick={() => toggleVisibility(item.id, item.isVisible)}>
                      {item.isVisible ? 'Hide from Catalog' : 'Show in Catalog'}
                    </button>
                    {user.role === 'ADMIN' && (
                      <>
                        <button className="edit-button" onClick={() => editItem(item)}>Edit</button>
                        <button className="delete-button" onClick={() => removeItem(item.id)}>Delete</button>
                      </>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <p>No catalogue items available.</p>
            )}
          </ul>
        </div>
      </div>
      {isModalOpen && user.role === 'ADMIN' && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editMode ? 'Edit Catalogue Item' : 'Add New Catalogue Item'}</h2>
            <label>
              Title:
              <input type="text" name="title" value={newItem.title} onChange={handleInputChange} />
            </label>
            <label>
              Description:
              <input type="text" name="description" value={newItem.description} onChange={handleInputChange} />
            </label>
            <label>
              Image URL:
              <input type="text" name="imageUrl" value={newItem.imageUrl} onChange={handleInputChange} />
            </label>
            <label>
              Visible in Catalog:
              <input type="checkbox" name="isVisible" checked={newItem.isVisible} onChange={(e) => setNewItem({...newItem, isVisible: e.target.checked})} />
            </label>
            <button className="confirm-button" onClick={editMode ? updateItem : addItem}>
              {editMode ? 'Update Item' : 'Add Item'}
            </button>
            <button className="cancel-button" onClick={() => { setIsModalOpen(false); setEditMode(false); setCurrentItem(null); }}>Cancel</button>
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

        .item-item {
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
          text-align: left;
        }

        .item-image {
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

        .item-actions button {
          margin-right: 0.5rem;
        }

        .visibility-button {
          background-color: #ffc107;
          color: black;
        }
      `}</style>
    </div>
  );
}