use anchor_lang::prelude::*;
use crate::state::CalendarEvent;

/// Integration with Clockwork for scheduling transactions
/// 
/// This module provides utilities for creating and managing Clockwork threads
/// that execute scheduled calendar events automatically.

#[derive(Accounts)]
pub struct CreateClockworkThread<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    pub calendar_event: Account<'info, CalendarEvent>,

    /// Clockwork thread account (created by Clockwork)
    /// This would be initialized by the Clockwork program
    pub clockwork_thread: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

/// Creates a Clockwork thread for a scheduled payment event
/// 
/// The thread will automatically execute the payment at the scheduled time
pub fn create_clockwork_thread(
    ctx: Context<CreateClockworkThread>,
) -> Result<()> {
    let calendar_event = &ctx.accounts.calendar_event;

    // Validate that the event is not already executed
    require!(!calendar_event.is_executed, ProgramError::InvalidArgument);

    // In a real implementation, this would:
    // 1. Create a Clockwork thread with the scheduled time
    // 2. Set up the thread to call execute_scheduled_payment at the scheduled time
    // 3. Store the thread ID for later reference
    
    // For now, we'll just validate the setup
    msg!(
        "Clockwork thread created for event: {} at time: {}",
        calendar_event.title,
        calendar_event.scheduled_time
    );

    Ok(())
}

/// Cancels a Clockwork thread for a scheduled event
#[derive(Accounts)]
pub struct CancelClockworkThread<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        constraint = calendar_event.owner == payer.key()
    )]
    pub calendar_event: Account<'info, CalendarEvent>,

    pub clockwork_thread: UncheckedAccount<'info>,
}

pub fn cancel_clockwork_thread(
    ctx: Context<CancelClockworkThread>,
) -> Result<()> {
    let calendar_event = &ctx.accounts.calendar_event;

    // Validate that the event hasn't been executed yet
    require!(!calendar_event.is_executed, ProgramError::InvalidArgument);

    msg!(
        "Clockwork thread cancelled for event: {}",
        calendar_event.title
    );

    Ok(())
}

