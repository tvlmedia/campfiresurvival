# Campfire Survival

Een singleplayer digitaal prototype van een eenvoudig kaartspel voor 3 tot 5 spelers. De gebruiker bestuurt alleen Speler 1; alle andere spelers worden automatisch bestuurd door eenvoudige JavaScript-regels en willekeurige keuzes.

## Starten

Open `index.html` direct in een browser.

Je kunt ook lokaal een simpele webserver starten:

```bash
python3 -m http.server 8787
```

Ga daarna naar `http://127.0.0.1:8787`.

## Spelregels

Kies op het startscherm 3, 4 of 5 spelers. Vul alleen de naam van de menselijke speler in. Leeg laten gebruikt automatisch `Speler 1`.

De overige spelers heten automatisch `Computer 1`, `Computer 2`, enzovoort.

Iedere speler start met:

- 1 geheime eilandkaart
- Geen handkaarten
- Geen voordeelkaarten

De gewone kaarten worden geschud als één gesloten trekstapel. Niet uitgedeelde eilanden doen dat potje niet mee, behalve wanneer `Kamp verplaatsen` een eiland wisselt met de beschikbare eilanden.

Tijdens jouw beurt kies je precies één hoofdactie:

- `Kaart trekken`: trek 1 kaart en verwerk die direct.
- `Kaart stelen`: kies een computerspeler en steel willekeurig 1 verborgen handkaart.

Extra acties vervangen de hoofdactie niet:

- `Sabotage`: leg één open Sabotage af om een ramp uit je eigen hand aan een andere speler te geven. Maximaal één keer per beurt.
- `De Heksenheuvel`: als je dit eiland hebt, mag je één keer in het spel maximaal twee rampen uit je hand weggeven.

Na jouw hoofdactie spelen alle computerspelers automatisch door totdat jij weer aan de beurt bent. De snelheid is instelbaar:

- Normale snelheid
- Snelle computerbeurten
- Direct zonder animaties

Je mag altijd je eigen hand, eiland en voordeelkaarten zien. Je ziet van computerspelers alleen hun naam, aantal handkaarten, open voordeelkaarten en of een eenmalige eilandkracht gebruikt is.

## Computerregels

Computerspelers gebruiken alleen vaste regels en `Math.random()`:

- 65% kans om 1 kaart te trekken.
- 35% kans om 1 willekeurige handkaart te stelen.
- Als niemand bestolen kan worden, trekt de computer altijd.
- Heeft de computer Sabotage en een rampkaart, dan gebruikt hij Sabotage met 50% kans.
- Heeft de computer De Heksenheuvel ongebruikt en een rampkaart, dan gebruikt hij die kracht met 35% kans.
- Heeft de computer met De Heksenheuvel twee of meer rampkaarten, dan is er 50% kans dat hij twee rampen weggeeft in plaats van één.
- Een computer met De Spiegel gebruikt die alleen wanneer hij minimaal één eigen rampkaart heeft.
- Plundertocht kiest willekeurig tussen beschikbare opties.

## Kaartverdeling

Grondstoffen:

- Hout x8
- Vis x8
- Water x8

Rampen:

- Beer x2: aan het einde -2 Vis
- Bosbrand x2: aan het einde -2 Hout
- Droogte x2: aan het einde -2 Water
- Kano lek x2: voorlopig geen effect

Voordelen:

- Bijl x2: blokkeert één Bosbrand
- Hengel x2: blokkeert één Beer
- Regenbui x2: blokkeert één Droogte
- Sabotage x3: geeft één eigen ramp door aan een andere speler

Speciale kaarten:

- Motorboot x2: trek direct 2 extra kaarten en verwerk alle kettingreacties
- Plundertocht x2: steel één open voordeelkaart of drie willekeurige handkaarten van één speler
- Kamp verplaatsen x2: wissel je eiland met een willekeurig beschikbaar ander eiland

De gewone trekstapel bevat 47 kaarten. De 7 eilanden zitten apart.

## Eilandkaarten

- De Visvijver: overgebleven Vis telt dubbel.
- Het Bos: overgebleven Hout telt dubbel.
- Het Riviertje: overgebleven Water telt dubbel.
- De Grot: bij het eindspel verwijder je één willekeurige ramp of twee identieke rampen voordat rampen worden verwerkt.
- De Heksenheuvel: één keer tijdens je eigen beurt mag je maximaal twee rampkaarten aan dezelfde speler of verschillende spelers geven.
- Het Voedselbos: na rampen minimaal 1 Hout, 1 Vis en 1 Water over geeft 3 bonuspunten.
- De Spiegel: één keer mag je een aangeboden ramp weigeren, die ramp afleggen en een eigen ramp teruggeven. Dit kan alleen als je al een eigen rampkaart hebt.

## Eindscore

Het eindspel verloopt stap voor stap:

1. De Grot verwijdert één willekeurige ramp of twee identieke rampen.
2. Voordeelkaarten blokkeren passende rampen.
3. Niet geblokkeerde rampen worden uitgevoerd. Grondstoffen gaan nooit onder 0.
4. Eilandscores en bonuspunten worden toegepast.
5. De hoogste score wint. Bij gelijkspel zijn er meerdere winnaars.

Het scoreoverzicht toont per speler de beginhoeveelheden, rampen, geblokkeerde rampen, uitgevoerde rampen, overgebleven grondstoffen, eilandbonus, bonuspunten en totaalscore.

## Debugpaneel

Het prototype bevat een inklapbaar debugpaneel. Daarmee kun je kaarten geven of verwijderen, voordeelkaarten geven, eilanden toewijzen, eilandkrachten markeren, de trekstapel schudden, de actieve speler veranderen, kaarten bovenop de trekstapel leggen, het eindspel starten en het spel resetten.

Daarnaast is er een simulatiemodus voor balanscontrole:

- 10 potjes simuleren
- 100 potjes simuleren
- 1.000 potjes simuleren

Tijdens simulaties worden alle spelers automatisch bestuurd met dezelfde eenvoudige regels. De resultaten tonen onder andere winpercentages per eiland, wins en winpercentages per spelerpositie, winnende start- en eind-eilandcombinaties, gemiddelde scores, hoogste en laagste score, gebruikte Sabotagekaarten, doorgegeven rampen, tegengehouden rampen, Heksenheuvel-gebruik met één of twee rampen, Spiegel-kansen, Grot-keuzes en hoe vaak Het Voedselbos effect had. De start- en eindcombinaties worden apart bijgehouden omdat `Kamp verplaatsen` eilandkaarten kan veranderen tijdens een potje.

Na iedere simulatie maakt het prototype ook automatisch een conclusierapport in tekstvorm. Dat rapport staat onder de simulatietabellen en is bedoeld om direct door te sturen naar ChatGPT voor balansfeedback. Voor eilandcombinaties is 100 potjes vooral een snelle indicatie; 1.000 potjes geeft betrouwbaardere patronen.

## Bekende TODO's

- Het definitieve effect van Kano lek moet nog worden bepaald.
