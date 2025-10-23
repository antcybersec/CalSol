use anchor_lang::prelude::*;

pub mod instructions;
pub mod state;
pub mod errors;

use instructions::*;

declare_id!("CalendarFiProgramIDPlaceholder");

#[program]
pub mod calendarfi {
    use super::*;

    /// Create a new scheduled payment event
    pub fn create_scheduled_payment(
        ctx: Context<CreateScheduledPayment>,
        title: String,
        description: String,
        scheduled_time: i64,
        amount: u64,
    ) -> Result<()> {
        instructions::create_scheduled_payment::handler(
            ctx,
            title,
            description,
            scheduled_time,
            amount,
        )
    }

    /// Create a token-gated calendar event
    pub fn create_token_gated_event(
        ctx: Context<CreateTokenGatedEvent>,
        title: String,
        description: String,
        required_token_mint: Pubkey,
        minimum_balance: u64,
    ) -> Result<()> {
        instructions::create_token_gated_event::handler(
            ctx,
            title,
            description,
            required_token_mint,
            minimum_balance,
        )
    }

    /// Verify if user owns required token
    pub fn verify_token_ownership(
        ctx: Context<VerifyTokenOwnership>,
    ) -> Result<bool> {
        instructions::verify_token_ownership::handler(ctx)
    }

    /// Execute a scheduled payment
    pub fn execute_scheduled_payment(
        ctx: Context<ExecuteScheduledPayment>,
    ) -> Result<()> {
        instructions::execute_scheduled_payment::handler(ctx)
    }

    /// Update event status
    pub fn update_event_status(
        ctx: Context<UpdateEventStatus>,
        is_executed: bool,
    ) -> Result<()> {
        instructions::update_event_status::handler(ctx, is_executed)
    }
}

