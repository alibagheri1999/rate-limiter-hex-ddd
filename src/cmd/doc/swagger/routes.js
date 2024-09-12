/**
 * @swagger
 * /api/users/data:
 *   get:
 *     summary: get random data
 *     tags: [Users(get)]
 *     parameters:
 *       - in: header
 *         name: user-id
 *         schema:
 *           type: strings.ts
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: get correct data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetRandomDataResponseSuccess'
 *       400:
 *         description: invalid request params
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetRandomDataResponseError'
 *       429:
 *         description: to many request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetRandomDataResponseError'
 *
 */
