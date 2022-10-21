const { Router } = require("express");
const contactsRouter = Router();
const contactsService = require("./contacts-service");
const {
  createContactSchema,
  updateContactSchema,
  updateContactFavoriteSchema,
} = require("./contacts-schemas");
const { catchAsync } = require("../../shared/middlewares/catch-async");
const { validate } = require("../../shared/middlewares/validate");
const { authorize } = require("../../shared/middlewares/authorize");

contactsRouter.use(authorize);

contactsRouter.get(
  "/",
  catchAsync(async (req, res, next) => {
    const contacts = await contactsService.getAllContacts(
      req.userId,
      req.query.page,
      req.query.limit,
      req.query.favorite
    );
    res.status(200).send(contacts);
  })
);

contactsRouter.get(
  "/:contactId",
  catchAsync(async (req, res, next) => {
    const { contactId } = req.params;

    const contact = await contactsService.getContactById(req.userId, contactId);

    res.status(200).send(contact);
  })
);

contactsRouter.post(
  "/",
  validate(createContactSchema),
  catchAsync(async (req, res, next) => {
    const { name, email, phone } = req.body;

    const contact = await contactsService.createContact({
      owner: req.userId,
      name,
      email,
      phone,
    });

    res.status(201).send(contact);
  })
);

contactsRouter.put(
  "/:contactId",
  validate(updateContactSchema),
  catchAsync(async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send("Missing fields");
    }

    const { contactId } = req.params;
    const { name, email, phone } = req.body;
    const contact = await contactsService.updateContact(req.userId, contactId, {
      name,
      email,
      phone,
    });

    res.status(200).send(contact);
  })
);

contactsRouter.patch(
  "/:contactId/favorite",
  validate(updateContactFavoriteSchema),
  catchAsync(async (req, res, next) => {
    const { contactId } = req.params;
    const { favorite } = req.body;

    const contact = await contactsService.updateContact(req.userId, contactId, {
      favorite,
    });

    res.status(200).send(contact);
  })
);

contactsRouter.delete(
  "/:contactId",
  catchAsync(async (req, res, next) => {
    const { contactId } = req.params;

    const contact = await contactsService.removeContact(req.userId, contactId);

    res.status(200).send(contact);
  })
);

module.exports = contactsRouter;
