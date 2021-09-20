export interface Strategy {
    chainId:string,
    name:string,
    address:string,
    params: {
        [key: string]: string
    }
}
