/* ==========================================================================
   DRONA AI - CHATBOT FRONTEND ENGINE
   ========================================================================== */

const API_BASE_URL = "http://localhost:5000/api";

/* ==========================================================================
   DRONA AI - EMAIL NOTIFICATION CONFIGURATION
   ========================================================================== */
const EMAIL_CONFIG = {
    // Choose your service: "formsubmit" (default), "web3forms", "formspree", or "emailjs"
    service: "web3forms", 
    
    // For FormSubmit: Deliver directly to this email address without requiring API keys!
    // (First time you submit, FormSubmit will send a one-time activation email to this address)
    formsubmit_email: "sanglappowerhouse@gmail.com",
    
    // For Web3Forms: Get a free Access Key at https://web3forms.com/
    // (This routes emails directly to your registered address: sanglappowerhouse@gmail.com)
    web3forms_access_key: "285f23b4-4b92-459c-886b-78c7bb173611",
    
    // For Formspree: Create a form at https://formspree.io/ and get the form ID
    formspree_form_id: "YOUR_FORMSPREE_FORM_ID_HERE",
    
    // For EmailJS: Register at https://www.emailjs.com/ and get your IDs
    emailjs_public_key: "YOUR_EMAILJS_PUBLIC_KEY_HERE",
    emailjs_service_id: "YOUR_EMAILJS_SERVICE_ID_HERE",
    emailjs_template_id: "YOUR_EMAILJS_TEMPLATE_ID_HERE"
};

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject Chatbot HTML Markup
    injectChatbotHTML();

    // 2. Initialize DOM References
    const launcher = document.getElementById("dronaChatLauncher");
    const chatWindow = document.getElementById("dronaChatWindow");
    const closeBtn = document.getElementById("dronaCloseBtn");
    const minBtn = document.getElementById("dronaMinBtn");
    const accessibilityBtn = document.getElementById("dronaAccessibilityBtn");
    const sendBtn = document.getElementById("dronaSendBtn");
    const chatInput = document.getElementById("dronaInput");
    const messagesContainer = document.getElementById("dronaMessages");
    const tabs = document.querySelectorAll(".drona-tab");
    const panels = document.querySelectorAll(".drona-panel");
    const levelBtns = document.querySelectorAll(".level-btn");
    const routineDisplay = document.getElementById("dronaRoutineDisplay");
    const progressChecklist = document.getElementById("dronaProgressChecklist");
    const progressPercent = document.getElementById("progressPercent");
    const progressBarFill = document.getElementById("progressBarFill");

    // State
    let currentUser = localStorage.getItem("drona_username") || "";
    let activeRoutine = null;
    let selectedDayIndex = 0;

    // 3. Setup Open/Close Event Listeners
    function handleLauncherActivation(e) {
        e.stopPropagation();
        chatWindow.classList.toggle("active");
        if (chatWindow.classList.contains("active")) {
            launcher.classList.add("drona-launcher-hidden");
            chatWindow.setAttribute("aria-hidden", "false");
            chatInput.focus();
            if (currentUser) {
                // Fetch saved routine if user exists
                loadUserRoutine();
            } else {
                renderAuthPanel();
            }
        } else {
            chatWindow.setAttribute("aria-hidden", "true");
        }
    }

    launcher.addEventListener("click", handleLauncherActivation);

    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        chatWindow.classList.remove("active");
        launcher.classList.remove("drona-launcher-hidden");
        chatWindow.setAttribute("aria-hidden", "true");
    });

    minBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        chatWindow.classList.remove("active");
        launcher.classList.remove("drona-launcher-hidden");
        chatWindow.setAttribute("aria-hidden", "true");
    });

    // Prevent clicks inside the chat window from bubbling up and closing it
    chatWindow.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // Accessibility High Contrast Mode Toggle
    accessibilityBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        chatWindow.classList.toggle("drona-high-contrast");
        const isHighContrast = chatWindow.classList.contains("drona-high-contrast");
        accessibilityBtn.title = isHighContrast ? "Disable High Contrast" : "Enable High Contrast";
        accessibilityBtn.innerHTML = isHighContrast ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    // Close on Escape Key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && chatWindow.classList.contains("active")) {
            chatWindow.classList.remove("active");
            launcher.classList.remove("drona-launcher-hidden");
            chatWindow.setAttribute("aria-hidden", "true");
        }
    });

    // Tab Switching
    tabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
            e.stopPropagation();
            const targetTab = tab.getAttribute("data-tab");
            
            // Set active tab
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Set active panel
            panels.forEach(p => p.classList.remove("active"));
            
            if (targetTab === "chat") {
                document.getElementById("dronaPanelChat").classList.add("active");
                document.getElementById("dronaChatFooter").style.display = "flex";
            } else if (targetTab === "routine") {
                document.getElementById("dronaPanelRoutine").classList.add("active");
                document.getElementById("dronaChatFooter").style.display = "none";
                if (currentUser) renderRoutinePanel();
            } else if (targetTab === "progress") {
                document.getElementById("dronaPanelProgress").classList.add("active");
                document.getElementById("dronaChatFooter").style.display = "none";
                if (currentUser) renderProgressPanel();
            }
        });
    });

    // 4. Send Message Actions
    sendBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        sendMessage();
    });
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });

    // Handle Quick Action Buttons
    document.querySelectorAll(".quick-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const action = btn.getAttribute("data-action");
            if (action === "membership") {
                handleQuickAction("Membership Info");
            } else if (action === "routine") {
                // Switch to Routine tab
                document.querySelector('[data-tab="routine"]').click();
            } else if (action === "progress") {
                // Switch to Progress tab
                document.querySelector('[data-tab="progress"]').click();
            }
        });
    });

    // Level selector for routine generation
    levelBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            levelBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const level = btn.getAttribute("data-level");
            generateRoutine(level);
        });
    });

    // 5. Functions & Implementations

    function injectChatbotHTML() {
        // Create launcher wrapper for Safari 3D stacking context
        const launcherWrapper = document.createElement("div");
        launcherWrapper.className = "drona-chat-launcher-wrapper";

        // Create launcher button (native button element for iOS accessibility & click triggers)
        const launcherBtn = document.createElement("button");
        launcherBtn.type = "button";
        launcherBtn.className = "drona-chat-launcher";
        launcherBtn.id = "dronaChatLauncher";
        launcherBtn.title = "Chat with Drona AI";
        launcherBtn.setAttribute("aria-label", "Open Drona AI Chat");
        launcherBtn.innerHTML = `
            <i class="fas fa-robot"></i>
            <span class="pulse-ring"></span>
        `;
        launcherWrapper.appendChild(launcherBtn);
        document.body.appendChild(launcherWrapper);

        // Create Chat Window wrapper for Safari 3D stacking context
        const windowWrapper = document.createElement("div");
        windowWrapper.className = "drona-chat-window-wrapper";

        // Create Chat Window
        const windowDiv = document.createElement("div");
        windowDiv.className = "drona-chat-window";
        windowDiv.id = "dronaChatWindow";
        windowDiv.setAttribute("aria-hidden", "true");
        windowDiv.innerHTML = `
            <div class="drona-chat-header">
                <div class="drona-brand">
                    <i class="fas fa-robot chatbot-icon"></i>
                    <div>
                        <span class="drona-title">Drona AI</span>
                        <span class="drona-status"><span class="status-dot"></span> Online</span>
                    </div>
                </div>
                <div class="header-actions">
                    <button type="button" id="dronaAccessibilityBtn" title="Enable High Contrast Mode"><i class="fas fa-eye-slash"></i></button>
                    <button type="button" id="dronaMinBtn" title="Minimize Chat"><i class="fas fa-minus"></i></button>
                    <button type="button" id="dronaCloseBtn" title="Close Chat"><i class="fas fa-times"></i></button>
                </div>
            </div>
            
            <div class="drona-tabs">
                <button type="button" class="drona-tab active" data-tab="chat"><i class="fas fa-comment-dots"></i> Chat</button>
                <button type="button" class="drona-tab" data-tab="routine"><i class="fas fa-dumbbell"></i> Routine</button>
                <button type="button" class="drona-tab" data-tab="progress"><i class="fas fa-check-double"></i> Progress</button>
            </div>

            <div class="drona-chat-body">
                <!-- Chat Panel -->
                <div class="drona-panel active" id="dronaPanelChat">
                    <div class="drona-messages" id="dronaMessages"></div>
                    <div class="drona-quick-actions">
                        <button type="button" class="quick-btn" data-action="membership"><i class="fas fa-id-card"></i> Membership Info</button>
                        <button type="button" class="quick-btn" data-action="routine"><i class="fas fa-dumbbell"></i> Fitness Routine</button>
                        <button type="button" class="quick-btn" data-action="progress"><i class="fas fa-calendar-check"></i> Track Progress</button>
                    </div>
                </div>

                <!-- Routine Generator Panel -->
                <div class="drona-panel" id="dronaPanelRoutine">
                    <div class="routine-setup">
                        <h4>Choose Your Fitness Level</h4>
                        <p>Drona AI will generate a personalized weekly split for your level.</p>
                        <div class="level-buttons">
                            <button type="button" class="level-btn" data-level="beginner">Beginner</button>
                            <button type="button" class="level-btn" data-level="intermediate">Intermediate</button>
                            <button type="button" class="level-btn" data-level="advanced">Advanced</button>
                        </div>
                    </div>
                    <div class="routine-display" id="dronaRoutineDisplay"></div>
                </div>

                <!-- Progress Log Panel -->
                <div class="drona-panel" id="dronaPanelProgress">
                    <div class="progress-header">
                        <h4 id="progressDayTitle">Today's Focus</h4>
                        <div class="progress-stats">
                            <span id="progressPercent">0% Done</span>
                            <div class="progress-bar-container">
                                <div class="progress-bar-fill" id="progressBarFill"></div>
                            </div>
                        </div>
                    </div>
                    <div class="progress-day-select" id="progressDaySelect"></div>
                    <div class="progress-checklist" id="dronaProgressChecklist"></div>
                </div>
            </div>

            <div class="drona-chat-footer" id="dronaChatFooter">
                <input type="text" id="dronaInput" placeholder="Ask Drona AI..." aria-label="Type message">
                <button type="button" id="dronaSendBtn" aria-label="Send Message"><i class="fas fa-paper-plane"></i></button>
            </div>
        `;
        windowWrapper.appendChild(windowDiv);
        document.body.appendChild(windowWrapper);
    }

    function addMessage(sender, text, type = "text") {
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${sender}`;
        
        if (type === "html") {
            msgDiv.innerHTML = text;
        } else {
            // Replace newlines with break tags for simple formatting
            msgDiv.innerText = text;
            msgDiv.innerHTML = msgDiv.innerHTML.replace(/\n/g, "<br>");
        }
        
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function showTypingIndicator() {
        const indicator = document.createElement("div");
        indicator.className = "drona-typing";
        indicator.id = "dronaTypingIndicator";
        indicator.innerHTML = `<span></span><span></span><span></span>`;
        messagesContainer.appendChild(indicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById("dronaTypingIndicator");
        if (indicator) indicator.remove();
    }

    // 6. User Account Registration Form in Chat Panel
    function renderAuthPanel() {
        messagesContainer.innerHTML = "";
        
        const authDiv = document.createElement("div");
        authDiv.className = "drona-auth-overlay";
        authDiv.innerHTML = `
            <div class="drona-auth-icon"><i class="fas fa-user-lock"></i></div>
            <h3>Welcome to SPH Gym</h3>
            <p style="color: var(--drona-dim); font-size: 13px;">Please enter your name/username to start tracking your daily progress and saving customized routines.</p>
            <input type="text" id="dronaAuthUsername" class="drona-auth-input" placeholder="e.g. rahul_sharma" required>
            <button type="button" id="dronaAuthSubmit" class="drona-auth-btn">Start My Session</button>
        `;
        messagesContainer.appendChild(authDiv);

        document.getElementById("dronaAuthSubmit").addEventListener("click", () => {
            const usernameInput = document.getElementById("dronaAuthUsername").value.trim();
            if (!usernameInput) return;
            
            // Register username
            fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: usernameInput })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    currentUser = data.user.id;
                    localStorage.setItem("drona_username", currentUser);
                    loadChatPanel();
                } else {
                    alert("Error: " + data.error);
                }
            })
            .catch(err => {
                console.error("Backend offline. Logging in locally:", err);
                currentUser = usernameInput.toLowerCase().replace(/[^a-z0-9_]/g, "");
                localStorage.setItem("drona_username", currentUser);
                loadChatPanel();
            });
        });
    }

    function loadChatPanel() {
        messagesContainer.innerHTML = "";
        addMessage("bot", `Hi ${currentUser}, I'm Drona AI – your fitness and admission assistant at SPH Gym. ⏱️ Ask me anything about memberships, timings, training plans, or fitness rules!`);
        addMessage("bot", `To generate a routine, click the 'Routine' tab. To track your daily checklist, click 'Progress'. Let's build your fitness routine!`);
        loadUserRoutine();
    }

    // 7. Chat Send Messages
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage("user", text);
        chatInput.value = "";
        showTypingIndicator();

        const q = text.toLowerCase();
        const isRegisterRequest = q.includes("membership") || q.includes("admission") || q.includes("inquiry") || q.includes("register") || q.includes("registration") || q.includes("join") || q.includes("sign up");

        // Send query to backend API
        fetch(`${API_BASE_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text, username: currentUser })
        })
        .then(res => res.json())
        .then(data => {
            removeTypingIndicator();
            if (data.response) {
                if (isRegisterRequest) {
                    addMessage("bot", data.response);
                    injectRegistrationForm();
                } else {
                    addMessage("bot", data.response);
                }
            } else {
                addMessage("bot", "Sorry, I encountered an error. Please try again.");
            }
        })
        .catch(err => {
            removeTypingIndicator();
            console.error("Backend error. Using local response rules:", err);
            // Fallback response locally
            setTimeout(() => {
                const response = getLocalFallback(text);
                addMessage("bot", response);
                if (isRegisterRequest) {
                    injectRegistrationForm();
                }
            }, 500);
        });
    }

    function handleQuickAction(text) {
        addMessage("user", text);
        showTypingIndicator();
        
        const q = text.toLowerCase();
        const isRegisterRequest = q.includes("membership") || q.includes("admission") || q.includes("inquiry") || q.includes("register") || q.includes("registration") || q.includes("join") || q.includes("sign up");

        fetch(`${API_BASE_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text, username: currentUser })
        })
        .then(res => res.json())
        .then(data => {
            removeTypingIndicator();
            addMessage("bot", data.response);
            if (isRegisterRequest || text === "Membership Info") {
                injectRegistrationForm();
            }
        })
        .catch(() => {
            removeTypingIndicator();
            const response = getLocalFallback(text);
            addMessage("bot", response);
            if (isRegisterRequest || text === "Membership Info") {
                injectRegistrationForm();
            }
        });
    }

    // Local Fallback Logic
    function getLocalFallback(query) {
        const q = query ? query.toLowerCase() : "";
        if (q.includes("membership") || q.includes("admission") || q.includes("price") || q.includes("fee") || q.includes("register") || q.includes("join")) {
            return "💪 Here is the SPH Gym Membership Pricing:\n\n♂️ Male Section: ₹1500 (1st Month), ₹500/mo subsequent.\n♀️ Female Section: ₹1600 (1st Month), ₹600/mo subsequent.\n\nPersonal Training addon is ₹2000/month. Fill out the form below to register!";
        }
        return "🤖 I am currently running in offline helper mode. Please contact SPH Gym staff at +91 9836336565 or submit a registration request below!";
    }

    // Direct background email notification dispatcher
    function sendEmailNotification(name, email, phone) {
        if (EMAIL_CONFIG.service === "formsubmit") {
            const emailTarget = EMAIL_CONFIG.formsubmit_email || "sanglappowerhouse@gmail.com";
            return fetch(`https://formsubmit.co/ajax/${emailTarget}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    _subject: `New Registration: ${name}`,
                    name: name,
                    email: email,
                    _replyto: email,
                    phone: phone
                })
            })
            .then(res => {
                if (!res.ok) throw new Error("Failed to send request via FormSubmit.");
                return res.json();
            })
            .then(data => {
                if (data.success === "false" || (data.message && data.message.toLowerCase().includes("activate"))) {
                    throw new Error("One-time activation required. SPH Gym owner: Please check your inbox (sanglappowerhouse@gmail.com) and click the FormSubmit activation link to start receiving requests!");
                }
                return data;
            });
        } else if (EMAIL_CONFIG.service === "web3forms") {
            if (EMAIL_CONFIG.web3forms_access_key === "YOUR_WEB3FORMS_ACCESS_KEY_HERE" || !EMAIL_CONFIG.web3forms_access_key) {
                return Promise.reject(new Error("Web3Forms Access Key is not configured in js/drona-ai.js."));
            }
            return fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    access_key: EMAIL_CONFIG.web3forms_access_key,
                    subject: `New Gym Registration: ${name}`,
                    from_name: name,
                    email: email,
                    phone: phone,
                    message: `New Gym Registration Request:\n\nUser Name: ${name}\nUser Email: ${email}\nUser Phone: ${phone}`
                })
            })
            .then(res => {
                if (!res.ok) throw new Error("Failed to send request via Web3Forms.");
                return res.json();
            });
        } else if (EMAIL_CONFIG.service === "formspree") {
            if (EMAIL_CONFIG.formspree_form_id === "YOUR_FORMSPREE_FORM_ID_HERE" || !EMAIL_CONFIG.formspree_form_id) {
                return Promise.reject(new Error("Formspree Form ID is not configured in js/drona-ai.js."));
            }
            return fetch(`https://formspree.io/f/${EMAIL_CONFIG.formspree_form_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    _subject: `New Registration: ${name}`,
                    message: `New Gym Registration Request:\n\nUser Name: ${name}\nUser Email: ${email}\nUser Phone: ${phone}`
                })
            })
            .then(res => {
                if (!res.ok) throw new Error("Failed to send request via Formspree.");
                return res.json();
            });
        } else if (EMAIL_CONFIG.service === "emailjs") {
            if (EMAIL_CONFIG.emailjs_public_key === "YOUR_EMAILJS_PUBLIC_KEY_HERE" ||
                EMAIL_CONFIG.emailjs_service_id === "YOUR_EMAILJS_SERVICE_ID_HERE" ||
                EMAIL_CONFIG.emailjs_template_id === "YOUR_EMAILJS_TEMPLATE_ID_HERE") {
                return Promise.reject(new Error("EmailJS credentials are not fully configured in js/drona-ai.js."));
            }
            return fetch("https://api.emailjs.com/api/v1.0/email/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    service_id: EMAIL_CONFIG.emailjs_service_id,
                    template_id: EMAIL_CONFIG.emailjs_template_id,
                    user_id: EMAIL_CONFIG.emailjs_public_key,
                    template_params: {
                        name: name,
                        email: email,
                        phone: phone,
                        subject: `New Registration: ${name}`
                    }
                })
            })
            .then(res => {
                if (!res.ok) {
                    return res.text().then(text => { throw new Error(text || "Failed to send request via EmailJS."); });
                }
                return { status: "success" };
            });
        } else {
            return Promise.reject(new Error("No valid email service selected in EMAIL_CONFIG."));
        }
    }

    // Drona AI Registration Request Form Injector
    function injectRegistrationForm() {
        const formId = "inquiryForm_" + Date.now();
        const formHTML = `
            <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--drona-border); border-radius: 8px; padding: 12px; margin-top: 5px;">
                <p style="font-weight:700; font-size:12px; margin-bottom: 8px; color: var(--drona-neon);"><i class="fas fa-envelope"></i> SPH Gym Registration Request</p>
                <form class="inchat-form" id="${formId}">
                    <input type="text" id="${formId}_name" placeholder="Full Name" required>
                    <input type="tel" id="${formId}_phone" placeholder="Phone Number" required>
                    <input type="email" id="${formId}_email" placeholder="Email Address" required>
                    <button type="submit" class="inchat-submit-btn">Send Request</button>
                </form>
            </div>
        `;
        addMessage("bot", formHTML, "html");

        const formElement = document.getElementById(formId);
        formElement.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById(`${formId}_name`).value.trim();
            const phone = document.getElementById(`${formId}_phone`).value.trim();
            const email = document.getElementById(`${formId}_email`).value.trim();

            const submitBtn = formElement.querySelector("button");
            submitBtn.disabled = true;
            submitBtn.innerText = "Sending...";

            sendEmailNotification(name, email, phone)
            .then(() => {
                formElement.parentElement.innerHTML = `
                    <div style="color: var(--drona-neon); font-size:12px; font-weight:700; margin:0; line-height:1.5;">
                        <p style="margin-bottom: 6px;"><i class="fas fa-check-circle"></i> Registration request sent successfully!</p>
                        <p style="color: #fff; font-weight: 500; font-size: 11px; text-align: justify; margin-bottom: 8px;">
                            Our SPH executive will reach out to you at the earliest.
                        </p>
                        <p style="color: var(--drona-neon); font-weight: 600; font-size: 10px; text-align: right; margin: 0; line-height: 1.3;">
                            Thanking you.<br>Regards, Team SPH
                        </p>
                    </div>
                `;
            })
            .catch((err) => {
                console.error("Email notification failed:", err);
                submitBtn.disabled = false;
                submitBtn.innerText = "Try Again";
                if (err.message.includes("activation required") || err.message.includes("Activation link") || err.message.includes("activation link")) {
                    const isLocalFile = window.location.protocol === "file:";
                    if (isLocalFile) {
                        formElement.parentElement.innerHTML = `
                            <div style="color: #FFB703; font-size:12px; font-weight:500; margin-top:5px; line-height:1.4;">
                                <p style="font-weight:700; margin-bottom:5px; color: #FFAA00;"><i class="fas fa-exclamation-triangle"></i> Local File Restriction</p>
                                <p>FormSubmit.co does not allow submissions from direct <code>file:///</code> paths.</p>
                                <p style="margin-top:5px; font-weight:700; color: #fff;">To resolve this:</p>
                                <ul style="margin-left:15px; margin-top:3px; padding-left:5px; margin-bottom:8px; list-style-type: disc;">
                                    <li>Run this project on a local server (e.g., VS Code <strong>Live Server</strong>, or run <code>python -m http.server</code> in the project directory).</li>
                                    <li>Or, use <strong>Web3Forms</strong> which supports direct local file testing. Get a free key at <a href="https://web3forms.com/" target="_blank" style="color: #FFAA00; text-decoration: underline; font-weight: bold;">web3forms.com</a> and paste it into the <code>EMAIL_CONFIG</code> in the code.</li>
                                </ul>
                            </div>
                        `;
                    } else {
                        formElement.parentElement.innerHTML = `
                            <div style="color: #FFB703; font-size:12px; font-weight:500; margin-top:5px; line-height:1.4;">
                                <p style="font-weight:700; margin-bottom:5px; color: #FFAA00;"><i class="fas fa-exclamation-triangle"></i> Activation Required</p>
                                <p>To start receiving requests, you must activate the FormSubmit endpoint once:</p>
                                <ol style="margin-left:15px; margin-top:3px; padding-left:5px; margin-bottom:10px;">
                                    <li>Check the inbox of <strong>sanglappowerhouse@gmail.com</strong>.</li>
                                    <li>Find the email from <strong>FormSubmit.co</strong> and click the verification button.</li>
                                </ol>
                                <button id="${formId}_activateBtn" class="inchat-submit-btn" style="background: #FFAA00; color: #000; font-weight: bold; width: 100%; border: none; padding: 8px; border-radius: 4px; cursor: pointer; transition: all 0.3s ease; display: block; text-align: center; margin-bottom: 8px;">
                                    Send New Activation Link
                                </button>
                                <p style="margin-top:5px; font-size:10px; color: var(--drona-dim);">Once activated, subsequent click submissions will succeed instantly!</p>
                            </div>
                        `;
                        
                        setTimeout(() => {
                            const activateBtn = document.getElementById(`${formId}_activateBtn`);
                            if (activateBtn) {
                                activateBtn.addEventListener("click", () => {
                                    activateBtn.disabled = true;
                                    activateBtn.innerText = "Triggering Link...";
                                    activateBtn.style.background = "#555";
                                    activateBtn.style.color = "#aaa";

                                    // Create a standard POST form to trigger standard activation redirect in a new tab
                                    const form = document.createElement("form");
                                    form.method = "POST";
                                    form.action = `https://formsubmit.co/${EMAIL_CONFIG.formsubmit_email || 'sanglappowerhouse@gmail.com'}`;
                                    form.target = "_blank";

                                    const msgInput = document.createElement("input");
                                    msgInput.type = "hidden";
                                    msgInput.name = "activation_request";
                                    msgInput.value = "This is a one-time activation request to start receiving gym registrations via the Drona AI chatbot.";
                                    form.appendChild(msgInput);

                                    document.body.appendChild(form);
                                    form.submit();
                                    document.body.removeChild(form);

                                    activateBtn.innerText = "Check Mail (Activation Sent)";
                                });
                            }
                        }, 50);
                    }
                } else {
                    addMessage("bot", `❌ Error sending request: ${err.message || "Unknown error"}`);
                }
            });
        });
    }

    // 8. Routine Operations
    function generateRoutine(level) {
        routineDisplay.innerHTML = `<div class="drona-typing" style="margin: 10px auto;"><span></span><span></span><span></span></div>`;
        
        // Let's create routine locally if backend is offline, else fetch
        const templates = {
            beginner: {
                title: "Beginner Full-Body Build",
                description: "3 days/week full body foundational strength program.",
                days: [
                    {
                        dayName: "Monday: Foundational Lift",
                        exercises: [
                            { name: "Bodyweight Squats", sets: 3, reps: "12-15 reps", done: false },
                            { name: "Incline Push-Ups", sets: 3, reps: "10 reps", done: false },
                            { name: "Dumbbell Rows", sets: 3, reps: "12 reps", done: false },
                            { name: "Plank Hold", sets: 3, reps: "30-45s", done: false }
                        ]
                    },
                    {
                        dayName: "Wednesday: Core & Cardio",
                        exercises: [
                            { name: "Bicycle Crunches", sets: 3, reps: "15 reps/side", done: false },
                            { name: "Glute Bridges", sets: 3, reps: "12 reps", done: false },
                            { name: "Treadmill Walk", sets: 1, reps: "15 mins", done: false }
                        ]
                    },
                    {
                        dayName: "Friday: Strength Focus",
                        exercises: [
                            { name: "Goblet Squats", sets: 3, reps: "10 reps", done: false },
                            { name: "Dumbbell Chest Press", sets: 3, reps: "10 reps", done: false },
                            { name: "Lat Pulldown", sets: 3, reps: "12 reps", done: false }
                        ]
                    }
                ]
            },
            intermediate: {
                title: "Intermediate Push-Pull-Legs",
                description: "4 days/week specialized muscle splits.",
                days: [
                    {
                        dayName: "Monday: Chest & Shoulders Push",
                        exercises: [
                            { name: "Flat Bench Press", sets: 4, reps: "8-10 reps", done: false },
                            { name: "Dumbbell Shoulder Press", sets: 3, reps: "10 reps", done: false },
                            { name: "Tricep Pushdowns", sets: 3, reps: "12 reps", done: false }
                        ]
                    },
                    {
                        dayName: "Wednesday: Back & Bicep Pull",
                        exercises: [
                            { name: "Lat Pulldown / Pull-ups", sets: 4, reps: "8-12 reps", done: false },
                            { name: "Barbell Rows", sets: 3, reps: "10 reps", done: false },
                            { name: "Hammer Curls", sets: 3, reps: "12 reps", done: false }
                        ]
                    },
                    {
                        dayName: "Thursday: Legs Focus",
                        exercises: [
                            { name: "Barbell Squats", sets: 4, reps: "8 reps", done: false },
                            { name: "Leg Press", sets: 3, reps: "12 reps", done: false },
                            { name: "Lying Leg Curls", sets: 3, reps: "12 reps", done: false }
                        ]
                    },
                    {
                        dayName: "Saturday: Abs & High Cardio",
                        exercises: [
                            { name: "Hanging Leg Raises", sets: 3, reps: "15 reps", done: false },
                            { name: "HIIT Sprints", sets: 5, reps: "30s sprint/rest", done: false }
                        ]
                    }
                ]
            },
            advanced: {
                title: "Advanced Hypertrophy Focus",
                description: "5 days/week high volume muscle building program.",
                days: [
                    {
                        dayName: "Monday: Chest & Biceps",
                        exercises: [
                            { name: "Incline Bench Press", sets: 4, reps: "6-8 reps", done: false },
                            { name: "Weighted Dips", sets: 3, reps: "8-10 reps", done: false },
                            { name: "Incline Curls", sets: 4, reps: "10 reps", done: false }
                        ]
                    },
                    {
                        dayName: "Tuesday: Back & Triceps",
                        exercises: [
                            { name: "Deadlifts", sets: 4, reps: "5 reps", done: false },
                            { name: "Barbell Rows", sets: 3, reps: "10 reps", done: false },
                            { name: "Tricep Overhead Extension", sets: 3, reps: "12 reps", done: false }
                        ]
                    },
                    {
                        dayName: "Thursday: Legs Quads Focus",
                        exercises: [
                            { name: "Back Squats", sets: 4, reps: "8 reps", done: false },
                            { name: "Front Squats", sets: 3, reps: "10 reps", done: false },
                            { name: "Standing Calf Raises", sets: 4, reps: "15 reps", done: false }
                        ]
                    },
                    {
                        dayName: "Friday: Shoulders & Abs",
                        exercises: [
                            { name: "Military Press", sets: 4, reps: "8 reps", done: false },
                            { name: "Lateral Raises", sets: 4, reps: "12 reps", done: false },
                            { name: "Cable Crunches", sets: 3, reps: "15 reps", done: false }
                        ]
                    },
                    {
                        dayName: "Saturday: Posterior Legs Chain",
                        exercises: [
                            { name: "Sumo Deadlifts", sets: 3, reps: "8 reps", done: false },
                            { name: "Romanian Deadlifts", sets: 3, reps: "10 reps", done: false }
                        ]
                    }
                ]
            }
        };

        const plan = templates[level];
        
        // Mock latency
        setTimeout(() => {
            renderGeneratedPlan(plan, level);
        }, 600);
    }

    function renderGeneratedPlan(plan, level) {
        routineDisplay.innerHTML = `
            <div style="padding: 10px 0;">
                <h3 style="color:#FFF; font-size:14px; font-weight:700;">${plan.title}</h3>
                <p style="color:var(--drona-dim); font-size:11px; margin-bottom: 12px;">${plan.description}</p>
                
                <div style="display:flex; flex-direction:column; gap:10px;">
                    ${plan.days.map((day, idx) => `
                        <div class="routine-card">
                            <div class="routine-card-title">${day.dayName}</div>
                            <div class="routine-ex-list">
                                ${day.exercises.map(ex => `
                                    <div class="routine-ex-item">
                                        <span>• ${ex.name}</span>
                                        <span class="routine-ex-sets">${ex.sets} sets x ${ex.reps}</span>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    `).join("")}
                </div>
                
                <button type="button" class="save-routine-btn" id="dronaSaveRoutineBtn">Save & Activate Routine</button>
            </div>
        `;

        document.getElementById("dronaSaveRoutineBtn").addEventListener("click", () => {
            saveRoutine(plan, level);
        });
    }

    function saveRoutine(plan, level) {
        const btn = document.getElementById("dronaSaveRoutineBtn");
        btn.disabled = true;
        btn.innerText = "Activating Plan...";

        fetch(`${API_BASE_URL}/routines`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: currentUser,
                routine_type: level,
                routine_plan: plan
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                activeRoutine = {
                    routine_type: level,
                    routine_plan: plan,
                    progress_log: {}
                };
                alert("Routine activated! Go to 'Progress' tab to start tracking!");
                document.querySelector('[data-tab="progress"]').click();
            } else {
                btn.disabled = false;
                btn.innerText = "Save & Activate Routine";
                alert("Failed saving routine plan: " + data.error);
            }
        })
        .catch(() => {
            // Local fallback
            activeRoutine = {
                routine_type: level,
                routine_plan: plan,
                progress_log: {}
            };
            alert("Routine activated locally! Start checking off your progress!");
            document.querySelector('[data-tab="progress"]').click();
        });
    }

    function loadUserRoutine() {
        if (!currentUser) return;
        fetch(`${API_BASE_URL}/routines?username=${currentUser}`)
        .then(res => res.json())
        .then(data => {
            if (data.status === "success" && data.routine) {
                activeRoutine = data.routine;
            }
        })
        .catch(err => console.log("Failed reading remote routine, working offline:", err));
    }

    function renderRoutinePanel() {
        if (!activeRoutine) {
            routineDisplay.innerHTML = `
                <div style="text-align:center; padding: 20px 10px; color: var(--drona-dim); font-size:13px;">
                    <i class="fas fa-dumbbell" style="font-size:32px; color: var(--drona-border); margin-bottom:10px;"></i>
                    <p>No active routine found. Select a fitness level above to generate one!</p>
                </div>
            `;
            return;
        }

        // Highlight level selector button
        const lvl = activeRoutine.routine_type;
        document.querySelectorAll(".level-btn").forEach(btn => {
            if (btn.getAttribute("data-level") === lvl) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        renderGeneratedPlan(activeRoutine.routine_plan, lvl);
    }

    // 9. Progress Checklist Rendering
    function renderProgressPanel() {
        if (!activeRoutine) {
            progressChecklist.innerHTML = `
                <div style="text-align:center; padding: 25px 10px; color: var(--drona-dim); font-size:13px;">
                    <i class="fas fa-tasks" style="font-size:32px; color: var(--drona-border); margin-bottom:10px;"></i>
                    <p>Generate & activate a routine plan from the 'Routine' tab first!</p>
                </div>
            `;
            progressPercent.innerText = "0% Done";
            progressBarFill.style.width = "0%";
            return;
        }

        const plan = activeRoutine.routine_plan;
        const days = plan.days || [];
        
        // Render day select buttons
        const daySelectContainer = document.getElementById("progressDaySelect");
        daySelectContainer.innerHTML = days.map((day, idx) => `
            <button type="button" class="day-select-btn ${idx === selectedDayIndex ? 'active' : ''}" data-day-idx="${idx}">
                Day ${idx + 1}
            </button>
        `).join("");

        // Add day click handlers
        document.querySelectorAll(".day-select-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                selectedDayIndex = parseInt(btn.getAttribute("data-day-idx"));
                renderProgressPanel();
            });
        });

        // Load exercises for selected day
        const selectedDay = days[selectedDayIndex];
        if (!selectedDay) return;

        document.getElementById("progressDayTitle").innerText = selectedDay.dayName;

        // Load checked logs for today (use ISO date)
        const dateKey = getTodayLocalDate();
        const logs = activeRoutine.progress_log || {};
        const completedList = logs[dateKey] || [];

        progressChecklist.innerHTML = selectedDay.exercises.map((ex, idx) => {
            const exId = `${selectedDay.dayName}_exercise_${idx}`;
            const isCompleted = completedList.includes(exId);
            return `
                <label class="checklist-item ${isCompleted ? 'completed' : ''}" data-ex-id="${exId}">
                    <input type="checkbox" data-ex-id="${exId}" ${isCompleted ? 'checked' : ''}>
                    <div class="checklist-details">
                        <span class="checklist-ex-name">${ex.name}</span>
                        <span class="checklist-ex-sets">${ex.sets} sets x ${ex.reps}</span>
                    </div>
                </label>
            `;
        }).join("");

        // Setup Checkbox change listeners
        document.querySelectorAll(".checklist-item input").forEach(chk => {
            chk.addEventListener("change", (e) => {
                const exId = chk.getAttribute("data-ex-id");
                const item = chk.parentElement;
                
                if (chk.checked) {
                    item.classList.add("completed");
                } else {
                    item.classList.remove("completed");
                }

                updateExerciseProgress(exId, chk.checked);
            });
        });

        calculateProgressPercent(selectedDay.exercises.length, completedList.length);
    }

    function calculateProgressPercent(total, completed) {
        if (total === 0) return;
        const pct = Math.min(100, Math.round((completed / total) * 100));
        progressPercent.innerText = `${pct}% Done`;
        progressBarFill.style.width = `${pct}%`;
    }

    function updateExerciseProgress(exId, isChecked) {
        const dateKey = getTodayLocalDate();
        if (!activeRoutine.progress_log) activeRoutine.progress_log = {};
        
        let completedList = activeRoutine.progress_log[dateKey] || [];

        if (isChecked) {
            if (!completedList.includes(exId)) completedList.push(exId);
        } else {
            completedList = completedList.filter(id => id !== exId);
        }

        activeRoutine.progress_log[dateKey] = completedList;

        // Recalculate percent bar
        const totalEx = activeRoutine.routine_plan.days[selectedDayIndex].exercises.length;
        calculateProgressPercent(totalEx, completedList.length);

        // Persistent save
        fetch(`${API_BASE_URL}/routines/progress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: currentUser,
                date: dateKey,
                completed_exercises: completedList
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                activeRoutine.progress_log = data.progress_log;
            }
        })
        .catch(err => console.log("Failed saving progress logs to database:", err));
    }

    function getTodayLocalDate() {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    if (currentUser) {
        loadChatPanel();
    } else {
        renderAuthPanel();
    }
});
