document.addEventListener('DOMContentLoaded', () => {
    // Anno corrente nel footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- LOGICA PAGINA SCHEDE ALLENAMENTO (index.html) ---
    if (document.getElementById('btnCreaNuovaScheda')) {
        const btnCreaNuovaScheda = document.getElementById('btnCreaNuovaScheda');
        const modalCreaScheda = document.getElementById('modalCreaScheda');
        const closeModalScheda = document.getElementById('closeModalScheda');
        const inputNomeScheda = document.getElementById('inputNomeScheda');
        const listaEserciziSchedaCorrente = document.getElementById('listaEserciziSchedaCorrente');
        const btnSalvaScheda = document.getElementById('btnSalvaScheda');
        const elencoSchedeContainer = document.getElementById('elencoSchedeContainer');

        const modalAggiungiEsercizio = document.getElementById('modalAggiungiEsercizio');
        const btnApriModalAggiungiEsercizio = document.getElementById('btnApriModalAggiungiEsercizio');
        const closeModalEsercizio = document.getElementById('closeModalEsercizio');
        
        const tabLinks = document.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');

        const selectEsercizioPredefinito = document.getElementById('selectEsercizioPredefinito');
        const btnConfermaAggiungiEsercizioPredefinito = document.getElementById('btnConfermaAggiungiEsercizioPredefinito');
        
        const inputNomeEsercizioCustom = document.getElementById('inputNomeEsercizioCustom');
        const selectGruppoMuscolareCustom = document.getElementById('selectGruppoMuscolareCustom');
        const btnConfermaAggiungiEsercizioCustom = document.getElementById('btnConfermaAggiungiEsercizioCustom');

        const formDettagliEsercizio = document.getElementById('formDettagliEsercizio');
        const nomeEsercizioSelezionatoDisplay = document.getElementById('nomeEsercizioSelezionato');
        const inputSerie = document.getElementById('inputSerie');
        const inputRep = document.getElementById('inputRep');
        const inputPeso = document.getElementById('inputPeso');
        const inputNoteEsercizio = document.getElementById('inputNoteEsercizio');
        const btnFinalizzaAggiuntaEsercizio = document.getElementById('btnFinalizzaAggiuntaEsercizio');

        let schedaCorrente = { nome: '', esercizi: [] };
        let esercizioDaFinalizzare = null; // Contiene nome e gruppo dell'esercizio scelto

        // Gestione Modali
        btnCreaNuovaScheda.onclick = () => { 
            schedaCorrente = { nome: '', esercizi: [] }; // Resetta scheda
            inputNomeScheda.value = '';
            listaEserciziSchedaCorrente.innerHTML = '';
            modalCreaScheda.style.display = 'block'; 
        }
        closeModalScheda.onclick = () => { modalCreaScheda.style.display = 'none'; }
        
        btnApriModalAggiungiEsercizio.onclick = () => {
            formDettagliEsercizio.style.display = 'none'; // Nascondi dettagli all'apertura
            modalAggiungiEsercizio.style.display = 'block';
        }
        closeModalEsercizio.onclick = () => { modalAggiungiEsercizio.style.display = 'none'; }

        window.onclick = (event) => {
            if (event.target == modalCreaScheda) modalCreaScheda.style.display = 'none';
            if (event.target == modalAggiungiEsercizio) modalAggiungiEsercizio.style.display = 'none';
        }

        // Gestione Tabs Modale Esercizi
        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                tabLinks.forEach(l => l.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                link.classList.add('active');
                document.getElementById(link.dataset.tab).classList.add('active');
            });
        });

        // Logica Aggiunta Esercizio
        btnConfermaAggiungiEsercizioPredefinito.onclick = () => {
            const selectedOption = selectEsercizioPredefinito.options[selectEsercizioPredefinito.selectedIndex];
            if (selectedOption && selectedOption.value !== "") {
                esercizioDaFinalizzare = { nome: selectedOption.dataset.nome, gruppo: selectedOption.parentElement.label };
                mostraFormDettagliEsercizio();
            } else {
                alert("Seleziona un esercizio!");
            }
        };

        btnConfermaAggiungiEsercizioCustom.onclick = () => {
            const nome = inputNomeEsercizioCustom.value.trim();
            const gruppo = selectGruppoMuscolareCustom.value;
            if (nome && gruppo) {
                esercizioDaFinalizzare = { nome, gruppo };
                mostraFormDettagliEsercizio();
                inputNomeEsercizioCustom.value = ''; // Pulisci campo
            } else {
                alert("Inserisci nome e gruppo muscolare per l'esercizio custom!");
            }
        };
        
        function mostraFormDettagliEsercizio() {
            if (esercizioDaFinalizzare) {
                nomeEsercizioSelezionatoDisplay.textContent = `Dettagli per: ${esercizioDaFinalizzare.nome}`;
                inputSerie.value = '';
                inputRep.value = '';
                inputPeso.value = '';
                inputNoteEsercizio.value = '';
                formDettagliEsercizio.style.display = 'block';
            }
        }

        btnFinalizzaAggiuntaEsercizio.onclick = () => {
            const serie = inputSerie.value.trim();
            const rep = inputRep.value.trim();
            const peso = inputPeso.value.trim();
            const note = inputNoteEsercizio.value.trim();

            if (esercizioDaFinalizzare && serie && rep) {
                schedaCorrente.esercizi.push({
                    nome: esercizioDaFinalizzare.nome,
                    gruppo: esercizioDaFinalizzare.gruppo,
                    serie,
                    rep,
                    peso: peso || 'N/A', // Peso opzionale
                    note
                });
                esercizioDaFinalizzare = null; // Resetta
                aggiornaListaEserciziSchedaCorrente();
                modalAggiungiEsercizio.style.display = 'none'; // Chiudi modale esercizi
                formDettagliEsercizio.style.display = 'none'; // Nascondi form dettagli
            } else {
                alert("Inserisci almeno serie e ripetizioni!");
            }
        };

        function aggiornaListaEserciziSchedaCorrente() {
            listaEserciziSchedaCorrente.innerHTML = '';
            schedaCorrente.esercizi.forEach((ex, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span><strong>${ex.nome}</strong> (${ex.gruppo}) - ${ex.serie}x${ex.rep} @ ${ex.peso}kg ${ex.note ? `- <i>${ex.note}</i>` : ''}</span>
                    <button class="remove-exercise-btn" data-index="${index}">×</button>
                `;
                li.querySelector('.remove-exercise-btn').onclick = (e) => {
                    schedaCorrente.esercizi.splice(e.target.dataset.index, 1);
                    aggiornaListaEserciziSchedaCorrente();
                };
                listaEserciziSchedaCorrente.appendChild(li);
            });
        }
        
        // Salva Scheda
        btnSalvaScheda.onclick = () => {
            schedaCorrente.nome = inputNomeScheda.value.trim();
            if (!schedaCorrente.nome) {
                alert("Dai un nome alla scheda!");
                return;
            }
            if (schedaCorrente.esercizi.length === 0) {
                alert("Aggiungi almeno un esercizio alla scheda!");
                return;
            }

            let schedeSalvate = JSON.parse(localStorage.getItem('fitFlowSchede')) || [];
            schedeSalvate.push(schedaCorrente);
            localStorage.setItem('fitFlowSchede', JSON.stringify(schedeSalvate));
            
            modalCreaScheda.style.display = 'none';
            caricaSchedeSalvate();
        };

        // Carica Schede
        function caricaSchedeSalvate() {
            elencoSchedeContainer.innerHTML = '';
            let schedeSalvate = JSON.parse(localStorage.getItem('fitFlowSchede')) || [];
            schedeSalvate.forEach((scheda, index) => {
                const schedaDiv = document.createElement('div');
                schedaDiv.classList.add('scheda-card');
                let eserciziHtml = '<ul>';
                scheda.esercizi.forEach(ex => {
                    eserciziHtml += `<li><strong>${ex.nome}</strong>: ${ex.serie} serie x ${ex.rep} reps @ ${ex.peso}kg ${ex.note ? `(${ex.note})` : ''}</li>`;
                });
                eserciziHtml += '</ul>';

                schedaDiv.innerHTML = `
                    <h4>${scheda.nome}</h4>
                    ${eserciziHtml}
                    <button class="btn btn-danger btn-sm btn-elimina-scheda" data-index="${index}">Elimina</button>
                `;
                elencoSchedeContainer.appendChild(schedaDiv);
            });
            
            // Add event listeners to new delete buttons
            document.querySelectorAll('.btn-elimina-scheda').forEach(button => {
                button.addEventListener('click', (e) => {
                    eliminaScheda(parseInt(e.target.dataset.index));
                });
            });
        }
        
        function eliminaScheda(index) {
            if (confirm("Sei sicuro di voler eliminare questa scheda?")) {
                let schedeSalvate = JSON.parse(localStorage.getItem('fitFlowSchede')) || [];
                schedeSalvate.splice(index, 1);
                localStorage.setItem('fitFlowSchede', JSON.stringify(schedeSalvate));
                caricaSchedeSalvate();
            }
        }

        caricaSchedeSalvate(); // Carica all'avvio
    }


    // --- LOGICA PAGINA DIARIO ALIMENTARE (diario.html) ---
    if (document.getElementById('btnAggiungiAlimento')) {
        const inputDataDiario = document.getElementById('dataDiario');
        const btnAggiungiAlimento = document.getElementById('btnAggiungiAlimento');
        const listaAlimentiUl = document.getElementById('listaAlimenti');
        
        const totCalorieSpan = document.getElementById('totCalorie');
        const totCarboidratiSpan = document.getElementById('totCarboidrati');
        const totGrassiSpan = document.getElementById('totGrassi');
        const totProteineSpan = document.getElementById('totProteine');

        const inputNuovoPeso = document.getElementById('inputNuovoPeso');
        const inputDataRegistrazionePeso = document.getElementById('dataRegistrazionePeso');
        const btnRegistraPeso = document.getElementById('btnRegistraPeso');
        const ultimoPesoRegistratoSpan = document.getElementById('ultimoPesoRegistrato');
        const dataUltimoPesoSpan = document.getElementById('dataUltimoPeso');
        const storicoPesiListaUl = document.getElementById('storicoPesiLista');

        // Imposta date default
        const oggi = new Date().toISOString().split('T')[0];
        inputDataDiario.value = oggi;
        inputDataRegistrazionePeso.value = oggi;

        // Carica dati all'avvio
        caricaDiarioAlimentare(inputDataDiario.value);
        caricaDatiPeso();

        inputDataDiario.addEventListener('change', (e) => {
            caricaDiarioAlimentare(e.target.value);
        });

        btnAggiungiAlimento.onclick = () => {
            const nome = document.getElementById('inputNomeAlimento').value.trim();
            const calorie = parseFloat(document.getElementById('inputCalorie').value);
            const carboidrati = parseFloat(document.getElementById('inputCarboidrati').value);
            const grassi = parseFloat(document.getElementById('inputGrassi').value);
            const proteine = parseFloat(document.getElementById('inputProteine').value);
            const pasto = document.getElementById('selectPasto').value;
            const data = inputDataDiario.value;

            if (!nome || isNaN(calorie) || isNaN(carboidrati) || isNaN(grassi) || isNaN(proteine)) {
                alert("Compila tutti i campi dell'alimento con valori validi.");
                return;
            }

            const alimento = { nome, calorie, carboidrati, grassi, proteine, pasto };
            let diario = JSON.parse(localStorage.getItem('fitFlowDiario')) || {};
            if (!diario[data]) diario[data] = [];
            diario[data].push(alimento);
            localStorage.setItem('fitFlowDiario', JSON.stringify(diario));
            
            caricaDiarioAlimentare(data); // Ricarica e aggiorna UI
            // Pulisci form
            document.getElementById('inputNomeAlimento').value = '';
            document.getElementById('inputCalorie').value = '';
            document.getElementById('inputCarboidrati').value = '';
            document.getElementById('inputGrassi').value = '';
            document.getElementById('inputProteine').value = '';
        };

        function caricaDiarioAlimentare(data) {
            listaAlimentiUl.innerHTML = '';
            let diario = JSON.parse(localStorage.getItem('fitFlowDiario')) || {};
            const alimentiDelGiorno = diario[data] || [];

            let totCal = 0, totCarb = 0, totGr = 0, totProt = 0;

            alimentiDelGiorno.forEach((alimento, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span><strong>${alimento.nome}</strong> (${alimento.pasto}) - 
                    Kcal: ${alimento.calorie}, C: ${alimento.carboidrati}g, G: ${alimento.grassi}g, P: ${alimento.proteine}g</span>
                    <button class="remove-food-btn" data-index="${index}" data-date="${data}">×</button>
                `;
                li.querySelector('.remove-food-btn').onclick = (e) => {
                    eliminaAlimento(e.target.dataset.date, parseInt(e.target.dataset.index));
                };
                listaAlimentiUl.appendChild(li);

                totCal += alimento.calorie;
                totCarb += alimento.carboidrati;
                totGr += alimento.grassi;
                totProt += alimento.proteine;
            });

            totCalorieSpan.textContent = totCal.toFixed(0);
            totCarboidratiSpan.textContent = totCarb.toFixed(1);
            totGrassiSpan.textContent = totGr.toFixed(1);
            totProteineSpan.textContent = totProt.toFixed(1);
        }
        
        function eliminaAlimento(data, index) {
            let diario = JSON.parse(localStorage.getItem('fitFlowDiario')) || {};
            if (diario[data]) {
                diario[data].splice(index, 1);
                if (diario[data].length === 0) delete diario[data]; // Rimuovi la data se non ci sono più alimenti
                localStorage.setItem('fitFlowDiario', JSON.stringify(diario));
                caricaDiarioAlimentare(data);
            }
        }

        btnRegistraPeso.onclick = () => {
            const peso = parseFloat(inputNuovoPeso.value);
            const dataReg = inputDataRegistrazionePeso.value;

            if (isNaN(peso) || !dataReg) {
                alert("Inserisci un peso valido e una data.");
                return;
            }

            let storicoPesi = JSON.parse(localStorage.getItem('fitFlowPeso')) || [];
            // Rimuovi eventuali registrazioni per la stessa data per evitarne multiple
            storicoPesi = storicoPesi.filter(entry => entry.data !== dataReg);
            storicoPesi.push({ data: dataReg, peso });
            // Ordina per data
            storicoPesi.sort((a, b) => new Date(a.data) - new Date(b.data));
            localStorage.setItem('fitFlowPeso', JSON.stringify(storicoPesi));
            
            caricaDatiPeso();
            inputNuovoPeso.value = '';
        };

        function caricaDatiPeso() {
            let storicoPesi = JSON.parse(localStorage.getItem('fitFlowPeso')) || [];
            storicoPesiListaUl.innerHTML = ''; // Pulisci la lista demo

            if (storicoPesi.length > 0) {
                const ultimo = storicoPesi[storicoPesi.length - 1];
                ultimoPesoRegistratoSpan.textContent = ultimo.peso.toFixed(1);
                dataUltimoPesoSpan.textContent = new Date(ultimo.data).toLocaleDateString('it-IT');

                // Popola la lista demo per il "grafico"
                storicoPesi.forEach(entry => {
                    const li = document.createElement('li');
                    li.textContent = `${new Date(entry.data).toLocaleDateString('it-IT')}: ${entry.peso.toFixed(1)} kg`;
                    storicoPesiListaUl.appendChild(li);
                });

            } else {
                ultimoPesoRegistratoSpan.textContent = 'N/D';
                dataUltimoPesoSpan.textContent = 'N/D';
                storicoPesiListaUl.innerHTML = '<li>Nessun dato di peso registrato.</li>';
            }
        }
    }

    // --- LOGICA PAGINA CONSIGLI (consigli.html) ---
    // Non c'è JS specifico per questa pagina se si usano <details>/<summary>
    // che funzionano nativamente.
});