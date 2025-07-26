/* ===== COACH.JS - Coach Interface Logik ===== */

// Coach-spezifische Funktionen
const CoachInterface = {
    init() {
        this.setupTabs();
        this.renderClients();
        this.renderPrompts();
        this.updatePromptStats();
        this.setupCategoryFilter();
        this.setupCollaborationMonitor();
        
        console.log('🎯 Coach Interface initialisiert');
    },

    // Tab-Navigation
    setupTabs() {
        DOM.findAll('.tab-btn').forEach(btn => {
            DOM.on(btn, 'click', () => {
                const targetTab = btn.getAttribute('data-tab');
                this.showTab(targetTab);
            });
        });
    },

    showTab(tabName) {
        // Alle Tabs deaktivieren
        DOM.findAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        DOM.findAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Gewählten Tab aktivieren
        const tabBtn = DOM.find(`[data-tab="${tabName}"]`);
        const tabContent = DOM.find(`#${tabName}Tab`);
        
        if (tabBtn && tabContent) {
            tabBtn.classList.add('active');
            tabContent.classList.add('active');
        }
    },

    // Klienten-Management
    renderClients() {
        const container = DOM.find('#clientsContainer');
        if (!container || !window.clients) return;

        DOM.empty(container);
        
        window.clients.forEach(client => {
            const clientCard = DOM.create('div', {
                className: 'client-card',
                'data-client-id': client.id,
                innerHTML: `
                    <div style="font-size: 1.3rem; font-weight: 700; color: #1e293b; margin-bottom: 8px;">
                        ${client.name}
                    </div>
                    <div style="color: #64748b; margin-bottom: 12px;">
                        <span style="font-weight: 600; color: #3b82f6;">${client.age} Jahre</span> • ${client.profession}
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                        ${client.topics.map(topic => 
                            `<span style="background: rgba(59,130,246,0.1); color: #3b82f6; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem;">${topic}</span>`
                        ).join('')}
                    </div>
                `
            });

            DOM.on(clientCard, 'click', () => this.selectClient(client.id));
            container.appendChild(clientCard);
        });
    },

    selectClient(clientId) {
        const client = window.clients.find(c => c.id === clientId);
        if (!client) return;

        window.coachingApp.selectedClient = client;
        
        // Visual feedback
        DOM.findAll('.client-card').forEach(card => {
            card.classList.remove('selected');
        });
        DOM.find(`[data-client-id="${clientId}"]`).classList.add('selected');
        
        // Session-Button anzeigen
        const startBtn = DOM.find('#startSessionBtn');
        if (startBtn) {
            startBtn.style.display = 'block';
            Utils.animateElement(startBtn, 'fade-in');
        }
        
        Utils.showToast(`Klient ausgewählt: ${client.name}`, 'success');
        console.log('✅ Klient ausgewählt:', client.name);
    },

    // Prompt-Management
    renderPrompts() {
        const container = DOM.find('#promptsContainer');
        const categoryFilter = DOM.find('#categoryFilter').value || '';
        
        if (!container || !window.prompts) return;

        const filteredPrompts = Object.entries(window.prompts).filter(([key, prompt]) => {
            return !categoryFilter || prompt.category === categoryFilter;
        });

        DOM.empty(container);
        
        filteredPrompts.forEach(([key, prompt]) => {
            const promptCard = DOM.create('div', {
                className: 'prompt-card',
                innerHTML: `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <strong style="color: #3b82f6; font-size: 1.1rem;">${key}</strong>
                        <span class="category-tag">${prompt.category}</span>
                    </div>
                    <div style="font-weight: 600; color: #374151; margin-bottom: 8px;">
                        ${prompt.description}
                    </div>
                    <div style="font-size: 0.9rem; color: #64748b; line-height: 1.4;">
                        ${Utils.truncateText(prompt.text, 100)}
                    </div>
                `
            });

            DOM.on(promptCard, 'click', () => this.usePrompt(key));
            container.appendChild(promptCard);
        });

        this.updatePromptStats();
    },

    usePrompt(promptKey) {
        const prompt = window.prompts[promptKey];
        if (!prompt) return;

        window.coachingApp.currentPrompt = prompt;
        const editor = DOM.find('#promptEditor');
        
        if (editor) {
            editor.value = `${promptKey}: ${prompt.description}\n\n${prompt.text}`;
            Utils.animateElement(editor, 'fade-in');
        }
        
        Utils.showToast(`Prompt geladen: ${promptKey}`, 'success');
        console.log('✅ Prompt geladen:', promptKey);
    },

    updatePromptStats() {
        const statsElement = DOM.find('#promptStats');
        if (!statsElement || !window.prompts) return;

        const totalPrompts = Object.keys(window.prompts).length;
        const categories = [...new Set(Object.values(window.prompts).map(p => p.category))];
        
        statsElement.innerHTML = `
            <strong>Prompts verfügbar: ${totalPrompts}</strong><br>
            <span style="font-size: 0.9rem; color: #64748b;">
                Kategorien: ${categories.join(', ')} | 
                GT: ${Object.values(window.prompts).filter(p => p.category === 'GT').length} | 
                SF: ${Object.values(window.prompts).filter(p => p.category === 'SF').length} | 
                DIAG: ${Object.values(window.prompts).filter(p => p.category === 'DIAG').length} | 
                LÖS: ${Object.values(window.prompts).filter(p => p.category === 'LÖS').length}
            </span>
        `;
    },

    setupCategoryFilter() {
        const filter = DOM.find('#categoryFilter');
        if (!filter || !window.prompts) return;

        const categories = [...new Set(Object.values(window.prompts).map(p => p.category))];
        
        categories.forEach(category => {
            const option = DOM.create('option', {
                value: category,
                textContent: `${category} (${Object.values(window.prompts).filter(p => p.category === category).length})`
            });
            filter.appendChild(option);
        });
        
        DOM.on(filter, 'change', () => this.renderPrompts());
    },

    // Kollaboration
    setupCollaborationMonitor() {
        if (!window.coachingComm) return;

        // Status-Updates überwachen
        window.coachingComm.onStatusChange((status) => {
            const statusElement = DOM.find('#connectionStatus');
            if (statusElement) {
                statusElement.textContent = status;
            }
        });

        // Nachrichten-Updates überwachen
        window.coachingComm.onMessagesUpdate((messages) => {
            this.updateCollaborationDisplay(messages);
        });
    },

    updateCollaborationDisplay(messages) {
        const container = DOM.find('#collaborationMessages');
        if (!container) return;

        if (messages.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: #64748b; padding: 40px;">
                    Hier sehen Sie den Dialog zwischen Coach und Coachee.<br>
                    Öffnen Sie das Kollaborations-Fenster für den Coachee.
                </div>
            `;
            
            // Actions ausblenden wenn keine Nachrichten
            const actions = DOM.find('#collaborationActions');
            if (actions) {
                actions.style.display = 'none';
            }
            return;
        }

        DOM.empty(container);
        
        messages.forEach(message => {
            const messageDiv = DOM.create('div', {
                className: `message ${message.sender.toLowerCase().replace(/[^a-z]/g, '')}`,
                innerHTML: `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="font-weight: bold; color: #3b82f6;">${this.getSenderDisplay(message.sender)}</span>
                        <span style="color: #64748b; font-size: 0.9rem;">${Utils.formatTime(message.timestamp)}</span>
                    </div>
                    <div style="line-height: 1.6;">${Utils.escapeHtml(message.content)}</div>
                `
            });
            container.appendChild(messageDiv);
        });

        MessageHelpers.scrollToBottom(container);
        
        // Actions anzeigen wenn Nachrichten vorhanden
        this.showCollaborationActions();
    },

    getSenderDisplay(sender) {
        const mapping = {
            'coach': '👨‍💼 Coach',
            'coachee': '👤 Coachee', 
            'system': '🎯 System',
            'kicoach': '🤖 KI-Coach',
            'ki-coach': '🤖 KI-Coach'
        };
        
        const key = sender.toLowerCase().replace(/[^a-z]/g, '');
        return mapping[key] || sender;
    },

    showCollaborationActions() {
        const actions = DOM.find('#collaborationActions');
        if (actions) {
            actions.style.display = 'flex';
            actions.innerHTML = `
                <button onclick="sendDialogToAI()" class="send-ai-btn">
                    🤖 Dialog an KI senden
                </button>
                <button onclick="openCollaborationWindow()" class="open-collab-btn">
                    🔗 Kollaborations-Fenster öffnen
                </button>
                <button onclick="editPrompt()" class="edit-btn">
                    ✏️ Zurück zum Editor
                </button>
            `;
        }
    },

    // Coach-KI
    setupCoachKI() {
        // Schnellzugriff-Buttons
        const processBtn = DOM.find('[onclick="loadProcessSupport()"]');
        const methodsBtn = DOM.find('[onclick="loadMethodenBeratung()"]');
        const interventionBtn = DOM.find('[onclick="loadInterventionshilfe()"]');
        const emergencyBtn = DOM.find('[onclick="loadNotfallSupport()"]');

        if (processBtn) DOM.on(processBtn, 'click', () => this.loadProcessSupport());
        if (methodsBtn) DOM.on(methodsBtn, 'click', () => this.loadMethodenBeratung());
        if (interventionBtn) DOM.on(interventionBtn, 'click', () => this.loadInterventionshilfe());
        if (emergencyBtn) DOM.on(emergencyBtn, 'click', () => this.loadNotfallSupport());
    },

    // Coach-KI Load-Funktionen korrigiert
    loadProcessSupport() {
        const input = DOM.find('#coachInput');
        const phase = DOM.find('#sessionPhase');
        
        if (input) input.value = 'Ich brauche Unterstützung bei der Prozesssteuerung. Wo stehen wir gerade und was ist der beste nächste Schritt?';
        if (phase) phase.value = 'Meta: Prozessreflexion';
        
        console.log('🔧 Prozess-Support geladen');
    },

    loadMethodenBeratung() {
        const input = DOM.find('#coachInput');
        if (input) input.value = 'Welche Coaching-Methode oder Intervention wäre jetzt am passendsten für meinen Coachee?';
        
        console.log('🛠️ Methoden-Beratung geladen');
    },

    loadInterventionshilfe() {
        const input = DOM.find('#coachInput');
        if (input) input.value = 'Mein Coachee zeigt [Verhalten/Reaktion]. Wie gehe ich damit professionell um?';
        
        console.log('🎯 Interventionshilfe geladen');
    },

    loadNotfallSupport() {
        const input = DOM.find('#coachInput');
        const urgency = DOM.find('#urgency');
        
        if (input) input.value = 'NOTFALL: Ich erkenne Warnsignale bei meinem Coachee und brauche sofortige Handlungsempfehlungen.';
        if (urgency) urgency.value = 'Notfall';
        
        console.log('🚨 Notfall-Support geladen');
    }
};

// Globale Funktionen für HTML-Aufrufe
window.startSession = function() {
    if (!window.coachingApp.selectedClient) {
        Utils.showToast('Bitte wählen Sie zuerst einen Klienten aus.', 'error');
        return;
    }
    
    // Messages bei neuer Session leeren
    if (window.coachingComm) {
        window.coachingComm.clearMessages();
        console.log('🗑️ Messages für neue Session geleert');
    }
    
    CoachInterface.showTab('coaching');
    SessionTimer.start();
    
    if (window.coachingComm) {
        window.coachingComm.addMessage('System', `Session gestartet für ${window.coachingApp.selectedClient.name}`, 'system');
    }
    
    Utils.showToast(`Session gestartet für ${window.coachingApp.selectedClient.name}`, 'success');
    console.log('🚀 Session gestartet für:', window.coachingApp.selectedClient.name);
};

window.sendToCollaboration = function() {
    const editor = DOM.find('#promptEditor');
    const content = editor?.value?.trim();
    
    if (!content) {
        Utils.showToast('Bitte geben Sie einen Prompt ein.', 'error');
        return;
    }
    
    if (!window.coachingComm) {
        Utils.showToast('Kommunikation nicht verfügbar.', 'error');
        return;
    }
    
    // Nachricht zur Kollaboration senden
    window.coachingComm.addMessage('Coach', content);
    
    // Zur Kollaborations-Tab wechseln
    CoachInterface.showTab('collaboration');
    
    Utils.showToast('Prompt an Coachee gesendet', 'success');
    console.log('✅ Prompt an Kollaboration gesendet');
};

// "Dialog an KI senden" Funktion
window.sendDialogToAI = function() {
    const messages = window.coachingComm?.getMessages() || [];
    
    if (messages.length === 0) {
        Utils.showToast('Keine Nachrichten zum Senden vorhanden.', 'error');
        return;
    }
    
    // Dialog zu KI-readable Format konvertieren
    const dialog = messages.map(msg => `${msg.sender}: ${msg.content}`).join('\n\n');
    
    // Intelligente KI-Antwort basierend auf Dialog generieren
    const aiResponse = generateAIResponse(dialog, messages);
    
    // KI-Antwort zur Kollaboration hinzufügen
    window.coachingComm.addMessage('KI-Coach', aiResponse);
    
    Utils.showToast('Dialog an KI gesendet - Antwort erhalten!', 'success');
    console.log('🤖 KI-Antwort generiert für Dialog');
};

// "An KI senden" Funktion - schickt den kompletten Dialog an die KI
window.sendToAI = function() {
    // Umleitung zur neuen Funktion
    sendDialogToAI();
};

// KI-Antwort basierend auf Dialogverlauf generieren
function generateAIResponse(dialog, messages) {
    const lastMessage = messages[messages.length - 1];
    const dialogLower = dialog.toLowerCase();
    
    // Analyse des Dialogs
    if (dialogLower.includes('gt1') || dialogLower.includes('anliegen')) {
        return `Vielen Dank für das Vertrauen, dass Sie Ihr Anliegen mit mir teilen. Was Sie beschreiben, zeigt wichtige Reflexions- und Entwicklungsbereitschaft. 

Ich höre heraus, dass Sie bereit sind, strukturiert an diesem Thema zu arbeiten. Das ist bereits eine wertvolle Ressource.

Zur Vertiefung: Wenn Sie Ihre Situation in einem Bild beschreiben müssten - welches Bild würden Sie wählen? Was würde dieses Bild über Ihr Anliegen aussagen?`;
    }
    
    if (dialogLower.includes('wunderfrage') || dialogLower.includes('wunder')) {
        return `Diese Wunderfrage öffnet wichtige Perspektiven! Ihre Antwort zeigt mir, dass Sie bereits eine klare Vorstellung von der gewünschten Zukunft haben.

Besonders wertvoll finde ich [konkretes Detail aus der Antwort]. Das zeigt mir Ihre Klarheit über das Ziel.

Nächster Schritt: Was von dem, was Sie im "Wunder-Zustand" beschrieben haben, ist heute - auch nur in kleinen Ansätzen - bereits vorhanden?`;
    }
    
    if (dialogLower.includes('ressourcen') || dialogLower.includes('stärken')) {
        return `Ich bin beeindruckt von den Ressourcen, die Sie mitbringen! Sie unterschätzen vermutlich Ihre Fähigkeiten.

Besonders die [erwähnte Stärke] ist eine echte Superkraft, die Ihnen in Ihrer aktuellen Situation sehr helfen kann.

Frage zur Vertiefung: Wie könnten Sie diese Stärke noch gezielter für Ihr aktuelles Anliegen einsetzen? Was würde sich dadurch verändern?`;
    }
    
    if (dialogLower.includes('hindernis') || dialogLower.includes('widerstand')) {
        return `Danke für diese ehrliche Reflexion über mögliche Hindernisse. Das zeigt Ihre realistische Einschätzung und Vorausplanung.

Ich sehe in dem, was Sie als "Hindernis" beschreiben, auch einen Teil von Ihnen, der Sie schützen möchte. Jeder Widerstand hat meist eine positive Absicht.

Lassen Sie uns erkunden: Wenn dieses Hindernis Ihr Freund wäre - was würde es Ihnen Gutes tun wollen? Wovor möchte es Sie bewahren?`;
    }
    
    // Standard-Antwort basierend auf letzter Nachricht
    if (lastMessage.sender === 'Coachee') {
        return `Vielen Dank für diese offene Antwort. Ich merke, wie Sie sich Gedanken machen und reflektieren - das ist ein wichtiger Teil des Coaching-Prozesses.

Was Sie beschreiben, zeigt mir Ihre Bereitschaft zur Veränderung und gleichzeitig eine gesunde Vorsicht. Beides ist wertvoll.

Meine Beobachtung: Sie haben bereits mehr Klarheit über Ihr Thema, als Sie vielleicht denken. 

Um den nächsten Schritt zu finden: Was fühlt sich für Sie als der natürlichste nächste Schritt an?`;
    }
    
    return `Ich schätze die Offenheit und Tiefe unseres Gesprächs. Ihre Bereitschaft zur Reflexion und Ihr Mut, sich diesen Fragen zu stellen, sind bemerkenswert.

Was ich in unserem Dialog wahrnehme: Sie sind bereits auf einem guten Weg und haben mehr Ressourcen, als Sie sich vielleicht bewusst sind.

Lassen Sie uns gemeinsam den nächsten Schritt erkunden. Was resoniert am stärksten mit Ihnen aus unserem bisherigen Gespräch?`;
}

// Prompt Editor zurück
window.editPrompt = function() {
    CoachInterface.showTab('coaching');
};

window.clearEditor = function() {
    const editor = DOM.find('#promptEditor');
    if (editor) {
        editor.value = '';
        Utils.showToast('Editor geleert', 'info');
    }
};

window.askCoachKI = function() {
    const input = DOM.find('#coachInput');
    const phase = DOM.find('#sessionPhase');
    const coacheeType = DOM.find('#coacheeType');
    const urgency = DOM.find('#urgency');
    
    if (!input?.value?.trim()) {
        Utils.showToast('Bitte beschreiben Sie Ihre Coaching-Situation.', 'error');
        return;
    }
    
    const response = CoachKI.generateResponse(
        input.value.trim(),
        phase?.value || '',
        coacheeType?.value || '',
        urgency?.value || ''
    );
    
    CoachKI.displayResponse(response);
    Utils.showToast('Coach-KI Antwort generiert', 'success');
    
    console.log('🧠 Coach-KI Response:', response);
};

window.clearCoachInput = function() {
    const input = DOM.find('#coachInput');
    const responseDiv = DOM.find('#coachKIResponse');
    
    if (input) input.value = '';
    if (responseDiv) responseDiv.style.display = 'none';
    
    Utils.showToast('Eingabe geleert', 'info');
};

// Coach-KI Logic
const CoachKI = {
    generateResponse(input, phase, coacheeType, urgency) {
        const inputLower = input.toLowerCase();
        
        // Notfall-Situationen erkennen
        if (inputLower.includes('suizid') || inputLower.includes('selbstverletzung') || urgency === 'Notfall') {
            return {
                category: 'NOTFALL',
                content: `<strong>🚨 NOTFALL-PROTOKOLL:</strong><br><br>
                1. <strong>Sofortige Sicherstellung:</strong> Direkt ansprechen und Sicherheit evaluieren<br>
                2. <strong>Professionelle Hilfe:</strong> Umgehend an Krisenintervention/Therapeuten weiterleiten<br>
                3. <strong>Dokumentation:</strong> Gespräch dokumentieren, Maßnahmen festhalten<br>
                4. <strong>Nachsorge:</strong> Follow-up vereinbaren, weitere Unterstützung organisieren<br><br>
                <em>⚠️ Dies überschreitet die Coaching-Grenzen. Therapeutische Intervention erforderlich.</em>`
            };
        }
        
        // Prozess-Support
        if (inputLower.includes('prozess') || inputLower.includes('stuck') || inputLower.includes('weiter')) {
            return {
                category: 'PROZESS',
                content: `<strong>⚙️ Prozess-Empfehlung für ${phase}:</strong><br><br>
                Basierend auf "${phase}" und Coachee-Typ "${coacheeType}" empfehle ich:<br><br>
                • <strong>Aktuelle Situation:</strong> Kurze Standortbestimmung mit dem Coachee<br>
                • <strong>Nächster Schritt:</strong> ${this.getNextStepRecommendation(phase)}<br>
                • <strong>Methodenvorschlag:</strong> ${this.getMethodRecommendation(phase, coacheeType)}<br>
                • <strong>Zeitrahmen:</strong> ca. 15-20 Minuten für diese Intervention<br><br>
                <em>💡 Tipp: Bei Widerstand zunächst würdigen, dann alternative Herangehensweise anbieten.</em>`
            };
        }
        
        // Methoden-Beratung
        if (inputLower.includes('methode') || inputLower.includes('technik') || inputLower.includes('intervention')) {
            return {
                category: 'METHODIK',
                content: `<strong>🛠️ Methodische Empfehlung:</strong><br><br>
                Für Ihre Situation in "${phase}" mit "${coacheeType}" eignen sich:<br><br>
                1. <strong>Primär-Methode:</strong> ${this.getPrimaryMethod(inputLower, phase)}<br>
                2. <strong>Fallback-Option:</strong> Falls Widerstand auftritt<br>
                3. <strong>Vertiefung:</strong> Bei besonders guter Resonanz<br><br>
                <strong>Konkrete Anwendung:</strong><br>
                ${this.getConcreteApplication(inputLower, coacheeType)}<br><br>
                <em>📋 Dokumentation: Notieren Sie die Wirksamkeit für zukünftige Sessions.</em>`
            };
        }
        
        // Widerstand/schwierige Situationen
        if (inputLower.includes('widerstand') || inputLower.includes('schwierig') || inputLower.includes('blockiert')) {
            return {
                category: 'WIDERSTAND',
                content: `<strong>🎯 Widerstandsarbeit:</strong><br><br>
                <strong>Würdigender Ansatz:</strong><br>
                "Ich merke, dass hier etwas in Ihnen zögert/bremst. Das ist völlig berechtigt und schützt Sie wahrscheinlich vor etwas. Mögen Sie mir erzählen, was diese innere Stimme zu bedenken gibt?"<br><br>
                <strong>Positive Absicht erkunden:</strong><br>
                • Was will dieser Anteil für Sie Gutes?<br>
                • Vor was schützt er Sie?<br>
                • Welche Erfahrungen stehen dahinter?<br><br>
                <strong>Integration statt Überwindung:</strong><br>
                Ziel ist nicht, den Widerstand zu brechen, sondern zu verstehen und zu integrieren.<br><br>
                <em>🤝 Denken Sie daran: Widerstand ist Information, nicht Opposition.</em>`
            };
        }
        
        // Standard-Beratung
        return {
            category: 'BERATUNG',
            content: `<strong>💡 Coach-Beratung für Ihre Situation:</strong><br><br>
            Basierend auf Ihrer Beschreibung und dem Kontext "${phase}" mit "${coacheeType}" empfehle ich:<br><br>
            <strong>Sofortige Schritte:</strong><br>
            1. Situation mit dem Coachee spiegeln und validieren<br>
            2. Gemeinsam den nächsten Fokus klären<br>
            3. Passende Intervention aus dem Prompt-Repository wählen<br><br>
            <strong>Haltung:</strong><br>
            • Ressourcenorientiert bleiben<br>
            • Prozess vor Inhalt<br>
            • Coachee als Experte für sein Leben würdigen<br><br>
            <em>🎯 Vertrauen Sie Ihrer Coaching-Kompetenz und dem Prozess.</em>`
        };
    },

    getNextStepRecommendation(phase) {
        const steps = {
            'Phase 1: Problem & Ziel': 'GT1-GT4 für strukturierte Problemerfassung',
            'Phase 2: Analyse': 'GT5-GT7 für Tiefenanalyse und Musterkennung',
            'Phase 3: Lösung': 'GT8-GT11 für Zielentwicklung und Ressourcenaktivierung',
            'Phase 4: Umsetzung': 'GT12 für konkrete Handlungsplanung',
            'Meta: Prozessreflexion': 'META1-META3 für Prozessreflexion'
        };
        return steps[phase] || 'Situationsgerechte Prompt-Auswahl';
    },

    getMethodRecommendation(phase, coacheeType) {
        if (phase.includes('Phase 1')) return 'GT1-GT4 oder SF1 für Problemklärung';
        if (phase.includes('Phase 2')) return 'DIAG1-DIAG5 für Tiefenanalyse';
        if (phase.includes('Phase 3')) return 'LÖS1-LÖS3 für Lösungsentwicklung';
        if (phase.includes('Phase 4')) return 'LÖS4-LÖS5 für Umsetzung';
        return 'META1-META3 für Prozessreflexion';
    },

    getPrimaryMethod(input, phase) {
        if (input.includes('spannungsfeld')) return 'Geißler GT4: Ausbalancierungsprobleme identifizieren';
        if (input.includes('team') || input.includes('gruppe')) return 'GRUPPE1: Team-Check mit strukturiertem Feedback';
        if (input.includes('vision') || input.includes('ziel')) return 'LÖS1: Erfolgsimagination entwickeln';
        return 'SF1: Solution Finder für grundlegende Klarheit';
    },

    getConcreteApplication(input, coacheeType) {
        return `Beginnen Sie mit einer offenen Frage, nutzen Sie aktives Zuhören und spiegeln Sie das Gehörte. Bei ${coacheeType} besonders auf systemische Aspekte achten.`;
    },

    displayResponse(response) {
        const responseDiv = DOM.find('#coachKIResponse');
        const contentDiv = DOM.find('#coachKIResponseContent');
        const categorySpan = DOM.find('#responseCategory');
        const followUp = DOM.find('#followUpActions');
        
        if (responseDiv && contentDiv && categorySpan && followUp) {
            responseDiv.style.display = 'block';
            contentDiv.innerHTML = response.content;
            categorySpan.textContent = response.category;
            followUp.style.display = 'block';
            
            Utils.animateElement(responseDiv, 'fade-in');
        }
    }
};

// Follow-up Aktionen
window.implementSuggestion = function() {
    Utils.showToast('Empfehlung wird in den Prompt-Editor übernommen.', 'info');
};

window.getAlternativeAdvice = function() {
    askCoachKI(); // Neue Antwort generieren
};

window.deepDive = function() {
    const currentInput = DOM.find('#coachInput')?.value || '';
    const input = DOM.find('#coachInput');
    if (input) {
        input.value = currentInput + '\n\nBitte gehe tiefer ins Detail und erkläre die Hintergründe.';
        askCoachKI();
    }
};

// Initialisierung
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        CoachInterface.init();
        CoachInterface.setupCoachKI(); // Coach-KI Setup hinzufügen
        console.log('🎯 Coach Interface bereit');
    }
});

// Globale Load-Funktionen für HTML onclick events
window.loadProcessSupport = function() {
    CoachInterface.loadProcessSupport();
};

window.loadMethodenBeratung = function() {
    CoachInterface.loadMethodenBeratung();
};

window.loadInterventionshilfe = function() {
    CoachInterface.loadInterventionshilfe();
};

window.loadNotfallSupport = function() {
    CoachInterface.loadNotfallSupport();
};