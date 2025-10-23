use anchor_lang::prelude::*;

#[account]
pub struct CalendarEvent {
    pub owner: Pubkey,
    pub title: String,
    pub description: String,
    pub scheduled_time: i64,
    pub amount: u64,
    pub recipient: Pubkey,
    pub token_mint: Option<Pubkey>,
    pub is_executed: bool,
    pub created_at: i64,
    pub bump: u8,
}

impl CalendarEvent {
    pub const MAX_TITLE_LENGTH: usize = 100;
    pub const MAX_DESCRIPTION_LENGTH: usize = 500;
    pub const SPACE: usize = 8 + // discriminator
        32 + // owner
        4 + Self::MAX_TITLE_LENGTH + // title
        4 + Self::MAX_DESCRIPTION_LENGTH + // description
        8 + // scheduled_time
        8 + // amount
        32 + // recipient
        1 + 32 + // token_mint (Option)
        1 + // is_executed
        8 + // created_at
        1; // bump
}

