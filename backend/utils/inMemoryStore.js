const bcrypt = require('bcryptjs');

// In-Memory Storage for Users & Posts fallback
const inMemoryUsers = [];
const inMemoryPosts = [];

// Seed initial default demo users synchronously
const initSeedUsers = () => {
  if (inMemoryUsers.length === 0) {
    const defaultPasswordHash = bcrypt.hashSync('123456', 10);
    
    inMemoryUsers.push({
      _id: 'mem_user_nidhi',
      name: 'Nidhi Pandey',
      username: 'nidhi_pandey',
      email: 'nidhi@taskplanet.com',
      password: defaultPasswordHash,
      badge: 'Legend',
      badgeLevel: 7,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      points: 150,
      balance: 25.00,
      createdAt: new Date()
    });

    inMemoryUsers.push({
      _id: 'mem_user_alex',
      name: 'Alex Morgan',
      username: 'alex_m',
      email: 'alex@taskplanet.com',
      password: defaultPasswordHash,
      badge: 'Diamond',
      badgeLevel: 5,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      points: 120,
      balance: 10.50,
      createdAt: new Date()
    });
  }
};

initSeedUsers();

// User Helper Methods
const findUserByIdentifier = (identifier) => {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase();
  return inMemoryUsers.find(
    u => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean
  );
};

const findUserById = (id) => {
  return inMemoryUsers.find(u => String(u._id) === String(id));
};

const createUser = async ({ name, username, email, password }) => {
  const cleanUsername = (username || name.toLowerCase().replace(/\s+/g, '')).trim().toLowerCase();
  let cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail.includes('@')) cleanEmail = `${cleanEmail}@taskplanet.com`;
  if (!cleanEmail.includes('.')) cleanEmail = `${cleanEmail}.com`;

  const existing = findUserByIdentifier(cleanEmail) || findUserByIdentifier(cleanUsername);
  if (existing) {
    const field = existing.email.toLowerCase() === cleanEmail ? 'Email' : 'Username';
    throw new Error(`${field} is already registered. Please log in with your credentials.`);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    _id: `mem_user_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    name,
    username: cleanUsername,
    email: cleanEmail,
    password: hashedPassword,
    badge: 'Legend',
    badgeLevel: 7,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername}`,
    points: 100,
    balance: 0.00,
    createdAt: new Date()
  };

  inMemoryUsers.push(newUser);
  return newUser;
};

// Posts Helper Methods
const getInMemoryPosts = (search = '') => {
  let list = [...inMemoryPosts];
  if (search) {
    list = list.filter(p => p.text.toLowerCase().includes(search.toLowerCase()));
  }
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const createInMemoryPost = ({ userId, authorName, authorUsername, authorAvatar, text, image }) => {
  const newPost = {
    _id: `mem_post_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    userId,
    authorName,
    authorUsername,
    authorAvatar: authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorUsername}`,
    text: text || '',
    image: image || '',
    likes: [],
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  inMemoryPosts.unshift(newPost);
  return newPost;
};

module.exports = {
  inMemoryUsers,
  inMemoryPosts,
  findUserByIdentifier,
  findUserById,
  createUser,
  getInMemoryPosts,
  createInMemoryPost
};
