import type { UsersRepository } from "@/modules/users/repos/users.repository.js";
import { AppError } from "@/shared/errors/app-error.js";

export class DeleteUserUseCase {
	constructor(private userRepository: UsersRepository) {}

	async execute(id: string) {
		const userExists = await this.userRepository.findById(id);
		if (!userExists) {
			throw new AppError("User not found", 404);
		}

		await this.userRepository.delete(id);

		return "User deleted!!";
	}
}
