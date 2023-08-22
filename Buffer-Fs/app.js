const fs = require('node:fs/promises');
const { off } = require('node:process');
const { buffer } = require('stream/consumers');

( async () => {

    // Command for creating, deleting or renaming files
    const CREATE_FILE = "create a file";
    const DELETE_FILE = "delete the file";
    const RENAME_FILE = "rename the file";
    const ADD_TO_FILE = "add to the file";

    const createFile = async (path) => {
        try {
          // we want to check whether or not we already have that file
          const existingFileHandle = await fs.open(path, "r");
          existingFileHandle.close();
    
          // we already have that file...
          return console.log(`The file ${path} already exists.`);
        } catch (e) {
          // we don't have the file, now we should create it
          const newFileHandle = await fs.open(path, "w");
          console.log("A new file was successfully created.");
          newFileHandle.close();
        }
      };

      const deleteFile = async (path) => {
        try {
          await fs.unlink(path);
          console.log("The file was successfully removed.");
        } catch (e) {
          if (e.code === "ENOENT") {
            console.log("No file at this path to remove.");
          } else {
            console.log("An error occurred while removing the file: ");
            console.log(e);
          }
        }
      };
    
      const renameFile = async (oldPath, newPath) => {
        try {
          await fs.rename(oldPath, newPath);
          console.log("The file was successfully renamed.");
        } catch (e) {
          if (e.code === "ENOENT") {
            console.log(
              "No file at this path to rename, or the destination doesn't exist."
            );
          } else {
            console.log("An error occurred while removing the file: ");
            console.log(e);
          }
        }
      };
    
      let addedContent;
    
      const addToFile = async (path, content) => {
        if (addedContent === content) return;
        try {
          const fileHandle = await fs.open(path, "a");
          fileHandle.write(content);
          addedContent = content;
          console.log("The content was added successfully.");
        } catch (e) {
          console.log("An error occurred while removing the file: ");
          console.log(e);
        }
      };
    
    //read the command file 
    const commandFileHandler = await fs.open("./command.txt", 'r');

    //This function for determine which command is executed in the command text file
    commandFileHandler.on("change", async ()=> {
        //get the size of the file
        const size = (await commandFileHandler.stat()).size;

        //allocate the buffer with the size of the file 
        const buff = Buffer.alloc(size);

        // the location at which we want to start filling our buffer
        const offset = 0;

        // how many bytes we want to read
        const length = buff.byteLength;

        // the position that we want to start reading the file from
        const position = 0;

        //we have to read whole content of the file (from beginning all the way to the end)
        await commandFileHandler.read(buff, offset, length, position);

        const command = buff.toString("utf-8");

        // create a file: 
        // create a file <path>
        if(command.includes(CREATE_FILE)){
            const filePath = command.substring(CREATE_FILE.length + 1);
            createFile(filePath);
        }

        //delete a file
        //delete a file <path>
        if(command.includes(DELETE_FILE)){
            const filePath = command.substring(DELETE_FILE.length + 1)
            deleteFile(filePath);
        }

        //Rename a file
        //Rename the file <path> to <new-path>
        if(command.includes(RENAME_FILE)){
            const index = command.indexOf(" to ");
            const oldFilePath = command.substring(RENAME_FILE.length + 1, index);
            const newFilePath = command.substring(index + 4);

            renameFile(oldFilePath, newFilePath)
        }

        //add to file:
        // add to the file<path> this content: <content>
        if(command.includes(ADD_TO_FILE)){
            const index = command.indexOf(" this content: ");
            const filePath = command.substring(ADD_TO_FILE + 1, index);
            const content = command.substring(index + 15);

            addToFile(filePath, content);
        }
    });

    //this is for watcher for watching the files
    const watcher = fs.watch('./command.txt');
    for await(const event of watcher){
        if(event.eventType === "change"){
            commandFileHandler.emit("change");
        }
    }
})();