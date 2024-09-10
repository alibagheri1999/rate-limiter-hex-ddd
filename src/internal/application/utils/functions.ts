export const getRandomIntInclusive = function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};

export const getRandomPhoneNumber = () => {
  let phoneNumbers: string[] = ["+989352461484","+989352461485","+989352461486","+989352461487","+989352461487","+989352461488","+989352461489"];
  const randomInt = getRandomIntInclusive(4, 9)
  return phoneNumbers[randomInt]
};

export const updateQueryBuilder = (tableName, entity, condition): string => {
  let query = "UPDATE users";

  delete entity.id;
  Object.keys(entity).forEach((key, index, total) => {
    if (index === 0) {
      query += " SET ";
    }
    if (typeof entity[key] === "number" || entity[key] === null) {
      query += `${key} = ${entity[key]} `;
    } else {
      query += `${key} = '${entity[key]}' `;
    }

    if (index !== total.length - 1) {
      query += ", ";
    }
  });
  query += condition + ";";
  return query;
};
