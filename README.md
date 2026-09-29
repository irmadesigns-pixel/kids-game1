# Zauber-Kleiderschrank

Ein Anziehspiel für Kinder ab etwa 3 Jahren. Die Kinder ziehen eine Prinzessin passend zum Thema an und lernen dabei spielerisch Farben, Zählen und „Was passt wohin?“. Alles wird vorgelesen, lesen können muss also niemand.

Das Spiel ist eine einzige Webseite (`index.html`). Es braucht keine App-Store-Installation, läuft im Browser des Tablets, lässt sich wie eine App auf den Startbildschirm legen und funktioniert danach auch ohne Internet.

## Was die Kinder machen können

- **6 Themenwelten:** Ball im Schloss, Geburtstag, Halloween, Schwimmen (Strand), Schnee und Garten, jeweils mit eigenem Hintergrund und passender Kleidung.
- **Anziehen:** Kleider, Kopfschmuck, Schuhe und Extras (Zauberstab, Luftballon, Schwimmring, Schal …) antippen. Die Prinzessin sagt dazu, was sie trägt, zum Beispiel: „Die blaue Mütze!“
- **Farbtöpfe:** Unter der Kleidung sind Farbkleckse. Ein Tipp färbt das Teil um, und die Farbe wird laut gesagt.
- **Zauberstab-Knopf:** Ein zufälliges Outfit, das zum Thema passt.
- **Kamera:** Speichert ein Foto im Fotoalbum (bleibt auf dem Tablet gespeichert).
- **Die Prinzessin antippen:** Sie kichert und sagt etwas Nettes.

## Lern-Elemente (gelber Stern-Knopf)

Der große gelbe Stern startet ein Rätsel. Für jede richtige Antwort gibt es einen Stern, alle 5 Sterne gibt es eine kleine Feier.

1. **Farben:** „Wo ist der blaue Luftballon?“ Drei Varianten zur Auswahl. Bei einer falschen Antwort sagt die Prinzessin die Farbe („Das ist Rot. Such Blau!“) und zeigt einen Farbklecks als Hilfe.
2. **Was passt?:** „Was brauche ich im Schnee?“ Mütze, Badeanzug oder Flip-Flops? Die falschen Antworten sind immer eindeutig falsch, damit es keine Streitfälle gibt.
3. **Zählen:** „Wie viele Kürbisse siehst du?“ Die Kinder können die Dinge antippen, dann wird mitgezählt. Bei einer falschen Antwort zählt die Prinzessin gemeinsam mit dem Kind: „Eins, zwei, drei. Tipp auf die 3.“

## Auf das Xiaomi-Tablet bringen

Das Repository ist privat. Das Spiel muss daher irgendwo als Webseite erreichbar sein. Drei Möglichkeiten:

**A) GitHub Pages (kostenlos, empfohlen, wenn das Repository öffentlich sein darf)**
1. Auf GitHub: *Settings → General → Danger Zone → Change visibility → Public*. Der Code enthält keine persönlichen Daten.
2. *Settings → Pages → Build and deployment → Source: Deploy from a branch*, dann den Branch mit dem Spiel und den Ordner `/ (root)` wählen und speichern.
3. Nach 1–2 Minuten ist das Spiel unter `https://irmadesigns-pixel.github.io/kids-game1/` erreichbar.

(Mit einem kostenpflichtigen GitHub-Pro-Konto geht Pages auch mit privatem Repository.)

**B) Netlify Drop (kostenlos, Repository bleibt privat)**
1. Das Repository als ZIP herunterladen und entpacken.
2. Auf <https://app.netlify.com/drop> den Ordner in das Browserfenster ziehen.
3. Man bekommt sofort eine Adresse (`…netlify.app`), die man auf dem Tablet öffnet.

**C) Am Tablet einrichten (bei A oder B)**
1. Die Adresse in **Chrome** öffnen, einmal auf „Spielen“ tippen.
2. Menü (⋮) → **„Zum Startbildschirm hinzufügen“** bzw. „App installieren“.
3. Das Spiel startet dann im Vollbild wie eine App und funktioniert auch offline.

**Tipp für Kinderhände:** Unter Android kann man eine App „anpinnen“ (*Einstellungen → Passwörter & Sicherheit → Datenschutz → App-Anheftung* bzw. „Bildschirm fixieren“, je nach MIUI/HyperOS-Version). Dann kommen die Kinder nicht versehentlich aus dem Spiel heraus.

**Vorlese-Stimme:** Das Spiel nutzt die Sprachausgabe des Tablets. Falls nichts zu hören ist: *Einstellungen → Zusätzliche Einstellungen → Sprachen & Eingabe → Text-in-Sprache-Ausgabe*, (der Pfad kann je nach MIUI/HyperOS-Version leicht abweichen), dort „Sprachausgabe von Google“ wählen und die deutsche Stimme herunterladen.

## Eltern-Menü

Auf dem Startbildschirm unten rechts das Zahnrad **gedrückt halten** (etwa 1 Sekunde). Dort kann man:

- der Prinzessin einen Namen geben (sie stellt sich dann damit vor),
- Stimme und Töne ein- oder ausschalten,
- Sterne zurücksetzen und das Fotoalbum leeren.

## Zur Figur

Die Prinzessin ist eine eigene Zeichnung im Stil von Peach (blonde Haare, rosa Kleid, Krone), aber keine Nintendo-Grafik. Offizielle Mario-Bilder sind urheberrechtlich geschützt und deshalb nicht enthalten. Im Eltern-Menü kann man sie trotzdem „Peach“ nennen.

## Technik (für später)

- Alles steckt in `index.html`: HTML, CSS und JavaScript, ohne Build-Schritt und ohne Bibliotheken.
- Alle Bilder sind Vektorgrafiken (SVG), die im Code gezeichnet werden. Sie sind auf jedem Bildschirm scharf, und die Datei bleibt klein.
- Kleidung ist in einem Katalog definiert (Funktion `kind(...)`, Abschnitt „Wardrobe catalogue“). Jedes Teil hat Kategorie, Name mit Artikel, erlaubte Farben und passende Themen. Neue Themen stehen in `THEMES`.
- `sw.js` speichert das Spiel für die Offline-Nutzung, `manifest.webmanifest` macht es installierbar.
- Gespeichert wird nur lokal auf dem Gerät (Sterne, Fotos, Einstellungen). Es werden keine Daten verschickt.

Zum Testen am Computer: Ordner mit einem kleinen Webserver öffnen, z. B. `npx serve .`, und `http://localhost:3000` im Browser aufrufen.
