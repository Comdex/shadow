
export default class BasicUtils {

  static genRandomString = (): string => {
    return '0xffeeaabb';
  }

  static hash = (name: string): any => {
    return name;
  }

  static generateKeypairs = (random?: string): any => {
    return { 'publicKey': 'abc_PublicKey_abc', 'privateKey': '123_PrivateKey_123' };
  }

  static encryptByPrivateKey = (txt: string, privateKey: string): any => {
    return txt
  }

  static decryptByPublicKey = (txt: string, publicKey: string): any => {
    return txt
  }

  /**
   *
   * @param nameHash0
   */
  static validateMerkleExistProof = (hashStr: string, existProof: string): any => {
    return true;
  }

  /**
   *
   * @param nameHash0
   */
  static validateMerkleNonExistProof = (hashStr: string, notExistProof: string): any => {
    return true;
  }


  static checkIfExistingName = (name0: string): any => {
    console.log('send to backend api to check if existing name...');
    // TODO send to backend api
    return name0 == 'mike.id';
  }

}



