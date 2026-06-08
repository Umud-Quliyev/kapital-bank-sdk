import {
    KapitalBank,
    KapitalBankError,
  } from "../src";
  
  const kb = new KapitalBank({
    username: "TerminalSys/kapital",
    password: "kapital123",
    environment: "test",
  });
  
  async function main() {
    try {
      const order = await kb.createOrder({
        typeRid: "Order_REC",
        amount: "1",
        currency: "AZN",
        language: "az",
        description: "Error Test",
      });
  
      await kb.setSourceToken(
        order.id,
        order.password,
        {
          initiationEnvKind: "Server",
          storedId: 5125,
        }
      );
  
      await kb.executeTransaction(
        order.id,
        {
          phase: "Single",
          conditions: {
            cofUsage: "Recurring",
          },
        }
      );
    } catch (error) {
      if (
        error instanceof KapitalBankError
      ) {
        console.log("Message:", error.message);
        console.log("Code:", error.code);
  
        console.log(
          "isDeclined:",
          error.isDeclined()
        );
  
        console.log(
          "isInvalidToken:",
          error.isInvalidToken()
        );
  
        console.log(
          "isInvalidOrderState:",
          error.isInvalidOrderState()
        );
      }
    }
  }
  
  main().catch(console.error);