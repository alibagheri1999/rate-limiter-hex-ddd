import { Response } from "express";
import { ApiResponse } from "../../domain/types/globalResponse";
import { HttpStatusCode } from "../../domain/types";

export const getRandomIntInclusive = function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};

export const getRandomPhoneNumber = () => {
  let phoneNumbers: string[] = [
    "+989352461483",
    "+989352461484",
    "+989352461485",
    "+989352461486",
    "+989352461487",
    "+989352461488",
    "+989352461489"
  ];
  const randomInt = getRandomIntInclusive(0, 6);
  return phoneNumbers[randomInt];
};

export function requestSender(
  response: Response,
  payload: ApiResponse<any>,
  status: HttpStatusCode
) {
  return response.status(status).json(payload);
}
