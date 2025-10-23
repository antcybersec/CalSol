// Solana Anchor Program for Scheduled Payments
// This is a template for the CalendarFi smart contract

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("11111111111111111111111111111111");

#[program]
pub mod scheduled_payment {
    use super::*;

    // Initialize a scheduled payment
    pub fn initialize_payment(
        ctx: Context<InitializePayment>,
        amount: u64,
        scheduled_time: i64,
        recipient: Pubkey,
    ) -> Result<()> {
        let payment = &mut ctx.accounts.payment;
        payment.payer = ctx.accounts.payer.key();
        payment.recipient = recipient;
        payment.amount = amount;
        payment.scheduled_time = scheduled_time;
        payment.executed = false;
        payment.bump = ctx.bumps.payment;

        Ok(())
    }

    // Execute a scheduled payment
    pub fn execute_payment(ctx: Context<ExecutePayment>) -> Result<()> {
        let payment = &mut ctx.accounts.payment;

        // Check if payment is already executed
        require!(!payment.executed, PaymentError::AlreadyExecuted);

        // Check if scheduled time has passed
        let clock = Clock::get()?;
        require!(
            clock.unix_timestamp >= payment.scheduled_time,
            PaymentError::NotYetScheduled
        );

        // Transfer tokens
        let cpi_accounts = Transfer {
            from: ctx.accounts.from_token_account.to_account_info(),
            to: ctx.accounts.to_token_account.to_account_info(),
            authority: ctx.accounts.payer.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        token::transfer(cpi_ctx, payment.amount)?;

        // Mark as executed
        payment.executed = true;

        Ok(())
    }

    // Cancel a scheduled payment
    pub fn cancel_payment(ctx: Context<CancelPayment>) -> Result<()> {
        let payment = &mut ctx.accounts.payment;

        // Only payer can cancel
        require!(
            ctx.accounts.payer.key() == payment.payer,
            PaymentError::Unauthorized
        );

        // Cannot cancel if already executed
        require!(!payment.executed, PaymentError::AlreadyExecuted);

        // Mark as cancelled
        payment.executed = true;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePayment<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = 8 + 32 + 32 + 8 + 8 + 1 + 1,
        seeds = [b"payment", payer.key().as_ref()],
        bump
    )]
    pub payment: Account<'info, Payment>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecutePayment<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub payment: Account<'info, Payment>,

    #[account(mut)]
    pub from_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub to_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CancelPayment<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(mut)]
    pub payment: Account<'info, Payment>,
}

#[account]
pub struct Payment {
    pub payer: Pubkey,
    pub recipient: Pubkey,
    pub amount: u64,
    pub scheduled_time: i64,
    pub executed: bool,
    pub bump: u8,
}

#[error_code]
pub enum PaymentError {
    #[msg("Payment has already been executed")]
    AlreadyExecuted,

    #[msg("Scheduled time has not yet passed")]
    NotYetScheduled,

    #[msg("Unauthorized to perform this action")]
    Unauthorized,
}

