gatorLog.beginWithCustomPins(SerialPin.P8, SerialPin.P12, DigitalPin.P13)
gatorLog.setDateAndTime(2021,12,2,14,34,1)
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

