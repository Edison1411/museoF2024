import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Image from 'next/image';

export default function Admin() {
  const { user, logout, getToken } = useAuth();
  const router = useRouter();
  const [catalogueItems, setCatalogueItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'ADMIN' && user.role !== 'ADMIN_READ') {
      router.push('/unauthorized');
    } else {
      fetchCatalogueItems();
    }
  }, [user, router]);

  const fetchCatalogueItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch('/api/catalogue', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch catalogue items');
      }
      const data = await res.json();
      setCatalogueItems(data.items || []);
    } catch (error) {
      console.error('Error fetching catalogue items:', error);
      setError('Failed to load catalogue items. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = async (id, currentVisibility) => {
    if (user.role !== 'ADMIN' && user.role !== 'ADMIN_READ') {
      setError('Insufficient permissions to change visibility.');
      return;
    }
    try {
      const token = getToken();
      const res = await fetch(`/api/catalogue/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Asegúrate de que el token se envíe correctamente
        },
        body: JSON.stringify({ isVisible: !currentVisibility }),
      });
      if (!res.ok) {
        throw new Error('Failed to update item visibility');
      }
      const updatedItem = await res.json();
      setCatalogueItems(catalogueItems.map(item => 
        item.id === id ? updatedItem : item
      ));
    } catch (error) {
      console.error('Error updating item visibility:', error);
      setError('Failed to update item visibility. Please try again.');
    }
  };

  const deleteItem = async (id) => {
    if (user.role !== 'ADMIN') {
      setError('Insufficient permissions to delete item.');
      return;
    }
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const token = getToken();
      const res = await fetch(`/api/catalogue/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to delete item');
      }
      setCatalogueItems(catalogueItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item. Please try again.');
    }
  };

  if (!user) return <div>Loading...</div>;
  if (user.role !== 'ADMIN' && user.role !== 'ADMIN_READ') return <div>Unauthorized access</div>;

  return (
    <div>
      <Navbar />
      <div className="admin-container">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p>Welcome, {user.username}!</p>
        <button className="logout-button" onClick={logout}>Logout</button>

        <h2>Catalogue Items</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <ul className="item-list">
            {catalogueItems.map(item => (
              <li key={item.id} className="item-item">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="item-image-container">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.title} 
                    width={200} 
                    height={200} 
                    layout="responsive"
                    objectFit="cover"
                  />
                </div>
                <div className="item-actions">
                  <button 
                    className="visibility-button"
                    onClick={() => toggleVisibility(item.id, item.isVisible)}
                  >
                    {item.isVisible ? 'Hide' : 'Show'}
                  </button>
                  {user.role === 'ADMIN' && (
                    <>
                      <button className="edit-button" onClick={() => editItem(item)}>Edit</button>
                      <button className="delete-button" onClick={() => deleteItem(item.id)}>Delete</button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Footer />
      <style jsx>{`
        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .admin-title {
          font-size: 2em;
          margin-bottom: 20px;
        }
        .logout-button {
          background-color: #f44336;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .item-list {
          list-style-type: none;
          padding: 0;
        }
        .item-item {
          border: 1px solid #ddd;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        .item-image-container {
          width: 200px;
          height: 200px;
          position: relative;
          margin-bottom: 10px;
        }
        .item-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        .visibility-button, .edit-button, .delete-button {
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .visibility-button {
          background-color: #4CAF50;
          color: white;
        }
        .edit-button {
          background-color: #2196F3;
          color: white;
        }
        .delete-button {
          background-color: #f44336;
          color: white;
        }
      `}</style>
    </div>
  );
}