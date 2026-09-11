# AO5 — Förregistrerad experimentdefinition för TDA

Författare: Claude (Opus 5)
Skriven: 2026-08-09, **innan någon modell har tränats och innan något
prediktivt resultat existerar**
Status: `LÅST — PRODUKTÄGARGODKÄND 2026-08-09`
Experiment-ID: `tda_stress_onset_v1`
Förutsätter: `FORHANDSBESKED_AO2_DIAGNOSTIK.md` och
`docs/TDA_BACKFILL_DIAGNOSTIK.md` (AO2 passerad)

---

## 0. Vad detta dokument gör

Det låser tolv saker innan de kan påverkas av ett resultat: beslutsproblem,
målserie, label, horisonter, features, benchmarkmodeller, valideringsprotokoll,
mätetal, promotionströsklar, negativa kontroller, multipeltestning och
framåtriktad mätning.

**Efter godkännande får ingenting i avsnitt 2–11 ändras.** En ändring kräver
nytt experiment-ID, ny generation och en skriftlig motivering som inte
hänvisar till ett observerat utfall.

---

## 1. Frågan

Från `TDA_överlägset.md`, skärpt:

> Ger förändringar i topologin hos amerikanska sektoravkastningar en tidigare
> och bättre varning om begynnande stress i **utvecklade aktiemarknader utanför
> USA** än volatilitet, korrelation, korrelationsspridning, PCA-koncentration,
> drawdown och den månatliga makroregimen?

Målet är avsiktligt icke-amerikanskt. Om målserien innehöll USA skulle testet
delvis mäta om amerikanska aktier förutsäger amerikanska aktier, och resultatet
vore svårtolkat oavsett utfall. Med ett icke-amerikanskt mål är prediktor och
mål ekonomiskt kopplade men inte mekaniskt identiska — vilket är exakt den
hypotes produktägaren formulerade.

---

## 2. Data — allt redan låst och arkiverat

**Prediktor.** `tda_ff12_us_sectors@1.0.0`, features ur
`raw/_tda/features_ph-v0.2.0_tda_ff12_us_sectors@1.0.0.ndjson`,
SHA-256 `505b9874fee07df6bb78380357edd2545a6bbf72920b9b7f44e1e3552a5d7819`.
7 845 handelsdagar, 1995-03-28–2026-05-29.

**Mål.** De tre regionala Fama/French-filerna som redan ligger i
`raw/tda/ff12-v1-rc1/`:

| Region | Fil | Serie-ID |
|---|---|---|
| Europa | `Europe_3_Factors_Daily_CSV.zip` | `ff_region_europe` |
| Japan | `Japan_3_Factors_Daily_CSV.zip` | `ff_region_japan` |
| Asia Pacific ex Japan | `Asia_Pacific_ex_Japan_3_Factors_Daily_CSV.zip` | `ff_region_apac_ex_japan` |

Avkastning beräknas deterministiskt som `(Mkt-RF + RF) / 100`, enligt
`config/tda/universe-ff12-sectors-v1.json` → `replication_series`.

**Ingen ny datainsamling, ingen ny licensfråga, ingen ny vintage.** Hela
experimentet körs på material som redan är verifierat, hashat och
produktägargodkänt. Filerna får inte bytas ut eller kompletteras inom `v1`.

Gemensamt utvärderingsintervall: 1995-03-28–2026-05-29, 8 194 handelsdagar i
målserierna, snittade mot prediktorns kalender.

---

## 3. Features — exakt fyra, låsta

Endast de features som klarade båda grindarna i AO2:

| Feature | R² mot alla fem baslinjer | Stabilitet 50 / 70 |
|---|---:|---:|
| `a_h0_max_persistence` | 0,040 | 0,877 / 0,896 |
| `a_h0_persistence_entropy` | 0,193 | 0,874 / 0,893 |
| `a_h1_total_persistence` | 0,452 | 0,820 / 0,866 |
| `b_h0_persistence_entropy` | 0,502 | 0,938 / 0,950 |

Uteslutna och får inte återinföras: alla fyra `bottleneck_previous`
(rangkorrelation 0,34–0,65), `a_h1_finite_count`, `a_h1_max_persistence`,
`a_h1_persistence_entropy` (0,62–0,79), samtliga `b_h1_*` (gren B saknar
ändliga H₁-klasser 55,9 % av dagarna), `a_h0_total_persistence`,
`b_h0_max_persistence`, `b_h0_total_persistence` (R² ≥ 0,70), samt de två
konstanta `finite_count`-serierna.

`a_h1_persistence_entropy` låg på 0,734 / 0,789 och missade gränsen 0,80 med
marginal som frestar. Den är utesluten.

Features standardiseras med medelvärde och skala skattade **enbart inom varje
träningsfold**.

---

## 4. Label — stressdebut

**Stressläge.** En handelsdag är i stressläge om målseriens ackumulerade
indexnivå ligger minst **10 %** under sitt löpande maximum över de föregående
**250 handelsdagarna**.

**Episod.** Sammanhängande stressdagar slås ihop till en episod. Två episoder
som separeras av högst **60 handelsdagar** räknas som samma episod.

**Debut.** Episodens första dag.

**Label.** `y_t = 1` om en debut inträffar i intervallet `(t, t+20]`
handelsdagar, annars `0`. Dagar där hela fönstret inte finns tillgängligt
utesluts.

### 4.1 Antal händelser — kontrollerat före låsning

Räknat på arkiverad data, utan att någon TDA-feature har använts:

| Region | −10 % | −15 % | −20 % |
|---|---:|---:|---:|
| Europa | **17** | 13 | 13 |
| Japan | **22** | 17 | 11 |
| Asia Pacific ex Japan | **17** | 16 | 12 |

Tröskeln **−10 % väljs som primär på antalet händelser**, alltså på
statistisk styrka, och valet är gjort innan någon modell körts. −20 % anges
här som i förväg deklarerad robusthetskontroll utan egen befogenhet att
promovera.

Europas debuter vid −10 %: 1998-08, 2000-04, 2006-06, 2007-08, 2008-01,
2010-02, 2010-11, 2011-06, 2014-10, 2015-08, 2018-08, 2020-02, 2020-10,
2022-02, 2023-09, 2024-11, 2026-03.

**Antalet oberoende stressregimer är lägre än antalet episoder.** 2007-08 och
2008-01 tillhör samma förlopp, liksom 2010-02 och 2010-11. Realistiskt rör det
sig om åtta till tio oberoende regimer per region. Det är den hårda gränsen
för vad testet kan visa.

---

## 5. Horisonter

Primär: **20 handelsdagar**. Sekundära: 5 och 60. Endast den primära bär
slutsatser; de sekundära redovisas deskriptivt.

---

## 6. Det primära testet — exakt ett

> **Europa, tröskel −10 %, horisont 20 handelsdagar: skillnaden i PR-AUC
> mellan en modell med klassiska features och samma modell med klassiska
> features plus de fyra TDA-featuresen.**

Allt annat i detta dokument är sekundärt. Ett sekundärt utfall får aldrig
ensamt motivera promotion.

PR-AUC väljs framför ROC-AUC eftersom stressdebut är sällsynt; ROC-AUC
överskattar systematiskt nyttan vid obalanserade klasser.

---

## 7. Benchmarkmodeller

Klassiska features, beräknade på samma 60 handelsdagar som TDA-fönstret:

- annualiserad realiserad volatilitet för den likaviktade FF12-portföljen,
- medelvärde av de 66 parvisa korrelationerna,
- standardavvikelse för samma korrelationer,
- största kovariansegenvärdets andel,
- aktuell drawdown inom fönstret.

Referensmodeller som ska köras:

1. naiv basfrekvens (konstant prediktion),
2. enbart volatilitet,
3. enbart drawdown,
4. regulariserad logistisk regression på alla fem klassiska features,
5. **samma modell plus de fyra TDA-featuresen**,
6. den månatliga makroregimen (`engine_version 2.0.0`, syntes) som separat,
   långsammare jämförelse utan gemensam modellklass.

Modell 4 och 5 måste använda **samma modellklass, samma kapacitet, samma
foldindelning, samma regulariseringssökning och samma slumpfrö**. Den enda
tillåtna skillnaden är de fyra tillagda kolumnerna.

---

## 8. Valideringsprotokoll

### 8.1 Det finns ingen ren tidsholdout — det ska sägas rakt ut

AO2:s episodgenomgång granskade samtliga åtta stressepisoder, inklusive 2018,
2020 och 2022. Ingen tidsperiod är därför orörd på featurenivå. Att i
efterhand utnämna de senaste åren till holdout vore att kalla en inspekterad
period för oinspekterad.

**Därför hålls geografi undan i stället för tid.**

### 8.2 Utveckling

All modellutveckling, all hyperparameterval och all felsökning sker **enbart
på Europa**.

Nested walk-forward med expanderande fönster, fem yttre folds. Hyperparametrar
väljs i en inre tidsserie-CV inom varje träningsfold.

- **Purge:** 60 handelsdagar mellan tränings- och testfold. Labeln ser 20 dagar
  framåt och drawdown-definitionen 250 dagar bakåt; 60 dagars purge tar bort
  den direkta överlappningen i labelfönstret.
- **Embargo:** ytterligare 20 handelsdagar efter varje testfold.
- All standardisering, imputering och urval sker inom träningsfolden.

### 8.3 Replikering — körs en gång

Japan och Asia Pacific ex Japan rörs inte förrän Europa är helt färdig och
resultatet är nedskrivet. De körs därefter **en gång**, med exakt den modell
och de hyperparametrar Europa gav. Ingen omjustering. Utfallet redovisas
oavsett vad det blir.

---

## 9. Mätetal och promotionströsklar

Promotion från `RESEARCH` kräver att **samtliga** fem villkor uppfylls:

| # | Villkor |
|---|---|
| 1 | ΔPR-AUC ≥ **+0,02 absolut** och ≥ **+10 % relativt**, median över de fem yttre foldarna, Europa, horisont 20 |
| 2 | Brier score försämras med högst **0,002**, och kalibreringslutningen ligger i **[0,80; 1,25]** |
| 3 | ΔPR-AUC har **samma tecken i minst 4 av 5** yttre folds |
| 4 | ΔPR-AUC > 0 i **både** Japan och Asia Pacific ex Japan, i den orörda replikeringskörningen |
| 5 | Samtliga negativa kontroller i avsnitt 10 passerar |

Faller något villkor sker ingen promotion. TDA förblir `RESEARCH` och
`stress_score`, `change_probability` och `direction` förblir okalibrerade.

Trösklarna är satta nu, utan kännedom om utfallet, och får inte justeras.

---

## 10. Negativa kontroller

Samtliga ska köras och redovisas:

1. **Blockpermuterade labels** — permutation i block om 250 handelsdagar så att
   autokorrelationen bevaras men kopplingen till prediktorn bryts.
2. **Slumpfeatures** — fyra brusserier med samma dimension, samma folds, samma
   modell.
3. **Fasrandomiserade avkastningar** — TDA-featuresen omräknade på serier med
   bevarat spektrum och bevarad autokorrelation men förstörd tvärsnittstopologi.
4. **Block-bootstrapade avkastningar** — samma sak med en andra metod.
5. **Fönsterkänslighet** — de fyra featuresen omräknade med 50 respektive 70
   dagars fönster.

**Beslutsregel:** varje kontroll måste ge ΔPR-AUC under promotionströskeln i
villkor 1. Om slumpfeatures eller fasrandomiserad topologi når tröskeln är
tröskeln fel satt och hela testet är ogiltigt — inte "nästan godkänt".

Kontroll 3 och 4 är de viktigaste. De skiljer *topologi* från *tidsseriestruktur*,
vilket är den enda invändning AO2 inte kunde besvara: episodtabellens
percentilmarkör utlöses med nära visshet även utan samband, eftersom max över
ett 60-dagarsband når 90:e percentilen med sannolikhet 1 − 0,9⁶⁰ ≈ 99,8 %.

---

## 11. Multipeltestning

Deklarerade jämförelser:

- **Primär: 1.** Europa, −10 %, horisont 20.
- **Sekundära: 17.** Tre regioner × tre horisonter × två trösklar, minus den
  primära.

De sekundära redovisas deskriptivt, utan p-värden och utan
promotionsbefogenhet. Antalet körda varianter — inklusive misslyckade och
avbrutna — ska anges i rapporten. Om fler än de 18 deklarerade jämförelserna
körs ska var och en listas.

---

## 12. Framåtriktad mätning

Från och med låsdatumet sparas varje handelsdag en fryst prediktion med
modellversion, featureversion, regelversion och indatahash. Utfallet utvärderas
utan efterhandsjustering, tidigast efter **24 månader eller tre nya
stressdebuter, det som inträffar sist**.

Detta är den enda genuint out-of-sample-evidensen i hela projektet, eftersom
den historiska delen enligt 8.1 inte har någon orörd tidsperiod.

---

## 13. Vad ett godkänt utfall betyder — och inte

Med åtta till tio oberoende stressregimer per region är även ett fullständigt
godkännande svag evidens. Rätt formulering vid full pass är:

> "TDA-featuresen tillför inkrementell information i ett förregistrerat test på
> historisk data, överlever negativa kontroller och replikerar geografiskt.
> Prognosnyttan är inte etablerad och följs framåt."

Formuleringar som "TDA förutsäger", "bevisad edge" eller "validerad signal" får
inte användas oavsett utfall inom denna generation.

---

## 14. Förbud

- Inga features läggs till, oavsett resultat.
- Inga trösklar ändras efter att ett resultat har setts.
- Inga extra fönsterlängder, grenar eller transformationer prövas för att
  "kontrollera" ett svagt utfall.
- Replikeringsmängden körs en gång och justeras aldrig.
- Allt som körs redovisas, även det som kastas.
- **Om det primära testet faller är svaret nej för experimentgeneration `v1`.**
  En ny generation kräver nytt ID, nytt källkontrakt och ett skäl formulerat
  oberoende av detta utfall.

---

## 15. Godkännande

Låses vid produktägarens godkännande. Datum och beslut skrivs in här, varefter
avsnitt 2–11 är oföränderliga inom `tda_stress_onset_v1`.

Produktägare: Gunnar Östberg  Datum: 2026-08-09

Beslut: Godkänd och låst genom produktägarens uttryckliga arbetsorder att
genomföra AO5. Avsnitt 2–11 är därmed oföränderliga inom
`tda_stress_onset_v1`.
