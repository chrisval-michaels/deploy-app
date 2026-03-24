import mongoose from 'mongoose';

// 1. CONFIGURATION
const MONGO_URI = 'mongodb+srv://backend-user:backend4040@backend.9pm5ex2.mongodb.net/backend-data?appName=Backend';


const taskSchema = new mongoose.Schema({
  description: { 
    type: String, 
    required: true 
  },
  completed: { 
    type: Boolean, 
    default: false 
  }
}, {
  collection: 'backend-collection', 
  strict: false,
  versionKey: false
});

const Task = mongoose.model('Task', taskSchema);


async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas!");
    console.log(`   Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    return; 
  }


  if (process.argv.length === 2) {
    await listTasks();
  } else if (process.argv.length === 3) {
    const description = process.argv[2];
    await addTask(description);
  } else {
    console.log("Invalid arguments.");
    console.log("Usage:");
    console.log("  To list tasks:  node mongodb_names.js");
    console.log("  To add a task:  node mongodb_names.js \"Task Description\"");
  }

  await mongoose.disconnect();
  console.log("Disconnected.");
}

// 4. FUNCTIONS
async function listTasks() {
  try {
    console.log("\n--- All Tasks in Database ---");
    
    const tasks = await Task.find({}).lean();
    
    console.log(`🔍 Found ${tasks.length} documents in 'backend-collection'.`);

    if (tasks.length === 0) {
      console.log("No tasks found.");
    } else {
      tasks.forEach((task, index) => {
        const status = task.completed ? "✅ Done" : "#ending";
        const id = task._id.toString();
        
        console.log(`${index + 1}. [${status}] ${task.description}`);
        console.log(`   ID: ${id}`);
        console.log("----------------------------");
      });
    }
    console.log("\n");
  } catch (error) {
    console.error("Error listing tasks:", error);
  }
}

async function addTask(desc) {
  try {
    console.log(`\nAdding task: "${desc}"...`);
    
    const newTask = new Task({
      description: desc
    });

    await newTask.save();
    
    console.log(`Success! Added task to the database.`);
  } catch (error) {
    console.error("Error adding task:", error.message);
  }
}


main();
