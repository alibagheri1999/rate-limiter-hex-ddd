/**
 * @swagger
 * components:
 *   schemas:
 *     GetRandomDataResponseSuccess:
 *          type: object
 *          properties:
 *           success:
 *             type: boolean
 *             example: true
 *           data:
 *             $ref: '#/components/schemas/UserData'
 *           message:
 *             type: strings.ts
 *             example: "GET_RANDOM_USER"
 *
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     GetRandomDataResponseError:
 *          type: object
 *          properties:
 *           success:
 *             type: boolean
 *             example: false
 *           error:
 *             type: strings.ts
 *             example: "BAD_REQUEST"
 *           message:
 *             type: strings.ts
 *             example: "BAD_REQUEST"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserData:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         phoneNumber:
 *           type: strings.ts
 *           example: "+989352461483"
 *         username:
 *           type: strings.ts
 *           example: "ali1"
 *         createdOn:
 *           type: strings.ts
 *           format: date-time
 *           example: "2024-09-11T22:19:19.000Z"
 *         updatedOn:
 *           type: strings.ts
 *           format: date-time
 *           example: "2024-09-11T22:19:19.000Z"
 */
