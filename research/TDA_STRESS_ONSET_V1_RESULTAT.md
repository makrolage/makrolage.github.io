# AO5 — resultat för `tda_stress_onset_v1`

> Forskningsrapport. Experimentet är förregistrerat men saknar ren historisk tidsholdout. TDA förblir `RESEARCH` oavsett historiskt utfall; detta är inte en validerad investeringssignal.

## Låsning och kördisciplin

- Produktägare: Gunnar Östberg. Låst: 2026-08-09.
- Förregistrering SHA-256: `1c2a5a74d2c8bd56149bcd72f4bb6b657eaf8c510b09741350bbe0406faf16f2`.
- Låst förregistrering: [`AO5_FORREGISTRERING_TDA_LOCKED.md`](AO5_FORREGISTRERING_TDA_LOCKED.md).
- Experimentkonfiguration: `eae556a5f6422291b1741d06050db3e5d5a390de03bfcc0041ff4630a2557a60`.
- Featurearkiv: `505b9874fee07df6bb78380357edd2545a6bbf72920b9b7f44e1e3552a5d7819`.
- Europa utvecklades först. Resultatet och de negativa kontrollerna skrevs därefter till en låst etappartefakt innan Japan eller Asia Pacific ex Japan lästes in.
- Deklarerade jämförelser körda: 18 av 18. Extra jämförelser: 0. Avbrutna/misslyckade modellvarianter: 0.
- Ett tekniskt preflight-försök avbröts innan featurematrisen laddades och innan någon modell tränades, eftersom `MAKROLAGE_DATA_DIR` inte pekade på reporoten. Det räknas inte som en körd eller avbruten modellvariant; miljön korrigerades utan analytisk ändring.

## Primärt test

Europa, −10 %, 20 handelsdagar; median över fem yttre walk-forward-folds.

| Mått | Klassiska | Klassiska + fyra TDA | Skillnad |
|---|---:|---:|---:|
| PR-AUC | 0.0494 | 0.1168 | 0.01945 (39.35 %) |
| Brier, medel | 0.0566 | 0.0598 | 0.0032 |
| Kalibreringslutning | — | 0.2198 | — |

Positiv ΔPR-AUC i 4 av 5 folds. **Det primära testet klarar inte den låsta effekttröskeln.**

| Fold | Testperiod | Positiva dagar | C klassisk | C + TDA | PR-AUC klassisk | PR-AUC + TDA | Δ |
|---:|---|---:|---:|---:|---:|---:|---:|
| 1 | 2005-05-26–2009-07-09 | 57 | 10 | 10 | 0.0317 | 0.0512 | 0.01945 |
| 2 | 2009-08-07–2013-09-19 | 57 | 0.01 | 10 | 0.1224 | 0.1277 | 0.00536 |
| 3 | 2013-10-18–2017-11-29 | 40 | 10 | 1 | 0.0456 | 0.0393 | -0.00624 |
| 4 | 2017-12-29–2022-02-10 | 73 | 10 | 10 | 0.0895 | 0.1441 | 0.05460 |
| 5 | 2022-03-14–2026-04-30 | 59 | 10 | 10 | 0.0494 | 0.1168 | 0.06738 |

### Samtliga sex förregistrerade referensmodeller

Makroregimen är den separata kategoriska, träningsfoldsskattade jämförelsen; den ingår inte i den gemensamma logistiska modellklassen.

| Modell | Median PR-AUC | Medel Brier |
|---|---:|---:|
| Naiv basfrekvens | 0.0550 | 0.0528 |
| Enbart volatilitet | 0.0543 | 0.0533 |
| Enbart drawdown | 0.0650 | 0.0532 |
| Fem klassiska | 0.0494 | 0.0566 |
| Fem klassiska + fyra TDA | 0.1168 | 0.0598 |
| Månatlig makroregim | 0.0764 | 0.0527 |

## Fem låsta promotionsvillkor

| # | Utfall | PASS/FAIL |
|---:|---|---|
| 1 | ΔPR-AUC ≥ 0,02000 och ≥ 10 % relativt: 0.01945, 39.35 % | FAIL |
| 2 | Brier-försämring ≤ 0,002 och lutning [0,80; 1,25]: 0.0032, 0.2198 | FAIL |
| 3 | Samma tecken i minst 4/5 folds: 4/5 | PASS |
| 4 | Positivt i Japan och APAC ex Japan: 0.0157, -0.0134 | FAIL |
| 5 | Alla negativa kontroller under tröskeln | FAIL |

**Historisk promotion: NEJ. Minst ett låst villkor föll; svaret är nej för experimentgeneration v1.**

## Negativa kontroller

| Kontroll | Median ΔPR-AUC | Relativ Δ | Under promotionströskeln |
|---|---:|---:|---|
| `block_bootstrapped_returns` | 0.0067 | 13.65 % | PASS |
| `block_permuted_labels` | -0.0048 | -5.35 % | PASS |
| `phase_randomized_returns` | 0.0007 | 1.38 % | PASS |
| `random_features` | -0.0000 | -0.04 % | PASS |
| `window_50` | 0.0087 | 17.62 % | PASS |
| `window_70` | 0.0238 | 48.11 % | FAIL |

Blockpermutationen använder 250-dagars labelblock. Fasrandomiseringen använder oberoende Fourierfaser per sektor. Blockbootstrap använder oberoende cirkulära 250-dagarsblock per sektor. Båda förstör den synkroniserade tvärsnittstopologin men bevarar avsedd tidsseriestruktur approximativt. Slumpkontrollen har fyra fasta normalbrusserier. Fönsterkontrollerna är exakt 50 och 70 dagar.

## Alla 18 deklarerade jämförelser

Sekundära utfall är deskriptiva och saknar promotionsbefogenhet.

| Region | Drawdown | Horisont | Klassisk PR-AUC | +TDA PR-AUC | Median Δ | Positiva folds |
|---|---:|---:|---:|---:|---:|---:|
| `ff_region_apac_ex_japan` | −10 % | 20 | 0.0708 | 0.0565 | -0.0134 | 2/5 |
| `ff_region_apac_ex_japan` | −10 % | 5 | 0.0179 | 0.0232 | 0.0061 | 4/5 |
| `ff_region_apac_ex_japan` | −10 % | 60 | 0.1718 | 0.1591 | -0.0070 | 2/5 |
| `ff_region_apac_ex_japan` | −20 % | 20 | 0.0215 | 0.0294 | 0.0055 | 3/5 |
| `ff_region_apac_ex_japan` | −20 % | 5 | 0.0126 | 0.0234 | 0.0037 | 3/5 |
| `ff_region_apac_ex_japan` | −20 % | 60 | 0.0677 | 0.0816 | 0.0114 | 4/5 |
| `ff_region_europe` | −10 % | 20 | 0.0494 | 0.1168 | 0.0194 | 4/5 |
| `ff_region_europe` | −10 % | 5 | 0.0208 | 0.0298 | -0.0040 | 2/5 |
| `ff_region_europe` | −10 % | 60 | 0.1496 | 0.1677 | 0.0072 | 3/5 |
| `ff_region_europe` | −20 % | 20 | 0.1021 | 0.0762 | -0.0050 | 1/5 |
| `ff_region_europe` | −20 % | 5 | 0.1815 | 0.1166 | 0.0000 | 2/5 |
| `ff_region_europe` | −20 % | 60 | 0.0825 | 0.0772 | 0.0012 | 3/5 |
| `ff_region_japan` | −10 % | 20 | 0.1264 | 0.1139 | 0.0157 | 3/5 |
| `ff_region_japan` | −10 % | 5 | 0.0458 | 0.0247 | -0.0136 | 0/5 |
| `ff_region_japan` | −10 % | 60 | 0.5097 | 0.4030 | -0.0659 | 0/5 |
| `ff_region_japan` | −20 % | 20 | 0.0439 | 0.0487 | 0.0000 | 1/5 |
| `ff_region_japan` | −20 % | 5 | 0.0139 | 0.0155 | 0.0000 | 2/5 |
| `ff_region_japan` | −20 % | 60 | 0.1391 | 0.1280 | 0.0000 | 2/5 |

## Data- och labelkontroll

Målarkiven innehåller 8134 handelsdagar per region inom 1995-03-28–2026-05-29; förregistreringens text anger 8 194, vilket motsvarar de ytterligare 60 måldagarna från 1995-01-03 till 1995-03-27. Modelleringen använder det explicit låsta gemensamma intervallet och 7845 prediktordagar.

| Region | −10 % | −15 % | −20 % |
|---|---:|---:|---:|
| `ff_region_apac_ex_japan` | 17 | 16 | 12 |
| `ff_region_europe` | 17 | 13 | 13 |
| `ff_region_japan` | 22 | 17 | 11 |

## Framåtriktad mätning

Förregistreringens framåtriktade fas är initierad men kan inte vara avslutad på låsdatumet. Inga handelsdagsfeatures efter 2026-05-29 finns i den låsta vintagen, alltså finns ännu ingen legitim fryst framtidsprediktion. Ny utvärdering får ske tidigast efter 24 månader **och** minst tre nya stressdebuter. Det historiska utfallet ersätter inte denna evidens.

## Reproducerbarhet och begränsning

Körmiljö: `macOS-26.5.2-arm64-arm-64bit-Mach-O`, Python `3.14.5`. Resultatfil SHA-256: `f01cc6324d68c48879903bea7199f4bd38f50a17ab2105bf4184a4329eb5be9d`. Den geografiska replikeringen har körts exakt en gång i denna generation och får inte omjusteras eller köras om som ett nytt analytiskt försök.
