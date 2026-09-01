const bcrypt = require('bcryptjs');

const defaultPasswordHash = bcrypt.hashSync('123456', 10);

const memoryUsers = [
  {
    _id: 'mem_user_nidhi',
    name: 'Nidhi Pandey',
    username: 'nidhi_pandey',
    email: 'nidhi@taskplanet.com',
    password: defaultPasswordHash,
    badge: 'Legend',
    badgeLevel: 7,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    points: 150,
    balance: 25.00
  },
  {
    _id: 'mem_user_alex',
    name: 'Alex Morgan',
    username: 'alex_m',
    email: 'alex@taskplanet.com',
    password: defaultPasswordHash,
    badge: 'Diamond',
    badgeLevel: 5,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    points: 120,
    balance: 10.50
  }
];

const memoryPosts = [
  {
    _id: 'mem_post_1',
    userId: 'mem_user_nidhi',
    authorName: 'Nidhi Pandey',
    authorUsername: 'nidhi_pandey',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    text: '🚀 Excited to share my latest updates on TaskPlanet! Loving the mini social post application features!',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    likes: [
      { userId: 'mem_user_alex', username: 'alex_m', name: 'Alex Morgan' }
    ],
    comments: [
      {
        _id: 'mem_comm_1',
        userId: 'mem_user_alex',
        name: 'Alex Morgan',
        username: 'alex_m',
        userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
        text: 'Awesome post Nidhi! Great work! 👏',
        createdAt: new Date(Date.now() - 3600000)
      }
    ],
    createdAt: new Date(Date.now() - 7200000)
  },
  {
    _id: 'mem_post_2',
    userId: 'mem_user_alex',
    authorName: 'Alex Morgan',
    authorUsername: 'alex_m',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    text: 'What are your favorite tech stacks for web applications in 2026? React + Node.js + Express is still my go-to choice! 💻✨',
    image: '',
    likes: [],
    comments: [],
    createdAt: new Date(Date.now() - 14400000)
  }
];

module.exports = {
  memoryUsers,
  memoryPosts
};
