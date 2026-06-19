let currentMode = "normal";

function setMode(mode) {

    currentMode = mode;

    const title = document.querySelector(".header p");

    if (mode === "notes") {
        title.innerText = "📝 Notes Generation Mode";
    }
    else if (mode === "mcq") {
        title.innerText = "❓ MCQ Generation Mode";
    }
    else if (mode === "summary") {
        title.innerText = "📖 Summary Mode";
    }
    else if (mode === "exam") {
        title.innerText = "🎯 Exam Preparation Mode";
    }
}

async function askAI() {

    const question = document.getElementById("question").value;

    if (question.trim() === "") return;

    const chatBox = document.getElementById("chat-box");

    // User Message
    chatBox.innerHTML += `
        <div class="user-message">
            ${question}
        </div>
    `;

    document.getElementById("question").value = "";

    // Loading Message
    const loading = document.createElement("div");
    loading.className = "ai-message";
    loading.innerText = "🤖 Thinking...";
    chatBox.appendChild(loading);

    let finalQuestion = question;

    if (currentMode === "notes") {
        finalQuestion =
            "Generate detailed study notes for: " + question;
    }
    else if (currentMode === "mcq") {
        finalQuestion =
            "Generate 10 MCQs with answers for: " + question;
    }
    else if (currentMode === "summary") {
        finalQuestion =
            "Summarize the topic in simple points: " + question;
    }
    else if (currentMode === "exam") {
        finalQuestion =
            "Generate important 3 mark and 5 mark university exam questions with answers for: " + question;
    }

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/ask",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: finalQuestion
                })
            }
        );

        const data = await response.json();

        loading.remove();

        // Clean AI response
        const formattedAnswer = data.answer
            .replace(/\*\*/g, "")
            .replace(/\*/g, "")
            .replace(/#{1,6}/g, "")
            .replace(/={3,}/g, "")
            .replace(/-{3,}/g, "")
            .replace(/\n/g, "<br>");

        // AI Message
        chatBox.innerHTML += `
            <div class="ai-message">
                <div class="answer-content">
                    ${formattedAnswer}
                </div>
            </div>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;

    }
    catch (error) {

        loading.innerText = "❌ Failed to connect to backend";

        console.error(error);
    }
}