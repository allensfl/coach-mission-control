// ===== KLIENTEN-DATENBANK =====
// ===== DEMO-KLIENTEN HINZUFÜGEN =====
const demoClients = [
  {
    id: 'demo-1',
    name: "Marcus Weber",
    age: 45,
    profession: "Führungskraft",
    topics: ["Lösungsorientierung", "Entscheidungsfindung"],
    method: 'solution',
    isDemo: true
  },
  {
    id: 'demo-2', 
    name: "Sarah Klein",
    age: 38,
    profession: "Managerin", 
    topics: ["Werte", "Sinnorientierung"],
    method: 'values',
    isDemo: true
  },
  {
    id: 'demo-3',
    name: "Thomas Müller",
    age: 41, 
    profession: "Team Lead",
    topics: ["Gestalt", "Erlebnisorientierung"],
    method: 'gestalt',
    isDemo: true
  },
  {
    id: 'demo-4',
    name: "Anna Schmidt", 
    age: 33,
    profession: "Beraterin",
    topics: ["KI-Coaching", "Triadisch"],
    method: 'triadic', 
    isDemo: true
  },
  {
    id: 'demo-5',
    name: "Lisa Müller",
    age: 36,
    profession: "Projektleiterin",
    topics: ["Systemisches Coaching", "Beziehungen"], 
    method: 'systemic',
    isDemo: true
  }
];

// Demo-Klienten zu clients Array hinzufügen
if (typeof clients !== 'undefined') {
  clients.push(...demoClients);
  console.log('🎯 Demo-Klienten hinzugefügt:', demoClients.length);
}
window.clients = [
    {
        id: 'client-001',
        name: "Alexandra Müller",
        age: 34,
        profession: "Marketing Managerin",
        topics: ["Karriereentwicklung", "Work-Life-Balance", "Führungskompetenzen"],
        background: "Arbeitet seit 8 Jahren im Marketing, kürzlich zur Teamleiterin befördert. Sucht Unterstützung beim Übergang in die Führungsrolle.",
        challenges: [
            "Delegation von Aufgaben",
            "Konflikte im Team lösen",
            "Zeitmanagement zwischen strategischen und operativen Aufgaben"
        ],
        goals: [
            "Selbstbewusste Führungskraft werden",
            "Effektive Kommunikation mit dem Team",
            "Bessere Work-Life-Balance etablieren"
        ],
        sessionHistory: 3,
        lastSession: "2024-01-15",
        notes: "Sehr reflektiert, arbeitet gerne mit praktischen Übungen. Bevorzugt strukturierte Ansätze.",
        status: "Aktiv"
    },
    {
        id: 'client-002', 
        name: "Thomas Weber",
        age: 42,
        profession: "IT-Projektmanager",
        topics: ["Stressmanagement", "Burnout-Prävention", "Karriereplanung"],
        background: "Erfahrener Projektmanager mit 15 Jahren Berufserfahrung. Fühlt sich zunehmend ausgebrannt und sucht neue Perspektiven.",
        challenges: [
            "Ständiger Zeitdruck in Projekten",
            "Schwierigkeiten beim 'Nein-Sagen'",
            "Fehlende langfristige Karrierevision"
        ],
        goals: [
            "Gesündere Arbeitsgewohnheiten entwickeln",
            "Klarheit über berufliche Zukunft gewinnen",
            "Resilienz aufbauen"
        ],
        sessionHistory: 5,
        lastSession: "2024-01-12",
        notes: "Analytischer Typ, schätzt datenbasierte Ansätze. Braucht konkrete Handlungsschritte.",
        status: "Aktiv"
    },
    {
        id: 'client-003',
        name: "Sarah Hoffmann",
        age: 29,
        profession: "Grafikdesignerin",
        topics: ["Selbstständigkeit", "Kreativitätsblockaden", "Selbstvertrauen"],
        background: "Freiberufliche Designerin seit 3 Jahren. Kämpft mit Unsicherheiten bezüglich ihrer Fähigkeiten und Preisgestaltung.",
        challenges: [
            "Imposter-Syndrom",
            "Schwierigkeiten bei der Kundenakquise",
            "Unregelmäßige Einnahmen"
        ],
        goals: [
            "Selbstvertrauen in die eigenen Fähigkeiten stärken",
            "Nachhaltige Kundenbeziehungen aufbauen",
            "Stabile Einkommensquelle etablieren"
        ],
        sessionHistory: 2,
        lastSession: "2024-01-10",
        notes: "Kreativ und intuitiv, reagiert gut auf visuelle Methoden. Eher emotionaler Zugang.",
        status: "Aktiv"
    },
    {
        id: 'client-004',
        name: "Michael Schmidt",
        age: 38,
        profession: "Vertriebsleiter",
        topics: ["Teamführung", "Motivation", "Veränderungsmanagement"],
        background: "Leitet ein 12-köpfiges Vertriebsteam. Das Unternehmen durchläuft gerade eine Digitalisierungsphase.",
        challenges: [
            "Widerstand des Teams gegen neue Prozesse",
            "Motivation des Teams aufrechterhalten",
            "Eigene Unsicherheit bei technischen Neuerungen"
        ],
        goals: [
            "Change-Prozess erfolgreich begleiten",
            "Teamzusammenhalt stärken",
            "Digitale Kompetenzen ausbauen"
        ],
        sessionHistory: 4,
        lastSession: "2024-01-08",
        notes: "Pragmatisch orientiert, schätzt Erfahrungsaustausch. Lernt gerne von Best Practices.",
        status: "Aktiv"
    },
    {
        id: 'client-005',
        name: "Julia Becker",
        age: 31,
        profession: "Personalreferentin",
        topics: ["Kommunikation", "Konfliktlösung", "Persönlichkeitsentwicklung"],
        background: "Arbeitet in der HR-Abteilung eines mittelständischen Unternehmens. Möchte ihre Beratungskompetenzen für interne Klienten verbessern.",
        challenges: [
            "Schwierige Gespräche mit Mitarbeitern führen",
            "Objektivität in emotionalen Situationen bewahren",
            "Grenzen zwischen Unterstützung und Therapie"
        ],
        goals: [
            "Professionelle Gesprächsführung meistern",
            "Konfliktmediationstechniken erlernen",
            "Persönliche Resilienz stärken"
        ],
        sessionHistory: 6,
        lastSession: "2024-01-05",
        notes: "Empathisch und hilfsbereit, manchmal zu emotional involviert. Arbeitet gerne systemisch.",
        status: "Aktiv"
    }
];

// ===== KLIENTEN-VERWALTUNG UTILITIES =====
window.ClientUtils = {
    // Klient nach ID finden
    findById: function(id) {
        return window.clients.find(client => client.id === id);
    },
    
    // Aktive Klienten filtern
    getActiveClients: function() {
        return window.clients.filter(client => client.status === "Aktiv");
    },
    
    // Klienten nach Thema filtern
    getByTopic: function(topic) {
        return window.clients.filter(client => 
            client.topics.some(t => t.toLowerCase().includes(topic.toLowerCase()))
        );
    },
    
    // Statistiken generieren
    getStats: function() {
        const total = window.clients.length;
        const active = this.getActiveClients().length;
        const avgSessions = window.clients.reduce((sum, client) => sum + client.sessionHistory, 0) / total;
        
        return {
            total: total,
            active: active,
            averageSessions: Math.round(avgSessions * 100) / 100
        };
    },
    
    // Neuen Klient hinzufügen
    addClient: function(clientData) {
        const newId = 'client-' + String(Date.now()).slice(-6);
        const newClient = {
            id: newId,
            sessionHistory: 0,
            lastSession: null,
            status: "Aktiv",
            ...clientData
        };
        window.clients.push(newClient);
        return newClient;
    },
    
    // Klient aktualisieren
    updateClient: function(id, updates) {
        const clientIndex = window.clients.findIndex(client => client.id === id);
        if (clientIndex !== -1) {
            window.clients[clientIndex] = { ...window.clients[clientIndex], ...updates };
            return window.clients[clientIndex];
        }
        return null;
    }
};

// ===== INITIALISIERUNG =====
console.log('👥 Klienten-Datenbank geladen:', window.clients.length, 'Klienten verfügbar');
console.log('📊 Klienten-Statistiken:', window.ClientUtils.getStats());

// ===== DEMO-KLIENTEN FÜR MULTI-METHOD SUPPORT =====
const demoClients = [
    {
        id: 'demo-1',
        name: "Marcus Weber",
        age: 45,
        profession: "Führungskraft",
        topics: ["Lösungsorientierung", "Entscheidungsfindung"],
        background: "Demo-Klient für Lösungsorientiertes Coaching",
        challenges: ["Entscheidungen treffen", "Lösungen finden"],
        goals: ["Klarere Entscheidungen", "Effektivere Problemlösung"],
        sessionHistory: 0,
        lastSession: null,
        method: 'solution',
        isDemo: true,
        status: "Demo-Klient"
    },
    {
        id: 'demo-2',
        name: "Sarah Klein",
        age: 38,
        profession: "Managerin",
        topics: ["Werte", "Sinnorientierung"],
        background: "Demo-Klient für Werte- & Sinnorientiertes Coaching",
        challenges: ["Werte definieren", "Sinn finden"],
        goals: ["Klare Werte", "Sinnvolle Arbeit"],
        sessionHistory: 0,
        lastSession: null,
        method: 'values',
        isDemo: true,
        status: "Demo-Klient"
    },
    {
        id: 'demo-3',
        name: "Thomas Müller",
        age: 41,
        profession: "Team Lead",
        topics: ["Gestalt", "Erlebnisorientierung"],
        background: "Demo-Klient für Gestalt-/Erlebnisorientiertes Coaching",
        challenges: ["Hier-und-jetzt", "Bewusstsein"],
        goals: ["Mehr Bewusstsein", "Authentizität"],
        sessionHistory: 0,
        lastSession: null,
        method: 'gestalt',
        isDemo: true,
        status: "Demo-Klient"
    },
    {
        id: 'demo-4',
        name: "Anna Schmidt",
        age: 33,
        profession: "Beraterin",
        topics: ["KI-Coaching", "Triadisch"],
        background: "Demo-Klient für Triadisches KI-Coaching",
        challenges: ["KI-Integration", "Digitale Zusammenarbeit"],
        goals: ["KI-Kompetenz", "Digitale Balance"],
        sessionHistory: 0,
        lastSession: null,
        method: 'triadic',
        isDemo: true,
        status: "Demo-Klient"
    },
    {
        id: 'demo-5',
        name: "Lisa Müller",
        age: 36,
        profession: "Projektleiterin",
        topics: ["Systemisches Coaching", "Beziehungen"],
        background: "Demo-Klient für Systemisches Coaching",
        challenges: ["Systemdenken", "Beziehungsgestaltung"],
        goals: ["Systemverständnis", "Bessere Kommunikation"],
        sessionHistory: 0,
        lastSession: null,
        method: 'systemic',
        isDemo: true,
        status: "Demo-Klient"
    }
];

// Demo-Klienten zu bestehenden Klienten hinzufügen
window.clients = [...window.clients, ...demoClients];

console.log('🎯 Demo-Klienten hinzugefügt:', demoClients.length, 'Demo-Klienten verfügbar');
console.log('📊 Gesamt-Klienten:', window.clients.length, 'Klienten (davon', demoClients.length, 'Demo-Klienten)');
// ===== DEMO-KLIENTEN FÜR MULTI-METHOD SUPPORT =====
const demoClients = [
  {
    id: 'demo-1',
    name: "Marcus Weber",
    age: 45,
    profession: "Führungskraft",
    topics: ["Lösungsorientierung", "Entscheidungsfindung"],
    background: "Demo-Klient für Lösungsorientiertes Coaching",
    challenges: ["Entscheidungen treffen", "Lösungen finden"],
    goals: ["Klarere Entscheidungen", "Effektivere Problemlösung"],
    sessionHistory: 0,
    lastSession: null,
    method: 'solution',
    isDemo: true,
    status: "Demo-Klient"
  },
  {
    id: 'demo-2',
    name: "Sarah Klein",
    age: 38,
    profession: "Managerin",
    topics: ["Werte", "Sinnorientierung"],
    background: "Demo-Klient für Werte- & Sinnorientiertes Coaching",
    challenges: ["Werte definieren", "Sinn finden"],
    goals: ["Klare Werte", "Sinnvolle Arbeit"],
    sessionHistory: 0,
    lastSession: null,
    method: 'values',
    isDemo: true,
    status: "Dem
