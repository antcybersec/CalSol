use anchor_lang::prelude::*;
use crate::state::CalendarEvent;
use crate::errors::CalendarFiError;

#[derive(Accounts)]
pub struct UpdateEventStatus<'info> {
    pub owner: Signer<'info>,

    #[account(
        mut,
        constraint = calendar_event.owner == owner.key()
    )]
    pub calendar_event: Account<'info, CalendarEvent>,
}

pub fn handler(
    ctx: Context<UpdateEventStatus>,
    is_executed: bool,
) -> Result<()> {
    let calendar_event = &mut ctx.accounts.calendar_event;

    // Only allow marking as executed if not already executed
    if is_executed && calendar_event.is_executed {
        return Err(CalendarFiError::EventAlreadyExecuted.into());
    }

    calendar_event.is_executed = is_executed;

    Ok(())
}

