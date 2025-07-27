// Coach Mission Control - Demo Version
// Fehlerfreie JavaScript-Implementierung für Demo-Features

// Demo-Konfiguration
const DEMO_CONFIG = {
    maxSessions: 3,
    maxClients: 5,
    maxPrompts: 8,
    upgradePrice: 197,
    upgradeUrl: 'https://paypal.me/allensfl/197'
};

// Session-Tracking für Demo-Limits
class DemoSessionManager {
    constructor() {
        this.storageKey = 'coachMissionControlDemo';
        this.initStorage();
    }

    initStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify({
                sessionsUsed: 0,
                firstVisit: Date.now(),
                lastSession: null
            }));
        }
    }

    getSessionData() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || {};
        } catch (e) {
            console.warn('Demo session data corrupted, resetting...');
            this.initStorage();
            return this.getSessionData();
        }
    }

    incrementSession() {
        const data = this.getSessionData();
        data.sessionsUsed = (data.sessionsUsed || 0) + 1;
        data.lastSession = Date.now();
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        return data;
    }

    hasSessionsLeft() {
        const data = this.getSessionData();
        return (data.sessionsUsed || 0) < DEMO_CONFIG.maxSessions;
    }

    getSessionsRemaining() {
        const data = this.getSessionData();
        return Math.max(0, DEMO_CONFIG.maxSessions - (data.sessionsUsed || 0));
    }
}

// Demo Session Manager Instance
const demoSession = new DemoSessionManager();

// DOM Ready Handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('Coach Mission Control Demo - JavaScript geladen');
    
    // Initialize Demo Features
    initializeDemoFeatures();
    
    // Load Demo Clients
    loadDemoClients();
    
    // Setup Event Listeners
    setupEventListeners();
    
    // Update Session Counter
    updateSessionCounter();
});

function initializeDemoFeatures() {
    // Demo-Banner Status Check
    const demoBanner = document.querySelector('.demo-banner');
    if (demoBanner) {
        console.log('✅ Demo-Banner gefunden');
    } else {
        console.warn('⚠️ Demo-Banner nicht gefunden');
    }
    
    // Navigation Tabs
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', handleTabClick);
    });
    
    // Kollaboration Button
    const collabButton = document.querySelector('button[onclick*="collaboration"]');
    if (collabButton) {
        collabButton.onclick = openCollaborationTeaser;
    }
}

function loadDemoClients() {
    const clientsContainer = document.getElementById('clients-list');
    if (!clientsContainer) {
        console.warn('Clients container nicht gefunden');
        return;
    }
    
    // Demo-Clients aus data/clients.js sollten automatisch geladen werden
    // Hier nur Demo-Badge hinzufügen falls nötig
    setTimeout(() => {
        const clientCards = document.querySelectorAll('.client-card');
        clientCards.forEach(card => {
            if (!card.querySelector('.demo-badge')) {
                addDemoBadge(card);
            }
        });
    }, 500);
}

function addDemoBadge(clientCard) {
    const badge = document.createElement('div');
    badge.className = 'demo-badge';
    badge.innerHTML = '🎯 DEMO';
    badge.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.7rem;
        font-weight: bold;
        z-index: 10;
    `;
    
    clientCard.style.position = 'relative';
    clientCard.appendChild(badge);
}

function setupEventListeners() {
    // Coach-KI Button
    const coachButton = document.querySelector('button[onclick*="coach"], .nav-tab[data-tab="coach"]');
    if (coachButton) {
        coachButton.addEventListener('click', handleCoachKIClick);
    }
    
    // Upgrade Buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('upgrade-btn') || 
            e.target.textContent.includes('€197') ||
            e.target.textContent.includes('kaufen')) {
            handleUpgradeClick(e);
        }
    });
}

function handleTabClick(event) {
    event.preventDefault();
    
    const tab = event.currentTarget;
    const tabName = tab.dataset.tab || tab.textContent.toLowerCase();
    
    // Remove active class from all tabs
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    
    // Add active class to clicked tab
    tab.classList.add('active');
    
    // Show corresponding content
    showTabContent(tabName);
}

function showTabContent(tabName) {
    // Hide all content areas
    const contentAreas = document.querySelectorAll('.content-area, .tab-content');
    contentAreas.forEach(area => {
        area.style.display = 'none';
        area.classList.remove('active');
    });
    
    // Show specific content
    const targetContent = document.getElementById(tabName + '-content') || 
                         document.getElementById(tabName) ||
                         document.querySelector(`[data-tab="${tabName}"]`);
    
    if (targetContent) {
        targetContent.style.display = 'block';
        targetContent.classList.add('active');
    }
    
    console.log(`Tab gewechselt zu: ${tabName}`);
}

function handleCoachKIClick(event) {
    event.preventDefault();
    
    if (!demoSession.hasSessionsLeft()) {
        showSessionLimitModal();
        return;
    }
    
    // Session verwenden
    const sessionData = demoSession.incrementSession();
    
    // Coach-KI Interface anzeigen
    showCoachKI();
    
    // Session Counter aktualisieren
    updateSessionCounter();
    
    console.log(`Coach-KI Session gestartet. Verbleibend: ${demoSession.getSessionsRemaining()}`);
}

function showCoachKI() {
    // Coach-KI Tab aktivieren
    const coachTab = document.querySelector('[data-tab="coach"], .nav-tab:last-child');
    if (coachTab) {
        coachTab.click();
    }
    
    // Demo-Prompts laden
    loadDemoPrompts();
}

function loadDemoPrompts() {
    const promptsContainer = document.getElementById('prompts-container') || 
                           document.querySelector('.prompts-list');
    
    if (!promptsContainer) {
        console.warn('Prompts container nicht gefunden');
        return;
    }
    
    // Demo-Hinweis hinzufügen
    if (!promptsContainer.querySelector('.demo-prompts-info')) {
        const demoInfo = document.createElement('div');
        demoInfo.className = 'demo-prompts-info';
        demoInfo.innerHTML = `
            <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 12px; margin-bottom: 20px;">
                <strong>🎯 Demo-Version:</strong> 8 von 65+ Prompts verfügbar
                <a href="${DEMO_CONFIG.upgradeUrl}" style="float: right; color: #007bff;">Vollversion für €${DEMO_CONFIG.upgradePrice} kaufen</a>
            </div>
        `;
        promptsContainer.insertBefore(demoInfo, promptsContainer.firstChild);
    }
}

function showSessionLimitModal() {
    // Modal HTML erstellen
    const modalHTML = `
        <div id="session-limit-modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <h2 style="color: #dc3545; margin-bottom: 20px;">🚫 Demo-Limit erreicht</h2>
                <p style="margin-bottom: 25px; line-height: 1.6;">
                    Sie haben alle <strong>3 Demo-Sessions</strong> verwendet.<br>
                    Schalten Sie jetzt die Vollversion frei für unbegrenztes Coaching!
                </p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                    <h4 style="color: #28a745; margin-bottom: 15px;">✅ Vollversion beinhaltet:</h4>
                    <ul style="text-align: left; margin: 0; padding-left: 20px;">
                        <li>65+ professionelle Coaching-Prompts</li>
                        <li>Unbegrenzte Coach-KI Sessions</li>
                        <li>Live-Kollaboration mit Klienten</li>
                        <li>Voice-to-Text Integration</li>
                        <li>Session-Aufzeichnung</li>
                        <li>Geissler-Methodik komplett</li>
                    </ul>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <span style="text-decoration: line-through; color: #999;">€2.997</span>
                    <span style="color: #dc3545; font-size: 1.2em; margin: 0 10px;">→</span>
                    <span style="color: #28a745; font-size: 1.4em; font-weight: bold;">€${DEMO_CONFIG.upgradePrice}</span>
                    <div style="color: #666; font-size: 0.9em;">Einführungspreis - später €297</div>
                </div>
                
                <button onclick="window.open('${DEMO_CONFIG.upgradeUrl}', '_blank')" style="
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 25px;
                    font-size: 1.1em;
                    font-weight: bold;
                    cursor: pointer;
                    margin-right: 15px;
                    transition: transform 0.2s;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    🛒 Jetzt für €${DEMO_CONFIG.upgradePrice} kaufen
                </button>
                
                <button onclick="closeSessionLimitModal()" style="
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 15px 25px;
                    border-radius: 25px;
                    cursor: pointer;
                ">
                    Demo weiter erkunden
                </button>
            </div>
        </div>
    `;
    
    // Modal zum DOM hinzufügen
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeSessionLimitModal() {
    const modal = document.getElementById('session-limit-modal');
    if (modal) {
        modal.remove();
    }
}

function handleUpgradeClick(event) {
    event.preventDefault();
    
    // Analytics Event (falls verfügbar)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'upgrade_click', {
            'event_category': 'demo',
            'event_label': 'upgrade_button',
            'value': DEMO_CONFIG.upgradePrice
        });
    }
    
    // PayPal öffnen
    window.open(DEMO_CONFIG.upgradeUrl, '_blank');
}

function updateSessionCounter() {
    const remaining = demoSession.getSessionsRemaining();
    
    // Session Counter im UI aktualisieren
    const counters = document.querySelectorAll('.session-counter, #session-counter');
    counters.forEach(counter => {
        counter.textContent = `${remaining} Demo-Sessions verbleibend`;
        
        if (remaining === 0) {
            counter.style.color = '#dc3545';
            counter.style.fontWeight = 'bold';
        } else if (remaining === 1) {
            counter.style.color = '#ffc107';
        }
    });
    
    // Coach-KI Button deaktivieren wenn keine Sessions
    const coachButtons = document.querySelectorAll('button[onclick*="coach"], .nav-tab[data-tab="coach"]');
    coachButtons.forEach(button => {
        if (remaining === 0) {
            button.style.opacity = '0.6';
            button.style.cursor = 'not-allowed';
        }
    });
}

function openCollaborationTeaser() {
    // Kollaboration-Teaser Modal öffnen
    window.open('./collaboration-gray-standalone.html', 'collaboration', 'width=800,height=600,scrollbars=yes');
}

// Globale Funktionen für HTML onclick-Events
window.closeSessionLimitModal = closeSessionLimitModal;
window.openCollaborationTeaser = openCollaborationTeaser;

// Error Handling
window.addEventListener('error', function(e) {
    console.warn('Demo JS Error caught:', e.message);
    // Stille Fehlerbehandlung - Demo soll trotzdem funktionieren
});

// Unhandled Promise Rejections
window.addEventListener('unhandledrejection', function(e) {
    console.warn('Demo Promise Rejection caught:', e.reason);
    e.preventDefault(); // Verhindert Console-Spam
});

// Demo-spezifische Hilfsfunktionen
function showDemoTooltip(element, message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'demo-tooltip';
    tooltip.textContent = message;
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
    
    setTimeout(() => tooltip.remove(), 3000);
}

// Demo Analytics (vereinfacht)
function trackDemoEvent(eventName, properties = {}) {
    console.log('Demo Event:', eventName, properties);
    
    // Hier könnte später echtes Analytics implementiert werden
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'event_category': 'demo',
            ...properties
        });
    }
}

// Page Visibility für Demo-Tracking
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        trackDemoEvent('demo_pause');
    } else {
        trackDemoEvent('demo_resume');
    }
});

console.log('✅ Coach Mission Control Demo JavaScript vollständig geladen');
console.log(`📊 Demo Status: ${demoSession.getSessionsRemaining()} Sessions verbleibend`);