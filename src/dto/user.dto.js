export default class UserDTO {
    constructor(user) {
        this.first_name = user.first_name
        this.email = user.email
        this.age = user.age
        this.role = user.role
        this.id = user._id
    }
}