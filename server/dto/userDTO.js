export function mapDTO(users) {
  const usersDTO = users.map(user => createUserDTO(user));
  return usersDTO;
}

export function createUserDTO(user) {
  return {
    username: user.username,
    email: user.email,
    role: user.role,
    address: user.address,
  };
}
