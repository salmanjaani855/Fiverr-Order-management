const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://Arslan:Ars101010@ac-58w9itl-shard-00-00.hdh0wvu.mongodb.net:27017,ac-58w9itl-shard-00-01.hdh0wvu.mongodb.net:27017,ac-58w9itl-shard-00-02.hdh0wvu.mongodb.net:27017/?ssl=true&replicaSet=atlas-ngn02s-shard-0&authSource=admin&appName=Cluster0';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.log('❌ MongoDB Error:', err.message));
