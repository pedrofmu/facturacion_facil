import { createSubjectData, getSubjectData } from "../src/infra/comunicate_db/manage_subject_data";

describe('manage subjects', () => {
    it("create subject", async () => {
        await createSubjectData(PersonType.J, "222222C", "Yolanda Muñoz", "Calle superfantastica", "01234", "Alcoy", "Alicante", "test@test.xyz", "current", "emisor");

        const test: Subject = await getSubjectData("222222C", "emisor");

        expect(test.name).toBe("Yolanda Muñoz");
    });
})
