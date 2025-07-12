#!/bin/bash
# Bash script to add sample questions using curl

API_BASE="http://localhost:5000/api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🚀 Starting to populate database with sample questions...${NC}"
echo ""

# Function to register a user
register_user() {
    local username=$1
    local email=$2
    local password=$3
    
    echo -e "${YELLOW}Registering user: $username${NC}"
    curl -s -X POST "$API_BASE/auth/register" \
        -H "Content-Type: application/json" \
        -d "{\"username\":\"$username\",\"email\":\"$email\",\"password\":\"$password\"}" \
        > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Registered user: $username${NC}"
    else
        echo -e "${RED}❌ Failed to register $username${NC}"
    fi
    sleep 0.5
}

# Function to login and get token
login_user() {
    local email=$1
    local password=$2
    
    token=$(curl -s -X POST "$API_BASE/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}" | \
        grep -o '"token":"[^"]*' | cut -d'"' -f4)
    
    echo "$token"
}

# Function to create a question
create_question() {
    local title=$1
    local description=$2
    local tags=$3
    local token=$4
    
    echo -e "${YELLOW}Creating question: $title${NC}"
    response=$(curl -s -X POST "$API_BASE/questions" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        -d "{\"title\":\"$title\",\"description\":\"$description\",\"tags\":$tags}")
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}📝 Created question: $title${NC}"
    else
        echo -e "${RED}❌ Failed to create question: $title${NC}"
    fi
    sleep 1
}

# Register users
echo -e "${YELLOW}👥 Registering users...${NC}"
register_user "jsdev123" "jsdev@example.com" "password123"
register_user "phpmaster" "phpmaster@example.com" "password123"
register_user "pythonista" "pythonista@example.com" "password123"
register_user "reactguru" "reactguru@example.com" "password123"
register_user "cssexpert" "cssexpert@example.com" "password123"
register_user "coder" "coder@example.com" "password123"
register_user "webdev" "webdev@example.com" "password123"
register_user "gituser" "gituser@example.com" "password123"
register_user "memorygeek" "memorygeek@example.com" "password123"
register_user "jsadvanced" "jsadvanced@example.com" "password123"

echo ""
echo -e "${YELLOW}📝 Creating questions...${NC}"

# Create questions
token1=$(login_user "jsdev@example.com" "password123")
create_question "What is the difference between == and === in JavaScript?" "I often see both == and === used in JavaScript conditionals. What is the difference between them, and when should I prefer one over the other?" "[\"javascript\",\"comparison\",\"operators\"]" "$token1"

token2=$(login_user "phpmaster@example.com" "password123")
create_question "How do I prevent SQL injection in PHP?" "I'm building a login system in PHP and heard about SQL injection vulnerabilities. How can I safely use user input in SQL queries?" "[\"php\",\"security\",\"sql-injection\",\"database\"]" "$token2"

token3=$(login_user "pythonista@example.com" "password123")
create_question "What does the yield keyword do in Python?" "I'm learning about generators in Python, and I've come across the yield keyword. How is it different from return and how does it affect function execution?" "[\"python\",\"generators\",\"yield\",\"functions\"]" "$token3"

token4=$(login_user "reactguru@example.com" "password123")
create_question "Why is my React component not re-rendering after state change?" "I'm using useState in a functional React component, but updating the state doesn't seem to trigger a re-render. What could be causing this?" "[\"react\",\"hooks\",\"usestate\",\"re-rendering\"]" "$token4"

token5=$(login_user "cssexpert@example.com" "password123")
create_question "How can I center a div both vertically and horizontally in CSS?" "I'm trying to center a <div> in the middle of the screen (both vertically and horizontally), but it's not working. What's the best way to do this in modern CSS?" "[\"css\",\"centering\",\"flexbox\",\"layout\"]" "$token5"

token6=$(login_user "coder@example.com" "password123")
create_question "What causes a 'Segmentation fault (core dumped)' error in C?" "My C program crashes with a \"Segmentation fault (core dumped)\" error. What does this mean and how can I debug it?" "[\"c\",\"debugging\",\"segmentation-fault\",\"memory\"]" "$token6"

token7=$(login_user "webdev@example.com" "password123")
create_question "How do I resolve a 'CORS policy: No 'Access-Control-Allow-Origin'' error?" "When I try to make an API request from my frontend to a different domain, I get a CORS error in the browser console. How can I fix this?" "[\"cors\",\"web-development\",\"api\",\"browser\"]" "$token7"

token8=$(login_user "gituser@example.com" "password123")
create_question "Difference between git pull and git fetch?" "Both git pull and git fetch seem to update the local repository. What exactly is the difference between them?" "[\"git\",\"version-control\",\"git-pull\",\"git-fetch\"]" "$token8"

token9=$(login_user "memorygeek@example.com" "password123")
create_question "What is the difference between stack and heap memory?" "In languages like C or Java, what's the difference between memory allocated on the stack vs the heap? When should I use one over the other?" "[\"memory-management\",\"stack\",\"heap\",\"programming\"]" "$token9"

token10=$(login_user "jsadvanced@example.com" "password123")
create_question "How do I debounce an input in JavaScript?" "I'm building a live search feature, but it fires the API call on every keystroke. How can I implement debouncing so it waits for a pause before triggering the call?" "[\"javascript\",\"debouncing\",\"performance\",\"search\"]" "$token10"

echo ""
echo -e "${GREEN}✅ Finished populating database!${NC}"
