const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message) => {
    const dateTime = `${format(new Date(), 'yyyy/MM/dd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if(!fs.existsSync(path.join(__dirname, 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, 'logs'));
        }
        //testing save
        await fsPromises.appendFile(path.join(__dirname, 'logs', 'eventLog.txt'), logItem);
    } catch (err) {
        console.log(err);
    }
}

// console.log(format(new Date(), 'yyyyMMdd\tHH:mm:ss'))

// console.log(uuid())

/* 
    to install npm to the file use npm init command.
    look more about npm packages command and learn basic command of it such as install the package, rm the package, update the package, etc.

*/

module.exports = logEvents;

