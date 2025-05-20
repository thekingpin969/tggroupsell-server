function getPrice(date: number): number {
    const jan2022 = 1640995200;
    const jan2021 = 1609459200;
    const jan2020 = 1577836800;
    const jan2019 = 1546300800;

    const dec2022 = 1672511399;
    const dec2021 = 1640975399;
    const dec2020 = 1609439399;
    const dec2019 = 1577816999;

    switch (true) {
        case (date >= jan2021 && date < dec2022):
            return 235;
        case (date >= jan2020 && date < dec2020):
            return 280;
        case (date >= jan2019 && date < dec2019):
            return 330;
        case (date < jan2019):
            return 400;
        default:
            return 0;
    }
}

export default getPrice;