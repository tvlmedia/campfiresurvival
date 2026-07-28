# Campfire Survival

Een volledig speelbaar digitaal prototype van een eenvoudig kaartspel voor 3 tot 5 spelers. Het prototype gebruikt alleen HTML, CSS en vanilla JavaScript.

## Starten

Open `index.html` direct in een browser.

Je kunt ook lokaal een simpele webserver starten:

```bash
python3 -m http.server 8787
```

Ga daarna naar `http://127.0.0.1:8787`.

## Spelregels

Kies op het startscherm 3, 4 of 5 spelers en vul namen in. Lege namen worden automatisch `Speler 1`, `Speler 2`, enzovoort.

Iedere speler start met:

- 1 geheime eilandkaart
- Geen handkaarten
- Geen voordeelkaarten

De gewone kaarten worden geschud als één gesloten trekstapel. Niet uitgedeelde eilanden doen dat potje niet mee, behalve wanneer `Kamp verplaatsen` een eiland wisselt met de beschikbare eilanden.

Tijdens je beurt kies je precies één hoofdactie:

- `Kaart trekken`: trek 1 kaart en verwerk die direct.
- `Kaart stelen`: kies een andere speler en steel willekeurig 1 verborgen handkaart. Als niemand handkaarten heeft, moet je een kaart trekken.

Extra acties vervangen de hoofdactie niet:

- `Sabotage`: leg één open Sabotage af om een ramp uit je eigen hand aan een andere speler te geven. Maximaal één keer per beurt.
- `De Heksenheuvel`: als je dit eiland hebt, mag je één keer in het spel een ramp uit je hand aan een andere speler geven.

Elke beurt begint met een overdrachtscherm, zodat spelers hun hand en eiland geheim kunnen houden op één apparaat.

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
- De Grot: bij het eindspel mag je één ramp wegleggen voordat rampen worden verwerkt.
- De Heksenheuvel: één keer tijdens je eigen beurt mag je een ramp aan een andere speler geven.
- Het Voedselbos: na rampen minimaal 1 Hout, 1 Vis en 1 Water over geeft 3 bonuspunten.
- De Spiegel: één keer mag je een aangeboden ramp weigeren en een ramp teruggeven.

## Eindscore

Het eindspel verloopt stap voor stap:

1. De Grot mag eventueel één ramp verwijderen.
2. Voordeelkaarten blokkeren passende rampen.
3. Niet geblokkeerde rampen worden uitgevoerd. Grondstoffen gaan nooit onder 0.
4. Eilandscores en bonuspunten worden toegepast.
5. De hoogste score wint. Bij gelijkspel zijn er meerdere winnaars.

Het scoreoverzicht toont per speler de beginhoeveelheden, rampen, geblokkeerde rampen, uitgevoerde rampen, overgebleven grondstoffen, eilandbonus, bonuspunten en totaalscore.

## Debugpaneel

Het prototype bevat een inklapbaar debugpaneel. Daarmee kun je kaarten geven of verwijderen, voordeelkaarten geven, eilanden toewijzen, eilandkrachten markeren, de trekstapel bekijken en schudden, de actieve speler veranderen, kaarten bovenop de trekstapel leggen, het eindspel starten en het spel resetten.

## Bekende TODO's

- Het definitieve effect van Kano lek moet nog worden bepaald.
