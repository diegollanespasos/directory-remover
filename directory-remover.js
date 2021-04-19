const fs = require('fs');
const readline = require('readline');
const directoryToDelete = process.argv[2];

var numDirectories = 1;
var numFiles = 0;

function removeDirectory(){
  fs.rm(directoryToDelete, {
    recursive: true
  }, error => 
    error ? console.log(error.message) : 
    console.log(`Removed ${numDirectories} directories, ${numFiles} files `));
}

function askUserToRemove(){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Directory is not empty, do you want to remove all content [yes]/no: ', (answer) => {
    if(answer.toLowerCase() === 'yes'){
      countDirectoriesAndFiles(directoryToDelete);
      removeDirectory();
    }
    rl.close();
  });
}

function isDirectoryEmpty(files) {
  if (files.length === 0)  {
    removeDirectory();
   } else {
    askUserToRemove();
   }
}

function countDirectoriesAndFiles(filePath) {
  fs.readdir(filePath, (err, files) => {
      files.forEach(file => {
          const isDirectory = fs.statSync(`${filePath}/${file}`).isDirectory();
          if(isDirectory){
            numDirectories +=1;
            countDirectoriesAndFiles(`${filePath}/${file}`);
          } else {
            numFiles +=1;
          }
      })
  })
}

fs.readdir(directoryToDelete, (error, files) => {
  if (error) {
    console.log('This directory does not exist');
  } else {
    isDirectoryEmpty(files);    
  }
});