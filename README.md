<h1 align="center"><b>Jocul 2048</b></h1>

<table align="center" width="100%" style="border-collapse: collapse; border: none; table-layout: fixed;">
  <tr style="border: none;">
    <td align="center" width="33.33%" style="border: none; padding: 5px;">
      <img src="https://github.com/user-attachments/assets/7ff5db27-b7b2-48bc-8279-4bc6147dfbe0" style="width: 100%; height: auto; display: block;" alt="Tema Albastra" />
    </td>
    <td align="center" width="33.33%" style="border: none; padding: 5px;">
      <img src="https://github.com/user-attachments/assets/b12061db-62a2-499a-a0e5-f330e5a2d609" style="width: 100%; height: auto; display: block;" alt="Fereastra Reguli" />
    </td>
    <td align="center" width="33.33%" style="border: none; padding: 5px;">
      <img src="https://github.com/user-attachments/assets/0558cced-1280-45e8-b34e-c62c9015f301" style="width: 100%; height: auto; display: block;" alt="Meniu Dificultate" />
    </td>
  </tr>
</table>

---

<h1 align="center"><b>Motivaţia alegerii temei, utilitatea aplicaţiei</b></h1>

<h2><b>1. Argumentul alegerii proiectului</b></h2>

> Alegerea proiectului de atestat a reprezentat o decizie bazată pe dorința de a îmbina cunoștințele de algoritmică dobândite la orele de informatică cu tehnologiile moderne de dezvoltare web. Am considerat că realizarea jocului „2048” constituie o probă de competență autentică, deoarece nu presupune doar simpla afișare a unor elemente grafice, ci necesită implementarea unei logici riguroase de gestionare a datelor. Pentru un elev în an terminal, acest proiect este puntea de legătură între problemele teoretice de tip olimpiadă și software-ul de larg consum, oferindu-mi ocazia să finalizez un produs complet, de la codul sursă până la interfața destinată utilizatorului final. Procesul de dezvoltare m-a ajutat să înțeleg mai bine ciclul de viață al unei aplicații, de la stadiul de idee și structură logică, până la optimizarea experienței vizuale pentru publicul larg, oferindu-mi o satisfacție profesională deosebită în momentul în care am văzut proiectul funcțional.

<h2><b>2. Importanța jocurilor de logică în mediul digital</b></h2>

> Utilitatea aplicației depășește sfera simplului divertisment, fiind un instrument veritabil pentru antrenamentul funcțiilor cognitive și a gândirii strategice în era vitezei. Jocul „2048” forțează utilizatorul să utilizeze logica matematică și recunoașterea tiparelor pentru a progresa, fiind o alternativă sănătoasă la jocurile moderne care se bazează doar pe reflexe. Într-o lume digitală plină de stimuli vizuali obositori, acest proiect oferă o variantă minimalistă care stimulează perseverența și capacitatea de concentrare a tinerilor și adulților deopotrivă. Din perspectiva unui dezvoltator, utilitatea proiectului constă în demonstrarea faptului că structurile de date fundamentale pot fi utilizate pentru a crea experiențe interactive complexe. Prin acest proiect, am dorit să promovez ideea că tehnologia poate fi un mediu de învățare activ, oferind satisfacție intelectuală prin rezolvarea unor probleme de logică aparent simple, dar care devin tot mai provocatoare pe măsură ce scorul crește.

---

<h1 align="center"><b>Structura aplicaţiei</b></h1>

<h2><b>1. Organizarea conţinutului informational</b></h2>

> Interfața este organizată pentru a oferi claritate, începând cu un intro scurt unde plăcuțele se unesc simbolic, urmat de dezvăluirea panoului de joc. Structura vizuală este împărțită strategic: partea superioară conține zona de identitate a jocului și panourile de scor, unde utilizatorul poate vedea în timp real evoluția punctajului curent și a celui mai bun record personal. Imediat sub acestea se află zona de control tactil și butoanele de setări, care permit accesul rapid la funcțiile de personalizare și informații. Centrul aplicației este ocupat de grila de joc, care se adaptează dinamic în funcție de nivelul de dificultate ales, asigurând o vizibilitate optimă a numerelor. Footer-ul aplicației completează experiența cu link-uri utile și informații despre versiune, totul fiind integrat într-un layout fluid care se ajustează automat pe orice tip de ecran. Această organizare permite o navigare intuitivă, astfel încât utilizatorul să se poată concentra exclusiv pe strategia de joc fără a fi distras de elemente inutile.
>  
> Această secvență de cod este responsabilă pentru tranziția de la starea de introducere la interfața activă a jocului, aplicând clase de animație elementelor DOM. Ea asigură o apariție progresivă și elegantă a meniurilor și a grilei, oferind utilizatorului un feedback vizual de calitate încă din primele secunde.

<h2><b>2. Structuri de date utilizate</b></h2>

> Elementul central de gestionare a datelor este o matrice pătratică, reprezentată printr-un tablou bidimensional, care stochează obiectele ce definesc fiecare plăcuță activă. Fiecare celulă a matricei conține fie valoarea zero pentru spațiile goale, fie un obiect complex cu proprietăți precum valoarea numerică, un identificator unic și flag-uri pentru animații. Pe lângă matricea principală, am utilizat variabile globale pentru a ține evidența scorului, a numărului de mutări și a timpului de joc scurs, facilitând astfel monitorizarea performanței. Sistemul de istoric folosește o structură de tip copie de siguranță, salvând configurația completă a tablei înainte de fiecare mutare pentru a permite revenirea la starea anterioară. Această abordare modulară a datelor permite o manipulare rapidă și sigură a stărilor jocului, asigurând că nicio informație nu se pierde în timpul execuției algoritmilor de mișcare sau în momentul salvării progresului în memoria browserului.
>  
> Funcția de inițializare a jocului construiește structura de bază a matricei în funcție de dimensiunea aleasă și resetează toți contorii de stare. Aceasta pregătește mediul logic prin popularea inițială a tablei cu primele două numere aleatorii, oferind punctul de plecare pentru o nouă sesiune de joc.

---

<h1 align="center"><b>Detalii tehnice de implementare</b></h1>

<h2><b>1. Gestiunea logică a mișcării și fuziunii</b></h2>

> Nucleul funcțional al aplicației este reprezentat de algoritmul care procesează deplasarea și combinarea numerelor în interiorul matricei la fiecare acțiune a utilizatorului. Atunci când se primește o comandă de mișcare, programul extrage fiecare rând sau coloană și aplică un filtru pentru a elimina elementele nule, lăsând doar plăcuțele active să „alunece” spre marginea dorită. În timpul acestei glisări, sistemul verifică dacă două elemente adiacente au aceeași valoare numerică și le fuzionează într-o singură entitate cu valoare dublă, marcând totodată creșterea scorului curent. Acest proces este recursiv pentru fiecare linie, asigurându-se că regulile de joc sunt aplicate uniform pe întreaga tablă, indiferent de complexitatea configurației. La finalul fiecărei mutări, se generează un semnal care confirmă dacă s-a produs vreo schimbare, condiție esențială pentru continuarea jocului și generarea de noi numere.
>  
> Această funcție realizează calculul matematic de bază al fuziunii, filtrând valorile goale și dublând numerele egale care se întâlnesc pe aceeași linie. Ea este responsabilă pentru corectitudinea logică a jocului, asigurând că fiecare unire de plăcuțe este contorizată corect în punctajul total al jucătorului.

<h2><b>2. Generarea aleatorie a datelor și sincronizarea cu interfața DOM</b></h2>

> Un aspect crucial pentru dinamica jocului este mecanismul de generare a noilor plăcuțe, care introduce un element de imprevizibilitate după fiecare mutare validă efectuată de jucător. Aplicația scanează matricea pentru a identifica toate celulele libere și alege una dintre acestea prin intermediul unui algoritm de selecție aleatorie, unde plasează o nouă valoare de 2 sau 4. Sincronizarea acestor date logice cu interfața vizuală se face printr-o funcție de randare care manipulează Document Object Model-ul, creând sau mutând elemente div în funcție de starea matricei. Fiecare plăcuță primește proprietăți CSS dinamice pentru poziție și culoare, oferind acea senzație de mișcare fluidă pe care utilizatorul o percepe pe ecran. Această legătură strânsă între codul JavaScript și reprezentarea vizuală asigură o experiență de joc fără întârzieri, unde fiecare schimbare de date este reflectată instantaneu în mediul grafic.
>  
> Funcția de desenare transformă coordonatele matematice din matrice în poziții vizuale pe ecran, folosind variabile CSS pentru a controla rândurile și coloanele. Ea este puntea de legătură care permite utilizatorului să vadă rezultatul calculelor algoritmice sub forma unor plăcuțe colorate și animate.

<h2><b>3. Sistemul de control multi-platformă și persistența datelor</b></h2>

> Pentru a garanta o accesibilitate cât mai largă, am implementat un sistem de control hibrid care răspunde atât la evenimentele de tastatură, cât și la gesturile de tip „swipe” pe ecranele tactile. Această funcționalitate presupune ascultarea activă a interacțiunilor și interpretarea vectorilor de mișcare pentru a declanșa funcția de mutare în direcția corectă, oferind o experiență unitară pe PC și mobil. Un alt punct forte al implementării tehnice este gestiunea persistenței datelor prin utilizarea tehnologiei „LocalStorage” din browser. Aplicația salvează automat starea curentă a jocului, scorul maxim și setările de dificultate, permițând utilizatorului să închidă pagina și să revină ulterior exact în același punct. Această abordare elimină frustrarea pierderii progresului și transformă jocul într-un produs software robust, capabil să păstreze recordurile personale pe termen lung fără a necesita un server extern de baze de date.
>  
> Această metodă serializează obiectele și matricea de joc într-un format text pentru a fi stocate local în memoria securizată a browserului. Ea asigură continuitatea experienței de utilizare, permițând aplicației să restaureze toate variabilele și elementele grafice exact așa cum au fost lăsate la ultima închidere.

---

<h1 align="center"><b>Resurse hard si soft necesare</b></h1>

<h2><b>1. Resurse software și mediul de dezvoltare</b></h2>

> Procesul de realizare a acestei aplicații s-a bazat pe utilizarea unor instrumente de dezvoltare moderne și standardizate în industria web, oferind un mediu de lucru stabil și eficient. Am utilizat Visual Studio Code ca editor principal, datorită capacităților safe avansate de gestionare a fișierelor și a extensiilor care facilitează scrierea codului curat în HTML5, CSS3 și JavaScript. Pe partea de design, am folosit proprietăți CSS moderne precum Flexbox și Grid pentru a asigura un layout responsiv, împreună cu variabilele CSS pentru a permite schimbarea temelor în timp real. Testarea a fost efectuată riguros folosind consola de dezvoltator (DevTools) din Google Chrome, care a permis monitorizarea performanței animațiilor și depanarea rapidă a algoritmilor de fuziune. Toate aceste resurse software sunt de tip open-source sau gratuite, ceea ce subliniază accesibilitatea creării de software de calitate în prezent.

<h2><b>2. Resurse hardware și portabilitatea aplicației</b></h2>

> Din punct de vedere hardware, aplicația a fost proiectată să fie extrem de puțin pretențioasă, putând rula pe orice dispozitiv capabil să deschidă un browser web modern. Deoarece logica jocului este executată integral pe dispozitivul utilizatorului (client-side), nu este nevoie de o conexiune la internet de mare viteză sau de un server cu resurse de procesare masive. Aplicația funcționează fluid pe computere cu specificații modeste, tablete de generație veche și pe majoritatea telefoanelor inteligente de tip smartphone disponibile pe piață. Animațiile sunt accelerate hardware prin intermediul browserului, ceea ce înseamnă că sarcina de randare este distribuită eficient către procesorul grafic al dispozitivului. Această portabilitate ridicată transformă jocul într-o soluție universală de divertisment, fiind ideală pentru utilizarea în medii școlare sau în timpul călătoriilor, indiferent de puterea de calcul a dispozitivului hardware folosit.

---

<h1 align="center"><b>Modalităţi de utilizare</b></h1>

<h2><b>1. Mecanismul de control și interacțiunea principală</b></h2>

> Utilizarea jocului este intuitivă, fiind centrată pe mișcarea plăcuțelor în cele patru direcții fundamentale pentru a obține fuziunea numerelor identice. Jucătorul poate folosi tastele săgeți pe un sistem de tip desktop sau glisări rapide cu degetul pe ecranele tactile, fiecare mișcare fiind însoțită de animații care indică direcția deplasării. Scopul jocului este atingerea valorii de 2048 prin unirea succesivă a puterilor lui 2, proces care necesită o planificare atentă a spațiului disponibil pe grila centrală. Interacțiunea este facilitată de afișajul permanent al scorului și al numărului de mutări, oferind un feedback constant despre eficiența strategiei aplicate. Chiar și un utilizator fără experiență în jocurile digitale poate învăța regulile în câteva secunde, mecanica de „drag and drop” simbolică fiind una dintre cele mai naturale forme de interacțiune om-calculator disponibile în prezent.
>  
> Codul de mai sus captează apăsările de taste ale utilizatorului și le redirecționează către motorul de procesare a mișcării, asigurând un răspuns imediat al interfeței. Această implementare este baza controlului pe sistemele PC, fiind concepută să fie robustă și să prevină comportamentele nedorite ale browserului în timpul jocului.

<h2><b>2. Gestionarea funcțiilor auxiliare și a setărilor vizuale</b></h2>

> Pe lângă mecanica principală de joc, aplicația oferă un set bogat de funcționalități auxiliare menite să îmbunătățească experiența și să permită personalizarea mediului de lucru. Utilizatorul poate accesa oricând butonul de „Anulare” pentru a corecta o mutare strategică greșită, funcție care restabilește starea anterioară a tablei și scorul aferent. Din meniul de setări, jucătorul are posibilitatea de a schimba tema vizuală a aplicației între diferite variante cromatice, adaptând contrastul și culorile plăcuțelor conform preferențelor sale estetice. De asemenea, dificultatea poate fi reglată prin schimbarea dimensiunii grilei, oferind astfel o provocare adaptată pentru începători sau pentru utilizatorii avansați. Toate aceste setări sunt salvate automat, astfel încât utilizatorul să se simtă într-un mediu familiar de fiecare dată când redeschide aplicația, beneficiind de un control total asupra modului în care alege să se relaxeze.
>  
> Funcția de anulare permite recuperarea ultimei stări salvate din variabila de istoric, oferind jucătorului o șansă de a-și revizui strategia. Această mică dar importantă utilitate adaugă un nivel de profunzime experienței, transformând jocul într-unul mai iertător și mai orientat către utilizator.

---

<h1 align="center"><b>Posibilităţi de dezvoltare</b></h1>

<h2><b>1. Optimizarea grafică și extinderea funcționalităților de joc</b></h2>

> Deși versiunea actuală este una completă, există multiple oportunități de dezvoltare viitoare care ar putea ridica standardul aplicației la un nivel profesional și mai înalt. O direcție prioritară ar fi integrarea unor animații și mai complexe bazate pe motorul WebGL, care să permită efecte de particule și tranziții tridimensionale între stările plăcuțelor. De asemenea, introducerea unor noi moduri de joc, cum ar fi cel cu obstacole fixe pe tablă sau plăcuțe care își schimbă valoarea în timp, ar putea diversifica experiența pentru utilizatorii veterani. O altă extindere utilă ar fi implementarea unui sistem de realizări (achievements) care să recompenseze jucătorul pentru atingerea unor praguri speciale sau pentru finalizarea jocului într-un timp record. Aceste adăugiri ar transforma „2048” dintr-un simplu proiect de atestat într-o platformă de divertisment complexă, capabilă să rețină atenția utilizatorilor pe perioade mult mai lungi de timp.

<h2><b>2. Digitalizarea experienței competitive și integrarea multimedia</b></h2>

> O altă oportunitate majoră de evoluție a proiectului constă în transformarea acestuia dintr-o experiență solitară într-una competitivă prin integrarea unui clasament online și a funcțiilor de partajare socială. Implementarea unei baze de date externe prin tehnologii precum Firebase ar permite stocarea recordurilor mondiale, oferind jucătorilor posibilitatea de a se compara cu prietenii sau cu utilizatori din întreaga lume. Pe lângă componenta competitivă, adăugarea unui sistem multimedia complet, care să includă efecte sonore la fuziunea numerelor și muzică ambientală dinamică, ar crește semnificativ nivelul de imersiune. Nu în ultimul rând, optimizarea aplicației pentru a funcționa ca o Progressive Web App (PWA) ar permite instalarea acesteia pe telefon direct din browser, oferind o experiență similară cu cea a aplicațiilor native, dar fără a ocupa spațiu inutil pe disc, demonstrând astfel scalabilitatea și viziunea modernă asupra dezvoltării software.
