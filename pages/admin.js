import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Image from 'next/image';

// Función para verificar si estamos dentro del horario permitido
const isWithinAllowedTime = () => {
  const currentTime = new Date().getHours();
  return currentTime >= 13 && currentTime < 16;
};

export default function Admin() {
  const { user, logout, getToken } = useAuth();
  const router = useRouter();
  const [catalogueItems, setCatalogueItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirigir si no hay usuario o si el rol no es permitido
    if (!user) {
      router.push('/login');
      return; // Asegúrate de que la función se detenga después de redirigir
    }

    if (user.role !== 'ADMIN' && user.role !== 'ADMIN_READ') {
      router.push('/unauthorized');
      return; // Detiene la ejecución si el rol no es permitido
    }

    // Si el usuario tiene el rol correcto, cargar los elementos del catálogo
    fetchCatalogueItems();
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
    // Verificar si estamos dentro del horario permitido antes de actualizar
    if (!isWithinAllowedTime()) {
      return; // Simplemente no hace nada si no estamos en el tiempo permitido
    }

    if (user && (user.role === 'ADMIN' || user.role === 'ADMIN_READ')) {
      try {
        const token = getToken();
        const res = await fetch(`/api/catalogue/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
    }
  };

  const deleteItem = async (id) => {
    if (user && user.role === 'ADMIN') {
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
    } else {
      setError('Insufficient permissions to delete item.');
    }
  };

  // Asegúrate de que el usuario esté definido antes de intentar acceder a sus propiedades
  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="admin-container">
        <h1 className="admin-title">Admin Dashboard</h1>
        <div className="welcome-message">
          <p>Welcome, <span className="username">{user.username}</span>!</p>
          <button className="logout-button" onClick={logout}>Logout</button>
        </div>

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
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .admin-title {
          font-size: 2.5em;
          margin-bottom: 20px;
          color: #333;
        }
        .welcome-message {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .username {
          font-weight: bold;
        }
        .logout-button {
          background-color: #f44336;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .logout-button:hover {
          background-color: #d32f2f;
        }
        .item-list {
          list-style-type: none;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .item-item {
          background-color: white;
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }
        .item-item:hover {
          transform: translateY(-5px);
        }
        .item-image-container {
          width: 100%;
          height: 200px;
          position: relative;
          margin-bottom: 10px;
          border-radius: 8px;
          overflow: hidden;
        }
        .item-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        .visibility-button, .edit-button, .delete-button {
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .visibility-button {
          background-color: #4CAF50;
          color: white;
        }
        .visibility-button:hover {
          background-color: #388E3C;
        }
        .edit-button {
          background-color: #2196F3;
          color: white;
        }
        .edit-button:hover {
          background-color: #1976D2;
        }
        .delete-button {
          background-color: #f44336;
          color: white;
        }
        .delete-button:hover {
          background-color: #d32f2f;
        }
        .error {
          color: #f44336;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
