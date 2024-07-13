import bycrpt from "bcryptjs";

export const hashPassword = async (password) => {
  try {
    const salt = await bycrpt.genSalt(10);
    return await bycrpt.hash(password, salt);
  } catch (error) {
    throw new Error(error);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bycrpt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error(error);
  }
};
