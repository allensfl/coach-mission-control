// Coach Mission Control - Demo Version
// Fehlerfreie JavaScript-Implementierung für Demo-Features mit Client-Rendering

// Demo-Konfiguration
const DEMO_CONFIG = {
    maxSessions: 103,
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
    // FIX: Demo-Banner Selector - multiple attempts
    const demoBanner = document.querySelector('.demo-version-banner') ||
                      document.querySelector('.demo-banner') ||
                      document.querySelector('[class*="demo"]') ||
                      document.querySelector('.banner');
    
    if (demoBanner) {
        console.log('✅ Demo-Banner gefunden');
    } else {
        console.warn('⚠️ Demo-Banner nicht gefunden - aber nicht kritisch');
    }
    
    // Navigation Tabs - multiple selectors
    const tabs = document.querySelectorAll('.nav-tab, .tab-btn, [data-tab]');
    tabs.forEach(tab => {
        tab.addEventListener('click', handleTabClick);
    });
    
    // Kollaboration Button
    const collabButton = document.querySelector('button[onclick*="collaboration"]') ||
                        document.querySelector('[data-tab="collaboration"]') ||
                        document.querySelector('.tab-btn[data-tab="kollaboration"]');
    
    if (collabButton) {
        collabButton.onclick = openCollaborationTeaser;
    }
    
    console.log('✅ Demo-Features initialisiert');
}

function loadDemoClients() {
    // FIX: Richtiger Selector für clientsContainer
    const clientsContainer = document.getElementById('clientsContainer') || 
                            document.getElementById('clients-list') ||
                            document.querySelector('.clients-container');
    
    if (!clientsContainer) {
        console.warn('Clients container nicht gefunden - checking alternative selectors');
        return;
    }
    
    console.log('✅ Clients container gefunden:', clientsContainer.id);
    
    // NEU: Client-Cards dynamisch erstellen
    if (window.clients && window.clients.length > 0) {
        renderClientCards(clientsContainer);
    } else {
        // Warten bis clients.js geladen ist
        setTimeout(() => {
            if (window.clients && window.clients.length > 0) {
                renderClientCards(clientsContainer);
            } else {
                console.warn('window.clients nicht verfügbar - versuche erneut in 2 Sekunden');
                setTimeout(() => {
                    if (window.clients && window.clients.length > 0) {
                        renderClientCards(clientsContainer);
                    }
                }, 2000);
            }
        }, 1000);
    }
}

// NEU: Funktion zum Rendern der Client-Cards
function renderClientCards(container) {
    console.log(`🎯 Rendering ${window.clients.length} demo clients`);
    
    container.innerHTML = ''; // Container leeren
    
    window.clients.forEach(client => {
        const clientCard = document.createElement('div');
        clientCard.className = 'client-card';
        clientCard.style.cssText = `
            background: white;
            border: 2px solid #e2e8f0;
            border-left: 4px solid #10b981;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 15px;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        
        clientCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1;">
                    <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 1.2em;">
                        ${client.name}
                    </h3>
                    <p style="margin: 0 0 5px 0; color: #64748b; font-size: 0.9em;">
                        <strong>${client.age} Jahre</strong> • ${client.profession}
                    </p>
                    <p style="margin: 0 0 10px 0; color: #475569; line-height: 1.4;">
                        <strong>Situation:</strong> ${client.situation}
                    </p>
                    <p style="margin: 0; color: #059669; font-weight: 500;">
                        <strong>Ziele:</strong> ${client.goals}
                    </p>
                </div>
            </div>
        `;
        
        // Demo-Badge hinzufügen
        addDemoBadge(clientCard);
        
        // Click-Handler
        clientCard.addEventListener('click', (event) => {
            selectClient(client, event);
        });
        
        // Hover-Effekte
        clientCard.addEventListener('mouseenter', () => {
            clientCard.style.transform = 'translateY(-2px)';
            clientCard.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            clientCard.style.borderColor = '#10b981';
        });
        
        clientCard.addEventListener('mouseleave', () => {
            clientCard.style.transform = 'translateY(0)';
            clientCard.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            clientCard.style.borderColor = '#e2e8f0';
        });
        
        container.appendChild(clientCard);
    });
    
    console.log(`✅ ${window.clients.length} client cards erfolgreich gerendert`);
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
    
    clientCard.appendChild(badge);
}

// NEU: Client-Auswahl Funktion
function selectClient(client, event) {
    console.log('Client ausgewählt:', client.name);
    
    // Alle Cards deselektieren
    document.querySelectorAll('.client-card').forEach(card => {
        card.style.borderLeftColor = '#10b981';
        card.style.backgroundColor = 'white';
    });
    
    // Aktuelle Card markieren
    const currentCard = event.target.closest('.client-card');
    currentCard.style.borderLeftColor = '#3b82f6';
    currentCard.style.backgroundColor = '#f8fafc';
    
    // Session-Button anzeigen
    const sessionBtn = document.getElementById('startSessionBtn');
    if (sessionBtn) {
        sessionBtn.style.display = 'inline-block';
        sessionBtn.onclick = () => startSessionWithClient(client);
    }
    
    // Demo-Event tracking
    trackDemoEvent('client_selected', {
        client_name: client.name,
        client_profession: client.profession
    });
}

// NEU: Session mit Klient starten
function startSessionWithClient(client) {
    if (!demoSession.hasSessionsLeft()) {
        showSessionLimitModal();
        return;
    }
    
    console.log('Session gestartet mit:', client.name);
    
    // Session verwenden
    demoSession.incrementSession();
    updateSessionCounter();
    
    // Zum Coach-KI Tab wechseln
    const coachTab = document.querySelector('[data-tab="coach-ki"]') ||
                    document.querySelector('.tab-btn:last-child') ||
                    document.querySelector('[onclick*="coach"]');
    if (coachTab) {
        coachTab.click();
    }
    
    // Client-Info im Coach-Interface anzeigen
    displayClientInfo(client);
    
    trackDemoEvent('session_started', {
        client_name: client.name,
        sessions_remaining: demoSession.getSessionsRemaining()
    });
}

// NEU: Client-Info im Coach-Interface
function displayClientInfo(client) {
    console.log('Coaching-Session für:', client.name);
    
    // Info im Coach-Tab anzeigen
    setTimeout(() => {
        const coachingArea = document.querySelector('#coachingTab, [id*="coach"]') ||
                           document.querySelector('.tab-content:last-child');
        
        if (coachingArea) {
            const clientInfo = document.createElement('div');
            clientInfo.className = 'current-client-info';
            clientInfo.style.cssText = `
                background: #f0f9ff;
                border: 1px solid #0ea5e9;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
            `;
            
            clientInfo.innerHTML = `
                <h4 style="margin: 0 0 10px 0; color: #0c4a6e;">
                    🎯 Coaching-Session mit ${client.name}
                </h4>
                <p style="margin: 0; color: #075985; font-size: 0.9em;">
                    ${client.profession} • Ziel: ${client.goals}
                </p>
            `;
            
            // Alte Client-Info entfernen
            const oldInfo = coachingArea.querySelector('.current-client-info');
            if (oldInfo) oldInfo.remove();
            
            // Neue Info einfügen
            coachingArea.insertBefore(clientInfo, coachingArea.firstChild);
        }
    }, 100);
}

function setupEventListeners() {
    // Coach-KI Button - multiple selectors
    const coachButton = document.querySelector('button[onclick*="coach"]') ||
                       document.querySelector('.nav-tab[data-tab="coach"]') ||
                       document.querySelector('.tab-btn[data-tab="coach-ki"]') ||
                       document.querySelector('[data-tab="coaching"]');
    
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
    const tabName = tab.dataset.tab || 
                   tab.textContent.toLowerCase().replace(/[^a-z]/g, '') ||
                   'clients';
    
    // Remove active class from all tabs
    document.querySelectorAll('.nav-tab, .tab-btn').forEach(t => t.classList.remove('active'));
    
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
    
    // Show specific content - multiple selector attempts
    const targetContent = document.getElementById(tabName + 'Tab') ||          // clientsTab
                         document.getElementById(tabName + '-content') ||      // clients-content
                         document.getElementById(tabName) ||                   // clients
                         document.querySelector(`[data-tab="${tabName}"]`) ||  // data-tab
                         document.getElementById('clientsTab');                // fallback
    
    if (targetContent) {
        targetContent.style.display = 'block';
        targetContent.classList.add('active');
        console.log(`✅ Tab gewechselt zu: ${tabName}`);
    } else {
        console.warn(`⚠️ Tab content nicht gefunden für: ${tabName}`);
        // Fallback - zeige ersten verfügbaren Tab
        const firstTab = document.querySelector('.tab-content');
        if (firstTab) {
            firstTab.style.display = 'block';
            firstTab.classList.add('active');
        }
    }
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
    // Coach-KI Tab aktivieren - multiple attempts
    const coachTab = document.querySelector('[data-tab="coach"]') ||
                    document.querySelector('[data-tab="coach-ki"]') ||
                    document.querySelector('.nav-tab:last-child') ||
                    document.querySelector('.tab-btn:last-child');
    
    if (coachTab) {
        coachTab.click();
    }
    
    // Demo-Prompts laden
    loadDemoPrompts();
}

function loadDemoPrompts() {
    const promptsContainer = document.getElementById('prompts-container') || 
                           document.querySelector('.prompts-list') ||
                           document.querySelector('[class*="prompt"]');
    
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
window.selectClient = selectClient;
window.startSessionWithClient = startSessionWithClient;

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