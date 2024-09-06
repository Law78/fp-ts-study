import * as readline from 'readline';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import path from 'path';

const rl = readline.createInterface({
  input: process.stdin, // Legge l'input dall'utente
  output: process.stdout // Scrive l'output sulla console
});

async function getTypeScriptFiles(dir: string): Promise<string[]> {
    /*
    Questa funzione legge tutti i file in una directory specifica e restituisce un array di file TypeScript.
    */
  const files = await fs.readdir(dir);
  return files.filter(file => file.endsWith('.ts') && file !== 'index.ts');
}

async function showMenu() {
  console.log('Seleziona un\'opzione:');
  const directories = await fs.readdir(__dirname);
  const options = directories.filter(dir => fs.stat(path.join(__dirname, dir)).then(stat => stat.isDirectory()));

  options.forEach((option, index) => {
    console.log(`${index + 1}. ${option}`);
  });

  rl.question('Inserisci il numero dell\'opzione: ', async (answer) => {
    const parsedAnswer = parseInt(answer);
    if (!isNaN(parsedAnswer) && parsedAnswer > 0 && parsedAnswer <= options.length) {
      const selectedOption = options[parsedAnswer - 1];
      const files = await getTypeScriptFiles(path.join(__dirname, selectedOption));
      console.log(`\nFile disponibili in ${selectedOption}:`);
      files.forEach((file, index) => {
        console.log(`${index + 1}. ${file}`);
      });

      rl.question('Inserisci il numero del file da eseguire: ', (fileAnswer) => {
        const parsedFileAnswer = parseInt(fileAnswer);
        if (!isNaN(parsedFileAnswer) && parsedFileAnswer > 0 && parsedFileAnswer <= files.length) {
          const selectedFile = files[parsedFileAnswer - 1];
          if (selectedFile) {
          const filePath = path.join(__dirname, selectedOption, selectedFile);
          console.log(`Esecuzione di ${filePath}`);
          exec(`ts-node ${filePath}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Errore di esecuzione: ${error}`);
              return;
            }
            console.log(stdout);
            console.error(stderr);
            rl.close();
            });
        
          } else {
            console.log('Selezione non valida');
            rl.close();
        }
        }
    });
    } else {
      console.log('Selezione non valida');
      rl.close();
    }
  });
}
/*
Questo codice è un semplice menu interattivo che permette di selezionare un file da eseguire all'interno di una directory specifica. 
Il codice utilizza le librerie readline per gestire l'input dell'utente e la libreria fs per leggere la directory e i file. 
Utilizza anche la libreria exec per eseguire i file selezionati.


1. Importa i moduli necessari per l'interazione con il filesystem, l'input/output e l'esecuzione di comandi.
2. Crea un'interfaccia readline per l'input dell'utente.
3. Definisce una funzione getTypeScriptFiles per ottenere tutti i file TypeScript in una directory.
4. Implementa la funzione showMenu che:
Mostra un elenco di sottocartelle nella directory corrente.
Chiede all'utente di selezionare una sottocartella.
Mostra un elenco di file TypeScript nella sottocartella selezionata.
Chiede all'utente di selezionare un file da eseguire.
Esegue il file selezionato usando ts-node.
Per utilizzare questo script, assicurati di avere installato ts-node globalmente (npm install -g ts-node) o localmente nel tuo progetto.
*/

showMenu();
