use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::state::CalendarEvent;
use crate::errors::CalendarFiError;

#[derive(Accounts)]
pub struct ExecuteScheduledPayment<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mut,
        constraint = calendar_event.owner == payer.key(),
        constraint = !calendar_event.is_executed
    )]
    pub calendar_event: Account<'info, CalendarEvent>,

    #[account(mut)]
    pub recipient: SystemAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ExecuteScheduledPayment>) -> Result<()> {
    let calendar_event = &mut ctx.accounts.calendar_event;
    let current_time = Clock::get()?.unix_timestamp;

    // Check if scheduled time has passed
    require!(
        current_time >= calendar_event.scheduled_time,
        CalendarFiError::InvalidScheduledTime
    );

    // Check if already executed
    require!(
        !calendar_event.is_executed,
        CalendarFiError::EventAlreadyExecuted
    );

    // Check if payer has sufficient balance
    require!(
        ctx.accounts.payer.lamports() >= calendar_event.amount,
        CalendarFiError::InsufficientSolBalance
    );

    // Transfer SOL from payer to recipient
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.payer.to_account_info(),
                to: ctx.accounts.recipient.to_account_info(),
            },
        ),
        calendar_event.amount,
    )?;

    // Mark as executed
    calendar_event.is_executed = true;

    Ok(())
}

