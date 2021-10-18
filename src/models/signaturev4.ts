export interface Signaturev4{
  domain:SignatureDomain,
  message: SignatureMessage,
  primaryType:string,
  types:any
}

export interface SignatureDomain{
  chainId: string,
  name: string,
  verifyingContract?:string,
  version?:string
}

export interface SignatureMessage{
  [key:string]: any
}
