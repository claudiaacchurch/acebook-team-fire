const Comment = require("../../lib/comment");

describe("Comment", () => {
    describe("creates", () => {
        test("with the correct properties", () => {
            const comment = new Comment("Test comment text");
            expect(comment.text).toEqual("Test comment text");
        })
    })
})