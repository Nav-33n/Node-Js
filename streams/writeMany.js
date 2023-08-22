// const fs = require('fs').promises;

// Execution Time: 1:20.11 (m:ss:mmm)
//CPU usage: 100% (one core)
//Memory Usage: 

// ( async ()=> {
//     console.time("writeMany")
//     const filePath = await fs.open('one-million.txt', 'w');

//     for (let index = 0; index < 1000000; index++) {
//         await filePath.write(` ${index} `)
//     }

//     console.timeEnd("writeMany")
// })();

// ---------------------------------------------------------------

// Execution Time: 24.11s
//CPU usage: 100% (one core)
//Memory Usage: 

// const fs = require('fs');

// (async ()=> {
//     console.time("writeMany");
//     fs.open("test.txt", "w", (err, fd) => {
//         for (let i = 0; i < 1000000; i++) {
//            fs.writeSync(fd, ` ${i} `) 
//         }

//         console.timeEnd("writeMany");
//     });
// })();

// ---------------------------------------------------------------

// Execution Time: 680.126ms
//CPU usage: 100% (one core)
//Memory Usage: 

//THIS IS NOT A BEST PRACTICE TO DO IT!!!

// const fs = require('fs').promises;

// (async ()=> {
//     console.time("writeMany");
//     const fileHandle = await fs.open("test.txt", "w");

//     const stream = fileHandle.createWriteStream();

//     for(let i = 0; i < 1000000; i++){
//         const buff = Buffer.from(` ${i} `, "utf-8");

//         //console.log(stream.writableBuffer)
//         //console.log(stream.writableHighWaterMark);
//         stream.write(buff);
//     }
//     console.timeEnd("writeMany");
// })();

const fs = require('fs').promises;

(async () => {
    console.time("writeMany");
    const fileHandle = await fs.open("test.txt", "w");

    const stream = fileHandle.createWriteStream();

    console.log(stream.writableHighWaterMark);

  //   const buff = Buffer.alloc(16383, "a");
  //   console.log(stream.write(buff));
  //   console.log(stream.write(Buffer.alloc(1, "a")));
  //   console.log(stream.write(Buffer.alloc(1, "a")));
  //   console.log(stream.write(Buffer.alloc(1, "a")));

  //   console.log(stream.writableLength);

  //   stream.on("drain", () => {
  //   console.log(stream.write(Buffer.alloc(16384, "a")));
  //   console.log(stream.writableLength);

  //   console.log("We are now safe to write more!");
  // });

  let i = 0;

  const numWrites = 1000000;

  const writeMany = () => {
    while (i < numWrites){
      const buff = Buffer.from(` ${i} `, "utf-8");

      // this is our last write
      if(i === numWrites - 1){
        return stream.end(buff);
      }

      // if stream.write return false, stop the loop
      if(!stream.write(buff)) break;

      i++;
    }
  };

  writeMany();

    // resume our loop once our stream's internal buffer is emptied
    stream.on("drain", () => {
      // console.log("Drained!!!");
      writeMany();
    });
  
    stream.on("finish", () => {
      console.timeEnd("writeMany");
      fileHandle.close();
    });
})();

