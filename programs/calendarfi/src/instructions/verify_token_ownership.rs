use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;
use crate::state::TokenGateConfig;
use crate::errors::CalendarFiError;

#[derive(Accounts)]
pub struct VerifyTokenOwnership<'info> {
    pub user: Signer<'info>,

    #[account(
        constraint = token_account.owner == user.key(),
        constraint = token_account.mint == token_gate_config.required_token_mint
    )]
    pub token_account: Account<'info, TokenAccount>,

    pub token_gate_config: Account<'info, TokenGateConfig>,
}

pub fn handler(ctx: Context<VerifyTokenOwnership>) -> Result<bool> {
    let token_account = &ctx.accounts.token_account;
    let token_gate_config = &ctx.accounts.token_gate_config;

    // Check if user has minimum required balance
    if token_account.amount >= token_gate_config.minimum_balance {
        Ok(true)
    } else {
        Err(CalendarFiError::InsufficientTokenBalance.into())
    }
}

