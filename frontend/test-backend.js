// Test script to verify backend API
const testBackend = async () => {
  try {
    console.log('Testing backend connection...');
    
    // Test health check
    const healthResponse = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@veridia.com',
        password: 'admin123'
      }),
    });
    
    console.log('Response status:', healthResponse.status);
    console.log('Response headers:', healthResponse.headers);
    
    if (healthResponse.ok) {
      const data = await healthResponse.json();
      console.log('Login successful:', data);
    } else {
      const errorText = await healthResponse.text();
      console.error('Login failed:', errorText);
    }
  } catch (error) {
    console.error('Connection error:', error);
  }
};

testBackend();
