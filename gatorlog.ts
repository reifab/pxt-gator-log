/**
* Andy England @ SparkFun Electronics
* September 6, 2018
* Development environment specifics:
* Written in Microsoft Makecode
* Tested with a SparkFun gatorlog sensor and micro:bit
*
* This code is released under the [MIT License](http://opensource.org/licenses/MIT).
* Please review the LICENSE.md file included with this example. If you have any questions
* or concerns with licensing, please contact techsupport@sparkfun.com.
* Distributed as-is; no warranty is given.
*/


/**
 * Functions to operate the gatorlog sensor
 */

enum ReturnDataType {
    Ascii = 1,
    Hexadecimal = 2,
    Raw = 3
}

enum HeaderLine {
    YES = 1,
    NO = 0,
}

//% color=#f44242 
//% icon="\uf0ce"
//% groups=['init', 'basic' ,'textfile', 'csv']
namespace gatorLog {
    // Functions for reading Particle from the gatorlog in Particle or straight adv value

    let commandMode = 0
    let currentFile = ""
    let carriageReturn = String.fromCharCode(13)
    let newLine = String.fromCharCode(10)
    let commandReady = ">"
    let writeReady = "<"
    let rowCounter = 0

    //The only reason we have this function is so we don't set currentFile to DELETEME.txt
    function dummyFile() {
        command()
        serial.writeString("append DELETEME.txt" + carriageReturn)
        serial.readUntil(writeReady)
        basic.pause(20)
        commandMode = 0;
        removeItem("DELETEME.txt")
        return
    }

    function command() {
        if (commandMode == 0) {
            serial.writeString(String.fromCharCode(26) + String.fromCharCode(26) + String.fromCharCode(26))
            serial.readUntil(commandReady)
            basic.pause(20)
            commandMode = 1
        }
        return
    }

    /**
    * Initializes gator:log and waits until it says it is ready to be written to.
    */
    //% weight=50 
    //% blockId="gatorLog_begin" 
    //% block="initialize gator:log"
    //% group="init"
    export function begin() {
        basic.pause(2500)
        serial.redirect(SerialPin.P15, SerialPin.P14, BaudRate.BaudRate9600)
        pins.digitalWritePin(DigitalPin.P13, 1)
        basic.pause(100)
        pins.digitalWritePin(DigitalPin.P13, 0)
        basic.pause(100)
        pins.digitalWritePin(DigitalPin.P13, 1)
        serial.readUntil(writeReady)
        basic.pause(20)
        dummyFile()
        return
    }

    /**
    * Opens the file with the name provided (don't forget to provide an extension). If the file does not exist, it is created.
    */
    //% weight=49
    //% blockId="gatorLog_openFile"
    //% block="open file named %value"
    //% group="textfile"
    export function openFile(value: string) {
        command()
        serial.writeString("append " + value + carriageReturn)
        serial.readUntil(writeReady)
        basic.pause(20)
        currentFile = value
        commandMode = 0;
        return
    }

    /**
    * Removes the file with the provided name
    */
    //% weight=48
    //% blockId="gatorLog_removeItem"
    //% block="remove file %value"
    //% group="basic"
    export function removeItem(value: string) {
        command()
        serial.writeString("rm " + value + carriageReturn)
        serial.readUntil(commandReady)
        basic.pause(20)
        return
    }

    /**
    * Creates a folder. Note that this block does not open the folder that it creates
    */
    //% weight=47
    //% blockId="gatorLog_mkDirectory"
    //% block="create folder with name %value"
    //% group="basic"
    export function mkDirectory(value: string) {
        command()
        serial.writeString("md " + value + carriageReturn)
        serial.readUntil(commandReady)
        basic.pause(20)
        return
    }

    /**
    * Opens a folder. Note that the folder must already exist on your SD card. To go back to the root/home folder, use "Change to '..' folder"
    */
    //% weight=46
    //% blockId="gatorLog_chDirectory"
    //% block="change to %value | folder"
    //% group="basic"
    export function chDirectory(value: string) {
        command()
        serial.writeString("cd " + value + carriageReturn)
        serial.readUntil(commandReady)
        basic.pause(20)
        return
    }

    /**
    * Removes a folder
    */
    //% weight=45
    //% blockId="gatorLog_removeDir"
    //% block="remove folder %value | and it's contents"
    //% group="basic"
    export function removeDir(value: string) {
        command()
        serial.writeString("rm -rf " + value + carriageReturn)
        serial.readUntil(commandReady)
        basic.pause(20)
        return
    }

    /**
    * Writes a line of text to the current open file. If no file has been opened, this will be recorded to the LOGxxxx.txt folder
    */
    //% blockId="gatorLog_writeLine"
    //% weight=44
    //% block="write line %value | to current file"
    //% group="textfile"
    export function writeLine(value: string) {
        if (commandMode == 1) {
            serial.writeString("append " + currentFile + carriageReturn)
            serial.readUntil(writeReady)
            basic.pause(20)
        }
        serial.writeString(value + carriageReturn + newLine)
        commandMode = 0
        basic.pause(20)
        return
    }

    /**
    * Writes text to the current open file. If no file has been opened, this will be recorded to the LOGxxxx.txt folder
    */
    //% blockId="gatorLog_writeText"
    //% weight=43
    //% block="write %value | to current file"
    //% group="textfile"
    export function writeText(value: string) {
        if (commandMode == 1) {
            serial.writeString("append " + currentFile + carriageReturn)
            serial.readUntil(writeReady)
            basic.pause(20)
        }
        serial.writeString(value)
        commandMode = 0
        basic.pause(20)
        return
    }

    /**
    * Writes text to the current open file at the position specified. If no file has been opened, this will be recorded to the LOGxxxx.txt folder
    */
    //% weight=42
    //% blockId="gatorLog_writeLineOffset"
    //% block="write line %value | at position %offset"
    //% advanced=true
    export function writeLineOffset(value: string, offset: number) {
        command()
        serial.writeString("write " + currentFile + " " + offset.toString() + carriageReturn)
        serial.readUntil(writeReady)
        basic.pause(20)
        serial.writeString(value + carriageReturn + newLine)
        serial.readUntil(writeReady)
        basic.pause(20)
        serial.writeString(carriageReturn + newLine)
        serial.readUntil(commandReady)
        basic.pause(20)
        return
    }

    function writeRowToCSVTypeAny(values: any[], isHeader: HeaderLine) {
        let row = []

        for (let element of values) {
            if (typeof element == 'string') {
                row.push(element)
            } else {
                row.push(convertToText(element));
            }
        }

        if (commandMode == 1) {
            serial.writeString("append " + currentFile + carriageReturn)
            serial.readUntil(writeReady)
            basic.pause(20)
        }
        if (isHeader == HeaderLine.YES) {
            row.insertAt(0, "Zeilenzähler ab Start");
            row.insertAt(1, "Datum");
            row.insertAt(2, "Uhrzeit");
        } else {
            let time
            let date
            date = timeanddate.date(timeanddate.DateFormat.YYYY_MM_DD)
            time = timeanddate.time(timeanddate.TimeFormat.HHMMSS24hr)
            time = time.replace(".", ":")
            row.insertAt(0, rowCounter.toString());
            row.insertAt(1, date);
            row.insertAt(2, time);
            rowCounter = rowCounter + 1;
        }
        serial.writeString(row.join(";") + carriageReturn + newLine)
        commandMode = 0
        basic.pause(20)
        return
    }

    /**
      * Opens a CSV File with the name provided (the extension .csv will be added automatically). If the file does not exist, it is created.
      */
    //% weight=49
    //% blockId="gatorLog_openCSVFile"
    //% block="open csv file named %value"
    //% group="csv"
    export function openCSVFile(value: string) {
        value = value + ".csv";
        openFile(value);
        return;
    }

    /**
    * Writes a row to the current open CSV file with the actual date and time. If no file has been opened, this will be recorded to the LOGxxxx.txt folder
    */
    //% blockId="gatorLog_writeRowWithTextToCSV"
    //% weight=42
    //% block="write one row with columns %values | to current csv file. Is Header %isHeader"
    //% isHeader.defl=Header.YES
    //% group="csv"
    export function writeRowWithTextToCSV(values: string[], isHeader: HeaderLine) {
        writeRowToCSVTypeAny(values, isHeader);
        return;
    }

    /**
    * Writes a row to the current open CSV file with the actual date and time. If no file has been opened, this will be recorded to the LOGxxxx.txt folder
    */
    //% blockId="gatorLog_writeRowWithNumbersToCSV"
    //% weight=41
    //% block="write one row with columns %values | to current csv file. Is Header %isHeader"
    //% isHeader.defl=Header.NO
    //% group="csv"
    export function writeRowWithNumbersToCSV(values: number[], isHeader: HeaderLine) {
        writeRowToCSVTypeAny(values, isHeader);
        return
    }
}