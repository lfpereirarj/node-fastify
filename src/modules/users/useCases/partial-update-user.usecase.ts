import type { UsersRepository } from "@/modules/users/repos/users.repository.js";
import { AppError } from "@/shared/errors/app-error.js";

interface PartialUpdateUserRequest {
	id: string;
	name?: string;
	email?: string;
	password?: string;
}

export class PartialUpdateUserUseCase {
	constructor(private userRepository: UsersRepository) {}

	async execute(data: PartialUpdateUserRequest) {
		const { id, ...user } = data;
		const userExists = await this.userRepository.findById(id);

		if (!userExists) {
			throw new AppError("User not found", 404);
		}

		if (user?.password) {
			user.password = `${user.password}_hashed`;
		}

		const partialUpdateUser = await this.userRepository.update(id, { ...user });

		return partialUpdateUser;
	}
}
