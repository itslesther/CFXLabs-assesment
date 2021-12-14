use anchor_lang::prelude::*;

declare_id!("68PkE6kyfbAw1K15ptDxne1NHY2a3CntkaWrmdmawDi1");

#[program]
pub mod cfx_labs_assesment {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        
        my_account.last_two_numbers = [0, 0];

        Ok(())
    }

    pub fn generate(ctx: Context<Generate>) -> ProgramResult {
        let my_account = &mut ctx.accounts.my_account;
        // my_account.data = data;

        msg!("Previous Fibonacci Number: {}", my_account.last_two_numbers[1]);

        let last_number = my_account.last_two_numbers[1];

        if last_number == 0 {
            my_account.last_two_numbers = [0, 1];
        } else {
            my_account.last_two_numbers[1] = my_account.last_two_numbers[1] + my_account.last_two_numbers[0];
            my_account.last_two_numbers[0] = last_number;
        }

        msg!("New Fibonacci Number: {}", my_account.last_two_numbers[1]);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 40)]
    pub my_account: Account<'info, Fibonacci>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Generate<'info> {
    #[account(mut)]
    pub my_account: Account<'info, Fibonacci>,
}


#[account]
pub struct Fibonacci {
    // pub data: u64,
    pub last_two_numbers: [u32; 2],
}


// WE DON'T USE THIS METHOD BECAUSE IT TAKES UP A LOT OF RESOURCES
// fn fibonacci(n: u32) -> u32 {
//     match n {
//         0 => 1,
//         1 => 1,
//         _ => fibonacci(n - 1) + fibonacci(n - 2),
//     }
// }
