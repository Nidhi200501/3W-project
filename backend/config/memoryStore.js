const bcrypt = require('bcryptjs');

let memoryUsers = [];
let memoryPosts = [];

// Seed initial TaskPlanet sample data
const seedMemoryData = async () => {
  if (memoryUsers.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const user1 = {
      _id: 'mem_user_1',
      name: 'Nitin Pandey',
      username: 'nitin3w',
      email: 'nitin@taskplanet.com',
      password: hashedPassword,
      badge: 'Legend',
      badgeLevel: 7,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nitin3w',
      points: 100,
      balance: 0.00,
      createdAt: new Date(Date.now() - 28800000) // 8 hours ago
    };

    const user2 = {
      _id: 'mem_user_2',
      name: 'Mayowa bafem',
      username: 'bafemlfvc',
      email: 'mayowa@taskplanet.com',
      password: hashedPassword,
      badge: 'Gold',
      badgeLevel: 3,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bafemlfvc',
      points: 100,
      balance: 0.00,
      createdAt: new Date(Date.now() - 600000)
    };

    const user3 = {
      _id: 'mem_user_3',
      name: 'Test User',
      username: 'testuser123',
      email: 'testuser123@example.com',
      password: hashedPassword,
      badge: 'Legend',
      badgeLevel: 7,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testuser123',
      points: 100,
      balance: 0.00,
      createdAt: new Date()
    };

    const user4 = {
      _id: 'mem_user_4',
      name: 'Demo Account',
      username: 'demouser',
      email: 'demo@example.com',
      password: hashedPassword,
      badge: 'Diamond',
      badgeLevel: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demouser',
      points: 250,
      balance: 15.50,
      createdAt: new Date()
    };

    memoryUsers.push(user1, user2, user3, user4);

    memoryPosts.push(
      {
        _id: 'mem_post_1',
        user: user1._id,
        authorName: 'Nitin Pandey',
        authorUsername: 'nitin3w',
        authorAvatar: user1.avatar,
        authorBadge: 'Legend',
        authorBadgeLevel: 7,
        text: '🚀 Earn Up to 10,000 Points with CPA Lead!\n\nLooking for more ways to earn on TaskPlanet? Try CPA Lead and complete available offers, surveys, and tasks to earn points.',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        likes: [
          { _id: 'like_1', userId: user2._id, username: 'bafemlfvc', name: 'Mayowa bafem', createdAt: new Date() }
        ],
        comments: [
          {
            _id: 'cmt_1',
            userId: user2._id,
            username: 'bafemlfvc',
            name: 'Mayowa bafem',
            userAvatar: user2.avatar,
            text: 'Thanks for sharing! Trying CPA Lead today.',
            createdAt: new Date()
          }
        ],
        sharesCount: 1,
        createdAt: new Date(Date.now() - 28800000)
      },
      {
        _id: 'mem_post_2',
        user: user2._id,
        authorName: 'Mayowa bafem',
        authorUsername: 'bafemlfvc',
        authorAvatar: user2.avatar,
        authorBadge: 'Gold',
        authorBadgeLevel: 3,
        text: 'Have you tried completing daily spin tasks on TaskPlanet? Super fast points accumulation!',
        image: '',
        likes: [
          { _id: 'like_2', userId: user1._id, username: 'nitin3w', name: 'Nitin Pandey', createdAt: new Date() }
        ],
        comments: [],
        sharesCount: 0,
        createdAt: new Date(Date.now() - 600000)
      }
    );
  }
};

seedMemoryData();

module.exports = {
  memoryUsers,
  memoryPosts
};
