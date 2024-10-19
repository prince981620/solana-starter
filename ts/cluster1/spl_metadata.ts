import wallet from "../wba-wallet.json"
import bs58 from "bs58";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";

// Define our Mint address
const mint = publicKey("LeB8ocXrkrRSP1xFevFTGB8j6rRcxhwyzZMTaPKGnX8")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint: mint,
            mintAuthority: signer,
        }

        let data: DataV2Args = {
            name: "Prince Token part2",
            symbol: "TEST2",
            uri: "",
            sellerFeeBasisPoints: 600,
            creators: null,
            collection: null,
            uses: null,
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data:data,
            isMutable:false,
            collectionDetails:null
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi); // 2PRcyuaULTuhXzw7rbxVUMDACVpTNDyiUz2U2wL2FHCKPppAJMRZSQR6BPuUtT88cFYSdoj57m8UkfvgBz5JsMt7
        console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
