import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert } from "chai";
import { CrunchyVsSmooth } from "../target/types/crunchy_vs_smooth";

describe("crunchy-vs-smooth", () => {
  // provider astrae una connessione rpc a solana:
  // ha l'attributo connection con relativi metodi forniti dalla rete tramite rpc
  // e simula un wallet (ha l'attributo wallet)
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // program è un'astrazione che combina il provider, l'idl e il program id
  // del program appena creato. In pratica è come se venisse fatto il deploy
  // del program sulla rete Solana e fossero disponibili le istruzioni per
  // interagire con esso tramite rpc
  const program = anchor.workspace.CrunchyVsSmooth as Program<CrunchyVsSmooth>;

  // provider e program esistono solo in ambiente di test per consentire all'utente
  // di concentrarsi sul test del program senza perdere tempo a fare ulteriori
  // configurazioni inutili

  const voteAccount = anchor.web3.Keypair.generate();

  it("Initializes with 0 votes for crunchy and smooth", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize()
      .accounts({
        voteAccount: voteAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([voteAccount])
      .rpc();
    console.log("Your transaction signature", tx);

    const account = await program.account.voteAccount.fetch(
      voteAccount.publicKey
    );

    console.log("Crunchy: ", account.crunchy.toString());
    console.log("Smooth: ", account.smooth.toString());
    assert.ok(
      account.crunchy.toString() == "0" && account.smooth.toString() == "0"
    );
  });

  it("Votes correctly for crunches", async () => {
    console.log("Testing voteCrunchy...");

    const tx = await program.methods
      .voteCrunchy()
      .accounts({
        voteAccount: voteAccount.publicKey,
      })
      .rpc();
    console.log("Your transaction signature", tx);

    const account = await program.account.voteAccount.fetch(
      voteAccount.publicKey
    );

    console.log("Crunchy: ", account.crunchy.toString());
    console.log("Smooth: ", account.smooth.toString());
    assert.ok(
      account.crunchy.toString() == "1" && account.smooth.toString() == "0"
    );
  });

  it("Votes correctly for smooth", async () => {
    console.log("Testing voteSmooth...");

    const tx = await program.methods
      .voteSmooth()
      .accounts({
        voteAccount: voteAccount.publicKey,
      })
      .rpc();
    console.log("Your transaction signature", tx);

    const account = await program.account.voteAccount.fetch(
      voteAccount.publicKey
    );

    console.log("Crunchy: ", account.crunchy.toString());
    console.log("Smooth: ", account.smooth.toString());
    assert.ok(
      account.crunchy.toString() == "1" && account.smooth.toString() == "1"
    );
  });
});
