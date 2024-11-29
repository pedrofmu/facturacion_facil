import { createSubjectData, getSubjectData } from "../src/infra/comunicate_db/manage_subject_data";

describe('manage subjects', () => {
    it("create subject", async () => {
        await createSubjectData("Aromaterapia SL", PersonType.L, "222222C", "Yolanda Muñoz", "Calle superfantastica", "01234", "Alcoy", "Alicante", "test@test.xyz", "current", "emisor");

        const test: subject = await getSubjectData("222222C", "emisor");

        expect(test.name).toBe("Yolanda Muñoz");
    });
})
