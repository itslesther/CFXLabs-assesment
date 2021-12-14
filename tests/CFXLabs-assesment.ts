import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { CfxLabsAssesment } from '../target/types/cfx_labs_assesment';
import assert from 'assert';
const { SystemProgram } = anchor.web3;


describe('CFXLabs-assesment', () => {
  //WE NEED TO SET THE ENV VAR ANCHOR_WALLET=~/.config/solana/id.json
  const provider = anchor.Provider.local();
  anchor.setProvider(provider);

  const myAccount = anchor.web3.Keypair.generate();
  
  const program = (anchor as any).workspace.CfxLabsAssesment as Program<CfxLabsAssesment>;
  console.log('programId:', program.programId.toBase58());

  let sequence: number[] = [];

  it('Is initialized!', async () => {
    const tx = await program.rpc.initialize({
      accounts: {
        myAccount: myAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [myAccount]
    });

    const account = await program.account.fibonacci.fetch(myAccount.publicKey);

    const fibonacciNumber: number = account.lastTwoNumbers[1];
    console.log(`First Fibonacci Number: ${fibonacciNumber}`);

    sequence.push(fibonacciNumber);

    assert.deepEqual(sequence, fibonacci(1));
  });

  const numbersToGenerate = 5;
  it(`Generates ${numbersToGenerate} more Fibonacci numbers`, async () => {

    async function generateAndRead() {
      const tx = await program.rpc.generate({
        accounts: {
          myAccount: myAccount.publicKey,
        }
      });
  
      const account = await program.account.fibonacci.fetch(myAccount.publicKey);
  
      const fibonacciNumber: number = account.lastTwoNumbers[1];
      console.log(`New Fibonacci Number: ${fibonacciNumber}`);

      sequence.push(fibonacciNumber);

      console.log(`Sequence: ${sequence}`);
    }

    for(let i = 0; i < numbersToGenerate; i++) {
      await generateAndRead();
    }

    assert.deepEqual(sequence, fibonacci(numbersToGenerate + 1));
  });
});



function fibonacci (n: number) {
  const fib: number[] = []; // Initialize array!

  if(n === 1) return [0];

  fib[0] = 0;
  fib[1] = 1;
  for (let i = 2; i < n; i++) {
    // Next fibonacci number = previous + one before previous
    // Translated to JavaScript:
    fib[i] = fib[i - 2] + fib[i - 1];
  }

  return fib;
}