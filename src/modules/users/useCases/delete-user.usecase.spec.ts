import { strict as assert } from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { InMemoryUsersRepository } from "@/modules/users/repos/memory-users.repository.js";
import { DeleteUserUseCase } from "@/modules/users/useCases/delete-user.usecase.js";
import { AppError } from "@/shared/errors/app-error.js";

describe("Delete User UseCase", () => {
	let usersRepository: InMemoryUsersRepository;
	let sut: DeleteUserUseCase;

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new DeleteUserUseCase(usersRepository as any);
	});

	it("should be able to delete a user", async () => {
		const user = await usersRepository.create({
			name: "John Doe",
			email: "john@test.com",
			password: "123",
		});

		await sut.execute(user.id);

		assert.equal(usersRepository.items.length, 0);
	});

	it("should not be able to delete a non-existing user", async () => {
		await assert.rejects(
			async () => {
				await sut.execute("fake-id");
			},
			(error: Error) => {
				assert.ok(error instanceof AppError);
				assert.equal(error.statusCode, 404);
				return true;
			},
		);
	});
});
