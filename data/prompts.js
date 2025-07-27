/* ===== PROMPTS.JS - Demo-Version (8 beste Prompts) ===== */
window.prompts = {
    // ===== GEISSLER TRIADISCH (Top 3) =====
    GT1: {
        category: "Geissler Triadisch",
        title: "Problem-Exploration",
        description: "Systematische Problemanalyse nach Geissler",
        phase: "A - Problem",
        type: "Analyse",
        content: `Lass uns dein Anliegen systematisch erkunden:

1. PROBLEM-BESCHREIBUNG:
- Beschreibe dein Anliegen in 2-3 Sätzen
- Was genau bereitet dir Schwierigkeiten?
- Seit wann besteht diese Situation?

2. AUSWIRKUNGEN:
- Wie wirkt sich das Problem auf dich aus?
- Welche Bereiche deines Lebens sind betroffen?
- Was passiert, wenn sich nichts ändert?

3. BISHERIGE LÖSUNGSVERSUCHE:
- Was hast du bereits versucht?
- Was hat funktioniert/nicht funktioniert?
- Welche Ressourcen stehen dir zur Verfügung?`
    },

    GT2: {
        category: "Geissler Triadisch", 
        title: "Ziel-Definition",
        description: "Klare Zielformulierung und Erfolgskriterien",
        phase: "B - Ziel",
        type: "Zielsetzung",
        content: `Lass uns dein Ziel klar definieren:

1. ZIEL-VISION:
- Wie soll die Situation idealerweise aussehen?
- Was möchtest du erreichen?
- Woran merkst du, dass du dein Ziel erreicht hast?

2. SMART-CHECK:
- Spezifisch: Ist dein Ziel konkret formuliert?
- Messbar: Wie kannst du Fortschritte messen?
- Attraktiv: Warum ist dieses Ziel wichtig für dich?
- Realistisch: Ist es in deiner Macht erreichbar?
- Terminiert: Bis wann möchtest du es erreichen?

3. MOTIVATION:
- Was treibt dich zu diesem Ziel?
- Welche Werte stehen dahinter?
- Was gewinnst du durch die Zielerreichung?`
    },

    GT3: {
        category: "Geissler Triadisch",
        title: "Lösungs-Entwicklung", 
        description: "Kreative Lösungsfindung und Handlungsplanung",
        phase: "C - Lösung",
        type: "Lösungsentwicklung",
        content: `Entwickeln wir gemeinsam Lösungsansätze:

1. BRAINSTORMING:
- Welche Möglichkeiten siehst du?
- Was würdest du einem Freund in derselben Situation raten?
- Welche verrückte Idee hättest du, wenn alles möglich wäre?

2. BEWERTUNG:
- Welche Optionen sprechen dich am meisten an?
- Was sind Vor- und Nachteile der verschiedenen Ansätze?
- Welche Option passt am besten zu deinen Werten?

3. HANDLUNGSPLAN:
- Welchen ersten kleinen Schritt kannst du heute machen?
- Wer oder was kann dich dabei unterstützen?
- Wie überprüfst du deinen Fortschritt?`
    },

    // ===== EINZELBERATUNG (Top 2) =====
    EB1: {
        category: "Einzelberatung",
        title: "Ressourcen-Aktivierung",
        description: "Stärken und Fähigkeiten bewusst machen",
        phase: "B - Ziel", 
        type: "Ressourcenarbeit",
        content: `Lass uns deine Stärken und Ressourcen entdecken:

1. PERSÖNLICHE STÄRKEN:
- Was sind deine größten Talente und Fähigkeiten?
- Wofür bekommst du häufig Komplimente?
- Was gelingt dir leicht, was anderen schwerfällt?

2. ERFOLGS-ERINNERUNGEN:
- Beschreibe eine Situation, in der du erfolgreich warst
- Was hast du damals getan? Welche Eigenschaften gezeigt?
- Wie hast du dich dabei gefühlt?

3. RESSOURCEN-TRANSFER:
- Wie kannst du diese Stärken für dein aktuelles Anliegen nutzen?
- Welche Erfolgsmuster lassen sich übertragen?
- Wer aus deinem Umfeld kann dich unterstützen?`
    },

    EB2: {
        category: "Einzelberatung",
        title: "Glaubenssätze prüfen",
        description: "Hinderliche Überzeugungen identifizieren und wandeln", 
        phase: "A - Problem",
        type: "Selbstreflexion",
        content: `Erkunden wir deine inneren Überzeugungen:

1. INNERE STIMME:
- Was sagst du dir selbst über diese Situation?
- Welche Gedanken gehen dir immer wieder durch den Kopf?
- Was "darf" oder "kann" man deiner Meinung nach (nicht)?

2. URSPRUNG:
- Woher könnten diese Überzeugungen stammen?
- Wer hat dir das mal gesagt?
- In welchem Kontext haben sie vielleicht gestimmt?

3. REALITÄTS-CHECK:
- Ist diese Überzeugung heute noch hilfreich?
- Welche Gegenbeispiele kennst du?
- Welche neue, förderliche Überzeugung würdest du gern haben?`
    },

    // ===== SYSTEMISCHES COACHING (Top 2) =====
    SC1: {
        category: "Systemisches Coaching",
        title: "Perspektivwechsel",
        description: "Situation aus verschiedenen Blickwinkeln betrachten",
        phase: "A - Problem",
        type: "Systemische Frage",
        content: `Betrachten wir die Situation aus verschiedenen Perspektiven:

1. DEINE SICHT:
- Wie siehst du die Situation?
- Was ist für dich das Hauptproblem?
- Welche Gefühle löst das bei dir aus?

2. ANDERE PERSPEKTIVEN:
- Wie würde [wichtige Person] die Situation sehen?
- Was würde ein neutraler Beobachter wahrnehmen?
- Wie könnte jemand, der dich liebt, die Lage einschätzen?

3. SYSTEM-BLICK:
- Welche Rolle spielst du in diesem System?
- Wer ist noch beteiligt und wie?
- Was würde sich ändern, wenn du dich anders verhältst?`
    },

    SC2: {
        category: "Systemisches Coaching", 
        title: "Wunderfrage",
        description: "Lösungsorientierte Zukunftsvision entwickeln",
        phase: "B - Ziel",
        type: "Lösungsfokus",
        content: `Stell dir vor, ein Wunder geschieht über Nacht:

1. DIE WUNDERFRAGE:
- Du wachst morgen auf und dein Problem ist gelöst
- Woran merkst du als erstes, dass sich etwas verändert hat?
- Wie verhältst du dich anders?
- Was denkst und fühlst du?

2. UMFELD-REAKTION:
- Wie reagieren andere auf die Veränderung?
- Was sagen sie zu dir?
- Wie verhalten sie sich dir gegenüber?

3. KLEINE WUNDER:
- Welche Teile dieses "Wunders" existieren bereits?
- Was kannst du heute tun, um dem Wunder näher zu kommen?
- Welcher kleinste Schritt wäre möglich?`
    },

    // ===== KOMMUNIKATION (Top 1) =====
    KO1: {
        category: "Kommunikation",
        title: "Schwierige Gespräche vorbereiten",
        description: "Strukturierte Vorbereitung für herausfordernde Dialoge",
        phase: "C - Lösung", 
        type: "Gesprächsführung",
        content: `Bereiten wir dein schwieriges Gespräch vor:

1. GESPRÄCHS-ZIEL:
- Was möchtest du erreichen?
- Welches Ergebnis wäre für dich zufriedenstellend?
- Was ist dein Plan B, falls das nicht gelingt?

2. ICH-BOTSCHAFTEN:
- Wie kannst du deine Sicht beschreiben, ohne anzuklagen?
- "Mir ist aufgefallen..." / "Ich empfinde..." / "Mir ist wichtig..."
- Welche Gefühle und Bedürfnisse stehen dahinter?

3. GESPRÄCHS-ABLAUF:
- Wie steigst du ein? (Positiver Einstieg)
- Wie strukturierst du deine Punkte?
- Wie gehst du mit Widerstand oder Emotionen um?
- Wie beendest du das Gespräch konstruktiv?`
    }
};

// Demo-Hinweis für Benutzer
console.log('🎯 Demo-Version: 8 von 65+ Prompts verfügbar');
console.log('💡 Vollversion enthält 65+ professionelle Coaching-Prompts');