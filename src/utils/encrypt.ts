import JsEncrypt from 'jsencrypt';

const ENCRYPT_PUBLIC_KEY =
	'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAES5S+kdbaxB1ayTVp4f2VIRcYEKZ+ff2X8RV7/JvG4CKiWQBR+SOjQCmUWZUDq64ZZXYuTnKwqNWK2P+gJvPwxKOA3IpWF4LComETSFfcE4e2nOLD4rRqjR/riwO4Wg7gBTQndVrJWZ+1HThoCLo/NATSdolreTbVvuAAdwu9wIDAQAB';

const RSAencrypt = (pas: string, publicKey: string = ENCRYPT_PUBLIC_KEY) => {
	//实例化jsEncrypt对象
	const jse = new JsEncrypt();
	//设置公钥
	jse.setPublicKey(publicKey);
	// console.log('加密：'+jse.encrypt(pas))
	return jse.encrypt(pas) || '';
};

const encryptTools = { RSAencrypt };

export default encryptTools;
