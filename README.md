# Data Logger
 This micro:bit extension is based on spark-fun gator:log extension https://github.com/sparkfun/pxt-gator-log. The extension was changed in the following points:
* functions added, to write CSV files to the SD card
* functions added, to write time and date columns automatically
* the hardware pins have been changed (see below)

The gator:log, which is an open source data logger based on the Serial OpenLog, can be used to write data to an SD card using a serial connection.

![SparkFun gator:log](https://raw.githubusercontent.com/sparkfun/pxt-gator-log/master/icon.png)  

## Usage (Software)
To use this package, go to https://makecode.microbit.org, click ``Add package`` and insert the following link to this repository: https://github.com/reifab/pxt-gator-log

## Usage (Hardware)
Connection:
| gator:log | micro:bit |
|-----------|-----------|
| 3V3       | 3V3       |
| GND       | GND       |
| RX        | P8        |
| TX        | P12       |
| RST       | P13       |

## Example: Basic Functionality Test
```blocks
gatorLog.beginWithCustomPins(SerialPin.P8, SerialPin.P12, DigitalPin.P13)
gatorLog.mkDirectory("testFolder")
gatorLog.chDirectory("testFolder")
gatorLog.openCSVFile("testFile")
gatorLog.writeRowWithTextToCSV(["Temperature - °C", "Pressure - Pa", "LightIntensity - Lux"], HeaderLine.YES)
for (let index = 0; index < 1000; index++) {
    gatorLog.writeRowWithNumbersToCSV([
    23,
    900,
    300
    ], HeaderLine.NO)
}


```

## Supported targets
* MicroBit V2.0
* for PXT/microbit
