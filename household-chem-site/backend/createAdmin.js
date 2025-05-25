const { Admin } = require('./models');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    const username = 'admin';
    const password = 'admin123';
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create or update admin user
    const [admin, created] = await Admin.upsert({
      username,
      password: hashedPassword
    });
    
    if (created) {
      console.log('Admin user created successfully!');
    } else {
      console.log('Admin user already exists, password updated.');
    }
    
    console.log('Admin credentials:');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
