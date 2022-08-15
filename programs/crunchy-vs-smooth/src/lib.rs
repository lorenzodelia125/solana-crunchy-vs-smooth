use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

// serve ad impostare l'address del program
declare_id!("3EAMBn9y34UdRNasRhuHNCGGD5Cdzyd79w5t1jBxRJeK");

// le macro astraggono un sacco di codice di basso livello semplificando
// la vita degli sviluppatori.

// la macro #[program] consente di definire la logica del program
// all'interno del modulo a cui è applicata e fare in moo che le
// funzioni vengano automaticamente riconosciute dal client come endpoint rpc
#[program]
pub mod crunchy_vs_smooth {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, bump: u8) -> ProgramResult {
        ctx.accounts.vote_account.bump = bump;
        Ok(())
    }

    pub fn vote_crunchy(ctx: Context<Vote>) -> ProgramResult {
        ctx.accounts.vote_account.crunchy += 1;
        Ok(())
    }

    pub fn vote_smooth(ctx: Context<Vote>) -> ProgramResult {
        ctx.accounts.vote_account.smooth += 1;
        Ok(())
    }
}

// la macro #[derive(Accounts)] serve a poter specificare in uno struct tutti
// gli account necessari per l'esecuzione di un'istruzione (con tanto di
// opzioni per effettuare una corretta validazione) e affida ad Anchor
// il compito di serializzare e deserializzare tutti i dati che transitano
#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct Initialize<'info> {
    #[account(init, payer = user, seeds = [b"vote_account".as_ref()], bump, space = 16 + 16)]
    pub vote_account: Account<'info, VotingState>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Vote<'info> {
    #[account(mut, seeds = [b"vote_account".as_ref()], bump)]
    pub vote_account: Account<'info, VotingState>,
}

#[account]
#[derive(Default)]
pub struct VotingState {
    pub bump: u8,
    pub crunchy: u64,
    pub smooth: u64,
}
