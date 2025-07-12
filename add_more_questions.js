const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api';

// Sample users to create and use for questions
const sampleUsers = [
  {
    username: 'techguru42',
    email: 'techguru42@example.com',
    password: 'Password123!'
  },
  {
    username: 'codeninja88',
    email: 'codeninja88@example.com', 
    password: 'Password123!'
  },
  {
    username: 'webmaster21',
    email: 'webmaster21@example.com',
    password: 'Password123!'
  }
];

// Additional sample questions
const additionalQuestions = [
  {
    title: "How to implement Redux in a React application?",
    description: "I'm new to Redux and trying to understand how to properly set it up in my React app. What are the best practices for state management?",
    tags: ["react", "redux", "javascript", "state-management"]
  },
  {
    title: "Best practices for MongoDB schema design",
    description: "What are the recommended approaches for designing MongoDB schemas? Should I embed documents or use references?",
    tags: ["mongodb", "database", "schema-design", "nosql"]
  },
  {
    title: "Understanding CSS Grid vs Flexbox",
    description: "When should I use CSS Grid and when should I use Flexbox? What are the main differences and use cases?",
    tags: ["css", "grid", "flexbox", "layout"]
  },
  {
    title: "How to handle authentication in Node.js APIs?",
    description: "What's the best way to implement JWT authentication in Express.js? Should I use sessions or tokens?",
    tags: ["nodejs", "express", "authentication", "jwt"]
  },
  {
    title: "Docker containerization for beginners",
    description: "I'm trying to containerize my application with Docker. What are the essential concepts I need to understand?",
    tags: ["docker", "containerization", "devops", "deployment"]
  },
  {
    title: "TypeScript vs JavaScript: When to use which?",
    description: "I'm debating whether to use TypeScript or stick with JavaScript for my new project. What are the pros and cons?",
    tags: ["typescript", "javascript", "programming", "development"]
  },
  {
    title: "GraphQL vs REST API comparison",
    description: "What are the advantages and disadvantages of GraphQL compared to traditional REST APIs?",
    tags: ["graphql", "rest", "api", "backend"]
  },
  {
    title: "Vue.js 3 Composition API explained",
    description: "How does the Composition API in Vue.js 3 differ from the Options API? When should I use it?",
    tags: ["vuejs", "composition-api", "frontend", "javascript"]
  },
  {
    title: "Python virtual environments best practices",
    description: "What's the recommended way to manage Python virtual environments? Should I use venv, conda, or something else?",
    tags: ["python", "virtual-environment", "pip", "development"]
  },
  {
    title: "AWS Lambda function optimization tips",
    description: "How can I optimize my AWS Lambda functions for better performance and cost efficiency?",
    tags: ["aws", "lambda", "serverless", "optimization"]
  }
];

async function registerUser(user) {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, user);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message?.includes('already exists')) {
      console.log(`User ${user.username} already exists, trying to login...`);
      try {
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: user.email,
          password: user.password
        });
        return loginResponse.data;
      } catch (loginError) {
        console.error(`Failed to login user ${user.username}:`, loginError.response?.data?.message);
        return null;
      }
    }
    console.error(`Error registering user ${user.username}:`, error.response?.data?.message);
    return null;
  }
}

async function createQuestion(question, token) {
  try {
    const response = await axios.post(`${API_BASE_URL}/questions`, question, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating question:', error.response?.data?.message);
    return null;
  }
}

async function main() {
  console.log('Starting to add more sample questions...');
  
  // Register users and collect tokens
  const userTokens = [];
  for (const user of sampleUsers) {
    const result = await registerUser(user);
    if (result && result.token) {
      userTokens.push(result.token);
      console.log(`✅ User ${user.username} registered/logged in successfully`);
    }
  }
  
  if (userTokens.length === 0) {
    console.error('❌ No users available to create questions');
    return;
  }
  
  // Create questions with different users
  let successCount = 0;
  for (let i = 0; i < additionalQuestions.length; i++) {
    const question = additionalQuestions[i];
    const token = userTokens[i % userTokens.length]; // Cycle through users
    
    const result = await createQuestion(question, token);
    if (result) {
      successCount++;
      console.log(`✅ Created question: "${question.title}"`);
    } else {
      console.log(`❌ Failed to create question: "${question.title}"`);
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n🎉 Successfully created ${successCount} additional questions!`);
  console.log(`📊 Total questions should now be ${4 + successCount} (4 original + ${successCount} new)`);
  console.log('🔄 Refresh your browser to see the pagination in action!');
}

main().catch(console.error);
