use anchor_lang::prelude::*;
use crate::state::{CalendarEvent, TokenGateConfig};
use crate::errors::CalendarFiError;

#[derive(Accounts)]
#[instruction(title: String, description: String)]
pub struct CreateTokenGatedEvent<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = CalendarEvent::SPACE,
        seeds = [b"calendar_event", payer.key().as_ref(), &[1]],
        bump
    )]
    pub calendar_event: Account<'info, CalendarEvent>,

    #[account(
        init,
        payer = payer,
        space = TokenGateConfig::SPACE,
        seeds = [b"token_gate", calendar_event.key().as_ref()],
        bump
    )]
    pub token_gate_config: Account<'info, TokenGateConfig>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateTokenGatedEvent>,
    title: String,
    description: String,
    required_token_mint: Pubkey,
    minimum_balance: u64,
) -> Result<()> {
    // Validate inputs
    require!(
        title.len() <= CalendarEvent::MAX_TITLE_LENGTH,
        CalendarFiError::StringTooLong
    );
    require!(
        description.len() <= CalendarEvent::MAX_DESCRIPTION_LENGTH,
        CalendarFiError::StringTooLong
    );

    let calendar_event = &mut ctx.accounts.calendar_event;
    calendar_event.owner = ctx.accounts.payer.key();
    calendar_event.title = title;
    calendar_event.description = description;
    calendar_event.scheduled_time = 0;
    calendar_event.amount = 0;
    calendar_event.recipient = ctx.accounts.payer.key();
    calendar_event.token_mint = Some(required_token_mint);
    calendar_event.is_executed = false;
    calendar_event.created_at = Clock::get()?.unix_timestamp;
    calendar_event.bump = ctx.bumps.calendar_event;

    let token_gate_config = &mut ctx.accounts.token_gate_config;
    token_gate_config.event = calendar_event.key();
    token_gate_config.required_token_mint = required_token_mint;
    token_gate_config.minimum_balance = minimum_balance;
    token_gate_config.created_at = Clock::get()?.unix_timestamp;
    token_gate_config.bump = ctx.bumps.token_gate_config;

    Ok(())
}

