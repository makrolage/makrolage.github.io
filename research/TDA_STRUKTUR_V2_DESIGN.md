# TDA struktur v2: beskrivande utveckling

Skrivet 2026-10-01 före den första beräkningen på FF49 i denna generation.
Detta är ett nytt utvecklingskontrakt, inte en låst prognosförregistrering.
Produktägarens uppdrag 2026-09-30 omfattar utvecklingen. FF12 v1 och AO5
förblir låsta och inga promotionsvillkor återöppnas.

## Första leverans

Fråga: hur förändras samband och diversifieringsstruktur mellan 49
amerikanska branschportföljer? Den beskrivande bilden jämför det senaste
60-handelsdagarsfönstret med ett lika långt fönster som slutade 20
handelsdagar tidigare. Fönstren överlappar; skillnaden är ingen
oberoende hypotesprövning. Valen är tekniska, gjorda före beräkning och
inte optimerade på ett prognosutfall.

Referenser: medelkorrelation, första huvudkomponentens andel, effektiv
rang, volatilitet för den likaviktade logavkastningen och RMS-förändring
i korrelationsmatrisen. TDA: antal H1-klasser, total persistens,
persistensviktad födelseskala och bottleneck-avstånd mellan fönstren.
Alla härleds ur samma indata. Tomt H1-diagram ger ingen födelseskala,
inte en påhittad nollobservation eller nollrisk.

Kontraktet finns i `config/tda/structure-v2.json`. Varje råvintage och
beräkning har hash, källtidsstämpel, senaste handelsdag och
biblioteksversioner. Senaste publiceringen är ett rekonstruerat
forskningsunderlag; den får inte användas som historiskt punkt-i-tid.
Källans periodiska uppdatering gör detta olämpligt som dagsaktuell varning.

Detta steg laddar inga framtida målserier, tränar ingen prognosmodell,
beräknar inga sannolikheter och ändrar inte produktionssyntesen.

## Separat prognosprövning som återstår

En färdig förregistrering behöver besluta om:

1. Ett primärt praktiskt mål: förlust av diversifiering eller början på
   en stressperiod, och en enda huvudsaklig prognoshorisont.
2. Beslutstid efter faktisk källpublicering, rätt måldata samt historiskt
   punkt-i-tid-underlag eller uttryckligen framåtriktat test.
3. Samma baslinjer för alla kandidater, inklusive volatilitetens nivå
   och förändring, korrelationsmomentum och en vanlig detektor för
   strukturförändring. Att en TDA-feature slår bara medelkorrelation räcker inte.
4. Förhandsbestämda tidsfolds, purge, embargo, kalibrering, antal prövningar,
   nollkontroller, mätetal för falsklarm/fördröjning och promotionsgränser.
5. Ett nytt, orört framåtriktat urval. Redan inspekterad historia får
   beskrivas som utvecklingsdata men inte döpas om till orörd holdout.

Ingen sådan prognosprövning startas av `collect_structure`. Designen
måste färdigställas och låsas separat före utfallsanalys. En annan
framtida studie kan separera korrelationsskalor eller använda fler
tillgångsslag; den får inte väljas därför att den ser bäst ut i samma data.

## Källor och begränsning

- [Kenneth Frenchs 49 branschportföljer](https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/Data_Library/det_49_ind_port.html).
- [Data Library](https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html): historiken kan rekonstrueras vid uppdatering.
- [Two-Scale Topological Momentum (2026)](https://www.preprints.org/manuscript/202606.0592): hypoteskälla, ej sakkunniggranskad; den prediktiva jämförelsen saknar volatilitet som kontroll.
- [Bayesian Online Changepoint Detection](https://arxiv.org/abs/0710.3742): alternativ metodfamilj, inte belägg för finansiell överlägsenhet.

Endast härledda sammanfattningar får publiceras. Råavkastningar,
fullständiga indata och arkiv stannar i det privata state-repot.
