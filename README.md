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
input.onButtonPressed(Button.A, function () {
    basic.showIcon(IconNames.Sword)
    gatorLog.begin(
    2021,
    12,
    1,
    14,
    38,
    0
    )
    gatorLog.mkDirectory("UV-Messung")
    gatorLog.chDirectory("UV-Messung")
    gatorLog.openCSVFile("uv-messung")
    gatorLog.writeRowWithTextToCSV(["UV-Wert"], Header.JA)
    loggen = true
    basic.showIcon(IconNames.Yes)
    basic.clearScreen()
})
input.onButtonPressed(Button.B, function () {
    loggen = false
    power.lowPowerRequest()
})
let loggen = false
basic.showIcon(IconNames.Heart)
basic.clearScreen()
loggen = false
power.fullPowerOn(FullPowerSource.A)
power.fullPowerOn(FullPowerSource.B)
basic.forever(function () {
    while (loggen) {
        gatorLog.writeRowWithNumbersToCSV([pins.analogReadPin(AnalogPin.P0)], Header.NEIN)
        power.lowPowerPause(5000)
    }
})

```

## Supported targets
* MicroBit V2.0
* for PXT/microbit
