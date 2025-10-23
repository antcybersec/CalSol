use anchor_lang::prelude::*;

#[error_code]
pub enum CalendarFiError {
    #[msg("Invalid scheduled time")]
    InvalidScheduledTime,

    #[msg("Event not found")]
    EventNotFound,

    #[msg("Unauthorized access")]
    UnauthorizedAccess,

    #[msg("Insufficient token balance")]
    InsufficientTokenBalance,

    #[msg("Token verification failed")]
    TokenVerificationFailed,

    #[msg("Event already executed")]
    EventAlreadyExecuted,

    #[msg("Invalid recipient")]
    InvalidRecipient,

    #[msg("Insufficient SOL balance")]
    InsufficientSolBalance,

    #[msg("Invalid token mint")]
    InvalidTokenMint,

    #[msg("String too long")]
    StringTooLong,
}

