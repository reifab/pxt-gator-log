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

