use anchor_lang::prelude::*;
use crate::state::CalendarEvent;
use crate::errors::CalendarFiError;

#[derive(Accounts)]
#[instruction(title: String, description: String)]
pub struct CreateScheduledPayment<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = CalendarEvent::SPACE,
        seeds = [b"calendar_event", payer.key().as_ref(), &[0]],
        bump
    )]
    pub calendar_event: Account<'info, CalendarEvent>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateScheduledPayment>,
    title: String,
    description: String,
    scheduled_time: i64,
    amount: u64,
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
    require!(
        scheduled_time > Clock::get()?.unix_timestamp,
        CalendarFiError::InvalidScheduledTime
    );

    let calendar_event = &mut ctx.accounts.calendar_event;
    calendar_event.owner = ctx.accounts.payer.key();
    calendar_event.title = title;
    calendar_event.description = description;
    calendar_event.scheduled_time = scheduled_time;
    calendar_event.amount = amount;
    calendar_event.recipient = ctx.accounts.payer.key();
    calendar_event.token_mint = None;
    calendar_event.is_executed = false;
    calendar_event.created_at = Clock::get()?.unix_timestamp;
    calendar_event.bump = ctx.bumps.calendar_event;

    Ok(())
}

