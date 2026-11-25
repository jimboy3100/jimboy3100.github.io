# Legend Mod gaming glossary

One table per language with the word to use for each common term in Legend Mod's packs
(`developers/i18n/src/*.json`). Use the same word everywhere in that language: toggles, tooltips,
toasts, help text and the web pages.

How to read the tables:

- **Use** is the word to write, in its base form and in lower case (German nouns and fixed labels
  such as Game Over keep their capitals). Capitalise it as the label needs, and inflect it inside a
  sentence (plural, article, case).
- **EN** in the notes means players of that language keep the English word. Write it exactly as the
  table shows it: Latin letters or the community's own spelling.
- **packs:** lists the other forms the packs use today. Those are the ones reviewers replace.
- **verify** means the choice is uncertain. Check the context and, if you can, how that community
  writes it. If you pick something else, use it everywhere and report it.
- The labels **Rounded** / **Square** are the HUD shape choice (`Rounded HUD` / `Square HUD`).
- Never translate: Legend Mod, Agar.io, Expanding Land, Discord, Twitch, YouTube, Google, key
  names (Space, Shift, Ctrl, Q, W...), URLs, placeholders, player and server names.
- `on`/`off` are toggle states. Write them in capitals only where the English is in capitals.

---

## el: Greek

Style: informal εσύ (Πάτα, Άνοιξε, Διάλεξε), never Πατήστε/Επιλέξτε in game UI. The question mark
is `;`. Keep the accent in lower case and drop it in ALL CAPS (ΡΥΘΜΙΣΕΙΣ, not ΡΥΘΜΊΣΕΙΣ). Buttons
use a verbal noun (Αποθήκευση, Εισαγωγή) or a short imperative, never a full sentence. Greek players
mix in many English gaming words, so write them in Latin letters (`split`, `skin`, `server`),
lower case inside a sentence.

| English | Use | Notes |
| --- | --- | --- |
| cell | κύτταρο | verify: players often just say "cell" or "μπάλα". Keep κύτταρο in UI |
| mass | μάζα | packs: Μαζα (no accent) |
| split | split | EN. packs: Διαίρεση, Διάσπαση, Χώρισμα: replace all |
| double split | double split | EN. packs: Διπλή διαίρεση, Διπλό split, Διπλό χώρισμα |
| triple split | triple split | EN |
| trick split | tricksplit | EN |
| feed / eject mass | feed | EN. packs: Τάισμα, Ταΐσματα, Τάισε |
| virus | ιός | verify: players also say "virus" |
| pop (on a virus) | σκάσιμο | verify |
| food / pellet | τροφή | packs: Φαγητο, Φαγητό, Σφαιρίδια. Pellet = κομματάκι τροφής where it has to be told apart |
| skin | skin (pl. skins) | EN. packs: Εικόνες Skin, Εικονες (skin) |
| custom skin | δικό σου skin | packs: Προσαρμοσμένη εικόνα, Προσαρμοσμένα skins |
| nickname | nick | EN. packs: Ψευδώνυμο, Όνομα |
| clan tag | tag | EN (tag clan where it has to be clear) |
| team | ομάδα | |
| teammate | συμπαίκτης | |
| party | party | EN. packs: ΠΑΡΕΑ, Πάρτι |
| party token | κωδικός party | packs: Πιστα (wrong) |
| leaderboard | κατάταξη | packs: Πίνακας κατάταξης, Ηγέτες. Πίνακας κατάταξης is fine where there is room |
| teamboard | κατάταξη ομάδας | packs: Ηγέτες Ομάδας |
| minimap | minimap | EN. packs: Μικρός χάρτης, Μίνι χάρτης, Χάρτης. verify: Μικρός χάρτης is also understood |
| sector | τομέας | |
| server | server | EN. packs: Διακομιστής, ΥΠΗΡΕΤΗΣ, Πίστες: replace all |
| region | περιοχή | |
| ping / lag / FPS | ping / lag / FPS | EN |
| zoom | ζουμ | |
| spectate | spectate | EN in labels (Spectate). Παρακολούθηση in sentences. packs: Επιθεωρηση. verify |
| free spectate | ελεύθερο spectate | packs: Ελεύθερη θέαση |
| multibox / bot / macro | multibox / bot / macro | EN. packs: Μακροεντολές (use macros) |
| hotkey | πλήκτρο | packs: Πλήκτρα συντόμευσης, Άμεσα Πλήκτρα. Πλήκτρα συντόμευσης for the settings section |
| replay | replay | EN. packs: Επανάληψη |
| respawn | respawn | EN. packs: Συνεχιση, Επαναγέννηση |
| game over | Game Over | EN on the card, Τέλος παιχνιδιού in sentences |
| death recap | ανασκόπηση θανάτου | |
| mass graph | γράφημα μάζας | |
| killer | ποιος σε έφαγε | for a field label. In sentences ο παίκτης που σε έφαγε |
| jelly physics | φυσική ζελέ | |
| HUD | HUD | EN. packs: Περίγυρος παιχνιδιού - HUD' |
| theme | θέμα | |
| preset | προρύθμιση | packs: Προεπιλογές (that word means "defaults") |
| profile / settings profile | προφίλ / προφίλ ρυθμίσεων | |
| import / export | εισαγωγή / εξαγωγή | |
| upload / download | ανέβασμα / κατέβασμα | buttons: Ανέβασε / Κατέβασε. packs: Ανεβάστε, Κατεβάστε (formal) |
| cloud | cloud | EN. Σύννεφο sounds literal |
| reset | επαναφορά | |
| restore defaults | επαναφορά προεπιλογών | |
| toggle | ενεργοποίηση/απενεργοποίηση | as a verb in tooltips: άναψε/σβήσε |
| show / hide | εμφάνιση / απόκρυψη | |
| enable / disable | ενεργοποίηση / απενεργοποίηση | |
| on / off | ΝΑΙ / ΟΧΙ | toggle states (packs agree). In sentences ενεργό / ανενεργό. verify: ON / OFF is also common |
| overlay | overlay | EN. verify |
| cursor | κέρσορας | |
| background | φόντο | |
| panel | πάνελ | packs: Πίνακας |
| menu | μενού | packs: Mενού (Latin M) |
| settings | ρυθμίσεις | |
| chat | chat | EN. packs: Συνομιλία, Συζητηση, Ομιλία. verify: Συνομιλία is understood too |
| chat bubble | συννεφάκι chat | verify |
| emoji | emoji | EN |
| mute | σίγαση | |
| streamer mode | λειτουργία streamer | |
| user scripts | scripts | EN. Never σενάρια |
| plugins | plugins | EN |
| editor | editor | EN. packs: Επεξεργασία (means "editing"). Επεξεργαστής also fine. verify |
| workshop | εργαστήριο | |
| gallery | συλλογή | |
| command centre | κέντρο εντολών | |
| notification | ειδοποίηση | |
| adaptive performance | προσαρμοστική απόδοση | |
| performance mode | λειτουργία απόδοσης | |
| diagnostics | διαγνωστικά | |
| accessibility | προσβασιμότητα | |
| Rounded / Square HUD | Στρογγυλεμένο / Τετράγωνο | |
| save / cancel / close / delete / apply | Αποθήκευση / Άκυρο / Κλείσιμο / Διαγραφή / Εφαρμογή | packs: Ακύρωση and Άκυρο both. Use Άκυρο |
| coins | νομίσματα | verify: players also say coins |
| DNA | DNA | EN |
| offer / deal | προσφορά | |
| purchase / buy | αγορά | |
| equip / unequip | φόρεσε / βγάλε | packs: Εφαρμογή / Αφαίρεση. verify |
| owned | το έχεις | |
| potion | φίλτρο | |
| boost | boost | EN. packs: ΕΝΙΣΧΥΣΗ. verify |
| quest | αποστολή | |
| level | επίπεδο | |
| XP | XP | EN |
| reward | ανταμοιβή | |
| daily | ημερήσιος/-α | Ημερήσια αποστολή |
| league | πρωτάθλημα | |
| login / logout | σύνδεση / αποσύνδεση | |
| guest | επισκέπτης | |
| account | λογαριασμός | |
| language | γλώσσα | |

---

## es: Spanish

Style: informal tú (Pulsa, Elige, Inicia sesión), neutral Spanish that works for Spain and Latin
America. Opening ¿ and ¡. Buttons use the infinitive (Guardar, Cancelar, Importar), toggle labels
are short nouns. Sentence case, not Title Case.

| English | Use | Notes |
| --- | --- | --- |
| cell | célula | |
| mass | masa | |
| split | split | EN. packs: Dividir, División, Divisiones |
| double split | doble split | EN-based. packs: Doble división, División doble, Double división |
| triple split | triple split | |
| trick split | tricksplit | EN |
| feed / eject mass | feed | EN. packs: Alimentar, Disparos. Verb in sentences: expulsar masa |
| virus | virus | |
| pop (on a virus) | reventón | Reventarse in sentences. verify |
| food / pellet | comida / bolitas | |
| skin | skin (pl. skins) | EN, masculine: el skin. packs: Skins customizadas (feminine) |
| custom skin | skin personalizado | |
| nickname | nick | EN |
| clan tag | tag del clan | |
| team | equipo | |
| teammate | compañero | |
| party | party | EN |
| party token | código de party | packs: Party (for Token) |
| leaderboard | clasificación | packs: Marcadores |
| teamboard | clasificación del equipo | packs: Tablero de equipo |
| minimap | minimapa | |
| sector | sector | |
| server | servidor | |
| region | región | |
| ping / lag / FPS | ping / lag / FPS | EN |
| zoom | zoom | |
| spectate | espectar | |
| free spectate | espectar libre | |
| multibox / bot / macro | multibox / bot / macro | EN |
| hotkey | atajo | packs: Tecla, Teclas rápidas, Teclas. Section: Atajos de teclado |
| replay | repetición | verify: replay is common in chat |
| respawn | reaparecer | |
| game over | fin de la partida | packs: Fin del juego |
| death recap | resumen de muerte | |
| mass graph | gráfica de masa | |
| killer | quién te comió | field label. Asesino sounds too strong. verify |
| jelly physics | física gelatina | |
| HUD | HUD | EN |
| theme | tema | |
| preset | preajuste | |
| profile / settings profile | perfil / perfil de ajustes | |
| import / export | importar / exportar | |
| upload / download | subir / descargar | |
| cloud | nube | |
| reset | restablecer | |
| restore defaults | restaurar valores predeterminados | short: Por defecto |
| toggle | activar/desactivar | |
| show / hide | mostrar / ocultar | |
| enable / disable | activar / desactivar | |
| on / off | SÍ / NO | toggle state. In sentences activado / desactivado |
| overlay | superposición | verify. Overlay is used by streamers |
| cursor | cursor | |
| background | fondo | |
| panel | panel | |
| menu | menú | |
| settings | ajustes | packs: Opciones |
| chat | chat | EN |
| chat bubble | burbuja de chat | |
| emoji | emoji | |
| mute | silenciar | |
| streamer mode | modo streamer | |
| user scripts | scripts | |
| plugins | plugins | |
| editor | editor | |
| workshop | taller | |
| gallery | galería | |
| command centre | centro de comandos | |
| notification | notificación | |
| adaptive performance | rendimiento adaptativo | |
| performance mode | modo rendimiento | |
| diagnostics | diagnóstico | |
| accessibility | accesibilidad | |
| Rounded / Square HUD | Redondeado / Cuadrado | |
| save / cancel / close / delete / apply | Guardar / Cancelar / Cerrar / Eliminar / Aplicar | packs: Borrar, Cerca (wrong, means "near") |
| coins | monedas | |
| DNA | ADN | |
| offer / deal | oferta | |
| purchase / buy | comprar | |
| equip / unequip | equipar / quitar | |
| owned | en propiedad | short label: Tuyo. verify |
| potion | poción | |
| boost | boost | EN. packs: IMPULSO. verify |
| quest | misión | |
| level | nivel | |
| XP | XP | |
| reward | recompensa | |
| daily | diaria | Misión diaria |
| league | liga | |
| login / logout | iniciar sesión / cerrar sesión | tag: SESIÓN |
| guest | invitado | |
| account | cuenta | |
| language | idioma | |

---

## bg: Bulgarian

Style: informal ти for game UI (Натисни, Избери, Влез), not Натиснете. Buttons use a short
imperative (Запази, Изтрий) or a verbal noun (Импорт). Bulgarian gamers write most gaming loanwords
in Cyrillic (скин, сплит, сървър, пинг, бот); keep FPS and HUD in Latin.

| English | Use | Notes |
| --- | --- | --- |
| cell | клетка | |
| mass | маса | packs: Maса (Latin M), Масса (Russian) |
| split | сплит | EN in Cyrillic. packs: Разделяне, РАЗДЕЛИ. verify |
| double split | двоен сплит | packs: Двойно разделяне, Двоен split |
| triple split | троен сплит | packs: Троен split |
| trick split | трик сплит | verify |
| feed / eject mass | фийд | verify. packs: Храни, Хранене, Храна. Изхвърляне на маса in explanations |
| virus | вирус | |
| pop (on a virus) | пръсване | verify |
| food / pellet | храна / топчета | |
| skin | скин (pl. скинове) | |
| custom skin | собствен скин | packs: Персонални скинове |
| nickname | ник | packs: Име |
| clan tag | клан таг | verify |
| team | отбор | packs: екип |
| teammate | съотборник | |
| party | парти | packs: PARTY, ГРУПА |
| party token | код за парти | packs: ИП адрес (wrong) |
| leaderboard | класация | packs: Класиране, Табло |
| teamboard | класация на отбора | packs: Екипборд |
| minimap | миникарта | packs: Минимап, Мини мап, Мини карта |
| sector | сектор | |
| server | сървър | |
| region | регион | packs: област |
| ping / lag / FPS | пинг / лаг / FPS | |
| zoom | мащаб | packs: Зуум |
| spectate | наблюдавай | |
| free spectate | свободно наблюдение | |
| multibox / bot / macro | мултибокс / бот / макро | packs: Multibox (Latin) |
| hotkey | бърз клавиш | |
| replay | повторение | verify: реплей is common |
| respawn | съживяване | packs: Възраждане. verify: респаун |
| game over | край на играта | |
| death recap | обзор на смъртта | verify |
| mass graph | графика на масата | |
| killer | кой те изяде | field label. verify |
| jelly physics | желе физика | packs: Физика от желе, Желирана физика |
| HUD | HUD | packs: Надписи |
| theme | тема | |
| preset | готови настройки | |
| profile / settings profile | профил / профил с настройки | |
| import / export | импорт / експорт | |
| upload / download | качи / изтегли | |
| cloud | облак | |
| reset | нулиране | buttons: Нулирай |
| restore defaults | по подразбиране | |
| toggle | вкл./изкл. | |
| show / hide | покажи / скрий | |
| enable / disable | включи / изключи | |
| on / off | ВКЛ / ИЗКЛ | packs mix ВКЛ and ВКЛ. Use no dot |
| overlay | наслагване | verify: оувърлей |
| cursor | курсор | |
| background | фон | |
| panel | панел | |
| menu | меню | |
| settings | настройки | |
| chat | чат | |
| chat bubble | балонче в чата | |
| emoji | емоджи | |
| mute | заглуши | |
| streamer mode | режим за стриймъри | |
| user scripts | скриптове | |
| plugins | плъгини | |
| editor | редактор | |
| workshop | работилница | |
| gallery | галерия | |
| command centre | команден център | |
| notification | известие | |
| adaptive performance | адаптивна производителност | |
| performance mode | режим производителност | |
| diagnostics | диагностика | |
| accessibility | достъпност | |
| Rounded / Square HUD | Заоблен / Квадратен | |
| save / cancel / close / delete / apply | Запази / Отказ / Затвори / Изтрий / Приложи | packs: Близо (wrong, means "near") |
| coins | монети | |
| DNA | ДНК | |
| offer / deal | оферта | |
| purchase / buy | купи | |
| equip / unequip | сложи / свали | packs: Екипирай. verify |
| owned | притежаваш | |
| potion | отвара | packs: ЕЛИКСИР, еликсири |
| boost | бууст | packs: УСИЛВАНЕ, БОНУС. verify |
| quest | мисия | |
| level | ниво | |
| XP | XP | |
| reward | награда | |
| daily | дневна | Дневна мисия |
| league | лига | |
| login / logout | вход / изход | buttons: Влез / Излез |
| guest | гост | |
| account | акаунт | |
| language | език | |

---

## fr: French

Style: tu (Appuie, Choisis, Connecte-toi), as in French game UIs. A non-breaking space before
`: ; ? !` and inside « ». Buttons use the infinitive (Enregistrer, Annuler, Importer). Sentence case.
French players keep split, feed, skin, ping, lag, bot, multibox and replay in English.

| English | Use | Notes |
| --- | --- | --- |
| cell | cellule | |
| mass | masse | |
| split | split | EN. packs: Diviser, Division, Divisions |
| double split | double split | packs: Double division |
| triple split | triple split | |
| trick split | tricksplit | |
| feed / eject mass | feed | EN. packs: Nourrir, Éjections. Éjecter de la masse in explanations |
| virus | virus | |
| pop (on a virus) | explosion | verify. packs: Éclatements |
| food / pellet | nourriture / pastilles | |
| skin | skin (pl. skins) | EN, masculine |
| custom skin | skin personnalisé | |
| nickname | pseudo | packs: Nom |
| clan tag | tag de clan | |
| team | équipe | |
| teammate | coéquipier | |
| party | party | EN. packs: GROUPE |
| party token | code de party | packs: Lien |
| leaderboard | classement | |
| teamboard | classement d'équipe | packs: Tableau d'équipe |
| minimap | mini-carte | packs: Minicarte. Pick one: mini-carte |
| sector | secteur | |
| server | serveur | |
| region | région | |
| ping / lag / FPS | ping / lag / FPS | EN |
| zoom | zoom | |
| spectate | regarder | label; mode spectateur in sentences |
| free spectate | spectateur libre | |
| multibox / bot / macro | multibox / bot / macro | EN |
| hotkey | raccourci | packs: Raccourcisn claver (typo) |
| replay | replay | EN |
| respawn | réapparaître | verify: respawn is common |
| game over | partie terminée | |
| death recap | récap de la mort | |
| mass graph | graphique de masse | |
| killer | qui t'a mangé | field label. verify |
| jelly physics | physique gélatine | packs: Gelée physique (wrong order) |
| HUD | HUD | |
| theme | thème | |
| preset | préréglage | |
| profile / settings profile | profil / profil de réglages | |
| import / export | importer / exporter | |
| upload / download | envoyer / télécharger | packs: [IMPORT] for upload. Use ENVOI |
| cloud | cloud | EN in gaming UI. Nuage is literal |
| reset | réinitialiser | |
| restore defaults | valeurs par défaut | |
| toggle | activer/désactiver | |
| show / hide | afficher / masquer | |
| enable / disable | activer / désactiver | |
| on / off | OUI / NON | toggle state. In sentences activé / désactivé |
| overlay | overlay | EN. verify: superposition |
| cursor | curseur | |
| background | fond | |
| panel | panneau | packs: Tableau de bord |
| menu | menu | |
| settings | paramètres | packs: Réglages |
| chat | chat | |
| chat bubble | bulle de chat | |
| emoji | emoji | |
| mute | rendre muet | short: Muet |
| streamer mode | mode streamer | |
| user scripts | scripts | |
| plugins | plugins | |
| editor | éditeur | |
| workshop | atelier | |
| gallery | galerie | |
| command centre | centre de commandes | |
| notification | notification | |
| adaptive performance | performances adaptatives | |
| performance mode | mode performance | |
| diagnostics | diagnostic | |
| accessibility | accessibilité | |
| Rounded / Square HUD | Arrondi / Carré | |
| save / cancel / close / delete / apply | Enregistrer / Annuler / Fermer / Supprimer / Appliquer | |
| coins | pièces | |
| DNA | ADN | |
| offer / deal | offre | |
| purchase / buy | acheter | |
| equip / unequip | équiper / retirer | |
| owned | possédé | |
| potion | potion | |
| boost | boost | |
| quest | quête | |
| level | niveau | |
| XP | XP | |
| reward | récompense | |
| daily | quotidienne | Quête quotidienne |
| league | ligue | |
| login / logout | connexion / déconnexion | buttons: Se connecter / Se déconnecter |
| guest | invité | |
| account | compte | |
| language | langue | |

---

## ar: Arabic

Style: right to left; the page sets `dir="rtl"` from `LMi18n.dir()`. Arabic punctuation `،` `؟` `؛`.
Address the player in the masculine singular imperative (اضغط، اختر). Write gaming words players keep
in English in Latin letters (FPS, HUD, Ping, Multibox); the bidi algorithm places them correctly,
so do not add marks by hand. Labels without the article where they are tight (إعدادات) and with it
for headings (الإعدادات). Pick one form per window. Arab agar.io players use many transliterations
(سكن، سيرفر، بوت); several choices below need a native check.

| English | Use | Notes |
| --- | --- | --- |
| cell | خلية | |
| mass | الكتلة | verify: players often say ماس. packs: الماس for Mass (×2) |
| split | انقسام | verify: سبليت is common in chat. packs: انقسم |
| double split | انقسام مزدوج | packs: دبل سبليت |
| triple split | انقسام ثلاثي | |
| trick split | تريك سبليت | verify |
| feed / eject mass | إطعام | verify: packs also اخراج الماس, التغذيات |
| virus | فيروس | |
| pop (on a virus) | انفجار | |
| food / pellet | طعام | packs: نقاط الماس, الماس, الكريات. verify |
| skin | سكن (pl. سكنات) | packs: الاسكنات |
| custom skin | سكن مخصص | |
| nickname | الاسم | packs: الأسم (spelling), اللقب |
| clan tag | تاغ الكلان | verify |
| team | فريق | |
| teammate | زميل | زملاء الفريق in plural. packs: الفريق (for Teammates) |
| party | بارتي | packs: المجموعة, حفلة (wrong: celebration), PARTY |
| party token | رمز البارتي | packs: السيرفر (wrong) |
| leaderboard | لوحة الصدارة | packs: لوحة المتصدرين, الأوائل |
| teamboard | لوحة الفريق | packs: الفريق |
| minimap | الخريطة المصغرة | |
| sector | قطاع | |
| server | السيرفر | packs: الخادم (formal, most packs). verify which the community prefers. Never mix in one window |
| region | المنطقة | packs: منطقة اللعب |
| ping / lag / FPS | Ping / لاق / FPS | lag: verify |
| zoom | التكبير | packs: الزووم |
| spectate | مشاهدة | packs: بث حي للاول, وضع التصفح (wrong) |
| free spectate | المشاهدة الحرة | |
| multibox / bot / macro | Multibox / بوت / ماكرو | packs: متعدد, التعدد, روبوتات |
| hotkey | اختصار | |
| replay | الإعادة | |
| respawn | إعادة الظهور | packs: إعادة البدء |
| game over | انتهت اللعبة | |
| death recap | ملخص الموت | |
| mass graph | رسم الكتلة | |
| killer | من أكلك | field label. verify |
| jelly physics | فيزياء الجيلي | |
| HUD | HUD | packs: Hud |
| theme | الثيم | packs: السمة, السمات. verify: gamers say ثيم |
| preset | إعداد جاهز | |
| profile / settings profile | الملف / ملف الإعدادات | packs: البروفايل, الملف الشخصي |
| import / export | استيراد / تصدير | |
| upload / download | رفع / تنزيل | packs: تحميل for download (ambiguous: means both) |
| cloud | السحابة | |
| reset | إعادة ضبط | |
| restore defaults | استعادة الافتراضي | |
| toggle | تشغيل/إيقاف | |
| show / hide | إظهار / إخفاء | packs: عرض |
| enable / disable | تفعيل / تعطيل | |
| on / off | تشغيل / إيقاف | toggle state. In sentences مفعّل / معطّل |
| overlay | طبقة علوية | verify |
| cursor | المؤشر | |
| background | الخلفية | |
| panel | اللوحة | packs: التحكم |
| menu | القائمة | |
| settings | الإعدادات | packs: الاعدادات (no hamza) |
| chat | الدردشة | packs: المحادثة |
| chat bubble | فقاعة الدردشة | |
| emoji | إيموجي | |
| mute | كتم | |
| streamer mode | وضع الستريمر | verify |
| user scripts | السكربتات | verify |
| plugins | الإضافات | |
| editor | المحرر | |
| workshop | الورشة | |
| gallery | المعرض | |
| command centre | مركز الأوامر | |
| notification | إشعار | |
| adaptive performance | الأداء التكيّفي | |
| performance mode | وضع الأداء | |
| diagnostics | التشخيص | |
| accessibility | إمكانية الوصول | |
| Rounded / Square HUD | دائري / مربع | |
| save / cancel / close / delete / apply | حفظ / إلغاء / إغلاق / حذف / تطبيق | packs: قريب (wrong, means "near") |
| coins | العملات | |
| DNA | DNA | |
| offer / deal | عرض | |
| purchase / buy | شراء | |
| equip / unequip | تجهيز / إزالة | |
| owned | مملوك | |
| potion | جرعة | |
| boost | معزز | packs: تعزيز |
| quest | مهمة | |
| level | المستوى | |
| XP | XP | |
| reward | مكافأة | |
| daily | يومية | مهمة يومية |
| league | الدوري | |
| login / logout | تسجيل الدخول / تسجيل الخروج | |
| guest | ضيف | |
| account | الحساب | |
| language | اللغة | |

---

## zh: Traditional Chinese

Style: Traditional characters only, with Taiwan UI vocabulary (伺服器, 設定, 帳號, 匯入, 儲存, 選單,
預設). Never simplified forms or mainland terms (服務器, 菜單, 賬號, 導入, 保存). Full-width punctuation
`，。：？！（）「」`, no spaces between Chinese characters; one space between Chinese and Latin
words or numbers is optional, so be consistent. Buttons are two to four characters (儲存、取消、套用).
No second-person pronoun needed; where one is used, 你.

| English | Use | Notes |
| --- | --- | --- |
| cell | 細胞 | verify: players often say 球 |
| mass | 質量 | verify: 體重 in 球球大作戰-style games |
| split | 分裂 | |
| double split | 雙分 | packs: 雙重分裂, 雙分裂, 雙空 (wrong). verify |
| triple split | 三分 | packs: 三重分裂. verify |
| trick split | 技巧分裂 | verify |
| feed / eject mass | 吐球 | packs: 餵食, 餵W. 吐球 is the community word |
| virus | 刺球 | packs: 病毒 (×3). verify: 刺球 is the community word, 病毒 the literal one |
| pop (on a virus) | 炸刺 | packs: 被炸次數. verify |
| food / pellet | 食物 / 點點 | packs: 點點 for Food, 顆粒 for Pellets. verify |
| skin | 造型 | packs: 皮, 皮膚 |
| custom skin | 自訂造型 | packs: 自訂皮膚 |
| nickname | 暱稱 | packs: 名字 |
| clan tag | 戰隊標籤 | verify |
| team | 隊伍 | packs: 團隊, 組隊, 小組 |
| teammate | 隊友 | |
| party | 組隊 | packs: 派對 (means a celebration). verify |
| party token | 組隊代碼 | packs: 服務器 (wrong) |
| leaderboard | 排行榜 | |
| teamboard | 隊伍排行榜 | packs: 隊友榜 |
| minimap | 小地圖 | |
| sector | 區域 | packs: 座標. verify |
| server | 伺服器 | packs: 服務器 (mainland) |
| region | 地區 | |
| ping / lag / FPS | Ping / 延遲 / FPS | lag in sentences: 卡頓 |
| zoom | 縮放 | |
| spectate | 觀戰 | |
| free spectate | 自由觀戰 | |
| multibox / bot / macro | 多開 / 機器人 / 巨集 | |
| hotkey | 快捷鍵 | packs: 熱鍵 |
| replay | 重播 | |
| respawn | 重生 | |
| game over | 遊戲結束 | |
| death recap | 死亡回顧 | |
| mass graph | 質量圖表 | |
| killer | 擊殺者 | |
| jelly physics | 果凍效果 | packs: 果凍物理學, 果凍物理效果 |
| HUD | HUD | packs: 螢幕資訊. verify |
| theme | 主題 | |
| preset | 預設組合 | |
| profile / settings profile | 設定檔 | |
| import / export | 匯入 / 匯出 | |
| upload / download | 上傳 / 下載 | |
| cloud | 雲端 | |
| reset | 重設 | |
| restore defaults | 還原預設值 | |
| toggle | 切換 | |
| show / hide | 顯示 / 隱藏 | |
| enable / disable | 啟用 / 停用 | |
| on / off | 開 / 關 | |
| overlay | 疊加層 | verify |
| cursor | 游標 | |
| background | 背景 | packs: 背脊 (wrong) |
| panel | 面板 | |
| menu | 選單 | packs: 菜單 (mainland) |
| settings | 設定 | |
| chat | 聊天 | packs: 對話 |
| chat bubble | 聊天泡泡 | |
| emoji | 表情符號 | |
| mute | 靜音 | |
| streamer mode | 實況主模式 | |
| user scripts | 腳本 | |
| plugins | 擴充功能 | packs: 外掛 (in Taiwan gaming 外掛 means a cheat) |
| editor | 編輯器 | |
| workshop | 工作坊 | |
| gallery | 圖庫 | |
| command centre | 指令中心 | |
| notification | 通知 | |
| adaptive performance | 自適應效能 | |
| performance mode | 效能模式 | |
| diagnostics | 診斷 | |
| accessibility | 無障礙 | |
| Rounded / Square HUD | 圓角 / 方角 | |
| save / cancel / close / delete / apply | 儲存 / 取消 / 關閉 / 刪除 / 套用 | |
| coins | 金幣 | |
| DNA | DNA | |
| offer / deal | 優惠 | |
| purchase / buy | 購買 | |
| equip / unequip | 裝備 / 卸下 | |
| owned | 已擁有 | |
| potion | 藥水 | |
| boost | 加成 | |
| quest | 任務 | |
| level | 等級 | |
| XP | 經驗值 | packs: XP. Short HUD label: XP |
| reward | 獎勵 | |
| daily | 每日 | 每日任務 |
| league | 聯賽 | |
| login / logout | 登入 / 登出 | |
| guest | 訪客 | |
| account | 帳號 | |
| language | 語言 | |

---

## ru: Russian

Style: ты in game UI (Нажми, Выбери, Войди), not Нажмите. Buttons use the infinitive (Сохранить,
Отменить, Импортировать) or a short noun (Импорт, Сброс). Russian agar players write gaming slang
in Cyrillic (сплит, фид, скин, пинг, лаг, бот, мультибокс); FPS and HUD stay Latin. Use ё where
the packs already do.

| English | Use | Notes |
| --- | --- | --- |
| cell | клетка | verify: players also say шар |
| mass | масса | |
| split | сплит | packs: Разделение, Деление, ДЕЛЕНИЕ |
| double split | двойной сплит | packs: Двойное разделение, Дабл сплит |
| triple split | тройной сплит | |
| trick split | трик-сплит | verify |
| feed / eject mass | фид | packs: Кормление, КОРМ, Еда. Выброс массы in explanations |
| virus | вирус | |
| pop (on a virus) | взрыв | Лопнуть на вирусе in sentences. verify |
| food / pellet | еда / шарики | |
| skin | скин (pl. скины) | |
| custom skin | свой скин | packs: Пользовательские скины |
| nickname | ник | |
| clan tag | клан-тег | |
| team | команда | |
| teammate | тиммейт | packs: Напарник, Товариши (typo), Союзники. verify: союзник is also natural |
| party | пати | packs: ГРУППА, PARTY |
| party token | токен пати | |
| leaderboard | топ | packs: Таблица лидеров, Лидерборд, Доска лидеров. Таблица лидеров for headings with room |
| teamboard | топ команды | packs: Товарищи |
| minimap | миникарта | packs: Мини-карта |
| sector | сектор | |
| server | сервер | packs: Серврер (typo) |
| region | регион | |
| ping / lag / FPS | пинг / лаг / FPS | |
| zoom | масштаб | packs: Увеличить |
| spectate | наблюдать | |
| free spectate | свободное наблюдение | |
| multibox / bot / macro | мультибокс / бот / макрос | packs: Multibox (Latin) |
| hotkey | горячая клавиша | short: клавиша. verify: бинд in gamer slang |
| replay | реплей | packs: Повтор. verify |
| respawn | респавн | packs: Возрождение |
| game over | игра окончена | |
| death recap | итоги гибели | |
| mass graph | график массы | |
| killer | кто тебя съел | field label. Убийца in sentences |
| jelly physics | желейная физика | packs: Неровности в шарах |
| HUD | HUD | |
| theme | тема | |
| preset | пресет | |
| profile / settings profile | профиль / профиль настроек | |
| import / export | импорт / экспорт | |
| upload / download | загрузить / скачать | |
| cloud | облако | |
| reset | сброс | button: Сбросить |
| restore defaults | по умолчанию | |
| toggle | вкл./выкл. | |
| show / hide | показать / скрыть | |
| enable / disable | включить / выключить | |
| on / off | ВКЛ / ВЫКЛ | |
| overlay | оверлей | |
| cursor | курсор | |
| background | фон | packs: Задний план |
| panel | панель | |
| menu | меню | |
| settings | настройки | |
| chat | чат | |
| chat bubble | облачко чата | |
| emoji | эмодзи | |
| mute | заглушить | |
| streamer mode | режим стримера | |
| user scripts | скрипты | |
| plugins | плагины | |
| editor | редактор | |
| workshop | мастерская | |
| gallery | галерея | |
| command centre | командный центр | |
| notification | уведомление | |
| adaptive performance | адаптивная производительность | |
| performance mode | режим производительности | |
| diagnostics | диагностика | |
| accessibility | доступность | |
| Rounded / Square HUD | Скруглённый / Квадратный | |
| save / cancel / close / delete / apply | Сохранить / Отмена / Закрыть / Удалить / Применить | |
| coins | монеты | |
| DNA | ДНК | |
| offer / deal | акция | |
| purchase / buy | купить | |
| equip / unequip | надеть / снять | |
| owned | есть | short label: Куплено |
| potion | зелье | |
| boost | буст | packs: УСИЛЕНИЕ, БОНУС. verify |
| quest | задание | |
| level | уровень | |
| XP | XP | packs: Опыт. Опыт in sentences |
| reward | награда | |
| daily | ежедневное | Ежедневное задание |
| league | лига | |
| login / logout | вход / выход | buttons: Войти / Выйти |
| guest | гость | |
| account | аккаунт | |
| language | язык | |

---

## de: German

Style: du (Drück, Wähle, Melde dich an), lower-case du. Buttons use the infinitive (Speichern,
Abbrechen, Importieren). German gamers keep many English terms (Split, Feed, Skin, Lag, Ping,
Replay, Respawn); write them as German nouns (capitalised) and join compounds with a hyphen where
English is involved (Clan-Tag, Party-Code, Streamer-Modus).

| English | Use | Notes |
| --- | --- | --- |
| cell | Zelle | |
| mass | Masse | |
| split | Split | EN. packs: Teilen |
| double split | Doppelsplit | packs: Doppelt teilen, Doppelteilung |
| triple split | Dreifachsplit | |
| trick split | Tricksplit | |
| feed / eject mass | Feed | EN. packs: Füttern. Masse auswerfen in explanations |
| virus | Virus | |
| pop (on a virus) | Platzen | verify |
| food / pellet | Futter / Kügelchen | packs: Essen, Kugeln |
| skin | Skin (pl. Skins) | |
| custom skin | eigener Skin | packs: Benutzerdefinierte Skins |
| nickname | Nick | |
| clan tag | Clan-Tag | |
| team | Team | packs: Mannschaften |
| teammate | Teammitglied | packs: Mitspieler, Teamkollegen. verify |
| party | Party | |
| party token | Party-Code | packs: Token |
| leaderboard | Bestenliste | packs: Rangliste |
| teamboard | Team-Bestenliste | packs: Teamtafel |
| minimap | Minimap | packs: Minikarte |
| sector | Sektor | |
| server | Server | |
| region | Region | |
| ping / lag / FPS | Ping / Lag / FPS | |
| zoom | Zoom | |
| spectate | Zuschauen | packs: Beobachten |
| free spectate | Freies Zuschauen | |
| multibox / bot / macro | Multibox / Bot / Makro | |
| hotkey | Hotkey | packs: Tastenkürzel (×5). Section heading: Tastenbelegung. verify |
| replay | Replay | packs: Wiederholung |
| respawn | Respawn | packs: Wiederbeleben |
| game over | Game Over | packs: Spiel vorbei |
| death recap | Todesrückblick | |
| mass graph | Massegrafik | |
| killer | Gefressen von | field label |
| jelly physics | Jelly-Physik | verify: Wackelphysik |
| HUD | HUD | |
| theme | Theme | packs: Design, Designs |
| preset | Voreinstellung | |
| profile / settings profile | Profil / Einstellungsprofil | |
| import / export | Importieren / Exportieren | packs: Import, Export |
| upload / download | Hochladen / Herunterladen | |
| cloud | Cloud | |
| reset | Zurücksetzen | |
| restore defaults | Standard wiederherstellen | |
| toggle | Ein/Aus | |
| show / hide | Anzeigen / Ausblenden | packs: Einblenden, Zeigen |
| enable / disable | Aktivieren / Deaktivieren | |
| on / off | AN / AUS | |
| overlay | Overlay | |
| cursor | Mauszeiger | packs: Cursor. verify |
| background | Hintergrund | |
| panel | Panel | |
| menu | Menü | |
| settings | Einstellungen | |
| chat | Chat | |
| chat bubble | Chatblase | |
| emoji | Emoji | |
| mute | Stummschalten | |
| streamer mode | Streamer-Modus | |
| user scripts | Skripte | |
| plugins | Plugins | |
| editor | Editor | |
| workshop | Werkstatt | |
| gallery | Galerie | |
| command centre | Kommandozentrale | |
| notification | Benachrichtigung | |
| adaptive performance | Adaptive Leistung | |
| performance mode | Leistungsmodus | |
| diagnostics | Diagnose | |
| accessibility | Barrierefreiheit | |
| Rounded / Square HUD | Abgerundet / Eckig | |
| save / cancel / close / delete / apply | Speichern / Abbrechen / Schließen / Löschen / Anwenden | |
| coins | Münzen | |
| DNA | DNA | |
| offer / deal | Angebot | |
| purchase / buy | Kaufen | |
| equip / unequip | Ausrüsten / Ablegen | |
| owned | Im Besitz | |
| potion | Trank | |
| boost | Boost | |
| quest | Quest | |
| level | Level | |
| XP | XP | packs: EP |
| reward | Belohnung | |
| daily | Täglich | Tägliche Quest |
| league | Liga | |
| login / logout | Anmelden / Abmelden | packs: Ausloggen. Tag: ANMELDUNG |
| guest | Gast | |
| account | Konto | |
| language | Sprache | |

---

## tr: Turkish

Style: sen (Bas, Seç, Giriş yap), not Basınız. Buttons use a short imperative (Kaydet, Sil, Uygula).
Upper case must keep the dotted İ: i → İ, ı → I (GİRİŞ, AYARLAR). Turkish agar players use split,
feed, skin, ping, lag and bot as they are. Suffixes join a loanword directly (skinler, not
skin'ler) and take an apostrophe only after an abbreviation or a name (FPS'i, Discord'a).

| English | Use | Notes |
| --- | --- | --- |
| cell | hücre | |
| mass | kütle | |
| split | split | EN. packs: Bölün, Bölünme, Bölünmeler |
| double split | çift split | packs: Çift bölünme, İki defa bölün |
| triple split | üçlü split | |
| trick split | trick split | verify |
| feed / eject mass | feed | EN. packs: Besle, Besleme. verify: yem atmak in chat |
| virus | virüs | |
| pop (on a virus) | patlama | |
| food / pellet | yem | packs: Topçuklar for Pellets |
| skin | skin (pl. skinler) | packs: Kostüm (×3), KOSTÜM. Use skin |
| custom skin | özel skin | packs: Özel kostüm |
| nickname | nick | packs: Takma ad |
| clan tag | klan etiketi | verify: tag |
| team | takım | |
| teammate | takım arkadaşı | packs: Takım |
| party | parti | packs: PARTY, Party. verify: party is also common |
| party token | parti kodu | |
| leaderboard | sıralama | packs: Lider tabloları, Liderlik tablosu |
| teamboard | takım sıralaması | |
| minimap | mini harita | packs: Harita |
| sector | sektör | packs: Bölgeler (clashes with region) |
| server | sunucu | packs: Server'lar |
| region | bölge | |
| ping / lag / FPS | ping / lag / FPS | |
| zoom | yakınlaştırma | short: Zoom |
| spectate | izle | |
| free spectate | serbest izleme | |
| multibox / bot / macro | multibox / bot / makro | |
| hotkey | kısayol tuşu | packs: Tuş Ayarları |
| replay | tekrar | verify: replay |
| respawn | yeniden doğ | |
| game over | oyun bitti | |
| death recap | ölüm özeti | |
| mass graph | kütle grafiği | |
| killer | seni yiyen | field label |
| jelly physics | jöle fiziği | |
| HUD | HUD | packs: Gösterge, Göstergeler |
| theme | tema | |
| preset | hazır ayar | |
| profile / settings profile | profil / ayar profili | |
| import / export | içe aktar / dışa aktar | |
| upload / download | yükle / indir | |
| cloud | bulut | |
| reset | sıfırla | |
| restore defaults | varsayılana döndür | |
| toggle | aç/kapat | |
| show / hide | göster / gizle | |
| enable / disable | etkinleştir / devre dışı bırak | short: aç / kapat |
| on / off | AÇIK / KAPALI | |
| overlay | katman | verify: overlay |
| cursor | imleç | |
| background | arka plan | packs: Arkaplan |
| panel | panel | |
| menu | menü | |
| settings | ayarlar | |
| chat | sohbet | |
| chat bubble | sohbet balonu | |
| emoji | emoji | |
| mute | sustur | |
| streamer mode | yayıncı modu | |
| user scripts | scriptler | verify: betikler is formal |
| plugins | eklentiler | |
| editor | düzenleyici | |
| workshop | atölye | |
| gallery | galeri | |
| command centre | komuta merkezi | |
| notification | bildirim | |
| adaptive performance | uyarlanabilir performans | |
| performance mode | performans modu | |
| diagnostics | tanılama | |
| accessibility | erişilebilirlik | |
| Rounded / Square HUD | Yuvarlak / Köşeli | |
| save / cancel / close / delete / apply | Kaydet / İptal / Kapat / Sil / Uygula | |
| coins | altın | packs: Altın everywhere except one Jeton |
| DNA | DNA | |
| offer / deal | teklif | verify: fırsat for deals |
| purchase / buy | satın al | |
| equip / unequip | kuşan / çıkar | packs: Kullan. verify |
| owned | sahipsin | |
| potion | iksir | |
| boost | takviye | packs: GÜÇLENDİRME |
| quest | görev | |
| level | seviye | |
| XP | XP | |
| reward | ödül | |
| daily | günlük | Günlük görev |
| league | lig | |
| login / logout | giriş / çıkış | buttons: Giriş yap / Çıkış yap |
| guest | misafir | |
| account | hesap | |
| language | dil | |

---

## pl: Polish

Style: ty (Naciśnij, Wybierz, Zaloguj się). Buttons use the imperative (Zapisz, Anuluj, Usuń) or a
noun for sections. Always write the diacritics (ą ć ę ł ń ó ś ź ż): the packs still have ASCII
forms (Tlo, Podzial, Skroty klawiszowe, Wlasne skiny) to fix. Polish agar players keep split, feed,
skin, ping, lag, bot and multibox and inflect them (skiny, splitem).

| English | Use | Notes |
| --- | --- | --- |
| cell | komórka | |
| mass | masa | |
| split | split | EN. packs: Podział, Rozdzielenie, Podzial |
| double split | podwójny split | packs: Podwójny podział, Podwójne rozdzielenie |
| triple split | potrójny split | |
| trick split | tricksplit | |
| feed / eject mass | feed | EN. packs: Karmienie, KARM. verify |
| virus | wirus | |
| pop (on a virus) | rozbicie | |
| food / pellet | jedzenie / kulki | packs: Pokarm |
| skin | skin (pl. skiny) | packs: Skórki |
| custom skin | własny skin | packs: Niestandardowe skórki |
| nickname | nick | packs: Nazwa |
| clan tag | tag klanu | |
| team | drużyna | packs: Zespół |
| teammate | członek drużyny | packs: Sojusznik, Koledzy z drużyny, Gracze. verify: teammate |
| party | party | packs: DRUŻYNA |
| party token | kod party | |
| leaderboard | ranking | packs: Tablica liderów, Topka |
| teamboard | ranking drużyny | packs: Tablica liderów wśród przyjaciół |
| minimap | minimapa | |
| sector | sektor | |
| server | serwer | |
| region | region | |
| ping / lag / FPS | ping / lag / FPS | |
| zoom | zoom | packs: Powiększenie |
| spectate | obserwuj | packs: Oglądaj |
| free spectate | wolna obserwacja | |
| multibox / bot / macro | multibox / bot / makro | |
| hotkey | skrót | section: Skróty klawiszowe. packs: Przyciski |
| replay | powtórka | |
| respawn | odrodzenie | verify: respawn |
| game over | koniec gry | |
| death recap | podsumowanie śmierci | |
| mass graph | wykres masy | |
| killer | kto cię zjadł | field label |
| jelly physics | fizyka galaretki | |
| HUD | HUD | |
| theme | motyw | packs: Wyglad |
| preset | preset | verify: gotowe ustawienia |
| profile / settings profile | profil / profil ustawień | |
| import / export | import / eksport | buttons: Importuj / Eksportuj |
| upload / download | wyślij / pobierz | packs: Przekazać plik, Ściągnij |
| cloud | chmura | |
| reset | resetuj | |
| restore defaults | przywróć domyślne | |
| toggle | wł./wył. | |
| show / hide | pokaż / ukryj | |
| enable / disable | włącz / wyłącz | |
| on / off | WŁ / WYŁ | packs mix WŁ and WŁ. Use no dot |
| overlay | nakładka | |
| cursor | kursor | |
| background | tło | packs: Tlo |
| panel | panel | |
| menu | menu | |
| settings | ustawienia | |
| chat | czat | |
| chat bubble | dymek czatu | |
| emoji | emoji | |
| mute | wycisz | |
| streamer mode | tryb streamera | |
| user scripts | skrypty | |
| plugins | wtyczki | |
| editor | edytor | |
| workshop | warsztat | |
| gallery | galeria | |
| command centre | centrum dowodzenia | |
| notification | powiadomienie | |
| adaptive performance | adaptacyjna wydajność | |
| performance mode | tryb wydajności | |
| diagnostics | diagnostyka | |
| accessibility | dostępność | |
| Rounded / Square HUD | Zaokrąglony / Kwadratowy | |
| save / cancel / close / delete / apply | Zapisz / Anuluj / Zamknij / Usuń / Zastosuj | |
| coins | monety | |
| DNA | DNA | |
| offer / deal | oferta | |
| purchase / buy | kup | |
| equip / unequip | załóż / zdejmij | |
| owned | posiadane | |
| potion | mikstura | |
| boost | boost | packs: DOPALACZ, WZMOCNIENIE. verify |
| quest | zadanie | |
| level | poziom | |
| XP | XP | packs: PD |
| reward | nagroda | |
| daily | dzienne | Zadanie dzienne |
| league | liga | |
| login / logout | logowanie / wylogowanie | buttons: Zaloguj się / Wyloguj |
| guest | gość | |
| account | konto | |
| language | język | |

---

## nl: Dutch

Style: je/jij (Druk, Kies, Log in), never u in game UI. Buttons use the infinitive (Opslaan,
Annuleren, Importeren). Dutch gamers keep most English terms (split, feed, skin, minimap, replay,
respawn, leaderboard); compounds with English words are written as one word or with a hyphen where
it reads better (clantag, partycode, streamermodus).

| English | Use | Notes |
| --- | --- | --- |
| cell | cel | |
| mass | massa | |
| split | split | EN. packs: Splitsen, SPLITS |
| double split | dubbele split | packs: Dubbel splitsen |
| triple split | driedubbele split | |
| trick split | tricksplit | |
| feed / eject mass | feed | EN. packs: Voeren, VOER, Voerbeurten |
| virus | virus | |
| pop (on a virus) | knal | packs: Knallen. verify: poppen |
| food / pellet | voedsel / bolletjes | |
| skin | skin (pl. skins) | |
| custom skin | eigen skin | packs: Aangepaste skins |
| nickname | nick | |
| clan tag | clantag | |
| team | team | |
| teammate | teamgenoot | packs: Teamleden |
| party | party | |
| party token | partycode | packs: Token |
| leaderboard | ranglijst | packs: Klassement. verify: leaderboard is common |
| teamboard | teamranglijst | |
| minimap | minimap | packs: Minikaart (×6). verify |
| sector | sector | |
| server | server | |
| region | regio | |
| ping / lag / FPS | ping / lag / FPS | |
| zoom | zoom | packs: Zoomen |
| spectate | toekijken | packs: Kijken. verify: spectaten |
| free spectate | vrij toekijken | |
| multibox / bot / macro | multibox / bot / macro | |
| hotkey | sneltoets | |
| replay | replay | packs: Herhaling |
| respawn | respawn | packs: Opnieuw spelen |
| game over | game over | |
| death recap | doodsoverzicht | verify |
| mass graph | massagrafiek | |
| killer | opgegeten door | field label |
| jelly physics | jelly-physics | verify: geleifysica |
| HUD | HUD | |
| theme | thema | |
| preset | preset | verify: voorinstelling |
| profile / settings profile | profiel / instellingenprofiel | |
| import / export | importeren / exporteren | |
| upload / download | uploaden / downloaden | |
| cloud | cloud | |
| reset | resetten | packs: Herstellen |
| restore defaults | standaard herstellen | |
| toggle | aan/uit | |
| show / hide | tonen / verbergen | |
| enable / disable | inschakelen / uitschakelen | |
| on / off | AAN / UIT | |
| overlay | overlay | |
| cursor | cursor | |
| background | achtergrond | |
| panel | paneel | |
| menu | menu | |
| settings | instellingen | |
| chat | chat | |
| chat bubble | chatballon | |
| emoji | emoji | |
| mute | dempen | |
| streamer mode | streamermodus | |
| user scripts | scripts | |
| plugins | plug-ins | |
| editor | editor | |
| workshop | werkplaats | |
| gallery | galerij | |
| command centre | commandocentrum | |
| notification | melding | |
| adaptive performance | adaptieve prestaties | |
| performance mode | prestatiemodus | |
| diagnostics | diagnose | |
| accessibility | toegankelijkheid | |
| Rounded / Square HUD | Afgerond / Vierkant | |
| save / cancel / close / delete / apply | Opslaan / Annuleren / Sluiten / Verwijderen / Toepassen | |
| coins | munten | |
| DNA | DNA | |
| offer / deal | aanbieding | |
| purchase / buy | kopen | |
| equip / unequip | gebruiken / afdoen | packs: Verwijderen for unequip (means delete). verify |
| owned | in bezit | |
| potion | drankje | |
| boost | boost | |
| quest | opdracht | verify: quest |
| level | level | |
| XP | XP | |
| reward | beloning | |
| daily | dagelijks | Dagelijkse opdracht |
| league | competitie | |
| login / logout | inloggen / uitloggen | |
| guest | gast | |
| account | account | |
| language | taal | |
