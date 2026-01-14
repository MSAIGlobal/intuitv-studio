import { MongoClient, MongoClientOptions } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set')
}

const uri = process.env.MONGODB_URI
const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

clientPromise
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Connection Failed:', err))

export default clientPromise
