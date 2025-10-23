import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Calendarfi } from "../target/types/calendarfi";
import { expect } from "chai";

describe("CalendarFi", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Calendarfi as Program<Calendarfi>;

  let calendarEventPda: anchor.web3.PublicKey;
  let calendarEventBump: number;

  before(async () => {
    // Derive PDA for calendar event
    [calendarEventPda, calendarEventBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("calendar_event"), provider.wallet.publicKey.toBuffer(), Buffer.from([0])],
      program.programId
    );
  });

  describe("Create Scheduled Payment", () => {
    it("should create a scheduled payment event", async () => {
      const title = "Test Payment";
      const description = "Test payment description";
      const scheduledTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const amount = new anchor.BN(1000000); // 0.001 SOL

      await program.methods
        .createScheduledPayment(title, description, new anchor.BN(scheduledTime), amount)
        .accounts({
          payer: provider.wallet.publicKey,
          calendarEvent: calendarEventPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // Fetch and verify the created event
      const event = await program.account.calendarEvent.fetch(calendarEventPda);
      expect(event.title).to.equal(title);
      expect(event.description).to.equal(description);
      expect(event.amount.toNumber()).to.equal(amount.toNumber());
      expect(event.isExecuted).to.be.false;
    });

    it("should fail with invalid scheduled time", async () => {
      const title = "Invalid Time Payment";
      const description = "Test";
      const scheduledTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
      const amount = new anchor.BN(1000000);

      try {
        await program.methods
          .createScheduledPayment(title, description, new anchor.BN(scheduledTime), amount)
          .accounts({
            payer: provider.wallet.publicKey,
            calendarEvent: calendarEventPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("InvalidScheduledTime");
      }
    });

    it("should fail with string too long", async () => {
      const title = "a".repeat(101); // Exceeds max length
      const description = "Test";
      const scheduledTime = Math.floor(Date.now() / 1000) + 3600;
      const amount = new anchor.BN(1000000);

      try {
        await program.methods
          .createScheduledPayment(title, description, new anchor.BN(scheduledTime), amount)
          .accounts({
            payer: provider.wallet.publicKey,
            calendarEvent: calendarEventPda,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("StringTooLong");
      }
    });
  });

  describe("Update Event Status", () => {
    it("should update event status", async () => {
      await program.methods
        .updateEventStatus(true)
        .accounts({
          owner: provider.wallet.publicKey,
          calendarEvent: calendarEventPda,
        })
        .rpc();

      const event = await program.account.calendarEvent.fetch(calendarEventPda);
      expect(event.isExecuted).to.be.true;
    });

    it("should fail when marking already executed event", async () => {
      try {
        await program.methods
          .updateEventStatus(true)
          .accounts({
            owner: provider.wallet.publicKey,
            calendarEvent: calendarEventPda,
          })
          .rpc();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error.message).to.include("EventAlreadyExecuted");
      }
    });
  });
});

