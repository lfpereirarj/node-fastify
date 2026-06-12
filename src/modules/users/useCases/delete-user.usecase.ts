import type { UsersRepository } from "../repos/users.repository.js";

export class DeleteUserUseCase {
	constructor(private userRepository: UsersRepository) {}

	async execute(id: string) {
		const userExists = await this.userRepository.findById(id);
		if (!userExists) {
			throw new Error("User not found");
		}

		await this.userRepository.delete(id);

		return "User deleted!!";
	}
}
