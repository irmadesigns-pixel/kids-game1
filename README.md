# Zauber-Kleiderschrank

Ein Anziehspiel für Kinder ab etwa 3 Jahren. Die Kinder ziehen eine Prinzessin passend zum Thema an und lernen dabei spielerisch Farben, Zählen und „Was passt wohin?“. Alles wird vorgelesen, lesen können muss also niemand.

Das Spiel ist eine einzige Webseite (`index.html`). Es braucht keine App-Store-Installation, läuft im Browser des Tablets, lässt sich wie eine App auf den Startbildschirm legen und funktioniert danach auch ohne Internet.

## Was die Kinder machen können

- **4 Prinzessinnen zur Auswahl:** Rosa (blonde Haare), Luna (silberne Haare), Amara (braune Locken) und Pia (rote Zöpfe mit Sommersprossen). Jede hat ihren eigenen Kleiderschrank pro Welt.
- **10 Themenwelten:** Ball im Schloss, Geburtstag, Halloween, Schwimmen (Strand), Meerjungfrau (unter Wasser), Schnee, Weihnachten, Garten, Herbst (mit Regen und Laterne) und Weltraum, jeweils mit eigenem Hintergrund und passender Kleidung.
- **Anziehen:** Kleider, Kopfschmuck, Schuhe und Extras (Zauberstab, Luftballon, Schwimmring, Schal, Raumhelm, Meerjungfrauen-Kleid …) antippen. Die Prinzessin sagt dazu, was sie trägt, zum Beispiel: „Die blaue Mütze!“
- **Tierfreunde:** Kätzchen, Hündchen, Häschen, Einhorn oder ein kleiner Drache sitzen neben der Prinzessin. Tippt man das Tier an, hüpft es und macht sein Geräusch.
- **Tanzparty (Noten-Knopf):** Die Prinzessin tanzt zu „Alle meine Entchen“, „Hänschen klein“ oder „Blinke, blinke, kleiner Stern“ (an Weihnachten: „Morgen kommt der Weihnachtsmann“), mit Discolicht und fliegenden Noten.
- **Farbtöpfe:** Unter der Kleidung sind Farbkleckse. Ein Tipp färbt das Teil um, und die Farbe wird laut gesagt.
- **Zauberstab-Knopf:** Ein zufälliges Outfit, das zum Thema passt.
- **Kamera:** Speichert ein Foto im Fotoalbum (bleibt auf dem Tablet gespeichert).
- **Die Prinzessin antippen:** Sie kichert und sagt etwas Nettes.

## Lern-Elemente (gelber Stern-Knopf)

Der große gelbe Stern startet ein Rätsel. Die vier Rätselarten wechseln sich ab. Für jede richtige Antwort gibt es einen Stern.

1. **Farben:** „Wo ist der blaue Luftballon?“ Drei Varianten zur Auswahl. Bei einer falschen Antwort sagt die Prinzessin die Farbe („Das ist Rot. Such Blau!“) und zeigt einen Farbklecks als Hilfe.
2. **Was passt?:** „Was brauche ich im Schnee?“ Mütze, Badeanzug oder Flip-Flops? Die falschen Antworten sind immer eindeutig falsch, damit es keine Streitfälle gibt.
3. **Zählen:** „Wie viele Kürbisse siehst du?“ Die Kinder können die Dinge antippen, dann wird mitgezählt. Bei einer falschen Antwort zählt die Prinzessin gemeinsam mit dem Kind: „Eins, zwei, drei. Tipp auf die 3.“
4. **Formen:** „Wo ist das Herz?“ Kreis, Dreieck, Quadrat, Stern und Herz. Bei einer falschen Antwort heißt es zum Beispiel: „Das ist ein Kreis. Such das Herz!“

### Überraschungen mit Sternen

Bei 5, 10, 15, 20 und 25 Sternen gibt es ein Geschenk zum Auspacken. Darin steckt ein neues Zauber-Teil, das ab dann in allen Welten im Kleiderschrank liegt (mit kleinem Stern markiert):

| Sterne | Überraschung |
| --- | --- |
| 5 | Einhorn-Haarreif |
| 10 | Sternenkleid |
| 15 | Regenbogenflügel |
| 20 | Glitzerschuhe |
| 25 | Königsumhang |

Setzt man im Eltern-Menü die Sterne auf 0, sind die Überraschungen wieder verschlossen und können neu gesammelt werden.

## Auf das Xiaomi-Tablet bringen

Das Spiel läuft über GitHub Pages unter **https://irmadesigns-pixel.github.io/kids-game1/**. Neue Versionen erscheinen dort automatisch, sobald sie im Branch liegen. Auf dem Tablet zeigt die installierte App nach dem nächsten Start mit Internet die neue Version.

So wurde es eingerichtet (zum Nachschlagen):

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

**Vorlese-Stimme:** Die Prinzessin spricht mit einer fest aufgenommenen Stimme (Google-Stimme „Laomedeia“, fröhlich und etwas langsamer gesprochen). Alle Sätze liegen als MP3-Dateien im Ordner `voice/`. Beim ersten Start mit Internet lädt das Spiel sie im Hintergrund auf das Tablet (etwa 14 MB), danach funktioniert die Stimme auch offline.

Nur Sätze mit selbst eingetragenen Namen (z. B. „Hallo, ich bin Peach!“) und Sätze, die (noch) nicht aufgenommen sind, spricht die Sprachausgabe des Tablets. Falls dabei nichts zu hören ist: *Einstellungen → Zusätzliche Einstellungen → Sprachen & Eingabe → Text-in-Sprache-Ausgabe*, (der Pfad kann je nach MIUI/HyperOS-Version leicht abweichen), dort „Sprachausgabe von Google“ wählen und die deutsche Stimme herunterladen.

## Eltern-Menü

Auf dem Startbildschirm unten rechts das Zahnrad **gedrückt halten** (etwa 1 Sekunde). Dort kann man:

- jeder Prinzessin einen eigenen Namen geben (sie stellt sich dann damit vor, z. B. Rosa als „Peach“; diese Sätze spricht die Tablet-Stimme),
- Stimme und Töne ein- oder ausschalten,
- Sterne zurücksetzen und das Fotoalbum leeren.

## Zu den Figuren

Alle Prinzessinnen sind eigene Zeichnungen. Rosa ist im Stil von Peach gestaltet (blonde Haare, rosa Kleid, Krone), aber keine Nintendo-Grafik. Offizielle Mario-Bilder sind urheberrechtlich geschützt und deshalb nicht enthalten. Im Eltern-Menü kann man sie trotzdem „Peach“ nennen.

## Technik (für später)

- Alles steckt in `index.html`: HTML, CSS und JavaScript, ohne Build-Schritt und ohne Bibliotheken.
- Alle Bilder sind Vektorgrafiken (SVG), die im Code gezeichnet werden. Sie sind auf jedem Bildschirm scharf, und die Datei bleibt klein.
- Die Prinzessinnen stehen in `CHARS` (Hautton, Haarfarbe, Frisur, Augenfarbe, Start-Outfit).
- Kleidung und Tiere sind in einem Katalog definiert (Funktion `kind(...)`, Abschnitt „Wardrobe catalogue“). Jedes Teil hat Kategorie, Name mit Artikel, erlaubte Farben und passende Themen. Überraschungs-Teile haben zusätzlich `need` (benötigte Sterne). Die Welten stehen in `THEMES`, die Hintergründe in `BG`.
- `sw.js` speichert das Spiel für die Offline-Nutzung, `manifest.webmanifest` macht es installierbar.
- **Stimme:** `voice/index.json` ordnet jedem Satz eine MP3-Datei in `voice/` zu. `Voice.say()` sucht den Satz dort und setzt zusammengesetzte Sätze aus Teilen zusammen („Super!“ + „Die blaue Mütze!“). Fehlt ein Teil, spricht die Tablet-Stimme den ganzen Satz.
- **Neue Sätze aufnehmen:** Nach Änderungen an Kleidung, Farben, Welten oder Texten `GOOGLE_TTS_API_KEY=… node tools/build-voice.mjs` ausführen (Node 18 oder neuer). Das Skript liest die Spieldaten aus `index.html`, nimmt nur neue Sätze auf und löscht nicht mehr benutzte Dateien. Die Satzvorlagen im Skript müssen zu den `say(...)`-Aufrufen im Spiel passen. Mit `--dry` zeigt es nur an, was neu aufgenommen würde. Der API-Schlüssel gehört nicht ins Repository.
- Gespeichert wird nur lokal auf dem Gerät (Sterne, Fotos, Einstellungen). Es werden keine Daten verschickt.

Zum Testen am Computer: Ordner mit einem kleinen Webserver öffnen, z. B. `npx serve .`, und `http://localhost:3000` im Browser aufrufen.
