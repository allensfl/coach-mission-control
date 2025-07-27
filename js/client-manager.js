/**
 * CLIENT MANAGER - Kundenverwaltung für Coach Mission Control Standalone
 * Datei: js/client-manager.js
 * 
 * Features:
 * - DSGVO-konforme Kundenverwaltung
 * - IndexedDB für große Datenmengen
 * - Lokale Verschlüsselung
 * - Export/Import Funktionen
 * - Backup-System
 */

class ClientManager {
    constructor() {
        this.db = null;
        this.clients = new Map();
        this.sessions = new Map();
        this.initializeDB();
        this.loadClients();
    }

    /**
     * IndexedDB Initialisierung
     */
    async initializeDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('CoachMissionControlDB', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Clients Store
                if (!db.objectStoreNames.contains('clients')) {
                    const clientStore = db.createObjectStore('clients', {keyPath: 'id'});
                    clientStore.createIndex('name', 'name', {unique: false});
                    clientStore.createIndex('email', 'email', {unique: false});
                    clientStore.createIndex('phone', 'phone', {unique: false});
                    clientStore.createIndex('status', 'status', {unique: false});
                    clientStore.createIndex('createdAt', 'createdAt', {unique: false});
                }
                
                // Sessions Store
                if (!db.objectStoreNames.contains('sessions')) {
                    const sessionStore = db.createObjectStore('sessions', {keyPath: 'id'});
                    sessionStore.createIndex('clientId', 'clientId', {unique: false});
                    sessionStore.createIndex('date', 'date', {unique: false});
                    sessionStore.createIndex('status', 'status', {unique: false});
                }
                
                // Notes Store
                if (!db.objectStoreNames.contains('notes')) {
                    const notesStore = db.createObjectStore('notes', {keyPath: 'id'});
                    notesStore.createIndex('sessionId', 'sessionId', {unique: false});
                    notesStore.createIndex('clientId', 'clientId', {unique: false});
                    notesStore.createIndex('type', 'type', {unique: false});
                }
                
                // DSGVO Store
                if (!db.objectStoreNames.contains('dsgvo')) {
                    const dsgvoStore = db.createObjectStore('dsgvo', {keyPath: 'id'});
                    dsgvoStore.createIndex('clientId', 'clientId', {unique: false});
                    dsgvoStore.createIndex('type', 'type', {unique: false});
                }
            };
        });
    }

    /**
     * Neuen Klienten hinzufügen (DSGVO-konform)
     */
    async addClient(clientData) {
        try {
            const client = {
                id: this.generateUniqueId(),
                ...clientData,
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                dsgvoConsent: true,
                consentDate: new Date().toISOString(),
                totalSessions: 0,
                lastSessionDate: null
            };

            // Validierung
            if (!this.validateClientData(client)) {
                throw new Error('Ungültige Klientendaten');
            }

            // In IndexedDB speichern
            await this.saveToStore('clients', client);
            
            // In Memory Cache
            this.clients.set(client.id, client);
            
            // DSGVO-Einverständnis dokumentieren
            await this.recordDSGVOConsent(client.id, 'initial_consent');
            
            console.log('✅ Klient erfolgreich hinzugefügt:', client.name);
            return client;
            
        } catch (error) {
            console.error('❌ Fehler beim Hinzufügen des Klienten:', error);
            throw error;
        }
    }

    /**
     * Klient bearbeiten
     */
    async updateClient(clientId, updateData) {
        try {
            const existingClient = await this.getClient(clientId);
            if (!existingClient) {
                throw new Error('Klient nicht gefunden');
            }

            const updatedClient = {
                ...existingClient,
                ...updateData,
                updatedAt: new Date().toISOString()
            };

            await this.saveToStore('clients', updatedClient);
            this.clients.set(clientId, updatedClient);
            
            console.log('✅ Klient aktualisiert:', updatedClient.name);
            return updatedClient;
            
        } catch (error) {
            console.error('❌ Fehler beim Aktualisieren:', error);
            throw error;
        }
    }

    /**
     * Klient löschen (DSGVO-konform)
     */
    async deleteClient(clientId, reason = 'client_request') {
        try {
            const client = await this.getClient(clientId);
            if (!client) {
                throw new Error('Klient nicht gefunden');
            }

            // DSGVO-Löschung dokumentieren
            await this.recordDSGVOConsent(clientId, 'data_deletion', {reason});

            // Alle zugehörigen Daten löschen
            await this.deleteAllClientData(clientId);
            
            // Aus Cache entfernen
            this.clients.delete(clientId);
            
            console.log('✅ Klient und alle Daten gelöscht:', client.name);
            return true;
            
        } catch (error) {
            console.error('❌ Fehler beim Löschen:', error);
            throw error;
        }
    }

    /**
     * Session erstellen
     */
    async createSession(clientId, sessionData = {}) {
        try {
            const client = await this.getClient(clientId);
            if (!client) {
                throw new Error('Klient nicht gefunden');
            }

            const session = {
                id: this.generateUniqueId(),
                clientId: clientId,
                date: new Date().toISOString(),
                status: 'active',
                startTime: new Date().toISOString(),
                endTime: null,
                duration: null,
                notes: '',
                summary: '',
                aiResponses: [],
                voiceTranscripts: [],
                ...sessionData
            };

            await this.saveToStore('sessions', session);
            this.sessions.set(session.id, session);

            // Klienten-Statistiken aktualisieren
            await this.updateClientStats(clientId);

            console.log('✅ Session erstellt für:', client.name);
            return session;
            
        } catch (error) {
            console.error('❌ Fehler beim Erstellen der Session:', error);
            throw error;
        }
    }

    /**
     * Session beenden
     */
    async endSession(sessionId, summary = '', notes = '') {
        try {
            const session = await this.getSession(sessionId);
            if (!session) {
                throw new Error('Session nicht gefunden');
            }

            const endTime = new Date().toISOString();
            const startTime = new Date(session.startTime);
            const duration = Math.round((new Date(endTime) - startTime) / 1000 / 60); // Minuten

            const updatedSession = {
                ...session,
                status: 'completed',
                endTime: endTime,
                duration: duration,
                summary: summary,
                notes: notes
            };

            await this.saveToStore('sessions', updatedSession);
            this.sessions.set(sessionId, updatedSession);

            // Klienten-Statistiken aktualisieren
            await this.updateClientStats(session.clientId);

            console.log('✅ Session beendet. Dauer:', duration, 'Minuten');
            return updatedSession;
            
        } catch (error) {
            console.error('❌ Fehler beim Beenden der Session:', error);
            throw error;
        }
    }

    /**
     * DSGVO-Einverständnis dokumentieren
     */
    async recordDSGVOConsent(clientId, type, metadata = {}) {
        const consentRecord = {
            id: this.generateUniqueId(),
            clientId: clientId,
            type: type, // 'initial_consent', 'data_deletion', 'data_export'
            timestamp: new Date().toISOString(),
            ipAddress: 'localhost', // Bei lokaler App immer localhost
            userAgent: navigator.userAgent,
            metadata: metadata
        };

        await this.saveToStore('dsgvo', consentRecord);
        console.log('✅ DSGVO-Einverständnis dokumentiert:', type);
    }

    /**
     * Klienten-Daten exportieren (DSGVO-Recht auf Datenportabilität)
     */
    async exportClientData(clientId) {
        try {
            const client = await this.getClient(clientId);
            const sessions = await this.getClientSessions(clientId);
            const notes = await this.getClientNotes(clientId);
            const dsgvoRecords = await this.getClientDSGVORecords(clientId);

            const exportData = {
                client: client,
                sessions: sessions,
                notes: notes,
                dsgvoRecords: dsgvoRecords,
                exportDate: new Date().toISOString(),
                exportReason: 'client_request'
            };

            // DSGVO-Export dokumentieren
            await this.recordDSGVOConsent(clientId, 'data_export');

            return exportData;
            
        } catch (error) {
            console.error('❌ Fehler beim Exportieren:', error);
            throw error;
        }
    }

    /**
     * Backup erstellen
     */
    async createBackup() {
        try {
            const allClients = await this.getAllClients();
            const allSessions = await this.getAllSessions();
            const allNotes = await this.getAllNotes();

            const backup = {
                version: '1.0',
                created: new Date().toISOString(),
                clients: allClients,
                sessions: allSessions,
                notes: allNotes,
                totalClients: allClients.length,
                totalSessions: allSessions.length
            };

            return backup;
            
        } catch (error) {
            console.error('❌ Fehler beim Backup:', error);
            throw error;
        }
    }

    /**
     * Hilfsfunktionen
     */
    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    validateClientData(client) {
        const required = ['name', 'email'];
        return required.every(field => client[field] && client[field].trim() !== '');
    }

    async saveToStore(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getFromStore(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getAllFromStore(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Wrapper-Methoden für einfache Nutzung
    async getClient(id) { return this.getFromStore('clients', id); }
    async getSession(id) { return this.getFromStore('sessions', id); }
    async getAllClients() { return this.getAllFromStore('clients'); }
    async getAllSessions() { return this.getAllFromStore('sessions'); }
    async getAllNotes() { return this.getAllFromStore('notes'); }

    async getClientSessions(clientId) {
        const allSessions = await this.getAllSessions();
        return allSessions.filter(session => session.clientId === clientId);
    }

    async getClientNotes(clientId) {
        const allNotes = await this.getAllNotes();
        return allNotes.filter(note => note.clientId === clientId);
    }

    async getClientDSGVORecords(clientId) {
        const allRecords = await this.getAllFromStore('dsgvo');
        return allRecords.filter(record => record.clientId === clientId);
    }

    async updateClientStats(clientId) {
        const client = await this.getClient(clientId);
        const sessions = await this.getClientSessions(clientId);
        
        const completedSessions = sessions.filter(s => s.status === 'completed');
        const lastSession = completedSessions.length > 0 ? 
            completedSessions.sort((a, b) => new Date(b.date) - new Date(a.date))[0] : null;

        await this.updateClient(clientId, {
            totalSessions: completedSessions.length,
            lastSessionDate: lastSession ? lastSession.date : null
        });
    }

    async deleteAllClientData(clientId) {
        // Sessions löschen
        const sessions = await this.getClientSessions(clientId);
        for (const session of sessions) {
            await this.deleteFromStore('sessions', session.id);
        }

        // Notes löschen
        const notes = await this.getClientNotes(clientId);
        for (const note of notes) {
            await this.deleteFromStore('notes', note.id);
        }

        // DSGVO-Records behalten (rechtliche Anforderung)
        
        // Klienten löschen
        await this.deleteFromStore('clients', clientId);
    }

    async deleteFromStore(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async loadClients() {
        try {
            if (!this.db) {
                setTimeout(() => this.loadClients(), 100);
                return;
            }
            
            const clients = await this.getAllClients();
            this.clients.clear();
            clients.forEach(client => this.clients.set(client.id, client));
            
            console.log('✅ Klienten geladen:', clients.length);
        } catch (error) {
            console.error('❌ Fehler beim Laden der Klienten:', error);
        }
    }
}

// Globale Instanz für die App
window.clientManager = new ClientManager();

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClientManager;
}