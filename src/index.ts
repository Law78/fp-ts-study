import * as readline from 'readline';
import { promises as fs } from 'fs';
import { exec } from 'child_process';
import path from 'path';

const rl = readline.createInterface({
  input: process.stdin, // Legge l'input dall'utente
  output: process.stdout // Scrive l'output sulla console
});

function handleError(message: string) {
  console.error(message);
  rl.close();
}

async function getTypeScriptFiles(dir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dir);
    return files.filter(file => file.endsWith('.ts') && file !== 'index.ts');
  } catch (error) {
    console.error(`Errore durante la lettura della directory ${dir}:`, error);
    return [];
  }
}

async function showMenu() {
  console.log('Seleziona un\'opzione:');
  try {
    const directories = await fs.readdir(__dirname);
    const options = await Promise.all(directories.map(async (dir) => {
      const stat = await fs.stat(path.join(__dirname, dir));
      return stat.isDirectory() ? dir : null;
    }));
    const validOptions = options.filter(Boolean);

    validOptions.forEach((option, index) => {
      console.log(`${index + 1}. ${option}`);
    });

    rl.question('Inserisci il numero dell\'opzione: ', async (answer) => {
      const parsedAnswer = parseInt(answer);
      if (isNaN(parsedAnswer) || parsedAnswer <= 0 || parsedAnswer > validOptions.length) {
        return handleError('Selezione non valida');
      }

      const selectedOption = validOptions[parsedAnswer - 1];
      if (!selectedOption) {
        return handleError('Selezione non valida');
      }

      const files = await getTypeScriptFiles(path.join(__dirname, selectedOption));
      console.log(`\nFile disponibili in ${selectedOption}:`);
      files.forEach((file, index) => {
        console.log(`${index + 1}. ${file}`);
      });

      rl.question('Inserisci il numero del file da eseguire: ', (fileAnswer) => {
        const parsedFileAnswer = parseInt(fileAnswer);
        if (isNaN(parsedFileAnswer) || parsedFileAnswer <= 0 || parsedFileAnswer > files.length) {
          return handleError('Selezione non valida');
        }

        const selectedFile = files[parsedFileAnswer - 1];
        if (!selectedFile) {
          return handleError('Selezione non valida');
        }

        const filePath = path.join(__dirname, selectedOption, selectedFile);
        console.log(`Esecuzione di ${filePath}`);
        exec(`ts-node ${filePath}`, (error, stdout, stderr) => {
          if (error) {
            return handleError(`Errore di esecuzione: ${error}`);
          }
          console.log(stdout);
          console.error(stderr);
          rl.close();
        });
      });
    });

  } catch (error) {
    handleError(`Si è verificato un errore durante la lettura della directory: ${error}`);
  }
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
