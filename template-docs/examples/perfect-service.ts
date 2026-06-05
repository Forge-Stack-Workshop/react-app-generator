// EXAMPLE — canonical pattern, copy & adapt.
// A service: pure business logic, no framework/transport concerns.
export interface UserRepo {
  findById(id: string): Promise<{ id: string } | null>;
}

export class UserService {
  constructor(private readonly repo: UserRepo) {}

  async getUser(id: string) {
    const user = await this.repo.findById(id);
    if (!user) throw new Error("NotFound");
    return user;
  }
}
