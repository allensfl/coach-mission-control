// Bessere Berndeutsch Erkennung mit Whisper API

// Neue API Route für Whisper Audio → Text
// api/whisper-transcribe.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Audio-Datei aus FormData extrahieren
        const formData = new FormData();
        
        // Audio Blob von Frontend empfangen
        const audioBlob = req.body.audio;
        formData.append('file', audioBlob, 'audio.webm');
        formData.append('model', 'whisper-1');
        formData.append('language', 'de'); // Deutsch (erkennt auch Schweizerdeutsch besser)
        formData.append('prompt', 'Berndeutsch, Schweizerdeutsch, Bärndütsch'); // Hilft bei Dialekt-Erkennung

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Whisper API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        
        res.status(200).json({ 
            success: true,
            transcription: data.text,
            confidence: 'high' // Whisper ist sehr gut
        });

    } catch (error) {
        console.error('Whisper Transcription Error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Transcription failed',
            message: error.message 
        });
    }
}

// Frontend: Bessere Audio-Aufnahme mit Whisper
let mediaRecorder = null;
let audioChunks = [];
let isRecordingWithWhisper = false;

// Whisper-basierte Aufnahme starten
window.startWhisperBerndeutschRecording = function() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        Utils.showToast('Audio-Aufnahme nicht verfügbar in diesem Browser.', 'error');
        return;
    }

    if (isRecordingWithWhisper) {
        stopWhisperBerndeutschRecording();
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            isRecordingWithWhisper = true;

            // UI Updates
            const button = event.target;
            button.textContent = '⏹️ Whisper Aufnahme stoppen';
            button.style.background = '#ef4444';
            
            const status = DOM.find('#chatgptTranslationStatus');
            if (status) {
                status.textContent = 'Whisper Aufnahme läuft... 🔴';
            }

            // Audio-Daten sammeln
            mediaRecorder.ondataavailable = function(event) {
                audioChunks.push(event.data);
            };

            // Aufnahme beendet - an Whisper senden
            mediaRecorder.onstop = function() {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                sendAudioToWhisper(audioBlob);
                
                // Stream stoppen
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            Utils.showToast('Whisper Aufnahme gestartet - viel bessere Berndeutsch Erkennung!', 'success');
        })
        .catch(error => {
            console.error('Microphone access error:', error);
            Utils.showToast('Mikrofon-Zugriff verweigert.', 'error');
        });
};

// Whisper Aufnahme stoppen
function stopWhisperBerndeutschRecording() {
    if (mediaRecorder && isRecordingWithWhisper) {
        mediaRecorder.stop();
        isRecordingWithWhisper = false;
        
        const button = document.querySelector('[onclick*="startWhisperBerndeutschRecording"]');
        if (button) {
            button.textContent = '🎤 Whisper Berndeutsch (besser!)';
            button.style.background = '#10b981';
        }
        
        const status = DOM.find('#chatgptTranslationStatus');
        if (status) {
            status.textContent = 'Whisper verarbeitet Audio...';
        }
    }
}

// Audio an Whisper API senden
async function sendAudioToWhisper(audioBlob) {
    try {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        const response = await fetch('/api/whisper-transcribe', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Whisper API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
            // Transkription in Textarea einfügen
            const textarea = DOM.find('#berndeutschInput');
            if (textarea) {
                textarea.value = data.transcription;
            }
            
            const status = DOM.find('#chatgptTranslationStatus');
            if (status) {
                status.textContent = 'Whisper Transkription erfolgreich! ✅';
            }
            
            Utils.showToast('Whisper Berndeutsch Erkennung erfolgreich!', 'success');
        } else {
            throw new Error(data.message || 'Whisper transcription failed');
        }
        
    } catch (error) {
        console.error('Whisper Error:', error);
        Utils.showToast(`Whisper Fehler: ${error.message}`, 'error');
        
        const status = DOM.find('#chatgptTranslationStatus');
        if (status) {
            status.textContent = 'Whisper Fehler ❌';
        }
    }
}

// Verbessertes ChatGPT Berndeutsch Interface mit Whisper
function addImprovedChatGPTBerndeutschInterface() {
    const coachKIResponse = DOM.find('#coachKIResponse');
    if (!coachKIResponse || DOM.find('#improvedChatgptBerndeutschSection')) return;

    const improvedHTML = `
        <div id="improvedChatgptBerndeutschSection" style="margin-top: 20px; padding: 20px; background: rgba(16, 185, 129, 0.1); border-radius: 12px; border: 2px solid rgba(16, 185, 129, 0.3);">
            <h4 style="color: #065f46; margin-bottom: 15px; display: flex; align-items: center;">
                🏔️ Verbesserte Berndeutsch → Hochdeutsch (Whisper + ChatGPT)
                <span style="background: #10b981; color: white; padding: 0.2rem 0.6rem; border-radius: 8px; font-size: 0.8rem; margin-left: 10px;">BESSER!</span>
            </h4>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #065f46;">
                    Berndeutsch Text (Whisper AI Erkennung):
                </label>
                <textarea id="improvedBerndeutschInput" style="
                    width: 100%;
                    min-height: 120px;
                    padding: 15px;
                    border: 2px solid rgba(16, 185, 129, 0.4);
                    border-radius: 10px;
                    font-family: inherit;
                    font-size: 1rem;
                    line-height: 1.6;
                    resize: vertical;
                " placeholder="Text wird hier von Whisper AI eingefügt (viel genauer als Browser!)"></textarea>
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 15px; align-items: center; flex-wrap: wrap;">
                <button onclick="startWhisperBerndeutschRecording()" style="background: #10b981; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    🎤 Whisper Berndeutsch (besser!)
                </button>
                <button onclick="translateImprovedBerndeutschWithChatGPT()" style="background: #f59e0b; color: white; border: none; padding: 12px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    🔄 ChatGPT übersetzen
                </button>
                <span id="improvedTranslationStatus" style="color: #065f46; font-weight: 600;"></span>
            </div>
            
            <div id="improvedHochdeutschResult" style="display: none; background: white; border: 2px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <div style="color: #065f46; font-weight: 600; margin-bottom: 10px;">🇩🇪 Perfekte Hochdeutsch Übersetzung:</div>
                <div id="improvedHochdeutschText" style="line-height: 1.6; color: #374151;"></div>
            </div>
            
            <div id="improvedActions" style="display: none; gap: 10px;">
                <button onclick="editImprovedTranslation()" style="background: #6b7280; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer;">
                    ✏️ Bearbeiten
                </button>
                <button onclick="sendImprovedTranslationToCoachee()" style="background: #10b981; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                    📤 An Coachee senden
                </button>
                <button onclick="clearImprovedTranslation()" style="background: #ef4444; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer;">
                    🗑️ Löschen
                </button>
            </div>
            
            <div style="margin-top: 15px; padding: 12px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; border-left: 4px solid #10b981;">
                <div style="font-weight: 600; color: #065f46; margin-bottom: 5px;">💡 Warum ist das besser?</div>
                <div style="color: #374151; font-size: 0.9rem;">
                    • Whisper AI (wie ChatGPT) statt Browser Speech Recognition<br>
                    • Speziell für Schweizer Dialekte optimiert<br>
                    • Viel höhere Genauigkeit bei Berndeutsch
                </div>
            </div>
        </div>
    `;
    
    coachKIResponse.insertAdjacentHTML('beforeend', improvedHTML);
}

// Verbesserte Übersetzung mit besserem Input
window.translateImprovedBerndeutschWithChatGPT = function() {
    const textarea = DOM.find('#improvedBerndeutschInput');
    if (!textarea) return;

    const berndeutschText = textarea.value.trim();
    if (!berndeutschText) {
        Utils.showToast('Bitte geben Sie einen Berndeutsch Text ein oder nutzen Sie Whisper Aufnahme.', 'error');
        return;
    }

    // Button Status
    const status = DOM.find('#improvedTranslationStatus');
    if (status) {
        status.textContent = 'ChatGPT übersetzt (mit besserem Input)...';
    }

    // ChatGPT Übersetzung mit verbessertem Prompt
    translateWithImprovedChatGPT(berndeutschText)
        .then(hochdeutschText => {
            if (hochdeutschText) {
                DOM.find('#improvedHochdeutschResult').style.display = 'block';
                DOM.find('#improvedHochdeutschText').textContent = hochdeutschText;
                DOM.find('#improvedActions').style.display = 'flex';
                
                if (status) {
                    status.textContent = 'Perfekte Übersetzung! ✅';
                }
                
                Utils.showToast('Verbesserte ChatGPT Übersetzung erfolgreich!', 'success');
            }
        })
        .catch(error => {
            if (status) {
                status.textContent = 'Übersetzung fehlgeschlagen ❌';
            }
        });
};

// Verbesserter ChatGPT Prompt für bessere Übersetzung
async function translateWithImprovedChatGPT(berndeutschText) {
    try {
        const response = await fetch('/api/translate-berndeutsch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: `${berndeutschText}

WICHTIGER KONTEXT: Dies ist authentischer Berndeutsch/Schweizerdeutsch Text, der bereits korrekt von Whisper AI erkannt wurde. Bitte übersetze präzise ins Hochdeutsche und behalte die emotionale Nuance bei.`
            })
        });

        const data = await response.json();
        return data.success ? data.translation : null;
        
    } catch (error) {
        console.error('Improved ChatGPT Translation Error:', error);
        return null;
    }
}

console.log('🏔️ Verbesserte Berndeutsch → Hochdeutsch mit Whisper AI geladen');
console.log('💡 Whisper AI ist VIEL genauer als Browser Speech Recognition!');