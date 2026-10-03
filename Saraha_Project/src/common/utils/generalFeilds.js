import { z } from "zod";
import { genderEnum } from "../enum/index.js";
import { getErrorMessage } from "./validationErrors.js";

export const generalFeilds = {
  email: (lang) =>
    z
      .email({
        error: getErrorMessage(lang, "email"),
      })
      .regex(
        /^[A-Za-z0-9_\-\.]{1, }@[A-Za-z\-_]{1, 20}(\.[a-z]{2, 8}){1,2}$/,
      ),
  password: (lang) =>
    z
      .string()
      .max(20, { error: getErrorMessage(lang, "longPassword") })
      .min(6, { error: getErrorMessage(lang, "shortPassword") }),
  cPassword: (lang) => z.string().max(20).min(6),
  phoneNumber: (lang) =>
    z
      .e164({
        pattern: /^10[0-25]\d{8}/,
        error: getErrorMessage(lang, "wrongPhoneNumber"),
      })
      .optional(),
  name: (lang) =>
    z
      .string({ error: getErrorMessage(lang, "name.invalidName") })
      .regex(/^[A-Za-z]{3,20}\s[A-Za-z]{3,20}$/, {
        error: getErrorMessage(lang, "name.twoNames"),
      }),
  DOB: (lang) => z.string(),
  scores: (lang) => z.array(z.number()).nonempty().optional(),
  gender: (lang) =>
    z.union([z.literal(genderEnum.male), z.literal(genderEnum.female)], {
      error: getErrorMessage(lang, "gender"),
    }),
  id: (lang) => z.string().length(24).min(1),
  page: (lang) => z.coerce.number().gte(1),
  limit: (lang) => z.coerce.number().gte(1),
  stringBool: (lang) =>
    z.stringbool({
      truthy: ["true"],
      falsy: ["false"],
      error: getErrorMessage(lang, "stringBool"),
    }),
  headers: (lang) =>
    z.object({
      authorization: z.string().jwt({ alg: "HS256" }),
      "accept-language": z.enum(["ar", "en"], {
        error: getErrorMessage(lang, "language"),
      }),
    }),
};
