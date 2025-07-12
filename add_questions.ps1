# PowerShell script to add sample questions
$API_BASE = "http://localhost:8000/api"

# Sample users
$users = @(
    @{username="jsdev123"; email="jsdev@example.com"; password="Password123"},
    @{username="phpmaster"; email="phpmaster@example.com"; password="Password123"},
    @{username="pythonista"; email="pythonista@example.com"; password="Password123"},
    @{username="reactguru"; email="reactguru@example.com"; password="Password123"},
    @{username="cssexpert"; email="cssexpert@example.com"; password="Password123"},
    @{username="coder"; email="coder@example.com"; password="Password123"},
    @{username="webdev"; email="webdev@example.com"; password="Password123"},
    @{username="gituser"; email="gituser@example.com"; password="Password123"},
    @{username="memorygeek"; email="memorygeek@example.com"; password="Password123"},
    @{username="jsadvanced"; email="jsadvanced@example.com"; password="Password123"}
)

# Sample questions
$questions = @(
    @{
        title="What is the difference between == and === in JavaScript?"
        description="I often see both == and === used in JavaScript conditionals. What is the difference between them, and when should I prefer one over the other?"
        tags=@("javascript", "comparison", "operators")
    },
    @{
        title="How do I prevent SQL injection in PHP?"
        description="I'm building a login system in PHP and heard about SQL injection vulnerabilities. How can I safely use user input in SQL queries?"
        tags=@("php", "security", "sql-injection", "database")
    },
    @{
        title="What does the yield keyword do in Python?"
        description="I'm learning about generators in Python, and I've come across the yield keyword. How is it different from return and how does it affect function execution?"
        tags=@("python", "generators", "yield", "functions")
    },
    @{
        title="Why is my React component not re-rendering after state change?"
        description="I'm using useState in a functional React component, but updating the state doesn't seem to trigger a re-render. What could be causing this?"
        tags=@("react", "hooks", "usestate", "re-rendering")
    },
    @{
        title="How can I center a div both vertically and horizontally in CSS?"
        description="I'm trying to center a <div> in the middle of the screen (both vertically and horizontally), but it's not working. What's the best way to do this in modern CSS?"
        tags=@("css", "centering", "flexbox", "layout")
    },
    @{
        title="What causes a 'Segmentation fault (core dumped)' error in C?"
        description="My C program crashes with a `"Segmentation fault (core dumped)`" error. What does this mean and how can I debug it?"
        tags=@("c", "debugging", "segmentation-fault", "memory")
    },
    @{
        title="How do I resolve a 'CORS policy: No 'Access-Control-Allow-Origin'' error?"
        description="When I try to make an API request from my frontend to a different domain, I get a CORS error in the browser console. How can I fix this?"
        tags=@("cors", "web-development", "api", "browser")
    },
    @{
        title="Difference between git pull and git fetch?"
        description="Both git pull and git fetch seem to update the local repository. What exactly is the difference between them?"
        tags=@("git", "version-control", "git-pull", "git-fetch")
    },
    @{
        title="What is the difference between stack and heap memory?"
        description="In languages like C or Java, what's the difference between memory allocated on the stack vs the heap? When should I use one over the other?"
        tags=@("memory-management", "stack", "heap", "programming")
    },
    @{
        title="How do I debounce an input in JavaScript?"
        description="I'm building a live search feature, but it fires the API call on every keystroke. How can I implement debouncing so it waits for a pause before triggering the call?"
        tags=@("javascript", "debouncing", "performance", "search")
    }
)

function Register-User($user) {
    $body = @{
        username = $user.username
        email = $user.email
        password = $user.password
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$API_BASE/auth/register" -Method POST -Body $body -ContentType "application/json"
        Write-Host "✅ Registered user: $($user.username)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Failed to register $($user.username): $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Login-User($user) {
    $body = @{
        email = $user.email
        password = $user.password
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri "$API_BASE/auth/login" -Method POST -Body $body -ContentType "application/json"
        Write-Host "🔐 Logged in user: $($user.username)" -ForegroundColor Green
        return $response.accessToken
    }
    catch {
        Write-Host "❌ Failed to login $($user.username): $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Create-Question($question, $token) {
    $body = @{
        title = $question.title
        description = $question.description
        tags = $question.tags
    } | ConvertTo-Json

    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

    try {
        $response = Invoke-RestMethod -Uri "$API_BASE/questions" -Method POST -Body $body -Headers $headers
        Write-Host "📝 Created question: $($question.title)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Failed to create question '$($question.title)': $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Main execution
Write-Host "🚀 Starting to populate database with sample questions..." -ForegroundColor Cyan
Write-Host ""

# Register all users
Write-Host "👥 Registering users..." -ForegroundColor Yellow
foreach ($user in $users) {
    Register-User $user
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "📝 Creating questions..." -ForegroundColor Yellow

# Create questions with different users
for ($i = 0; $i -lt $questions.Length; $i++) {
    $user = $users[$i]
    $question = $questions[$i]
    
    # Login user
    $token = Login-User $user
    if ($token) {
        Create-Question $question $token
    }
    
    Start-Sleep -Milliseconds 1000
}

Write-Host ""
Write-Host "✅ Finished populating database!" -ForegroundColor Green
