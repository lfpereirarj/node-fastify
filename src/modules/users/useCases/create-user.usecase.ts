import type { UsersRepository } from "../repos/users.repository";

interface CreateUserRequest {
	name: string;
	email: string;
	password: string;
}

export class CreateUserUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute(data: CreateUserRequest) {
		const { name, email, password } = data;
		const userAlreadyExists = await this.usersRepository.findByEmail(email);

		if (userAlreadyExists) {
			throw new Error("E-mail already exists");
		}

		const hashedPassword = `${password}_hashed`;

		const user = await this.usersRepository.create({
			name,
			email,
			password: hashedPassword,
		});

		return user;
	}
}
