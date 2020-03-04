import {Services} from "../services/singletonServiceFactory";


export async function checkReservedCertificates() {
    const pubKeyOFBDH = await Services.ReserveService.getBDHToCheck();
    const numToReserve = await Promise.all(
        pubKeyOFBDH.map(pubKey => {
            return Services.ReserveService.getNumberOfCertificateToReserve(pubKey)
                .then(num => [pubKey, num])
        })
    );

    numToReserve
        .forEach(d => {
            const [pubKey, num] = d;
            Services.ReserveService.triggerReservation(pubKey as string, num as number)
        })
}

export async function reserveCertificateFor(pubKey: string) {
    console.log("reserving for", pubKey)
    //const wallet = await Services.ArianeeService.getWallet();
    //   await wallet.methods.reserveCertificateId(undefined, pubKey);
}
