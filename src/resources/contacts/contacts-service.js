const { ContactModel } = require("./contact-model");
const { NotFound } = require("http-errors");

const getAllContacts = async (userId, queryPage, queryLimit, queryFavorite) => {
  let search = { owner: userId };
  let page = null;
  let limit = 20;

  if (queryFavorite === "true" || queryFavorite === "false") {
    search = { owner: userId, favorite: queryFavorite };
  }

  if (queryLimit >= 5 && queryLimit <= 50) {
    limit = Math.round(queryLimit);
  }

  if (queryPage > 1) {
    page = (Math.round(queryPage) - 1) * limit;
  }

  return ContactModel.find(search).skip(page).limit(limit);
};

const getContactById = async (userId, id) => {
  const contact = await ContactModel.findOne({ _id: id, owner: userId });

  if (!contact) {
    throw new NotFound(`Not found contact id: ${id}`);
  }

  return contact;
};

const createContact = async ({ owner, name, email, phone }) => {
  return ContactModel.create({ owner, name, email, phone });
};

const updateContact = async (userId, id, fields) => {
  const contact = await ContactModel.findByIdAndUpdate(
    { _id: id, owner: userId },
    fields,
    {
      new: true,
    }
  );

  if (!contact) {
    throw new NotFound(`Not found contact id: ${id}`);
  }

  return contact;
};

const removeContact = async (userId, id) => {
  const contact = await ContactModel.findByIdAndRemove({
    _id: id,
    owner: userId,
  });

  if (!contact) {
    throw new NotFound(`Not found contact id: ${id}`);
  }

  return contact;
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  removeContact,
};
