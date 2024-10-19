import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://devnet.irys.xyz/5jeemZX36acSXUtXTMAdVMiFgU86GRfzmsiEdvRMZdfh";
        const metadata = {
            name: "Rugged by jeff's beard",
            symbol: "legendary rugg",
            description: "dont get lost in there...",
            image: image,
            attributes: [
                {trait_type: 'color', value: 'white'},
                {trait_type: 'what she said ??', value: 'its long'},
                {trait_type: 'rarity', value: '100%'},                
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: [keypair.publicKey]
        };
        const myUri = await umi.uploader.uploadJson(metadata); //https://devnet.irys.xyz/4Hy7RopWSG4LehQMAiV4zBqHtLntBH2P2cP54cyijZkK
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
