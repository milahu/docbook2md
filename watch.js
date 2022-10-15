import { watch } from 'fs';
import { execSync } from 'child_process'
/** @typedef {import("@types/node")} */

const mainFile = 'docbook2md.js';

function date() {
  return new Date().toLocaleString('af')
}

console.log(`${date()} watch.js: Watching for file changes on ${mainFile}`);

async function run() {
  console.log(`${date()} watch.js: running: node ${mainFile}`)
  try {
    // If the process times out or has a non-zero exit code, execSync will throw
    execSync(`node ${mainFile}`, { encoding: 'utf8', stdio: 'inherit' })
    // no. this does not print full error messages:
    // error source lines are missing + no way to get them from node
    //await import(mainFile)
  }
  catch (error) {
    /* not working to get error source lines
    console.dir({
      //trace,
      stack: error.stack,
      lineNumber: error.lineNumber,
      fileName: error.fileName,
      error,
    })
    console.error(error)
    */
  }
}

console.log()
run()

let ignoreNextChange = false

watch(mainFile, async (event, filename) => {
  // event == 'change'
  if (filename) {
    // FIXME avoid false positives
    // when i "save file" on docbook2md.js, run this only once (not twice)
    //console.clear()
    if (ignoreNextChange) {
      console.log(`${date()} watch.js: ignoring second file change`)
      ignoreNextChange = false
      return
    }
    console.log()
    console.log(`${date()} watch.js: file changed: ${filename}`)
    run()
    ignoreNextChange = true
  }
});
