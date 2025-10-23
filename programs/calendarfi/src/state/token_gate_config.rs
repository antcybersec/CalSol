use anchor_lang::prelude::*;

#[account]
pub struct TokenGateConfig {
    pub event: Pubkey,
    pub required_token_mint: Pubkey,
    pub minimum_balance: u64,
    pub created_at: i64,
    pub bump: u8,
}

impl TokenGateConfig {
    pub const SPACE: usize = 8 + // discriminator
        32 + // event
        32 + // required_token_mint
        8 + // minimum_balance
        8 + // created_at
        1; // bump
}

