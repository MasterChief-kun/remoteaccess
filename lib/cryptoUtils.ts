import bcrypt from "bcryptjs"

export async function saltAndHashPwd(pwd : string) {
    var hashedPwd : string;

    let salt = await bcrypt.genSalt(10);

    hashedPwd = await bcrypt.hash(pwd, salt);

    return hashedPwd;
}

export async function comparePwd(pwd :string, pwdHash :string) {
    let correct = await bcrypt.compare(pwd, pwdHash);
    return correct
}
