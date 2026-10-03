# Källkontrakt för den beskrivande kontextpanelen

Version `context@1.0.1`, 2026-10-03. Maskinläsbara adresser, exakta
serieidentiteter, enheter och åldersgränser finns i `makrolage/context.py`.
Panelen har ingen vikt i produktionssyntesen och utgör ingen validerad
prognosmodell. API-svar verifierades mot riktiga leveranser.

| Mått | Primär källa | Transformation och jämförelse |
|---|---|---|
| BNP-indikator | [SCB](https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__NR__NR9999__NR9999A/NR9999ENS2010BNPIndN/) | TAB443, BNPMarknadspris BNPM, ContentsCode 000000X2. Säsongrensad månatlig volymförändring; skillnad mot föregående månad i procentenheter. |
| ADS | [Philadelphia Fed](https://www.philadelphiafed.org/surveys-and-data/real-time-data-research/ads) | Daglig modellskattning; skillnad över 28 kalenderdagar. |
| NFCI / ANFCI | [Chicago Fed](https://www.chicagofed.org/research/data/nfci/current-data) genom direkt CSV-leverans | Veckodata; förändring över fyra veckor. ANFCI är justerat för ekonomins läge och är inte en oberoende röst. |
| KPIF | [SCB](https://www.scb.se/PR0101) | TAB6601, totalgrupp 00, ContentsCode 0000080U. Årlig inflationstakt; skillnad mot föregående månad i procentenheter. |
| Svensk tioårsränta | [Riksbanken](https://www.riksbank.se/sv/statistik/rantor-och-valutakurser/) | SEGVB10YC, underliggande data Refinitiv. Räntenivå och egen beräkning av förändring över 28 kalenderdagar; inte totalavkastning. |
| EUR/SEK | [Riksbanken](https://www.riksbank.se/sv/statistik/rantor-och-valutakurser/) | SEKEURPMI, SEK per euro; förändring över 28 kalenderdagar. Indikativ kurs. |
| NEW CISS | [ECB](https://data.ecb.europa.eu/data/datasets/CISS) | D.U2.Z0Z.4F.EC.SS_CIN.IDX. Index 0–1, skillnad över 28 kalenderdagar. Den äldre SS_CI-serien används inte. Se [metod](https://www.ecb.europa.eu/pub/pdf/scpwps/ecb.wp2842~9a4cb3f225.en.pdf). |
| GSCPI | [New York Fed](https://www.newyorkfed.org/research/policy/gscpi) | Senaste daterade vintagekolumn i leveransfilen. Månadsdata, standardavvikelser från genomsnitt; skillnad mot föregående månad. Publiceringskolumnens månad är inte observationsmånad. |

## Revisioner och aktualitet

Hela källsvaret arkiveras privat före parsning, med SHA-256 och separat
hämtningslogg. Endast ändrade värden för samma observationsperiod räknas
som revisioner. Nytillkomna perioder räknas separat. Första arkiveringen
kan inte visa tidigare revisioner. Nytt svar som tappar tidigare
observationer avvisas; senaste verifierade fil bevaras.

Publika kort visar referensperiod, hämtningsdatum, källänk, nivå och
förändring inom samma vintage. De återskapar inte historiska realtidssignaler.
GSCPI:s vintagekolumner ger inte exakt historisk publiceringstid. Råserier,
Excel-filer och breda vintagefiler publiceras inte.

Misslyckad hämtning, äldre observation än måttets specificerade gräns eller
mer än fyra dagar sedan verifiering ger osäker aktualitet. Den öppna
webbsidan räknar dessutom om verifieringens ålder varje minut.
För bankdagsserier väljs närmast föregående tillgängliga jämförelsedag,
med högst sju dagars glapp. Saknad jämförelse visas som saknad.

Källorna kompletterar varandra genom att skilja aktivitet, finansiering,
inflation, valuta och utbud. De får inte adderas till en informell
röstning om risk: flera mått delar underliggande information.


Drifttillägg 2026-10-03: FRED-leveransen gav upprepade timeout från
GitHub Actions. Hämtningen går därför direkt till Chicago Feds officiella
CSV. Äldre FRED-råfiler kan fortfarande återspelas. Kolumner och datumformat
valideras separat, och samma mått/enhet används. Transportfel får ett
extra försök efter två sekunder; mottagna HTTP-felsvar arkiveras och
parsarfel maskeras inte genom omförsök.
