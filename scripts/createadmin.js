// scripts/createAdmin.js
async function createAdminUser() {
  try {
    console.log("Attempting to create admin user...");
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'your_secure_password',
        role: 'ADMIN',
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(`HTTP error! status: ${res.status}, message: ${error.message}, details: ${error.details}`);
    }

    const data = await res.json();
    console.log("Admin user created successfully:", data);
  } catch (error) {
    console.error("Error creating admin user:", error.message);
  }
}

createAdminUser();