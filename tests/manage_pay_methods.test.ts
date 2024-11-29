import { createPayMethod, getAllPayMethodTypes } from "../src/infra/comunicate_db/manage_pay_methods";

describe('manage pay methods', () => {
    it("create pay method", async () => {
        await createPayMethod("current", "efectivo", 'IBAN,fecha vencimiento');

        const test: payMethodType = (await getAllPayMethodTypes("current"))[0];

        expect(test.extraData.split(",")[0]).toBe("IBAN");
    });
})
