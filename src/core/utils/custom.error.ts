import { EError } from '../enums'

export const CError = {
  //NOTE: Authorization
  INACTIVE_USER: `${EError.INACTIVE_USER}: This user's account is not active. Please contact the superadmin to activate it.`,
  WRONG_PASSWORD: `${EError.WRONG_PASSWORD}: The password is wrong.`,
  NO_TOKEN: `${EError.NO_TOKEN}: There is no token in cookies. Nobody is logged in.`,
  NOT_LOGGED_IN: `${EError.NOT_LOGGED_IN}: Nobody is logged in.`,
  //NOTE: Not found
  NOT_FOUND_ID: `${EError.NOT_FOUND_ID}: An item with this id was not found.`,
  NOT_FOUND_PHONE: `${EError.NOT_FOUND_PHONE}: An item with this phone number was not found.`,
  NOT_FOUND_CLIENT_ID: `${EError.NOT_FOUND_CLIENT_ID}: A client with this clientId does not exist.`,
  NOT_FOUND_FILE: `${EError.NOT_FOUND_FILE}: A file was not found.`,
  NOT_FOUND_AVATAR: `${EError.NOT_FOUND_AVATAR}: This item does not have an avatar.`,
  NOT_FOUND_EMPLOYEE_ID: `${EError.NOT_FOUND_EMPLOYEE_ID}: An employee with this employeeId was not found.`,
  //NOTE: Already exists
  NAME_ALREADY_EXISTS: `${EError.NAME_ALREADY_EXISTS}: An item with this name already exists.`,
  PHONE_ALREADY_EXISTS: `${EError.PHONE_ALREADY_EXISTS}: An item with this phone already exists.`,
  TITLE_ALREADY_EXISTS: `${EError.TITLE_ALREADY_EXISTS}: There already exists an itme with this title.`,
  EMAIL_ALREADY_EXISTS: `${EError.EMAIL_ALREADY_EXISTS}: An item with this email already exists.`,
  //NOTE: File error
  NO_FILE_PROVIDED: `${EError.NO_FILE_PROVIDED}: No file was provided.`,
  FILE_ID_NOT_RELATED: `${EError.FILE_ID_NOT_RELATED}: The item has no related file with this id.`,
  FILE_ID_NOT_RELATED_TO_SECTION: `${EError.FILE_ID_NOT_RELATED_TO_SECTION}: A file with this id is not related to this file section.`,
  //NOTE: invalid data
  INVALID_PERMISSION: `${EError.INVALID_PERMISSION}: An invalid permission was provided.`,
  INVALID_POSITION: `${EError.INVALID_POSITION}: An invalid position was provided.`,
  //NOTE: superadmin error
  ATTEMPT_TO_EDIT_SUPERADMIN: `${EError.ATTEMPT_TO_EDIT_SUPERADMIN}: Superadmin cannot be edited through this endpoint.`,
  NOT_SUPERADMIN_ID: `${EError.NOT_SUPERADMIN_ID}: This is not superadmin's id.`,
}
